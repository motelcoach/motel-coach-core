const fs = require('fs');
const path = require('path');

const blogFolder = 'src/content/blog';

console.log("Starting 2026 GEO Blueprint Injection...");

if (fs.existsSync(blogFolder)) {
    const files = fs.readdirSync(blogFolder);

    files.forEach(file => {
        const filePath = path.join(blogFolder, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if it already has the Answer Capsule
        if (!content.includes('## Executive Summary: Key Takeaways')) {
            
            // We split at the end of the Frontmatter (---)
            const parts = content.split('---');
            
            if (parts.length >= 3) {
                const frontmatter = parts[1];
                const body = parts.slice(2).join('---');

                // The Answer Capsule format required by AI Agents
                const answerCapsule = `\n\n<div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-2xl my-8">\n<h2 class="text-xl font-bold text-brand-950 mb-3 !mt-0">Executive Summary: Key Takeaways</h2>\n<p class="text-gray-700 m-0">\n<em>[GEO Action Required: Write a 50-100 word declarative summary here. State the operational result first, followed by the mechanism. This is your 'BLUF' (Bottom Line Up Front) for AI overviews.]</em>\n</p>\n</div>\n\n`;

                // Rebuild the file with the Capsule injected right after the title/frontmatter
                const newContent = `---${frontmatter}---${answerCapsule}${body}`;
                
                fs.writeFileSync(filePath, newContent);
                console.log(`Injected Answer Capsule into: ${file}`);
            }
        } else {
            console.log(`Skipped: ${file} (Capsule already exists)`);
        }
    });
}

console.log("\n--- BLUEPRINT INJECTION COMPLETE ---");
console.log("Next Step: Open your markdown files and replace the bracketed text with your 50-100 word summaries.");