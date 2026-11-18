#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const complete = new Set([
  'new-puppy-checklist',
  'new-kitten-checklist',
  'best-dog-crate',
  'best-cat-carrier',
  'dog-harness-size-guide',
  'best-cat-litter-box-multiple-cats',
]);
const BASE = process.env.BASE || 'http://127.0.0.1:3000';
async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  assert.equal(res.status, 200, path);
  return res.text();
}
const text = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

test('unfinished topic stays accessible but is noindex and absent from sitemap', async () => {
  const html = await get('/knowledge/cat-cost-per-year');
  assert.match(html, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/, 'topic preview must not be indexed as a finished guide');
  assert.match(text(html), /Guide in preparation/);
  assert.ok(!text(html).includes('Editorial review'), 'preview must not claim an editorial pass');
  assert.ok(!text(html).includes('Reading time'), 'preview must not claim a full-article reading time');
  assert.ok(!/<script[^>]*application\/ld\+json[^>]*>[^<]*"@type":"Article"/.test(html), 'preview must not emit finished Article structured data');
  const sitemap = await get('/sitemap.xml');
  assert.ok(!sitemap.includes('/knowledge/cat-cost-per-year'), 'unfinished topic leaked into sitemap');
  for (const slug of complete) {
    assert.ok(sitemap.includes(`/knowledge/${slug}</loc>`), `${slug}: missing from sitemap`);
  }
});

test('homepage and knowledge center count and promote only complete guides', async () => {
  const home = await get('/');
  assert.ok(home.includes(`data-guide-count="${complete.size}"`), 'homepage must derive completed-guide count from actual bodies');
  assert.ok(!/24\s*guides/.test(text(home)), 'homepage must not pass off topic records as complete guides');
  const knowledge = await get('/knowledge');
  assert.ok(text(knowledge).includes(`${complete.size} full guides`), 'knowledge center must state the actual complete count');
  assert.ok(text(knowledge).includes(`${24 - complete.size} topics in preparation`), 'knowledge center must account for unfinished topics separately');
  assert.ok(!/Editorial reviews completed this month/.test(text(knowledge)), 'do not invent monthly editorial review metrics');
  for (const path of ['/knowledge?species=cat&section=health','/knowledge?species=dog&section=costs']) {
    const filtered = await get(path);
    assert.ok(text(filtered).includes('Nothing published under that filter yet.'), 'unfinished health/cost records must not appear as finished guides');
  }
});

test('trust policy matches research-based guides and unobserved prices', async () => {
  const policy = text(await get('/trust'));
  assert.ok(policy.includes('Research-based guides'), 'policy must explain the actual source-linked guide label');
  assert.ok(!policy.includes('Prices are re-checked on a schedule'), 'do not promise an unbuilt price-check schedule');
  assert.ok(policy.includes('No price-check date is shown until a price has actually been observed'), 'price evidence rule must match shop');
});

test('each public hub has exactly one newsletter signup with the correct POST target', async () => {
  for (const path of ['/', '/dogs', '/cats', '/knowledge', '/shop', '/marketplace', '/community']) {
    const html = await get(path);
    const forms = [...html.matchAll(/<form\b([^>]*)>/g)].map((match) => match[1]);
    const signups = forms.filter((attributes) => /action="\/api\/newsletter"/.test(attributes));
    assert.equal(signups.length, 1, `${path}: expected one signup, without duplicate newsletter sections`);
    assert.match(signups[0], /method="post"/i, `${path}: signup must POST to the intake endpoint`);
  }
});

test('seller application is a POST form with every required intake field', async () => {
  const html = await get('/marketplace');
  const forms = [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)];
  const application = forms.find((match) => /action="\/api\/seller-application"/.test(match[1]));
  assert.ok(application, 'seller application must be connected to the existing intake endpoint');
  assert.match(application[1], /method="post"/i, 'application fields must not be put in the URL');
  for (const name of ['trading_name', 'country', 'email', 'licence']) {
    assert.match(application[2], new RegExp(`<input[^>]*name="${name}"`), `missing ${name}`);
  }
  const grooming = text(await get('/knowledge?section=grooming'));
  assert.ok(grooming.includes('topic: grooming'), 'a Grooming link must not silently reset to All topics');
});

test('all 24 existing article routes have a canonical URL and truthful indexing state', async () => {
  const content = await readFile(new URL('../lib/content.ts', import.meta.url), 'utf8');
  const records = content.split('const articleRecords: Article[] = [')[1].split('export const articles:')[0];
  const slugs = [...records.matchAll(/slug: '([^']+)'/g)].map((match) => match[1]);
  assert.equal(slugs.length, 24, 'route coverage must account for every original article record');
  for (const slug of slugs) {
    const html = await get(`/knowledge/${slug}`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${slug}: expected one H1`);
    assert.ok(html.includes(`href="https://pawverdi.com/knowledge/${slug}"`), `${slug}: wrong canonical`);
    const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html);
    assert.equal(noindex, !complete.has(slug), `${slug}: incorrect robots state`);
    assert.equal(html.includes('data-guide-body'), complete.has(slug), `${slug}: incorrect guide body state`);
  }
});
