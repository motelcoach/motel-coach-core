const fs = require('fs');
const path = require('path');

const folders = ['src/content/pages', 'src/content/blog'];

console.log("Starting Sanitization...");

folders.forEach(folder => {
    if (!fs.existsSync(folder)) return;

    const files = fs.readdirSync(folder);

    files.forEach(file => {
        const filePath = path.join(folder, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // 1. Remove everything between <style> tags if they exist
        content = content.replace(/<style([\s\S]*?)<\/style>/gi, '');

        // 2. Remove lines that look like Squarespace CSS junk (.fe-block, .sqs-, etc)
        // This looks for long strings of CSS selectors and curly braces
        const cleanContent = content.split('\n').filter(line => {
            const isJunk = line.includes('.fe-') || 
                           line.includes('.sqs-') || 
                           line.includes('--grid-gutter') ||
                           line.includes('grid-area:') ||
                           line.includes('@media');
            return !isJunk;
        }).join('\n');

        // 3. Clean up excessive empty lines left behind
        const finalContent = cleanContent.replace(/\n{3,}/g, '\n\n');

        fs.writeFileSync(filePath, finalContent);
        console.log(`Cleaned: ${file}`);
    });
});

console.log("\n--- ALL FILES SANITIZED ---");
