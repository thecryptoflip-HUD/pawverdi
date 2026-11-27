// Exercise the actual multipart handler with in-memory Auth, PostgREST and Storage adapters.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const req = createRequire(import.meta.url);
async function compile(relative) {
  const source = await readFile(new URL(relative, import.meta.url), "utf8");
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
}
const media = {};
Function("exports", await compile("../lib/media-file.ts"))(media);
const compiled = await compile("../app/api/admin/media/route.ts");
const id = "00000000-0000-4000-8000-000000000100";
const origin = "http://localhost:3000";
const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);

function fixture({
  role = "editor",
  conflict = false,
  cleanupFailure = false,
} = {}) {
  const row = {
    id,
    revision: 1,
    state: "draft",
    media_path: id + "/previous.webp",
  };
  const stored = new Map([[row.media_path, Buffer.from("previous")]]);
  const db = {
    from() {
      let changes = null;
      const filters = {};
      const query = {
        select() {
          return query;
        },
        eq(field, value) {
          filters[field] = value;
          return query;
        },
        update(values) {
          changes = values;
          return query;
        },
        async maybeSingle() {
          if (
            (conflict && changes) ||
            !Object.entries(filters).every(([k, v]) => row[k] === v)
          )
            return { data: null, error: null };
          if (changes)
            Object.assign(row, changes, { revision: row.revision + 1 });
          return { data: { ...row }, error: null };
        },
      };
      return query;
    },
  };
  const service = {
    storage: {
      from() {
        return {
          async upload(path, file) {
            stored.set(path, Buffer.from(await file.arrayBuffer()));
            return { error: null };
          },
          async remove(paths) {
            if (cleanupFailure) return { error: "unavailable" };
            paths.forEach((p) => stored.delete(p));
            return { error: null };
          },
        };
      },
    },
  };
  const mocks = {
    "next/server": { NextResponse: Response },
    "@/lib/auth": {
      getSession: async () => ({ role }),
      isStaff: (r) => r === "editor",
    },
    "@/lib/supabase-server": { serverSupabase: async () => db },
    "@/lib/supabase-admin": { adminClient: () => service },
    "@/lib/media-response": {},
    "@/lib/media-file": media,
  };
  const mod = { exports: {} };
  Function(
    "require",
    "exports",
    "module",
    compiled,
  )((name) => mocks[name] ?? req(name), mod.exports, mod);
  async function post(bytes = png, type = "image/png", alternatives = {}) {
    const form = new FormData();
    Object.entries({
      id,
      revision: "1",
      description: "Dog portrait",
      credit: "Higgsfield",
      rights: "on",
    }).forEach(([k, v]) => form.set(k, v));
    form.set("file", new Blob([bytes], { type }), "portrait");
    const wrapped = new Request(origin + "/api/admin/media", {
      method: "POST",
      body: form,
    });
    const body = await wrapped.arrayBuffer();
    return mod.exports.POST(
      new Request(wrapped.url, {
        method: "POST",
        body,
        headers: {
          "Content-Type": wrapped.headers.get("Content-Type"),
          "Content-Length": String(body.byteLength),
          origin,
          ...alternatives,
        },
      }),
    );
  }
  return { row, stored, post };
}
test("upload commits bytes, advances draft revision and removes the previous object", async () => {
  const { row, stored, post } = fixture();
  const res = await post();
  assert.equal(res.status, 303);
  assert.equal(row.revision, 2);
  assert.match(res.headers.get("location"), /result=saved/);
  assert.equal(stored.size, 1);
  assert.deepEqual(stored.get(row.media_path), Buffer.from(png));
});
test("a concurrent edit discards only the unlinked new object", async () => {
  const { row, stored, post } = fixture({ conflict: true });
  assert.equal((await post()).status, 409);
  assert.equal(row.revision, 1);
  assert.deepEqual([...stored.keys()], [id + "/previous.webp"]);
});
test("a failed cleanup reports the retained private object with the new media saved", async () => {
  const { row, stored, post } = fixture({ cleanupFailure: true });
  const res = await post();
  assert.equal(row.revision, 2);
  assert.match(res.headers.get("location"), /result=media-cleanup/);
  assert.equal(stored.size, 2);
});
test("rejects reader roles, cross-site requests, mismatched file formats and oversized requests", async () => {
  assert.equal((await fixture({ role: "reader" }).post()).status, 403);
  const { row, stored, post } = fixture();
  assert.equal(
    (await post(png, "image/png", { origin: "https://elsewhere.invalid" }))
      .status,
    403,
  );
  assert.equal((await post(png, "video/mp4")).status, 415);
  assert.equal(
    (
      await post(png, "image/png", {
        "content-length": String(media.maxMediaBytes + 65536),
      })
    ).status,
    413,
  );
  assert.equal(row.revision, 1);
  assert.equal(stored.size, 1);
});
