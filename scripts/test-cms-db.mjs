// Run against a fresh in-memory PostgreSQL database for each invocation.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const pkg = "@electric-sql/pglite";
const { PGlite } = await import(pkg);
const base = "@electric-sql/pglite/contrib/";
const { pgcrypto } = await import(base + "pgcrypto");
const { pg_trgm } = await import(base + "pg_trgm");
const db = new PGlite({ extensions: { pgcrypto, pg_trgm } });
try {
  await db.exec(`create schema extensions; create schema auth; create role anon; create role authenticated;
 grant usage on schema auth to anon,authenticated;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);
 create function auth.uid() returns uuid language sql stable as $f$select nullif(current_setting('app.user',true),'')::uuid$f$;`);
  for (const migration of ["0001_init.sql", "0002_publication.sql"]) {
    await db.exec(
      await readFile(
        new URL("../supabase/migrations/" + migration, import.meta.url),
        "utf8",
      ),
    );
  }
  // Isolate the Storage policies using the table and role interface Supabase Storage exposes.
  await db.exec(`create schema storage; grant usage on schema storage to authenticated,anon;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text references storage.buckets,name text);
    alter table storage.objects enable row level security; grant select on storage.objects to anon,authenticated;`);
  await db.exec(
    await readFile(
      new URL("../supabase/migrations/0005_media.sql", import.meta.url),
      "utf8",
    ),
  );
  const ids = {
    editor: "00000000-0000-4000-8000-000000000001",
    reviewer: "00000000-0000-4000-8000-000000000002",
    reader: "00000000-0000-4000-8000-000000000003",
  };
  for (const [role, id] of Object.entries(ids)) {
    await db.query("insert into auth.users values($1,$2,null)", [
      id,
      role + "@example.invalid",
    ]);
    await db.query("update profiles set role=$1 where id=$2", [role, id]);
  }
  await db.exec("grant select on public.profiles to authenticated");
  async function act(role) {
    await db.exec("reset role");
    await db.query("select set_config('app.user',$1,false)", [ids[role] || ""]);
    await db.exec("set role " + (role === "anon" ? "anon" : "authenticated"));
  }
  const insert =
    "insert into publication_entries(kind,slug,title,summary,body) values('deal','test','Test','summary','body')";
  const visible = async () =>
    Number(
      (await db.query("select count(*) as n from publication_entries")).rows[0]
        .n,
    );
  await act("anon");
  await assert.rejects(db.exec(insert));
  await act("reader");
  await assert.rejects(db.exec(insert));
  await act("editor");
  await db.exec(insert);
  assert.equal(await visible(), 1);
  await act("anon");
  assert.equal(await visible(), 0);
  await act("editor");
  await db.exec("update publication_entries set state='review'");
  await assert.rejects(
    db.exec("update publication_entries set state='published'"),
  );
  await act("reviewer");
  await assert.rejects(
    db.exec("update publication_entries set state='published'"),
  );
  await db.exec(
    "update publication_entries set expires_at=now()+interval '1 day', disclosure='Sponsored', destination_url='https://example.invalid',merchant='test'",
  );
  await db.exec("update publication_entries set state='published'");
  const info = (
    await db.query("select verified_at,revision from publication_entries")
  ).rows[0];
  assert.ok(info.verified_at);
  assert.equal(info.revision, 4);
  await act("anon");
  assert.equal(await visible(), 1);
  await assert.rejects(db.exec("update publication_entries set title='bad'"));
  await act("reviewer");
  await assert.rejects(
    db.exec("update publication_entries set title='edit published'"),
  );
  await db.exec("update publication_entries set state='archived'");
  await act("anon");
  assert.equal(await visible(), 0);
  await db.exec("reset role");
  assert.equal(
    Number(
      (
        await db.query(
          "select count(*) n from audit_log where entity='publication_entries'",
        )
      ).rows[0].n,
    ),
    5,
  );
  // Price evidence and expiry are enforced independently of the browser.
  await act("editor");
  await db.exec(
    "insert into publication_entries(kind,slug,title,summary,body) values('product','gear','Gear','Description','')",
  );
  await assert.rejects(
    db.exec("update publication_entries set price_cents=500 where slug='gear'"),
  );
  await assert.rejects(
    db.exec(
      "update publication_entries set price_cents=500,price_checked_at=now()+interval '1 day' where slug='gear'",
    ),
  );
  await db.exec(
    "update publication_entries set price_cents=500,price_checked_at=now(),state='review' where slug='gear'",
  );
  await act("reviewer");
  await db.exec(
    "update publication_entries set state='published',expires_at=now()+interval '1 second' where slug='gear'",
  );
  await act("anon");
  assert.equal(await visible(), 1);
  await new Promise((resolve) => setTimeout(resolve, 1100));
  assert.equal(await visible(), 0);
  // Supply the normal Supabase table read grants used by the triage policies.
  await db.exec(
    "reset role; grant select on contact_messages to authenticated; insert into contact_messages(email,topic,message) values ('test@example.invalid','other','private body')",
  );
  await act("reader");
  assert.equal(
    (await db.query("select id from contact_messages")).rows.length,
    0,
  );
  await act("editor");
  await db.exec("update contact_messages set status='triaged' where id=1");
  await assert.rejects(
    db.exec(
      "update contact_messages set email='other@example.invalid' where id=1",
    ),
  );
  await db.exec("reset role");
  assert.deepEqual(
    (
      await db.query(
        "select detail from audit_log where entity='contact_messages'",
      )
    ).rows[0].detail,
    { previous: "new", status: "triaged" },
  );
  await act("editor");
  await db.exec(
    "insert into publication_entries(kind,slug,title,summary,body) values('media','portrait','Portrait','A pet portrait','')",
  );
  const mediaId = (
    await db.query("select id from publication_entries where slug='portrait'")
  ).rows[0].id;
  const path = mediaId + "/" + mediaId + ".webp";
  await assert.rejects(
    db.query("update publication_entries set media_path=$1 where id=$2", [
      path,
      mediaId,
    ]),
  );
  await db.query(
    "update publication_entries set media_path=$1,media_credit='Higgsfield',media_description='Dog portrait',state='review' where id=$2",
    [path, mediaId],
  );
  await db.exec("reset role");
  await db.query(
    "insert into storage.objects(bucket_id,name) values('publication-media',$1)",
    [path],
  );
  await act("anon");
  assert.equal(
    (await db.query("select * from storage.objects")).rows.length,
    0,
  );
  await act("reviewer");
  assert.equal(
    (await db.query("select * from storage.objects")).rows.length,
    1,
  );
  await db.query(
    "update publication_entries set state='published' where id=$1",
    [mediaId],
  );
  await act("anon");
  assert.equal(
    (await db.query("select * from storage.objects")).rows.length,
    1,
  );
  await act("reviewer");
  await db.query(
    "update publication_entries set state='archived' where id=$1",
    [mediaId],
  );
  await act("anon");
  assert.equal(
    (await db.query("select * from storage.objects")).rows.length,
    0,
  );
  console.log(
    "Passed PostgreSQL CMS integration: migrations, anonymous/reader/editor/reviewer permissions, review transition, approval evidence, disclosure gates, archive, automatic expiry, price evidence, revision, inquiry triage, media visibility and audit.",
  );
} finally {
  await db.close();
}
