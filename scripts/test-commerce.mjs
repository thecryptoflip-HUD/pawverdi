// Isolated integration run: real Next routes, deterministic PostgREST fixture, no outside calls.
// Usage: node scripts/test-commerce.mjs (run in its own checkout, away from any Next build).
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
const inputs = [];
const now = new Date().toISOString();
const rows = [
  {
    kind: "product",
    slug: "qa-brush",
    title: "QA brush",
    brand: "Fixture maker",
    price_cents: 1250,
    price_checked_at: now,
  },
  { kind: "deal", slug: "qa-offer", title: "QA verified offer" },
  {
    kind: "deal",
    slug: "qa-expired",
    title: "QA expired offer",
    expires_at: "2020-01-01T00:00:00Z",
  },
  {
    kind: "deal",
    slug: "qa-unverified",
    title: "QA unverified offer",
    verified_at: null,
  },
  {
    kind: "campaign",
    slug: "qa-sponsor",
    title: "QA sponsor",
    category: "shop-inline-01",
  },
].map((r, i) => ({
  id: String(i + 1),
  summary: "Fixture summary",
  body: "Fixture body",
  species: "dog",
  category: "grooming",
  merchant: "Fixture retailer",
  state: "published",
  disclosure: "Fixture disclosure",
  featured: false,
  destination_url: "https://merchant.invalid/store?utm_campaign=approved",
  verified_at: now,
  expires_at: "2099-12-31T23:59:59Z",
  updated_at: now,
  ...r,
}));
const fixture = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  res.setHeader("content-type", "application/json");
  if (url.pathname === "/rest/v1/tracking_events" && req.method === "POST") {
    let body = "";
    for await (const chunk of req) body += chunk;
    inputs.push(JSON.parse(body));
    res.writeHead(201);
    res.end("");
    return;
  }
  if (url.pathname === "/rest/v1/publication_entries") {
    const result = rows.filter((r) =>
      ["kind", "slug", "state"].every(
        (k) =>
          !url.searchParams.has(k) || url.searchParams.get(k) === "eq." + r[k],
      ),
    );
    res.end(JSON.stringify(result));
    return;
  }
  res.end("[]");
});
fixture.listen(0, "127.0.0.1");
await once(fixture, "listening");
const port = Number(process.env.COMMERCE_TEST_PORT || 3485),
  base = "http://127.0.0.1:" + port;
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "-H",
    "127.0.0.1",
    "-p",
    String(port),
  ],
  {
    detached: true,
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:" + fixture.address().port,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "fixture-anon",
      SUPABASE_SERVICE_ROLE_KEY: "fixture-service",
      PAWVERDI_AMAZON_APPROVED: "true",
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let log = "";
for (const stream of [child.stdout, child.stderr])
  stream.on("data", (s) => {
    log = (log + s).slice(-5000);
  });
const get = (route, extra = {}) =>
  fetch(base + route, { redirect: "manual", ...extra });
async function content(path) {
  const r = await get(path);
  assert.equal(r.status, 200, path);
  return (await r.text())
    .split("<main")
    .at(-1)
    .split("</main>")[0]
    .replaceAll("<!-- -->", "");
}
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await get("/api/health")).ok) {
        ready = true;
        break;
      }
    } catch {}
    if (child.exitCode !== null) break;
    await delay(300);
  }
  assert.ok(ready, log);
  for (const slug of [
    "dogs",
    "cats",
    "birds",
    "small-animals",
    "fish",
    "reptiles",
  ])
    assert.match(await content("/discover/" + slug), /[2-9][0-9]* results/);
  assert.match(
    await content("/discover/dogs?q=brush&category=grooming&sort=za"),
    /1 result/,
  );
  assert.match(await content("/discover/reptiles?q=brush"), /0 results/);
  const detail = await content("/products/qa-brush");
  assert.match(detail, /Fixture disclosure/);
  assert.match(detail, /12.50/);
  assert.equal((await get("/products/no-such-product")).status, 404);
  assert.match(
    await content("/compare?item=bird-perches&item=qa-brush"),
    /Bird perches/,
  );
  assert.match(
    await content("/compare?item=bird-perches&item=qa-brush"),
    /QA brush/,
  );
  const deals = await content("/deals");
  assert.match(deals, /QA verified offer/);
  assert.doesNotMatch(deals, /QA (expired|unverified) offer/);
  const link = await get("/go/deal/qa-offer");
  assert.equal(link.status, 302);
  assert.equal(
    link.headers.get("location"),
    "https://merchant.invalid/store?utm_campaign=approved",
  );
  assert.equal(inputs.length, 0);
  for (const slug of ["qa-unverified", "qa-expired", "unknown"])
    assert.equal((await get("/go/deal/" + slug)).status, 404);
  const opt = { cookie: "pv_analytics=allow", referer: base + "/deals" };
  await get("/go/deal/qa-offer", { headers: { ...opt, "sec-gpc": "1" } });
  assert.equal(inputs.length, 0);
  await get("/go/deal/qa-offer", { headers: opt });
  assert.equal(inputs[0].event, "click");
  assert.equal(inputs[0].attribution, "deals");
  const destination = "/discover?utm_campaign=qa-sponsor&utm_source=ignored";
  const cookie = (r) =>
    r.headers.getSetCookie().find((v) => v.startsWith("pv_campaign="));
  assert.equal(cookie(await get(destination)), undefined);
  assert.equal(
    cookie(await get(destination, { headers: { ...opt, dnt: "1" } })),
    undefined,
  );
  assert.equal(
    cookie(
      await get("/discover?utm_campaign=arbitrary-visitor-string", {
        headers: opt,
      }),
    ),
    undefined,
  );
  const accepted = cookie(await get(destination, { headers: opt }));
  assert.ok(accepted?.startsWith("pv_campaign=qa-sponsor;"));
  assert.doesNotMatch(accepted, /Expires|Max-Age/i);
  await get("/go/deal/qa-offer", {
    headers: {
      ...opt,
      cookie: opt.cookie + "; " + accepted.split(";")[0],
      referer: base + "/products/qa-brush",
    },
  });
  assert.equal(inputs.at(-1).campaign, "qa-sponsor");
  assert.equal(inputs.at(-1).attribution, "products");
  await get("/go/deal/qa-offer", {
    headers: { ...opt, cookie: opt.cookie + "; pv_campaign=unknown-string" },
  });
  assert.equal(inputs.at(-1).campaign, null);
  assert.match(await content("/shop"), /QA sponsor/);
  const opts = {
    method: "POST",
    headers: { ...opt, origin: base, referer: base + "/shop" },
  };
  assert.equal((await get("/api/impressions/qa-sponsor", opts)).status, 204);
  assert.equal(inputs.at(-1).event, "impression");
  assert.equal(inputs.at(-1).attribution, "shop");
  assert.equal(
    (
      await get("/api/impressions/qa-sponsor", {
        method: "POST",
        headers: { ...opt, origin: "https://invalid.example" },
      })
    ).status,
    403,
  );
  assert.equal(
    (await get("/go/guide/pdp-bed-ortho-boucle")).headers
      .get("location")
      .includes("tag=pawverdi-20"),
    true,
  );
  assert.ok([303, 307, 308].includes((await get("/admin/performance")).status));
  console.log(
    "Commerce integration passed: six collections, filters, product details, unknown slugs, comparison, verified deal expiry, destination lookup, opt-in events, GPC, ad placements, impression origin, affiliate flag, report access.",
  );
} finally {
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {}
  fixture.closeAllConnections();
  fixture.close();
}
