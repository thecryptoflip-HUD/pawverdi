// Run on a local release build with puppeteer-core installed in the QA environment.
import assert from 'node:assert/strict';
const { launch } = await import(process.env.PUPPETEER_MODULE || 'puppeteer-core');
const base = process.env.BASE || 'http://127.0.0.1:3000';
if (!['localhost','127.0.0.1'].includes(new URL(base).hostname)) throw Error('Use a local BASE.');
const args = ['--headless', '--disable-dev-shm-usage'];
if (process.env.CHROME_NO_SANDBOX === '1') args.push('--no-sandbox');
const browser = await launch({args, executablePath:process.env.CHROME_PATH, headless:true});
try {
  for (const [width, height, touch] of [[1440,900,false], [768,1024,true], [390,844,true], [320,700,true]]) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => Object.defineProperty(navigator, "hardwareConcurrency", {get:()=>8}));
    await page.setViewport({width,height,hasTouch:touch,isMobile:touch});
    await page.goto(base, {waitUntil:'networkidle2'});
    const hero = await page.$('.pv-hero-scene');
    assert.ok(hero, 'hero missing');
    assert.equal(await page.$$eval('.pv-species-links a', nodes=>nodes.length), 6);
    const cover = await page.$eval('[data-pet-photo="home-hero"]', image => ({
      loaded: image.complete && image.naturalWidth > 0,
      source: new URL(image.currentSrc).pathname,
      priority: image.fetchPriority,
    }));
    assert.ok(cover.loaded, 'hero artwork failed to load');
    assert.equal(cover.priority, 'high');
    if (width <= 480) assert.match(cover.source, /dog-garden-(480|850)\.webp$/);
    await hero.scrollIntoView();
    const bounds = await hero.boundingBox();
    assert.ok(bounds.width <= width, 'hero width exceeds viewport');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), 'page scrolls horizontally');
    const x=bounds.x + bounds.width*.72, y=bounds.y+bounds.height*.45;
    const client = touch ? await page.createCDPSession() : null;
    if (touch) {
      await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-8,y}]});
      await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y}]});
    } else {
      await page.mouse.move(x,y);
    }
    await page.waitForFunction(()=>Number(document.querySelector('.pv-hero-scene').style.getPropertyValue('--scene-x')) > 0,{timeout:3000});
    if (touch) {
      await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    } else {
      await page.mouse.move(1,1);
    }
    await page.waitForFunction(()=>Number(document.querySelector('.pv-hero-scene').style.getPropertyValue('--scene-x')) === 0,{timeout:3000});
    await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await page.mouse.move(x,y);
    assert.equal(await page.$eval('.pv-reference-homehero-image',e=>getComputedStyle(e).transform),'none','reduced-motion image must remain stationary');
    console.log('PASS',width+'px',touch?'touch':'mouse','layout, species links, depth response, reset and reduced motion');
    await page.close();
  }
} finally { await browser.close(); }
