// Ephemeral PostgreSQL integration. Uses the same PGlite dependency as the CMS tests.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
const db = new PGlite({ extensions: { pgcrypto, pg_trgm } });
try {
  await db.exec(`create schema extensions; create schema auth; create role anon; create role authenticated; create role service_role bypassrls;
    grant usage on schema auth to anon,authenticated; create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);
    create function auth.uid() returns uuid language sql stable as $f$select nullif(current_setting('app.user',true),'')::uuid$f$;`);
  for (const file of [
    "0001_init.sql",
    "0002_publication.sql",
    "0004_metrics.sql",
  ])
    await db.exec(
      await readFile(
        new URL("../supabase/migrations/" + file, import.meta.url),
        "utf8",
      ),
    );
  const id = "00000000-0000-4000-8000-000000000001";
  await db.query("insert into auth.users values ($1,$2,null)", [
    id,
    "tester@example.invalid",
  ]);
  await db.exec("grant select on profiles to authenticated");
  const count = async () =>
    Number(
      (await db.query("select count(*) n from commerce_performance")).rows[0].n,
    );
  await db.exec(
    "set role service_role; insert into tracking_events(kind,slug,merchant,event,attribution) values('campaign','banner','test','impression','shop'),('campaign','banner','test','click','shop');reset role;",
  );
  await db.query("select set_config('app.user',$1,false)", [id]);
  await db.exec("set role anon");
  await assert.rejects(db.exec("select * from tracking_events"));
  await assert.rejects(db.exec("select * from commerce_performance"));
  await db.exec("reset role; set role authenticated");
  assert.equal(await count(), 0);
  await assert.rejects(
    db.exec(
      "insert into tracking_events(kind,slug,merchant,event,attribution) values('campaign','banner','test','click','shop')",
    ),
    /permission denied/,
  );
  const stmt =
    "insert into merchant_statements (merchant,report_date,reference,conversions,commission_cents) values('test',current_date,'fixture',2,1250)";
  await assert.rejects(db.exec(stmt));
  await db.exec(
    "reset role; update profiles set role='editor'; set role authenticated",
  );
  assert.equal(await count(), 1);
  const report = (
    await db.query("select clicks,impressions from commerce_performance")
  ).rows[0];
  assert.equal(+report.clicks, 1);
  assert.equal(+report.impressions, 1);
  await assert.rejects(db.exec(stmt));
  await db.exec(
    "reset role; update profiles set role='admin'; set role authenticated",
  );
  await db.exec(stmt);
  await assert.rejects(db.exec(stmt));
  assert.equal(
    (await db.query("select commission_cents from merchant_statements")).rows[0]
      .commission_cents,
    1250,
  );
  console.log(
    "Commerce PostgreSQL checks passed: metrics migration, insert permissions, private event log, staff-only aggregates, click/impression totals, admin-only statements, duplicate protection.",
  );
} finally {
  await db.close();
}
