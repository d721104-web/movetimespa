#!/usr/bin/env python3
"""Check generated public content and local links, without contacting booking endpoints."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else '_site').resolve()
ORIGIN = 'https://www.movetimespa.com'
FORBIDDEN = ['可指定', '女師傅', '張老師', '林老師', '陪玩', '專業認證', '最熱門', '最多人預約',
             '男師傅', '女按摩師', '男／女按摩師', '客戶真實評價']

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.canonicals, self.h1 = [], [], [], 0
        self.json_blocks, self.json_buffer = [], None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'h1':
            self.h1 += 1
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonicals.append(a.get('href'))
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag == 'script' and a.get('type') == 'application/ld+json':
            self.json_buffer = ''

    def handle_data(self, data):
        if self.json_buffer is not None:
            self.json_buffer += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.json_buffer is not None:
            self.json_blocks.append(self.json_buffer)
            self.json_buffer = None

errors, pages = [], {}
assert ROOT.is_dir(), f'Missing built site: {ROOT}'
for path in ROOT.rglob('*.html'):
    text = path.read_text(encoding='utf-8')
    page = Page(text)
    pages[path] = page
    label = path.relative_to(ROOT).as_posix()
    for phrase in FORBIDDEN:
        if phrase in text:
            errors.append(f'{label}: forbidden public phrase {phrase}')
    if page.h1 != 1:
        errors.append(f'{label}: expected one H1, got {page.h1}')
    if len(page.ids) != len(set(page.ids)):
        errors.append(f'{label}: duplicate HTML IDs')
    if label != '404.html':
        expected = ORIGIN + '/' + label.removesuffix('index.html')
        if page.canonicals != [expected]:
            errors.append(f'{label}: canonical {page.canonicals}, expected {expected}')
    for block in page.json_blocks:
        try:
            json.loads(block)
        except ValueError as e:
            errors.append(f'{label}: invalid JSON-LD: {e}')

for path, page in pages.items():
    for href in page.links:
        url = urlsplit(href)
        if url.netloc and url.netloc != 'www.movetimespa.com':
            continue
        if url.scheme and url.scheme not in ('http', 'https'):
            continue
        dest = (ROOT / unquote(url.path).lstrip('/')) if url.path.startswith('/') else path.parent / unquote(url.path)
        if not url.path:
            dest = path
        if dest.is_dir():
            if url.path and not url.path.endswith('/'):
                errors.append(f'{path.relative_to(ROOT)}: directory link lacks slash: {href}')
            dest /= 'index.html'
        dest = dest.resolve()
        if not dest.exists():
            errors.append(f'{path.relative_to(ROOT)}: broken internal link: {href}')
        elif url.fragment and dest in pages and unquote(url.fragment) not in pages[dest].ids:
            errors.append(f'{path.relative_to(ROOT)}: missing anchor: {href}')

ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
for item in ET.parse(ROOT / 'sitemap.xml').getroot().findall('s:url', ns):
    loc = item.findtext('s:loc', namespaces=ns)
    if not loc.startswith(ORIGIN + '/') or not loc.endswith('/'):
        errors.append(f'Inconsistent sitemap URL: {loc}')
    dest = ROOT / urlsplit(loc).path.lstrip('/') / 'index.html'
    if not dest.exists():
        errors.append(f'Sitemap URL missing: {loc}')
    lastmod = item.findtext('s:lastmod', namespaces=ns)
    if lastmod is not None and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', lastmod):
        errors.append(f'Invalid lastmod: {loc}: {lastmod}')

for name in ['V3-LAUNCH-GUIDE.md', 'MIGRATION-CHECKLIST.md']:
    if (ROOT / name).exists():
        errors.append(f'Internal documentation published: {name}')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'PASS: {len(pages)} HTML pages; forbidden phrases, H1, IDs, JSON-LD, canonical, internal links and sitemap')
