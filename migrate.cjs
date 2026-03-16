const fs = require('fs');
const xml2js = require('xml2js');
const TurndownService = require('turndown');
const turndownService = new TurndownService();
const parser = new xml2js.Parser();

console.log("Checkpoint 1: Script started...");

if (!fs.existsSync('export.xml.xml')) {
    console.error("Checkpoint ERROR: export.xml not found!");
    process.exit(1);
}

const xml = fs.readFileSync('export.xml.xml', 'utf8');
console.log("Checkpoint 2: XML file loaded into memory...");

parser.parseString(xml, (err, result) => {
    if (err) {
        console.error("Checkpoint ERROR parsing XML:", err);
        return;
    }
    console.log("Checkpoint 3: XML parsed successfully. Looking for data...");

    // Check if the structure matches Squarespace's usual RSS format
    if (!result.rss || !result.rss.channel || !result.rss.channel[0].item) {
        console.error("Checkpoint ERROR: Unexpected XML structure. Here is what I see:", Object.keys(result));
        return;
    }

    const items = result.rss.channel[0].item;
    console.log(`Checkpoint 4: Found ${items.length} total items in XML. Starting extraction...`);
    
    if (!fs.existsSync('src/content/blog')) fs.mkdirSync('src/content/blog', { recursive: true });
    if (!fs.existsSync('src/content/pages')) fs.mkdirSync('src/content/pages', { recursive: true });

    let count = 0;
    items.forEach(item => {
        const title = item.title ? item.title[0] : 'Untitled';
        const type = item['wp:post_type'] ? item['wp:post_type'][0] : 'unknown';
        const status = item['wp:status'] ? item['wp:status'][0] : 'unknown';
        const slug = item['wp:post_name'] ? item['wp:post_name'][0] : null;

        // Log everything so we see why it's skipping
        if (status === 'publish' && !title.includes('###') && slug) {
            const content = item['content:encoded'] ? item['content:encoded'][0] : '';
            const date = item.pubDate ? item.pubDate[0] : new Date().toISOString();
            const markdown = turndownService.turndown(content);
            const frontmatter = `---\ntitle: "${title}"\npubDate: ${date}\nslug: ${slug}\n---\n\n`;
            
            const folder = (type === 'post') ? 'src/content/blog' : 'src/content/pages';
            fs.writeFileSync(`${folder}/${slug}.md`, frontmatter + markdown);
            console.log(`Extracted [${type}]: ${title}`);
            count++;
        }
    });

    console.log(`\n--- FINISHED: Extracted ${count} files ---`);
});