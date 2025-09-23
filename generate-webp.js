#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const imageDir = path.join(__dirname, 'assets', 'images');
const webpDir = path.join(__dirname, 'assets', 'images', 'webp');

// Create WebP directory if it doesn't exist
if (!fs.existsSync(webpDir)) {
  fs.mkdirSync(webpDir, { recursive: true });
}

// Images to convert to WebP
const imagesToConvert = [
  'banner-img.png',
  'about-1.jpg', 'about-2.jpg', 'about-3.jpg', 'about-4.jpg',
  'gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg', 'gallery-5.jpg', 'gallery-6.jpg',
  'team-01.png', 'team-02.png', 'team-03.png',
  'dish-01.jpg', 'dish-02.jpg', 'dish-03.jpg', 'dish-04.jpg', 'dish-05.jpg',
  'salad-01.jpg', 'salad-02.jpg', 'salad-03.jpg'
];

// Quality settings for different image types
const qualitySettings = {
  'team': 85,    // Higher quality for team photos
  'gallery': 80, // High quality for gallery images
  'about': 75,   // Good quality for about images
  'dish': 80,    // High quality for food images
  'salad': 75,   // Good quality for salad images
  'default': 75  // Default quality
};

function getQuality(imageName) {
  if (imageName.includes('team')) return qualitySettings.team;
  if (imageName.includes('gallery')) return qualitySettings.gallery;
  if (imageName.includes('about')) return qualitySettings.about;
  if (imageName.includes('dish')) return qualitySettings.dish;
  if (imageName.includes('salad')) return qualitySettings.salad;
  return qualitySettings.default;
}

function convertToWebP(imagePath, webpPath, quality) {
  return new Promise((resolve, reject) => {
    const cmd = `"C:\\Program Files\\libwebp-1.6.0-windows-x64\\bin\\cwebp.exe" -q ${quality} "${imagePath}" -o "${webpPath}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ Failed to convert ${path.basename(imagePath)}: ${error.message}`);
        reject(error);
        return;
      }

      if (fs.existsSync(webpPath)) {
        const originalSize = fs.statSync(imagePath).size;
        const webpSize = fs.statSync(webpPath).size;
        const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

        console.log(`✅ ${path.basename(imagePath)}: ${formatBytes(originalSize)} → ${formatBytes(webpSize)} (${savings}% smaller)`);
        resolve();
      } else {
        console.log(`❌ WebP file not created for ${path.basename(imagePath)}`);
        reject(new Error('WebP file not created'));
      }
    });
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function generateWebPImages() {
  console.log('🔄 Starting WebP conversion...');

  // Check if cwebp is available
  try {
    await new Promise((resolve, reject) => {
      exec('"C:\\Program Files\\libwebp-1.6.0-windows-x64\\bin\\cwebp.exe" -version', (error, stdout, stderr) => {
        if (error) {
          console.log('❌ cwebp not found. Please install it first:');
          console.log('   Windows: Download from https://developers.google.com/speed/webp/download');
          console.log('   Or use: choco install webp');
          reject(error);
        } else {
          console.log('✅ cwebp found, starting conversion...');
          resolve();
        }
      });
    });
  } catch (error) {
    console.log('❌ cwebp is not available. Please install it to generate WebP images.');
    return;
  }

  const totalImages = imagesToConvert.length;
  let convertedImages = 0;

  for (const imageName of imagesToConvert) {
    const imagePath = path.join(imageDir, imageName);
    const webpPath = path.join(webpDir, imageName.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  Source image not found: ${imageName}`);
      continue;
    }

    try {
      await convertToWebP(imagePath, webpPath, getQuality(imageName));
      convertedImages++;
    } catch (error) {
      console.log(`❌ Failed to convert ${imageName}: ${error.message}`);
    }
  }

  console.log(`\n📊 Conversion Summary:`);
  console.log(`   Total images processed: ${totalImages}`);
  console.log(`   Successfully converted: ${convertedImages}`);
  console.log(`   Failed: ${totalImages - convertedImages}`);
  console.log(`   Success rate: ${((convertedImages / totalImages) * 100).toFixed(1)}%`);

  if (convertedImages > 0) {
    console.log(`\n🎉 WebP images generated successfully!`);
    console.log(`   Images saved in: ${webpDir}`);
    console.log(`   Update your HTML to use WebP format for better performance.`);
  }
}

// Check if this file is being run directly
if (require.main === module) {
  generateWebPImages().catch(console.error);
}

module.exports = { generateWebPImages, convertToWebP, getQuality };