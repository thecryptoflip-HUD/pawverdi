#!/usr/bin/env node
/**
 * Production smoke test. Run against a running server:
 *   npm run build && npm start &
 *   npm run verify            # defaults to http://127.0.0.1:3000
 *   BASE=https://pawverdi.com npm run verify
 *
 * Exits non-zero on the first hard failure so CI can gate a release.
 */

const BASE = process.env.BASE || 'http://127.0.0.1:3000';

const pages = [
  ['/', ['What your pet', 'PawVerdi', 'Verify']],
  ['/dogs', ['Dog Center', 'Breed reference']],
  ['/cats', ['Cat Center', 'Breed reference']],
  ['/knowledge', ['Knowledge Center', 'guides']],
  ['/knowledge/cat-cost-per-year', ['What this guide covers', 'Medical disclaimer']],
  ['/marketplace', ['0 listings published', 'Verification']],
  ['/shop', ['Not yet reviewed', 'Method']],
  ['/advertise', ['Sponsored', 'not negotiable']],
  ['/community', ['One email a month']],
  ['/trust', ['Affiliate disclosure', 'Seller and listing standards']],
  ['/contact', ['PawVerdi@hotmail.com']],
  ['/admin', ['Content mode', 'Admin dashboard']],
  ['/sitemap.xml', ['<urlset']],
  ['/robots.txt', ['Sitemap:']],
  ['/knowledge?species=cat&section=health', ['Showing']],
  ['/knowledge?species=dog&section=costs', ['Showing']],
];

const failures = [];
const rows = [];

function record(name, ok, detail) {
  rows.push({ name, ok, detail });
  if (!ok) failures.push(`${name}: ${detail}`);
}

async function checkPage(path, needles) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const html = await res.text();
    const statusOk = res.status === 200;
    const missing = needles.filter((n) => !html.toLowerCase().includes(n.toLowerCase()));
    record(
      path,
      statusOk && missing.length === 0,
      statusOk ? (missing.length ? `missing text: ${missing.join(', ')}` : `${html.length} bytes`) : `HTTP ${res.status}`,
    );
  } catch (error) {
    record(path, false, `request failed: ${error.message}`);
  }
}

async function checkApi() {
  try {
    const res = await fetch(`${BASE}/api/health`);
    const body = await res.json();
    record('/api/health', res.status === 200 && body.ok === true, `mode=${body.mode} articles=${body.content?.articles}`);
  } catch (error) {
    record('/api/health', false, error.message);
  }

  // valid payload must be accepted (202 in demo mode, 200 live)
  try {
    const res = await fetch(`${BASE}/api/newsletter`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'smoke-test@example.com' }),
    });
    const body = await res.json();
    record('/api/newsletter (valid)', [200, 202].includes(res.status) && body.ok === true, `http=${res.status} stored=${body.stored}`);
  } catch (error) {
    record('/api/newsletter (valid)', false, error.message);
  }

  // invalid payload must be rejected with 400
  try {
    const res = await fetch(`${BASE}/api/newsletter`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    record('/api/newsletter (invalid)', res.status === 400, `http=${res.status}`);
  } catch (error) {
    record('/api/newsletter (invalid)', false, error.message);
  }

  // seller intake must never create a live listing — status only
  try {
    const res = await fetch(`${BASE}/api/seller-application`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ trading_name: 'Smoke Test Kennel', country: 'UK', email: 'seller@example.com', licence: 'TEST-123', schemes: 'kennel club' }),
    });
    const body = await res.json();
    record('/api/seller-application', [200, 202].includes(res.status) && body.ok === true, `http=${res.status} stored=${body.stored}`);
  } catch (error) {
    record('/api/seller-application', false, error.message);
  }
}

async function checkSecurityHeaders() {
  const res = await fetch(`${BASE}/`);
  const expected = ['x-content-type-options', 'referrer-policy', 'x-frame-options'];
  const missing = expected.filter((h) => !res.headers.get(h));
  record('security headers', missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : 'present');
}

async function checkNoKeyMaterial() {
  try {
    const res = await fetch(`${BASE}/api/db-status`);
    const body = await res.text();
    // Key material must never appear in a diagnostics response. These needles
    // cover both legacy JWTs and the new opaque keys.
    const leaks = ['sb_secret_', 'sb_publishable_', 'eyJhbGciOiJ'].filter((needle) => body.includes(needle));
    record('no key material in /api/db-status', leaks.length === 0, leaks.length ? `leaked: ${leaks.join(', ')}` : 'clean');
  } catch (error) {
    record('no key material in /api/db-status', false, error.message);
  }
}

(async () => {
  console.log(`\nPawVerdi smoke test → ${BASE}\n${'-'.repeat(64)}`);
  for (const [path, needles] of pages) await checkPage(path, needles);
  await checkApi();
  await checkSecurityHeaders();
  await checkNoKeyMaterial();

  for (const row of rows) {
    console.log(`${row.ok ? 'PASS' : 'FAIL'}  ${row.name.padEnd(46)} ${row.detail}`);
  }
  console.log('-'.repeat(64));
  console.log(`${rows.length - failures.length}/${rows.length} checks passed`);

  if (failures.length) {
    console.error(`\n${failures.length} failure(s):\n- ${failures.join('\n- ')}\n`);
    process.exit(1);
  }
  console.log('All checks passed.\n');
})();
