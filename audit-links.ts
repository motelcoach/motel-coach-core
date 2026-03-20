import { readFileSync, writeFileSync } from 'fs';
import * as cheerio from 'cheerio';

// CONFIGURATION
const BASE_URL = 'http://localhost:4321'; // Change this to your actual URL
const EXCLUSIONS = ['.pdf', '.jpg', '.png', '.zip', 'tel:', 'mailto:'];

const visited = new Set<string>();
const queue: string[] = [BASE_URL];
const linkMap: Record<string, { incoming: string[], outgoingCount: number, genericAnchors: number }> = {};
const allDiscoveredPages = new Set<string>();

async function crawl() {
  console.log(`--- Starting SEO Internal Link Audit for ${BASE_URL} ---`);

  while (queue.length > 0) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      const internalLinks = $('a[href]');
      linkMap[url] = linkMap[url] || { incoming: [], outgoingCount: 0, genericAnchors: 0 };
      
      internalLinks.each((_, el) => {
        let href = $(el).attr('href') || '';
        const anchorText = $(el).text().trim().toLowerCase();

        // Convert relative to absolute
        if (href.startsWith('/')) href = new URL(href, BASE_URL).href;
        
        // Filter: only internal links, ignore files/emails
        if (href.startsWith(BASE_URL) && !EXCLUSIONS.some(ext => href.includes(ext))) {
          const targetUrl = href.split('#')[0].replace(/\/$/, ""); // Normalize URL
          
          linkMap[url].outgoingCount++;
          allDiscoveredPages.add(targetUrl);

          // Track incoming links for the target
          if (!linkMap[targetUrl]) {
            linkMap[targetUrl] = { incoming: [], outgoingCount: 0, genericAnchors: 0 };
          }
          if (!linkMap[targetUrl].incoming.includes(url)) {
            linkMap[targetUrl].incoming.push(url);
          }

          // SEO Best Practice: Check for weak anchor text
          if (['click here', 'read more', 'more', 'link', 'here'].includes(anchorText)) {
            linkMap[url].genericAnchors++;
          }

          if (!visited.has(targetUrl)) {
            queue.push(targetUrl);
          }
        }
      });
    } catch (error) {
      console.error(`Failed to crawl: ${url}`);
    }
  }

  generateReport();
}

function generateReport() {
  let report = `# Website Internal Link Audit\n\n`;
  report += `**Total Pages Crawled:** ${visited.size}\n\n`;

  report += `## 🚨 Orphaned or Weakly Linked Pages\n`;
  report += `Pages with 0 or 1 incoming links (Search engines struggle to find these):\n\n`;

  Object.entries(linkMap).forEach(([url, data]) => {
    if (data.incoming.length <= 1) {
      report += `- **${url}** (Incoming Links: ${data.incoming.length})\n`;
    }
  });

  report += `\n## ⚡ SEO & Speed Improvements\n`;
  Object.entries(linkMap).forEach(([url, data]) => {
    if (data.genericAnchors > 0) {
      report += `- **${url}**: Has ${data.genericAnchors} generic anchor tags (e.g., "click here"). Change these to descriptive keywords (e.g., "Luxury Suite Rates") for better AI SEO.\n`;
    }
    if (data.outgoingCount > 100) {
       report += `- **${url}**: Too many outgoing links (${data.outgoingCount}). This dilutes "Link Juice" and slows down crawl speed.\n`;
    }
  });

  writeFileSync('internal-link-report.md', report);
  console.log('--- Audit Complete. Report saved to internal-link-report.md ---');
}

crawl();