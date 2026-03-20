import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Directories to scan and save to
const DIRECTORIES_TO_SCAN = ['./src/content/blog', './src/pages'];
const IMAGE_SAVE_DIR = path.join(__dirname, 'public', 'images', 'migrated');
const IMAGE_URL_PREFIX = '/images/migrated/';

// Regex to catch Squarespace CDN links (handles markdown and HTML src)
const SQUARESPACE_REGEX = /https:\/\/images\.squarespace-cdn\.com[^\s)"']+/g;

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function getMarkdownFiles(dir, fileList = []) {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await getMarkdownFiles(filePath, fileList);
      } else if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
        fileList.push(filePath);
      }
    }
  } catch (err) {
    // Directory might not exist, skip
  }
  return fileList;
}

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filepath, buffer);
}

async function run() {
  console.log('🚀 Starting Squarespace Image Rescue...');
  await ensureDir(IMAGE_SAVE_DIR);

  let filesToScan = [];
  for (const dir of DIRECTORIES_TO_SCAN) {
    await getMarkdownFiles(path.join(__dirname, dir), filesToScan);
  }

  let totalImagesDownloaded = 0;
  let totalFilesModified = 0;

  for (const filePath of filesToScan) {
    let content = await fs.readFile(filePath, 'utf-8');
    const matches = content.match(SQUARESPACE_REGEX);

    if (matches && matches.length > 0) {
      console.log(`\n📄 Found ${matches.length} images in ${path.basename(filePath)}`);
      let fileModified = false;

      for (const url of matches) {
        try {
          // Clean the filename for SEO (extract after last slash, remove query params)
          const urlObj = new URL(url);
          let rawFilename = path.basename(urlObj.pathname);
          if (!rawFilename || rawFilename === 'undefined') {
             rawFilename = `image-${Date.now()}.jpg`;
          }
          // Decode URI component to handle %20 etc, then sanitize
          const cleanFilename = decodeURIComponent(rawFilename).replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
          
          const localFilePath = path.join(IMAGE_SAVE_DIR, cleanFilename);
          const relativeUrl = `${IMAGE_URL_PREFIX}${cleanFilename}`;

          // Download only if it doesn't already exist
          try {
            await fs.access(localFilePath);
            console.log(`   ⏭️  Already exists: ${cleanFilename}`);
          } catch {
            console.log(`   ⬇️  Downloading: ${cleanFilename}`);
            await downloadImage(url, localFilePath);
            totalImagesDownloaded++;
          }

          // Replace in content
          content = content.split(url).join(relativeUrl);
          fileModified = true;

        } catch (error) {
          console.error(`   ❌ Error downloading ${url}:`, error.message);
        }
      }

      if (fileModified) {
        await fs.writeFile(filePath, content, 'utf-8');
        totalFilesModified++;
        console.log(`   ✅ Updated links in ${path.basename(filePath)}`);
      }
    }
  }

  console.log('\n🎉 Rescue Complete!');
  console.log(`📊 Total Images Downloaded: ${totalImagesDownloaded}`);
  console.log(`📝 Total Markdown Files Updated: ${totalFilesModified}`);
}

run();
