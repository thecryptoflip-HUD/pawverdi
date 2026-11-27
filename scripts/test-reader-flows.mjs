// Run on a local release build with puppeteer-core installed in the QA environment.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
const { launch } = await import(process.env.PUPPETEER_MODULE || 'puppeteer-core');
const base = process.env.BASE || 'http://127.0.0.1:3000';
if (!['localhost','127.0.0.1'].includes(new URL(base).hostname)) throw Error('Use a local BASE.');
const args = ['--headless', '--disable-dev-shm-usage'];
if (process.env.CHROME_NO_SANDBOX === '1') args.push('--no-sandbox');
const browser = await launch({args, executablePath:process.env.CHROME_PATH, headless:true});
const errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  for (const width of [1440,768,390]) {
    await page.setViewport({width, height:width===1440?900:844, hasTouch:width<1000, isMobile:width<768});
    await page.goto(base, {waitUntil:'networkidle2'});
    assert.ok(await page.$('.pv-hero-scene'));
    assert.equal(await page.$$eval('.pv-species-links a', links => links.length),6);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    if (process.env.QA_SHOTS) {
      await mkdir(process.env.QA_SHOTS,{recursive:true});
      await page.screenshot({path:join(process.env.QA_SHOTS,'home-'+width+'.png')});
    }
    console.log('PASS home viewport '+width);
  }
  await page.goto(base+'/discover/birds', {waitUntil:'networkidle2'});
  await page.type('[name=q]', 'perch');
  await Promise.all([page.waitForNavigation(),page.click('form button')]);
  assert.ok(await page.$('a[href="/products/bird-perches"]'));
  assert.equal(await page.$('a[href="/products/bird-carriers"]'),null);
  await page.click('input[value=bird-perches]');
  await Promise.all([page.waitForNavigation(),page.click('form[action="/compare"] button')]);
  assert.match(await page.$eval('table', element => element.innerText),/Bird perches/);
  console.log('PASS search, species filter and selected-item comparison');
  await page.goto(base+'/search?q=aquarium');
  assert.ok(await page.$('main a[href="/products/aquarium-lights"]'));
  await page.goto(base+'/deals');
  assert.match(await page.$eval('main',element=>element.innerText),/No current verified offers/);
  await page.goto(base+'/cookie-preferences',{waitUntil:'networkidle2'});
  const clickText = async text => {
    const handle=await page.evaluateHandle(t=>[...document.querySelectorAll('button')].find(el=>el.textContent.includes(t)),text);
    await handle.asElement().click();
  };
  await Promise.all([page.waitForNavigation(),clickText('Allow analytics')]);
  assert.match(await page.evaluate(()=>document.cookie),/pv_analytics=allow/);
  await clickText('Keep analytics off');
  assert.match(await page.evaluate(()=>document.cookie),/pv_analytics=deny/);
  console.log('PASS global search, verified deals empty state and cookie consent round trip');
  assert.deepEqual(errors,[]);
  console.log('PASS no uncaught page or browser console errors');
} finally { await browser.close(); }
