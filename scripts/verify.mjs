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
  ['/', ['More joy, color', 'PawVerdi', 'pv-home-hero', 'pv-picture-frame', 'pv-invitation']],
  ['/dogs', ['Dog Center', 'Breed reference']],
  ['/cats', ['Cat Center', 'Breed reference']],
  ['/knowledge', ['Knowledge Center', 'guides', 'pv-editorial-tile']],
  ['/knowledge/cat-cost-per-year', ['What this guide covers', 'Medical disclaimer']],
  ['/marketplace', ['0 listings published', 'Verification', 'pv-editorial-tile']],
  ['/shop', ['Not yet reviewed', 'Method']],
  ['/advertise', ['Sponsored', 'cannot remove the sponsored label']],
  ['/community', ['One email a month', 'pv-editorial-tile']],
  ['/trust', ['Affiliate disclosure', 'Seller and listing standards']],
  ['/contact', ['PawVerdi@hotmail.com']],
  ['/admin/login', ['Sign in']],
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
    record('/api/health', res.status === 200 && body.ok === true && !JSON.stringify(body).includes('mode') && !JSON.stringify(body).includes('articles'), `http=${res.status}`);
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
  const expected = ['x-content-type-options', 'referrer-policy', 'x-frame-options', 'cross-origin-opener-policy', 'cross-origin-resource-policy', 'x-permitted-cross-domain-policies'];
  const missing = expected.filter((h) => !res.headers.get(h));
  record('security headers', missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : 'present');
}

async function checkCsp() {
  const res = await fetch(`${BASE}/`);
  const csp = res.headers.get('content-security-policy') || '';
  const required = ["default-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'"];
  const missing = required.filter((needle) => !csp.includes(needle));
  record('content-security-policy', missing.length === 0, missing.length ? `missing: ${missing.join(', ')}` : `${csp.split(';').length} directives`);
}

async function checkDiagnosticsGuard() {
  try {
    const res = await fetch(`${BASE}/admin`, { redirect: 'manual' });
    record('/admin redirects to login', [307, 308].includes(res.status) && (res.headers.get('location') || '').includes('/admin/login'), `http=${res.status}`);
  } catch (error) {
    record('/admin redirects to login', false, error.message);
  }
  for (const path of ['/api/db-status', '/api/db-status?purge=1', '/api/admin/whoami']) {
    try {
      const res = await fetch(`${BASE}${path}`);
      const body = await res.json();
      const forbidden = ['host', 'ref', 'keyKinds', 'serviceKeySource', 'schemaReady', 'tables', 'missing'];
      record(`${path} unauthenticated`, res.status === 401 && body.ok === false && body.error === 'Authentication required.' && forbidden.every((key) => !(key in body)) && !JSON.stringify(body).toLowerCase().includes('host'), `http=${res.status}`);
    } catch (error) {
      record(`${path} unauthenticated`, false, error.message);
    }
  }
}

async function checkForgedSession() {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const jwt = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: 'x', role: 'authenticated' })}.forged`;
  const project = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0] : 'forged';
  const session = `base64-${Buffer.from(JSON.stringify({ access_token: jwt, refresh_token: 'forged', token_type: 'bearer' })).toString('base64url')}`;
  for (const path of ['/admin', '/api/admin/whoami', '/api/db-status']) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        redirect: 'manual', headers: { cookie: `sb-${project}-auth-token=${session}` },
      });
      record(`${path} forged session`, [401, 307].includes(res.status), `http=${res.status}`);
    } catch (error) {
      record(`${path} forged session`, false, error.message);
    }
  }
  try {
    const res = await fetch(`${BASE}/admin`, { redirect: 'manual' });
    const cache = res.headers.get('cache-control') || '';
    record('admin private cache policy', cache.includes('private') && cache.includes('no-store')
      && /(?:^|,\s*)cookie(?:,|$)/i.test(res.headers.get('vary') || ''), `http=${res.status}`);
  } catch (error) {
    record('admin private cache policy', false, error.message);
  }
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
  await checkCsp();
  await checkDiagnosticsGuard();
  await checkForgedSession();

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
