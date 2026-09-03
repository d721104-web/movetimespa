#!/usr/bin/env python3
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
GUIDES = ROOT / "_guides"
REQUIRED = [
    "title", "seo_title", "description", "lede", "category",
    "summary", "date", "modified", "order"
]

def frontmatter(text):
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---\n", 4)
    if end == -1:
        return None
    block = text[4:end]
    data = {}
    for line in block.splitlines():
        m = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if m:
            data[m.group(1)] = m.group(2).strip().strip('"\'')
    return data

errors = []
for path in sorted(GUIDES.glob("*.md")):
    text = path.read_text(encoding="utf-8")
    fm = frontmatter(text)
    if fm is None:
        errors.append(f"{path.name}: 缺少有效 YAML front matter")
        continue
    for key in REQUIRED:
        if not fm.get(key):
            errors.append(f"{path.name}: 缺少 {key}")
    desc = fm.get("description", "")
    if desc and len(desc) < 35:
        errors.append(f"{path.name}: description 太短（目前 {len(desc)} 字）")
    if desc and len(desc) > 190:
        errors.append(f"{path.name}: description 太長（目前 {len(desc)} 字）")
    if "http://" in text:
        errors.append(f"{path.name}: 正文出現 http://，請確認是否應改為 https://")

if errors:
    print("Guide content check failed:")
    for e in errors:
        print(" -", e)
    sys.exit(1)
print(f"Guide content check passed: {len(list(GUIDES.glob('*.md')))} article(s)")
