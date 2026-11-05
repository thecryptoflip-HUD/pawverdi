#!/usr/bin/env node
/**
 * Read-only, black-box shop checks; no database, account, or retailer requests.
 *   BASE=http://127.0.0.1:3100 node scripts/test-shop.mjs
 * Without BASE, use port 3100 if available; otherwise start an isolated Next
 * dev child on 127.0.0.1:3102 and always stop that child after the checks.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
let base = process.env.BASE || 'http://127.0.0.1:3000';
let child;
let childOutput = '';
let passed = 0;
let failed = 0;

async function request(url, timeout = 90_000) {
  return fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(timeout) });
}

async function stopDev() {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const exited = once(child, 'exit');
  try { process.kill(-child.pid, 'SIGTERM'); } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
  const stopped = await Promise.race([exited.then(() => true), delay(5_000).then(() => false)]);
  if (!stopped) {
    try { process.kill(-child.pid, 'SIGKILL'); } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
    await exited;
  }
  console.log('Stopped isolated Next dev child.');
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await stopDev();
    process.exit(signal === 'SIGINT' ? 130 : 143);
  });
}

async function shopResponse() {
  const configured = new URL(base);
  assert.ok(configured.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(configured.hostname),
    'BASE must be a local HTTP server; these tests never contact production or retailers');
  assert.ok(!configured.username && !configured.password, 'BASE must not contain credentials');
  try {
    return await request(new URL('/shop', base));
  } catch (error) {
    if (process.env.BASE || error.cause?.code !== 'ECONNREFUSED') throw error;
  }

  base = 'http://127.0.0.1:3102';
  try {
    await request(new URL('/shop', base), 2_000);
    throw new Error('Port 3102 is already occupied; set BASE to the intended local server instead');
  } catch (error) {
    if (error.cause?.code !== 'ECONNREFUSED') throw error;
  }

  child = spawn(process.execPath, [
    'node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', '3102',
  ], {
    cwd: root,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  });
  const remember = (chunk) => { childOutput = (childOutput + chunk.toString()).slice(-16_000); };
  child.stdout.on('data', remember);
  child.stderr.on('data', remember);
  let spawnError;
  child.on('error', (error) => { spawnError = error; });
  console.log('Started isolated Next dev child on http://127.0.0.1:3102.');

  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (spawnError) throw spawnError;
    if (child.exitCode !== null || child.signalCode !== null) {
      throw new Error(`Next dev exited before becoming ready:\n${childOutput}`);
    }
    try { return await request(new URL('/shop', base)); } catch (error) {
      if (error.cause?.code !== 'ECONNREFUSED') throw error;
    }
    await delay(250);
  }
  throw new Error(`Next dev did not become ready:\n${childOutput}`);
}

function text(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"').replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, ' ').trim();
}

function links(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => ({
    attrs: Object.fromEntries([...match[1].matchAll(/([\w:-]+)="([^"]*)"/g)]
      .map((attribute) => [attribute[1].toLowerCase(), attribute[2].replace(/&amp;/g, '&')])),
    label: text(match[2]),
  }));
}

async function check(name, run) {
  try {
    await run();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

try {
  const response = await shopResponse();
  assert.equal(response.status, 200, `GET /shop returned HTTP ${response.status}`);
  const html = await response.text();
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(main, 'Shop must render its content in main');
  const tbody = main.match(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/i)?.[1];
  assert.ok(tbody, 'Shop must render a category shortlist table');
  const rows = [...tbody.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
  assert.equal(rows.length, 4, 'Expected the four existing category/type shortlist rows');
  console.log(`PawVerdi shop checks → ${base}/shop`);

  await check('unobserved prices have no check timestamps', () => {
    for (const row of rows) {
      const cells = [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((match) => match[1]);
      assert.equal(cells.length, 6, 'Each shortlist row must retain six labelled columns');
      assert.equal(text(cells[4]), 'Not yet checked', `${text(cells[0])}: no observed price means no check date`);
      assert.doesNotMatch(cells[4], /<time\b/i, 'An absent price check must not render a time element');
      assert.doesNotMatch(text(cells[3]), /\$\s*\d/, 'Do not invent a price');
    }
  });

  await check('every row offers a safe category-level retailer link', () => {
    const targets = [
      ['www.amazon.com', '/s', 'orthopedic dog beds', 'Amazon'],
      ['www.chewy.com', '/b/carriers-106726', null, 'Chewy'],
      ['www.amazon.com', '/s', 'front clip dog harnesses', 'Amazon'],
      ['www.chewy.com', '/b/litter-boxes-413', null, 'Chewy'],
    ];
    rows.forEach((row, index) => {
      const anchors = links(row);
      assert.equal(anchors.length, 1, `Row ${index + 1} needs one real retailer link`);
      const { attrs, label } = anchors[0];
      const destination = new URL(attrs.href);
      const [hostname, pathname, query, merchant] = targets[index];
      assert.equal(destination.protocol, 'https:', 'Retailer links must use HTTPS');
      assert.equal(destination.hostname, hostname, 'Use the correct retailer, not a redirect service');
      assert.equal(destination.pathname, pathname, 'Link to a category, not an invented product or ASIN');
      assert.equal(destination.searchParams.get('k'), query);
      assert.ok(!destination.username && !destination.password && !destination.hash);
      assert.match(label, new RegExp(`Browse .*${merchant}`), 'Link text must describe the retailer browse action');
      assert.equal(attrs.target, '_blank');
      const rel = new Set((attrs.rel || '').split(/\s+/));
      for (const token of ['sponsored', 'nofollow', 'noopener']) {
        assert.ok(rel.has(token), `Commercial links require rel=${token}`);
      }
    });
  });

  await check('configured Amazon links preserve the tag and tracked label', () => {
    for (const index of [0, 2]) {
      const { attrs } = links(rows[index])[0];
      const destination = new URL(attrs.href);
      assert.deepEqual(destination.searchParams.getAll('tag'), ['pawverdi-20'], 'Preserve the existing configured Amazon tag');
      assert.equal(attrs['data-track'], 'tracked');
      assert.match(text(rows[index]), /\bAffiliate\b/, 'A tracked Amazon link needs an inline affiliate label');
    }
  });

  await check('Chewy remains an ordinary untracked retailer link', () => {
    for (const index of [1, 3]) {
      const { attrs } = links(rows[index])[0];
      assert.equal(attrs['data-track'], 'UNTRACKED', 'Unconfigured Chewy links must not imply affiliate tracking');
      assert.equal(new URL(attrs.href).search, '', 'Do not invent tracking parameters for Chewy');
      assert.doesNotMatch(text(rows[index]), /\bAffiliate\b/i, 'Chewy must not carry an affiliate badge');
      assert.match(text(rows[index]), /Retailer link\s*[·—-]?\s*untracked/i, 'Explain the ordinary retailer-link status inline');
    }
  });

  await check('readers see the Amazon Associate disclosure before shopping', () => {
    const disclosure = main.match(/<aside\b[^>]*id="shop-disclosure"[^>]*>([\s\S]*?)<\/aside>/i);
    assert.ok(disclosure, 'Put a reader-facing shop disclosure on this page');
    assert.ok(disclosure.index < main.indexOf('<table'), 'Disclosure must precede the commercial links');
    const copy = text(disclosure[1]);
    assert.ok(copy.includes('As an Amazon Associate I earn from qualifying purchases.'), 'Use the Amazon Associate disclosure wording');
    assert.match(copy, /may earn a commission at no extra cost to you/i);
    assert.match(copy, /Chewy links are ordinary retailer links without affiliate tracking/i);
    assert.ok(links(main).some(({ attrs }) => attrs.href === '#shop-disclosure'), 'Make the shop disclosure reachable from the hero');
    assert.doesNotMatch(text(main), /(?:affiliate account|earnings|commissions?)\s+(?:is |are |have been )?(?:verified|confirmed|guaranteed)/i);
  });

  await check('shop presents a category/type shortlist, not reviewed products', () => {
    const title = text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
    assert.match(title, /category shortlist/i, 'Page metadata must not advertise tested recommendations');
    assert.doesNotMatch(title, /tested recommendations|honest comparisons/i);
    const caption = text(main.match(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i)?.[1] || '');
    assert.match(caption, /category\/type shortlist/i);
    assert.match(text(main), /No products in this shortlist have been tested or rated by PawVerdi\./);
    const names = rows.map((row) => text(row.match(/<th\b[^>]*>([\s\S]*?)<\/th>/i)?.[1] || ''));
    assert.deepEqual(names, ['Orthopedic dog beds', 'Top-loading cat carriers', 'Front-clip dog harnesses', 'High-sided litter boxes']);
    for (const row of rows) {
      assert.match(text(row), /Not yet reviewed/);
      assert.doesNotMatch(text(row), /\d+(?:\.\d+)?\s*\/\s*(?:5|10)|[★☆]/, 'No invented scores or stars');
    }
    assert.doesNotMatch(html, /"@type"\s*:\s*"(?:Product|Review|AggregateRating)"/, 'A category shortlist must not publish product-review structured data');
  });

  await check('testing method is future policy, not completed work', () => {
    const policy = main.match(/<section\b[^>]*id="how-we-test"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
    assert.ok(policy, 'Keep the testing-policy section reachable');
    const copy = text(policy);
    assert.match(copy, /Future testing policy/i);
    assert.match(copy, /policy for future product reviews, not a record of completed tests/i);
    assert.match(copy, /named reviewer/i);
    assert.match(copy, /dated test notes/i);
    assert.doesNotMatch(copy, /same three dogs|was purchased|is measured|unit is kept|ratings expire/i);
  });

  await check('price explanation states the current limitation without developer promises', () => {
    const copy = text(main);
    assert.doesNotMatch(copy, /lib\/pricing\.ts|price sync job|merchant feed|within the last 24 hours|live feeds/i,
      'Remove developer-only references and unsupported scheduled-feed claims');
    assert.match(copy, /We have not captured prices for this shortlist/i);
    assert.match(copy, /Check the retailer for the current price and availability/i);
    assert.match(copy, /no price check date is shown until a price has actually been observed/i);
  });

  console.log(`${passed}/${passed + failed} shop checks passed`);
  process.exitCode = failed ? 1 : 0;
} catch (error) {
  console.error(`Shop test setup failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await stopDev();
}
