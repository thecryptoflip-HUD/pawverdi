#!/usr/bin/env python3
"""Read-only check of rendered public navigation, fragment targets and image URLs.

Run against a locally running production build: python3 scripts/test-navigation.py.
The crawler skips API, admin, affiliate redirects, and off-site requests.
"""
from collections import defaultdict, deque
from html.parser import HTMLParser
from os import environ
from urllib.error import HTTPError
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, build_opener
from xml.etree import ElementTree


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.images = []
        self.ids = set()
        self.missing_alt = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if attributes.get('id'):
            self.ids.add(attributes['id'])
        if tag == 'a' and attributes.get('href'):
            self.links.append(attributes['href'])
        if tag in {'img', 'source'} and attributes.get('srcset'):
            for candidate in attributes['srcset'].split(','):
                parts = candidate.strip().split()
                if parts and parts[0].startswith('/'):
                    self.images.append(parts[0])
        if tag == 'img' and attributes.get('src'):
            self.images.append(attributes['src'])
            if 'alt' not in attributes:
                self.missing_alt.append(attributes['src'])


base = environ.get('BASE', 'http://127.0.0.1:3000').rstrip('/')
location = urlsplit(base)
if location.scheme != 'http' or location.hostname not in {'127.0.0.1', 'localhost', '::1'}:
    raise SystemExit('Use a local HTTP BASE for navigation tests.')
opener = build_opener(NoRedirect)
with opener.open(base + '/sitemap.xml', timeout=30) as res:
    sitemap = ElementTree.fromstring(res.read())
paths = [urlsplit(node.text).path or '/' for node in sitemap.findall('.//{*}loc')]
if not paths:
    raise SystemExit('Sitemap contains no pages.')
queue = deque(dict.fromkeys(paths))
visited, ids, image_urls = set(), {}, set()
fragments, failures = defaultdict(set), set()

while queue:
    path = queue.popleft()
    if path in visited:
        continue
    visited.add(path)
    try:
        with opener.open(base + path, timeout=30) as res:
            if res.headers.get_content_type() != 'text/html':
                continue
            page = Page()
            page.feed(res.read().decode('utf-8'))
    except HTTPError as err:
        destination = err.headers.get('location')
        if err.code in (301, 302, 307, 308) and destination:
            target = urlsplit(urljoin(base + path, destination))
            if target.netloc == location.netloc:
                queue.append(target.path)
                continue
        failures.add(f'{path}: HTTP {err.code}')
        continue
    ids[path] = page.ids
    failures.update(f'{path}: image lacks alt: {src}' for src in page.missing_alt)
    for src in page.images:
        image = urlsplit(urljoin(base + path, src))
        if image.netloc == location.netloc:
            image_urls.add(image.path + ('?' + image.query if image.query else ''))
    for href in page.links:
        link = urlsplit(urljoin(base + path, href))
        if link.netloc != location.netloc or link.scheme != 'http':
            continue
        if any(link.path == prefix or link.path.startswith(prefix + '/')
               for prefix in ['/api', '/admin', '/go', '/out', '/r', '/_next']):
            continue
        target = link.path + ('?' + link.query if link.query else '')
        queue.append(target)
        if link.fragment and not link.fragment.startswith(':~:text='):
            fragments[target, unquote(link.fragment)].add(path)

for (path, fragment), sources in fragments.items():
    if path in ids and fragment not in ids[path]:
        failures.add(f'{path}#{fragment}: fragment missing, linked from {min(sources)}')

for path in sorted(image_urls):
    try:
        with opener.open(base + path, timeout=30) as res:
            if not res.headers.get_content_type().startswith('image/') or not res.read(1):
                failures.add(f'{path}: invalid image response')
    except HTTPError as err:
        failures.add(f'{path}: image HTTP {err.code}')

print(f'{len(paths)} sitemap entries, {len(visited)} local paths, '
      f'{len(fragments)} fragment targets, {len(image_urls)} distinct image URLs.')
for failure in sorted(failures):
    print('FAIL', failure)
raise SystemExit(bool(failures))
