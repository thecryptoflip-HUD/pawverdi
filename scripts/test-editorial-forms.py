"""Browser checks for enquiry and consent workflows, on a local build without live data."""
import os
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

base = os.getenv('BASE', 'http://127.0.0.1:3000').rstrip('/')
if urlparse(base).hostname not in ('127.0.0.1', 'localhost'):
    raise SystemExit('Use a local BASE.')
with sync_playwright() as pw:
    browser = pw.chromium.launch(
        executable_path=os.getenv('CHROME_PATH') or None, headless=True,
        args=['--no-sandbox'] if os.getenv('CHROME_NO_SANDBOX') == '1' else [],
    )
    page = browser.new_page()
    for route, title in [
        ('about', 'About PawVerdi'), ('faq', 'Frequently asked'), ('terms', 'Terms of use'),
        ('privacy', 'Privacy policy'), ('media-kit', 'media kit'), ('editorial-standards', 'Editorial standards'),
        ('journal', 'Living with pets'), ('journal/a-weekend-away', 'weekend'), ('search?q=aquarium', 'Search PawVerdi'),
    ]:
        assert page.goto(base + '/' + route).status == 200, route
        assert title in page.locator('main h1').inner_text(), route
    assert page.locator('main a[href="/products/aquarium-lights"]').count()
    print('PASS editorial pages, journal, search')
    # Use an intercepted unavailable-intake response unless explicitly testing an offline fixture.
    if os.getenv('PAWVERDI_OFFLINE_TEST') != '1':
        for path in ['/api/contact', '/api/advertise']:
            page.route('**'+path, lambda route: route.fulfill(status=202, json={'ok':True, 'stored':False}))
    for route, values in [
        ('advertise', {'company':'Example Partner','email':'sample@example.invalid','campaign':'Proposing a winter sponsorship.'}),
        ('contact', {'email':'sample@example.invalid','message':'I have a question about the directory.'}),
    ]:
        page.goto(base+'/'+route, wait_until='domcontentloaded')
        form = page.locator('form[action="/api/'+route+'"]')
        for field, value in values.items():
            form.locator('[name="'+field+'"]').fill(value)
        form.locator('button[type=submit]').click()
        form.get_by_role('status').get_by_text('We could not confirm receipt.', exact=False).wait_for()
        assert form.locator('[name=email]').input_value() == values['email']
        assert page.request.post(base+'/api/'+route, data={'email':'bad'}).status == 400
    print('PASS enquiry form feedback, retained input and invalid request handling')
    page.goto(base+'/cookie-preferences', wait_until='domcontentloaded')
    page.get_by_role('button', name='Allow analytics').click()
    page.wait_for_url('**/cookie-preferences?saved=1')
    assert any(c['name']=='pv_analytics' and c['value']=='allow' for c in page.context.cookies())
    page.get_by_role('button', name='Keep analytics off').click()
    assert any(c['name']=='pv_analytics' and c['value']=='deny' for c in page.context.cookies())
    print('PASS saved consent and withdrawal')
    browser.close()
