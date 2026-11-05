#!/usr/bin/env node
import assert from 'node:assert/strict';
import test from 'node:test';

const BASE = process.env.BASE || 'http://127.0.0.1:3000';
async function page(path) {
  const res = await fetch(`${BASE}${path}`);
  assert.equal(res.status, 200, path);
  const html = await res.text();
  // Ignore React's serialized payload: only the rendered article is evidence.
  return { html, article: html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1] || '' };
}
function visibleText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

test('puppy checklist renders a complete, sourced guide instead of a preview', async () => {
  const { article, html } = await page('/knowledge/new-puppy-checklist');
  const text = visibleText(article);
  assert.ok(!text.includes('This is a working preview'), 'published puppy guide must not be a placeholder');
  assert.ok(article.includes('data-guide-body'), 'substantive guide body must render on the server');
  for (const section of ['Before pickup', 'What can wait', 'The first night', 'Sources']) {
    assert.ok(text.includes(section), `missing practical section: ${section}`);
  }
  assert.ok(text.split(/\s+/).length >= 700, 'checklist must provide at least 700 words of real guidance');
  assert.ok(article.includes('https://www.pdsa.org.uk/'), 'PDSA source link missing');
  assert.ok(article.includes('https://www.bluecross.org.uk/'), 'Blue Cross source link missing');
  assert.match(html, /<link[^>]*rel="canonical"[^>]*href="https:\/\/pawverdi\.com\/knowledge\/new-puppy-checklist"/);
  assert.ok(!html.match(/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/), 'complete guide should be indexable');
  assert.ok(!article.includes('Veterinary review by'), 'no invented veterinary reviewer');
});

test('kitten checklist renders safe-room, litter and settling guidance with sources', async () => {
  const { article } = await page('/knowledge/new-kitten-checklist');
  const text = visibleText(article);
  assert.ok(article.includes('data-guide-body'), 'kitten guide must have its own complete body');
  assert.ok(!text.includes('This is a working preview'), 'kitten guide must not be a placeholder');
  for (const section of ['Before collection', 'Set up the safe room', 'Litter trays', 'What can wait', 'Sources']) {
    assert.ok(text.includes(section), `missing practical section: ${section}`);
  }
  assert.ok(text.split(/\s+/).length >= 700, 'kitten guide must provide at least 700 words');
  assert.ok(article.includes('https://www.cats.org.uk/'), 'Cats Protection guidance must be linked');
  assert.match(text, /lilies/i, 'kitten-proofing must cover lilies');
  assert.match(text, /not vet-reviewed/i, 'review status must be explicit');
  assert.ok(!article.includes('Veterinary review by'), 'do not fabricate a veterinary reviewer');
});
