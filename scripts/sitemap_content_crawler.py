#!/usr/bin/env python3
"""
Crawl a website via its XML sitemap, extract core page content, and export to CSV.

Usage:
    python sitemap_content_crawler.py https://example.com/sitemap.xml
    python sitemap_content_crawler.py https://example.com/sitemap.xml -o audit.csv
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
import time
import xml.etree.ElementTree as ET
from typing import Iterable
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup, Comment, NavigableString, Tag

# Browser-like User-Agent to reduce blocks from basic bot filters.
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

REQUEST_TIMEOUT_SECONDS = 30
REQUEST_DELAY_SECONDS = 1.0

SITEMAP_NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

CSV_COLUMNS = [
    "URL",
    "Meta Title",
    "Meta Description",
    "H1 Title",
    "H2 Headings",
    "Main Body Text",
    "Word Count",
]

# Tags stripped before body extraction (global chrome + non-content).
STRIP_TAGS = frozenset(
    {
        "script",
        "style",
        "noscript",
        "svg",
        "iframe",
        "header",
        "footer",
        "nav",
        "aside",
        "form",
    }
)

WHITESPACE_RE = re.compile(r"\s+")


def normalize_whitespace(text: str) -> str:
    return WHITESPACE_RE.sub(" ", text).strip()


def fetch_url(session: requests.Session, url: str) -> requests.Response:
    return session.get(url, timeout=REQUEST_TIMEOUT_SECONDS)


def decode_html_response(response: requests.Response) -> str:
    """
    Decode HTML as UTF-8 when possible so smart quotes, em dashes, and arrows
    are not misread (which causes mojibake like â€™ or â† in exports).
    """
    content_type = response.headers.get("Content-Type", "")
    charset_match = re.search(r"charset=([\w-]+)", content_type, re.I)
    if charset_match:
        response.encoding = charset_match.group(1)
    elif not response.encoding or response.encoding.lower() == "iso-8859-1":
        # requests defaults to ISO-8859-1 when charset is missing; modern sites are UTF-8.
        response.encoding = response.apparent_encoding or "utf-8"
    return response.text


def parse_sitemap_xml(xml_bytes: bytes) -> tuple[list[str], list[str]]:
    """
    Parse a sitemap or sitemap index document.

    Returns:
        (page_urls, nested_sitemap_urls)
    """
    root = ET.fromstring(xml_bytes)
    tag_local = root.tag.split("}")[-1] if "}" in root.tag else root.tag

    page_urls: list[str] = []
    nested_sitemaps: list[str] = []

    if tag_local == "sitemapindex":
        for loc in root.findall(".//sm:sitemap/sm:loc", SITEMAP_NS):
            if loc.text and loc.text.strip():
                nested_sitemaps.append(loc.text.strip())
        if not nested_sitemaps:
            for loc in root.findall(".//{*}sitemap/{*}loc"):
                if loc.text and loc.text.strip():
                    nested_sitemaps.append(loc.text.strip())
    elif tag_local == "urlset":
        for loc in root.findall(".//sm:url/sm:loc", SITEMAP_NS):
            if loc.text and loc.text.strip():
                page_urls.append(loc.text.strip())
        if not page_urls:
            for loc in root.findall(".//{*}url/{*}loc"):
                if loc.text and loc.text.strip():
                    page_urls.append(loc.text.strip())
    else:
        # Fallback: collect any <loc> under url entries vs sitemap entries.
        for loc in root.findall(".//sm:url/sm:loc", SITEMAP_NS):
            if loc.text and loc.text.strip():
                page_urls.append(loc.text.strip())
        for loc in root.findall(".//sm:sitemap/sm:loc", SITEMAP_NS):
            if loc.text and loc.text.strip():
                nested_sitemaps.append(loc.text.strip())

    return page_urls, nested_sitemaps


def collect_urls_from_sitemap(
    session: requests.Session, sitemap_url: str, visited_sitemaps: set[str]
) -> list[str]:
    """Recursively resolve sitemap indexes and return deduplicated page URLs."""
    if sitemap_url in visited_sitemaps:
        return []
    visited_sitemaps.add(sitemap_url)

    print(f"Fetching sitemap: {sitemap_url}")
    time.sleep(REQUEST_DELAY_SECONDS)

    try:
        response = fetch_url(session, sitemap_url)
        response.raise_for_status()
    except requests.RequestException as exc:
        print(f"[ERROR] Failed to fetch sitemap {sitemap_url}: {exc}", file=sys.stderr)
        return []

    page_urls: list[str] = []
    nested_sitemaps: list[str] = []

    try:
        page_urls, nested_sitemaps = parse_sitemap_xml(response.content)
    except ET.ParseError as exc:
        print(f"[ERROR] Invalid XML in sitemap {sitemap_url}: {exc}", file=sys.stderr)
        return []

    for nested in nested_sitemaps:
        page_urls.extend(collect_urls_from_sitemap(session, nested, visited_sitemaps))

    # Preserve order while deduplicating.
    seen: set[str] = set()
    unique_urls: list[str] = []
    for url in page_urls:
        if url not in seen:
            seen.add(url)
            unique_urls.append(url)

    return unique_urls


def remove_non_content_nodes(root: Tag) -> None:
    """Remove chrome and non-visible elements from a BeautifulSoup subtree."""
    for tag_name in STRIP_TAGS:
        for node in root.find_all(tag_name):
            node.decompose()

    for comment in root.find_all(string=lambda text: isinstance(text, Comment)):
        comment.extract()


def extract_visible_text(container: Tag) -> str:
    chunks: list[str] = []
    for element in container.descendants:
        if isinstance(element, NavigableString) and not isinstance(element, Comment):
            parent = element.parent
            if parent and isinstance(parent, Tag) and parent.name in STRIP_TAGS:
                continue
            text = str(element).strip()
            if text:
                chunks.append(text)
    return normalize_whitespace(" ".join(chunks))


def select_main_container(soup: BeautifulSoup) -> Tag | None:
    for selector in ("main", "article", '[role="main"]', "#main", ".main-content"):
        node = soup.select_one(selector)
        if node and isinstance(node, Tag):
            return node
    body = soup.body
    if body and isinstance(body, Tag):
        return body
    return soup if isinstance(soup, Tag) else None


def extract_meta_description(soup: BeautifulSoup) -> str:
    tag = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    if tag and tag.get("content"):
        return normalize_whitespace(tag["content"])
    tag = soup.find("meta", attrs={"property": re.compile(r"^og:description$", re.I)})
    if tag and tag.get("content"):
        return normalize_whitespace(tag["content"])
    return ""


def extract_h1(soup: BeautifulSoup) -> str:
    h1 = soup.find("h1")
    if h1:
        return normalize_whitespace(h1.get_text(separator=" ", strip=True))
    return ""


def extract_h2_joined(soup: BeautifulSoup, delimiter: str = " | ") -> str:
    headings = [
        normalize_whitespace(h2.get_text(separator=" ", strip=True))
        for h2 in soup.find_all("h2")
    ]
    headings = [h for h in headings if h]
    return delimiter.join(headings)


def extract_page_fields(html: str, page_url: str) -> dict[str, str | int]:
    soup = BeautifulSoup(html, "lxml")

    meta_title_tag = soup.find("title")
    meta_title = (
        normalize_whitespace(meta_title_tag.get_text(strip=True))
        if meta_title_tag
        else ""
    )

    meta_description = extract_meta_description(soup)
    h1_title = extract_h1(soup)
    h2_headings = extract_h2_joined(soup)

    container = select_main_container(soup)
    main_body_text = ""
    if container is not None:
        container_copy = BeautifulSoup(str(container), "lxml")
        body_root = container_copy.find("main") or container_copy.find("article")
        if body_root is None:
            body_root = container_copy.body or container_copy
        if isinstance(body_root, Tag):
            remove_non_content_nodes(body_root)
            main_body_text = extract_visible_text(body_root)

    word_count = len(main_body_text.split()) if main_body_text else 0

    return {
        "URL": page_url,
        "Meta Title": meta_title,
        "Meta Description": meta_description,
        "H1 Title": h1_title,
        "H2 Headings": h2_headings,
        "Main Body Text": main_body_text,
        "Word Count": word_count,
    }


def crawl_pages(
    session: requests.Session, urls: Iterable[str]
) -> list[dict[str, str | int]]:
    rows: list[dict[str, str | int]] = []

    for index, page_url in enumerate(urls, start=1):
        print(f"[{index}] Crawling: {page_url}")

        try:
            response = fetch_url(session, page_url)
            if response.status_code == 404:
                print(f"[WARN] 404 Not Found: {page_url}", file=sys.stderr)
                continue
            response.raise_for_status()

            content_type = response.headers.get("Content-Type", "").lower()
            if "html" not in content_type and "xml" not in content_type:
                # Skip non-HTML assets listed in some sitemaps.
                if not page_url.lower().endswith(
                    (".html", ".htm", ".php", ".asp", ".aspx")
                ):
                    print(
                        f"[SKIP] Non-HTML content-type ({content_type}): {page_url}",
                        file=sys.stderr,
                    )
                    continue

            row = extract_page_fields(decode_html_response(response), page_url)
            rows.append(row)
            print(
                f"       OK — title: {row['Meta Title'][:60]!r} "
                f"({row['Word Count']} words)"
            )

        except requests.Timeout:
            print(f"[ERROR] Timeout: {page_url}", file=sys.stderr)
        except requests.HTTPError as exc:
            print(f"[ERROR] HTTP {exc.response.status_code}: {page_url}", file=sys.stderr)
        except requests.RequestException as exc:
            print(f"[ERROR] Request failed for {page_url}: {exc}", file=sys.stderr)
        except Exception as exc:
            print(f"[ERROR] Parse failed for {page_url}: {exc}", file=sys.stderr)
        finally:
            time.sleep(REQUEST_DELAY_SECONDS)

    return rows


def write_csv(rows: list[dict[str, str | int]], output_path: str) -> None:
    # utf-8-sig adds a BOM so Excel on Windows opens the file as UTF-8 (not CP1252).
    with open(output_path, "w", encoding="utf-8-sig", newline="") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)
    print(f"\nWrote {len(rows)} rows to {output_path}")


def build_session() -> requests.Session:
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
    )
    return session


def validate_sitemap_url(url: str) -> str:
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise argparse.ArgumentTypeError(
            "Sitemap URL must be a valid http(s) URL, e.g. https://example.com/sitemap.xml"
        )
    return url


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Crawl a website via XML sitemap and export content audit CSV."
    )
    parser.add_argument(
        "sitemap_url",
        type=validate_sitemap_url,
        help="Base sitemap URL (supports nested sitemap indexes).",
    )
    parser.add_argument(
        "-o",
        "--output",
        default="website_content_audit.csv",
        help="Output CSV path (default: website_content_audit.csv).",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    session = build_session()

    print(f"Starting sitemap crawl from: {args.sitemap_url}\n")
    visited_sitemaps: set[str] = set()
    page_urls = collect_urls_from_sitemap(session, args.sitemap_url, visited_sitemaps)

    if not page_urls:
        print("[ERROR] No page URLs discovered in sitemap.", file=sys.stderr)
        return 1

    print(f"\nDiscovered {len(page_urls)} unique page URL(s). Beginning crawl...\n")
    rows = crawl_pages(session, page_urls)
    write_csv(rows, args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
