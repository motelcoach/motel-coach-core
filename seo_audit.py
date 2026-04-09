"""
Motel Coach SEO Audit Script
Crawls https://motelcoach.com.au/ via sitemap and extracts key SEO metadata.
Output: motel_coach_seo_audit_2026.csv
"""

import csv
import re
import time
import urllib.robotparser
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# ── Config ────────────────────────────────────────────────────────────────────
BASE_URL      = "https://motelcoach.com.au"
SITEMAP_URL   = "https://motelcoach.com.au/sitemap-index.xml"
OUTPUT_FILE   = "motel_coach_seo_audit_2026.csv"
CRAWL_DELAY   = 1.2   # seconds between requests
REQUEST_TIMEOUT = 15
USER_AGENT    = "MotelCoachSEOAudit/1.0 (+https://motelcoach.com.au)"

HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Tags whose text is excluded from word count (nav/header/footer noise)
EXCLUDED_TAGS = {"nav", "header", "footer", "script", "style", "noscript", "aside"}

# ── Robots.txt ────────────────────────────────────────────────────────────────
def build_robots_parser(base_url: str) -> urllib.robotparser.RobotFileParser:
    rp = urllib.robotparser.RobotFileParser()
    rp.set_url(urljoin(base_url, "/robots.txt"))
    try:
        rp.read()
    except Exception as e:
        print(f"  [warn] Could not read robots.txt: {e}")
    return rp


def is_allowed(rp: urllib.robotparser.RobotFileParser, url: str) -> bool:
    return rp.can_fetch(USER_AGENT, url)


# ── Sitemap parsing ───────────────────────────────────────────────────────────
def fetch_urls_from_sitemap(sitemap_url: str, session: requests.Session) -> list[str]:
    """Recursively resolve sitemap index → sitemap → URLs."""
    urls: list[str] = []
    try:
        resp = session.get(sitemap_url, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
    except Exception as e:
        print(f"  [error] Could not fetch sitemap {sitemap_url}: {e}")
        return urls

    soup = BeautifulSoup(resp.content, "lxml-xml")

    # Sitemap index — recurse into child sitemaps
    for sitemap_tag in soup.find_all("sitemap"):
        loc = sitemap_tag.find("loc")
        if loc and loc.text.strip():
            urls.extend(fetch_urls_from_sitemap(loc.text.strip(), session))

    # Regular sitemap — collect <loc> entries
    for url_tag in soup.find_all("url"):
        loc = url_tag.find("loc")
        if loc and loc.text.strip():
            urls.append(loc.text.strip())

    return urls


# ── Page extraction ───────────────────────────────────────────────────────────
def clean_word_count(soup: BeautifulSoup) -> int:
    """Return word count of visible body text, excluding nav/header/footer."""
    body = soup.find("body")
    if not body:
        return 0
    # Remove excluded tags in-place on a copy so we don't mutate the original
    working = BeautifulSoup(str(body), "lxml")
    for tag in working.find_all(EXCLUDED_TAGS):
        tag.decompose()
    text = working.get_text(separator=" ")
    words = re.findall(r"\b\w+\b", text)
    return len(words)


def extract_page_data(url: str, session: requests.Session) -> dict:
    row = {
        "url":              url,
        "page_title":       "",
        "meta_description": "",
        "h1":               "",
        "word_count":       0,
        "http_status":      "",
        "issues":           [],
    }

    try:
        resp = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
        row["http_status"] = resp.status_code

        if resp.status_code != 200:
            row["issues"].append(f"HTTP {resp.status_code}")
            return row

        soup = BeautifulSoup(resp.content, "lxml")

        # Title
        title_tag = soup.find("title")
        row["page_title"] = title_tag.get_text(strip=True) if title_tag else ""

        # Meta description
        meta = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
        row["meta_description"] = meta.get("content", "").strip() if meta else ""

        # H1
        h1 = soup.find("h1")
        row["h1"] = h1.get_text(strip=True) if h1 else ""

        # Word count
        row["word_count"] = clean_word_count(soup)

    except requests.exceptions.Timeout:
        row["http_status"] = "TIMEOUT"
        row["issues"].append("Request timed out")
    except requests.exceptions.ConnectionError:
        row["http_status"] = "CONN_ERROR"
        row["issues"].append("Connection error")
    except Exception as e:
        row["http_status"] = "ERROR"
        row["issues"].append(str(e))

    return row


def build_issues_flag(row: dict) -> str:
    flags = list(row["issues"])  # carry over any HTTP errors
    if not row["meta_description"]:
        flags.append("Missing meta description")
    if not row["h1"]:
        flags.append("Missing H1")
    if row["page_title"] and len(row["page_title"]) > 60:
        flags.append(f"Title too long ({len(row['page_title'])} chars)")
    if row["meta_description"] and len(row["meta_description"]) > 160:
        flags.append(f"Meta desc too long ({len(row['meta_description'])} chars)")
    if row["word_count"] and row["word_count"] < 300:
        flags.append(f"Thin content ({row['word_count']} words)")
    return " | ".join(flags) if flags else "OK"


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    session = requests.Session()
    session.headers.update(HEADERS)

    print("=" * 60)
    print("  Motel Coach SEO Audit 2026")
    print("=" * 60)

    # Robots.txt
    print("\n[1/4] Reading robots.txt …")
    rp = build_robots_parser(BASE_URL)

    # Sitemap
    print(f"[2/4] Fetching sitemap: {SITEMAP_URL} …")
    urls = fetch_urls_from_sitemap(SITEMAP_URL, session)

    # Deduplicate and filter to same domain only
    seen: set[str] = set()
    filtered: list[str] = []
    base_netloc = urlparse(BASE_URL).netloc
    for u in urls:
        parsed = urlparse(u)
        if parsed.netloc == base_netloc and u not in seen:
            seen.add(u)
            filtered.append(u)

    print(f"       Found {len(filtered)} unique URLs to audit.")

    # Crawl
    print(f"\n[3/4] Crawling {len(filtered)} pages (delay: {CRAWL_DELAY}s) …\n")
    results = []
    for i, url in enumerate(filtered, 1):
        if not is_allowed(rp, url):
            print(f"  [{i:>3}/{len(filtered)}] SKIPPED (robots.txt): {url}")
            continue

        print(f"  [{i:>3}/{len(filtered)}] {url}")
        data = extract_page_data(url, session)
        data["issues_flag"] = build_issues_flag(data)
        results.append(data)
        time.sleep(CRAWL_DELAY)

    # Write CSV
    print(f"\n[4/4] Writing {OUTPUT_FILE} …")
    fieldnames = [
        "url",
        "http_status",
        "page_title",
        "meta_description",
        "h1",
        "word_count",
        "issues_flag",
    ]
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(results)

    # Summary
    total       = len(results)
    ok          = sum(1 for r in results if r["issues_flag"] == "OK")
    missing_meta = sum(1 for r in results if "Missing meta description" in r["issues_flag"])
    missing_h1  = sum(1 for r in results if "Missing H1" in r["issues_flag"])
    thin        = sum(1 for r in results if "Thin content" in r["issues_flag"])

    print("\n" + "=" * 60)
    print("  AUDIT SUMMARY")
    print("=" * 60)
    print(f"  Total pages audited : {total}")
    print(f"  All clear (OK)      : {ok}")
    print(f"  Missing meta desc   : {missing_meta}")
    print(f"  Missing H1          : {missing_h1}")
    print(f"  Thin content (<300w): {thin}")
    print(f"\n  Output saved to: {OUTPUT_FILE}")
    print("=" * 60)


if __name__ == "__main__":
    main()
