import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
const tables = ['seller_applications','ad_enquiries','newsletter_subscribers','contact_messages'];
try {
  await db.exec('create role anon; create role authenticated; create role service_role;');
  for (const name of tables) {
    await db.exec('create table public.' + name + '(body text); grant insert on public.' + name + ' to anon,authenticated');
  }
  await db.exec(await readFile(new URL('../supabase/migrations/0003_intake.sql', import.meta.url), 'utf8'));
  for (const role of ['anon','authenticated']) {
    await db.exec('set role '+role);
    for (const name of tables) await assert.rejects(db.exec("insert into public."+name+" values('direct')"), /permission denied/);
    await assert.rejects(db.query('select claim_intake_slot($1,2)', ['a'.repeat(64)]), /permission denied/);
    await db.exec('reset role');
  }
  await db.exec('set role service_role');
  const claim = async () => (await db.query('select claim_intake_slot($1,2) as ok', ['a'.repeat(64)])).rows[0].ok;
  assert.equal(await claim(), true);
  assert.equal(await claim(), true);
  assert.equal(await claim(), false);
  await db.exec("reset role; update public.intake_limits set expires_at=now()-interval '1 minute'; set role service_role");
  assert.equal(await claim(), true);
  console.log('PASS private inbox permissions, restricted rate-limit RPC, threshold and expiry.');
} finally { await db.close(); }
