const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        let filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else {
            if (filePath.endsWith('.astro') || filePath.endsWith('.md') || filePath.endsWith('.tsx') || filePath.endsWith('.mdx')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walk('src');
let changedCount = 0;

function fixTrailingSlashes(content) {
    let modified = content;

    // Fix missing trailing slashes for standard markdown links without hash or extensions
    // Matches [/some-path](/) and adds a trailing slash to [/some-path/]
    modified = modified.replace(/\[([^\]]+)\]\(\/([a-zA-Z0-9\-_]+)\)/g, '[$1](/$2/)');
    modified = modified.replace(/\[([^\]]+)\]\(\/([a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+)\)/g, '[$1](/$2/)');
    modified = modified.replace(/\[([^\]]+)\]\(\/([a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+)\)/g, '[$1](/$2/)');

    // Matches href="/some-path" and adds trailing slash
    modified = modified.replace(/href=["']\/([a-zA-Z0-9\-_]+)["']/g, 'href="/$1/"');
    modified = modified.replace(/href=["']\/([a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+)["']/g, 'href="/$1/"');
    modified = modified.replace(/href=["']\/([a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+\/[a-zA-Z0-9\-_]+)["']/g, 'href="/$1/"');
    
    // Check with query params like href="/contact?topic=Consultancy" -> href="/contact/?topic=Consultancy"
    modified = modified.replace(/href=["']\/([a-zA-Z0-9\-_]+)\?([a-zA-Z0-9\-_=&%]+)["']/g, 'href="/$1/?$2"');

    // Replace /motel-management-blog/ with /blog/
    modified = modified.replace(/\/motel-management-blog\//g, '/blog/');
    modified = modified.replace(/motel-management-blog\//g, 'blog/');

    // Replacements for legacy paths
    modified = modified.replace(/\/motel-management-lessons\/?/g, '/blog/');
    modified = modified.replace(/\/store\/?/g, '/');
    modified = modified.replace(/\/cart\/?/g, '/');
    modified = modified.replace(/\/faq\/?/g, '/');
    
    // Convert https://www.motelcoach.com.au to https://motelcoach.com.au/ (already largely done but check)
    // The user also mentioned replacing motelcoach.com.au (without trailing slash)
    // Let's do a search for https://motelcoach.com.au that doesn't have a trailing slash or path after it
    modified = modified.replace(/https:\/\/motelcoach\.com\.au(?!\/)/g, 'https://motelcoach.com.au/');

    return modified;
}

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = fixTrailingSlashes(content);
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        changedCount++;
        console.log('Updated', file);
    }
});
console.log('Total files changed:', changedCount);