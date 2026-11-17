#!/usr/bin/env node
/** Read-only checks of rendered image placements, including renamed duplicate files. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const catalogue = JSON.parse(await readFile(new URL('../lib/pet-photography.json', import.meta.url), 'utf8'));

const base = process.env.BASE || 'http://127.0.0.1:3000';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Run photo checks against a local test server');
const routes = ['/', '/dogs', '/cats', '/knowledge', '/shop', '/marketplace', '/community'];
const expected = [13, 13, 13, 12, 14, 13, 13];
const decode = value => value.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#x27;/g, "'");
const pages = await Promise.all(routes.map(async route => {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(main, `${route}: main content is missing`);
  const images = [...main.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map(match => decode(match[1]));
  const backgrounds = [...main.matchAll(/\bstyle="([^"]*)"/gi)].flatMap(match =>
    [...decode(match[1]).matchAll(/background-image:\s*url\(([^)]+)\)/g)].map(value => value[1].replace(/^['"]|['"]$/g, ''))
  );
  return { route, images, backgrounds, all: [...images, ...backgrounds] };
}));
let passed = 0;
const check = async (label, run) => { await run(); passed++; console.log(`PASS ${label}`); };

await check('all seven pages retain a photograph for every assigned placement', () => {
  pages.forEach((page, index) => {
    assert.equal(page.backgrounds.length, 1, `${page.route}: expected one visible hero photo`);
    assert.equal(page.all.length, expected[index], `${page.route}: photo count changed`);
  });
  assert.deepEqual(new Set(pages.flatMap(page => page.all)), new Set(Object.values(catalogue).map(photo => photo.src)), 'Rendered images must match the approved placement catalogue');
});
const placements = pages.flatMap(page => page.all.map(src => ({ route: page.route, src })));
await check('no photograph URL repeats within or across the seven pages', () => {
  const seen = new Map();
  for (const placement of placements) {
    assert.match(placement.src, /^\/brand\//, 'Keep website photos local');
    assert.ok(!seen.has(placement.src), `${placement.src} repeated on ${seen.get(placement.src)} and ${placement.route}`);
    seen.set(placement.src, placement.route);
  }
  assert.equal(seen.size, 91);
});
let next = 0;
const assets = [];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (next < placements.length) {
    const placement = placements[next++];
    const response = await fetch(new URL(placement.src, base));
    assert.equal(response.status, 200, placement.src);
    assert.match(response.headers.get('content-type') || '', /^image\//, placement.src);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.ok(bytes.length > 1000, `${placement.src}: empty or placeholder image`);
    assets.push({ ...placement, sha: createHash('sha256').update(bytes).digest('hex') });
  }
}));
await check('all 91 photograph assets load as images', () => assert.equal(assets.length, 91));
await check('different filenames do not conceal identical image content', () => {
  const seen = new Map();
  for (const asset of assets) {
    assert.ok(!seen.has(asset.sha), `${asset.src} duplicates the image bytes of ${seen.get(asset.sha)}`);
    seen.set(asset.sha, asset.src);
  }
});
console.log(`${passed}/4 photography checks passed — 91 distinct photos across seven pages`);
