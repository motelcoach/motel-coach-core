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
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Check href="https://motelcoach.com.au/something"
    content = content.replace(/href=["'](https:\/\/motelcoach\.com\.au\/[a-zA-Z0-9\-_/]+)["']/g, (match, p1) => {
        if (!p1.includes('.') && !p1.endsWith('/')) {
            console.log(file, 'Fixed absolute href:', match);
            return `href="${p1}/"`;
        }
        return match;
    });
    
    // Check [Text](https://motelcoach.com.au/something)
    content = content.replace(/\[([^\]]+)\]\((https:\/\/motelcoach\.com\.au\/[a-zA-Z0-9\-_/]+)\)/g, (match, p1, p2) => {
        if (!p2.includes('.') && !p2.endsWith('/')) {
            console.log(file, 'Fixed absolute markdown link:', match);
            return `[${p1}](${p2}/)`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
    }
});