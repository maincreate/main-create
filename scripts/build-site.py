#!/usr/bin/env python3
"""Assemble and validate the static Main{Create} public site.

No network access, runtime dependencies, or privileged build steps required.
Only intentionally published files are copied into the Pages artifact.
"""
from __future__ import annotations

import pathlib
import shutil
import sys
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "_site"
FILES = (
    "index.html", "style.css", "CNAME",
    "assets/maincreate-braces-layers.svg",
    "assets/maincreate-icon.png",
    "docs/index.html", "docs/docs.css", "docs/docs.js",
)

class LocalReferenceParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs: list[str] = []
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if tag in {"a", "link", "script", "img"} and key in {"href", "src"} and value:
                self.refs.append(value)

def check_html(path: pathlib.Path) -> None:
    parser = LocalReferenceParser()
    parser.feed(path.read_text(encoding="utf-8"))
    for reference in parser.refs:
        parts = urlsplit(reference)
        if parts.scheme or parts.netloc or not parts.path or reference.startswith("#"):
            continue
        if parts.path.startswith("/"):
            target = ROOT / unquote(parts.path).lstrip("/")
        else:
            target = path.parent / unquote(parts.path)
        if target.is_dir() or parts.path.endswith("/"):
            target = target / "index.html"
        if not target.is_file() or ROOT not in target.resolve().parents:
            raise ValueError(f"{path.relative_to(ROOT)}: broken local reference {reference!r}")

def check_brand_layout() -> None:
    """Prevent a duplicate logo icon beside the website wordmark."""
    public = (ROOT / "index.html").read_text(encoding="utf-8")
    docs = (ROOT / "docs/index.html").read_text(encoding="utf-8")
    if '<header class="site-header">' not in public or '<div class="preview-top">' not in public:
        raise ValueError("Expected site branding sections not found")
    site_header = public.split('<header class="site-header">', 1)[1].split('</header>', 1)[0]
    workspace = public.split('<div class="preview-top">', 1)[1].split('<div class="preview-body">', 1)[0]
    docs_header = docs.split('<header class="nav wrap">', 1)[1].split('</header>', 1)[0]
    if any('<img' in header or 'brand-icon' in header for header in (site_header, docs_header)):
        raise ValueError("Navigation must show the styled Main{Create} wordmark without an icon")
    if 'class="brand-name"' not in site_header or 'class="brand-name"' not in docs_header:
        raise ValueError("Navigation wordmark is missing")
    if 'Main{Create}' in workspace or 'class="preview-logo"' not in workspace or '/ WORKSPACE' not in workspace:
        raise ValueError("Workspace preview must contain the symbol plus / WORKSPACE only")


def main() -> None:
    domain = (ROOT / "CNAME").read_text(encoding="utf-8").strip()
    if domain != "maincreate.com":
        raise ValueError("CNAME must contain exactly maincreate.com")
    check_brand_layout()
    for relative in FILES:
        source = ROOT / relative
        if not source.is_file():
            raise FileNotFoundError(relative)
        if source.suffix == ".html":
            check_html(source)
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    for relative in FILES:
        target = OUTPUT / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / relative, target)
    (OUTPUT / ".nojekyll").touch()
    print(f"Validated and assembled {len(FILES)} files in {OUTPUT.relative_to(ROOT)}")

if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError) as error:
        print(f"Site build failed: {error}", file=sys.stderr)
        raise SystemExit(1)
