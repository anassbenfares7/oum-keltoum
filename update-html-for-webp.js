const fs = require('fs');
const path = require('path');

// HTML files to update
const htmlFiles = [
  'index.html',
  'about.html',
  'menu.html',
  'reservation.html',
  'contact.html'
];

// Images that have WebP versions
const webpImages = [
  'banner-img.png',
  'about-1.jpg', 'about-2.jpg', 'about-3.jpg', 'about-4.jpg',
  'gallery-1.jpg', 'gallery-2.jpg', 'gallery-3.jpg', 'gallery-4.jpg', 'gallery-5.jpg', 'gallery-6.jpg',
  'team-01.png', 'team-02.png', 'team-03.png',
  'dish-01.jpg', 'dish-02.jpg', 'dish-03.jpg', 'dish-04.jpg', 'dish-05.jpg',
  'salad-01.jpg', 'salad-02.jpg', 'salad-03.jpg'
];

function updateHtmlForWebP() {
  console.log('🔄 Updating HTML files for WebP support...');

  htmlFiles.forEach(htmlFile => {
    const filePath = path.join(__dirname, htmlFile);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  HTML file not found: ${htmlFile}`);
      return;
    }

    console.log(`📝 Processing ${htmlFile}...`);

    let content = fs.readFileSync(filePath, 'utf8');
    let changesMade = 0;

    // Add WebP support script if not already present
    if (!content.includes('webp-support.js')) {
      // Find the script.js reference and add WebP support after it
      const scriptJsPattern = /<script defer src="\.\/assets\/js\/script\.js"><\/script>/;
      if (scriptJsPattern.test(content)) {
        content = content.replace(scriptJsPattern,
          '<script defer src="./assets/js/script.js"></script>\n\n    <!-- WebP Support -->\n    <script defer src="./webp-support.js"></script>'
        );
        changesMade++;
      }
    }

    // Update img tags to use picture elements with WebP fallback
    webpImages.forEach(imageName => {
      const imgPattern = new RegExp(`<img[^>]*src=["']\\.\\/assets\\/images\\/${imageName}["'][^>]*>`, 'g');
      const matches = content.match(imgPattern);

      if (matches) {
        matches.forEach(imgTag => {
          // Extract attributes from img tag
          const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
          const altMatch = imgTag.match(/alt=["']([^"']*)["']/);
          const classMatch = imgTag.match(/class=["']([^"']*)["']/);
          const loadingMatch = imgTag.match(/loading=["']([^"']*)["']/);
          const widthMatch = imgTag.match(/width=["']([^"']*)["']/);
          const heightMatch = imgTag.match(/height=["']([^"']*)["']/);
          const styleMatch = imgTag.match(/style=["']([^"']*)["']/);

          const src = srcMatch ? srcMatch[1] : '';
          const alt = altMatch ? altMatch[1] : '';
          const className = classMatch ? classMatch[1] : '';
          const loading = loadingMatch ? loadingMatch[1] : '';
          const width = widthMatch ? widthMatch[1] : '';
          const height = heightMatch ? heightMatch[1] : '';
          const style = styleMatch ? styleMatch[1] : '';

          // Create picture element
          const webpSrc = `./assets/images/webp/${imageName.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;

          let pictureElement = `<picture>`;
          pictureElement += `\n    <source srcset="${webpSrc}" type="image/webp">`;
          pictureElement += `\n    <source srcset="${src}" type="image/${imageName.endsWith('.png') ? 'png' : 'jpeg'}">`;
          pictureElement += `\n    <img src="${src}"`;
          if (alt) pictureElement += ` alt="${alt}"`;
          if (className) pictureElement += ` class="${className}"`;
          if (loading) pictureElement += ` loading="${loading}"`;
          if (width) pictureElement += ` width="${width}"`;
          if (height) pictureElement += ` height="${height}"`;
          if (style) pictureElement += ` style="${style}"`;
          pictureElement += `>`;
          pictureElement += `\n  </picture>`;

          // Replace img tag with picture element
          content = content.replace(imgTag, pictureElement);
          changesMade++;
        });
      }
    });

    // Save updated content
    if (changesMade > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${htmlFile}: ${changesMade} changes made`);
    } else {
      console.log(`ℹ️  ${htmlFile}: No changes needed`);
    }
  });

  console.log('\n🎉 HTML files updated for WebP support!');
  console.log('The WebP support script will automatically handle:');
  console.log('  - WebP detection');
  console.log('  - Graceful fallback for non-supported browsers');
  console.log('  - Automatic image optimization');
}

// Run the update
updateHtmlForWebP();