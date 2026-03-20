import fs from 'fs';
import path from 'path';
import https from 'https';

const DOWNLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'legacy');
const TARGET_EXTENSIONS = ['.md', '.mdx', '.astro'];

// Create the target directory if it doesn't exist
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

// Helper: Recursively get all target files (Node 20+ native)
function getFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== 'dist' && item.name !== 'public') {
      getFiles(fullPath, files);
    } else if (item.isFile() && TARGET_EXTENSIONS.includes(path.extname(item.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = getFiles(path.join(process.cwd(), 'src'));

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  // Match Squarespace CDN URLs (stops at standard quote or space)
  const regex = /https:\/\/images\.squarespace-cdn\.com\/[^"'\s\)]+/g;
  const matches = content.match(regex);

  if (matches) {
    let modified = false;

    matches.forEach(originalUrl => {
      // Safely strip query parameters for the filename
      const cleanUrl = originalUrl.split('?')[0];
      const fileName = path.basename(cleanUrl);
      const localFilePath = path.join(DOWNLOAD_DIR, fileName);
      const relativePath = `/images/legacy/${fileName}`;

      // 1. Safe String Replacement (handles regex special characters in the URL)
      content = content.split(originalUrl).join(relativePath);
      modified = true;

      // 2. Download the image if we don't already have it
      if (!fs.existsSync(localFilePath)) {
        const fileStream = fs.createWriteStream(localFilePath);
        
        https.get(originalUrl, response => {
          if (response.statusCode === 200) {
            response.pipe(fileStream);
            fileStream.on('finish', () => {
              fileStream.close();
              console.log(`✅ Rescued: ${fileName}`);
            });
          } else {
            console.error(`⚠️ Failed to download (Status ${response.statusCode}): ${originalUrl}`);
            fs.unlink(localFilePath, () => {}); // Clean up empty/failed file
          }
        }).on('error', err => {
          console.error(`❌ Network Error for ${originalUrl}: ${err.message}`);
          fs.unlink(localFilePath, () => {}); // Clean up partial download
        });
      }
    });

    // 3. Save the modified file
    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`📝 Updated file: ${path.relative(process.cwd(), file)}`);
    }
  }
});

console.log('🚀 Scan complete. Downloads running in the background...');