const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const imageDir = path.join(__dirname, 'assets', 'images');
const largeImages = [
    'salad-02.jpg', 'dish-05.jpg', 'pagetitle-contact.jpg', 'dish-10-2.jpg',
    'pagetitle-menu.jpg', 'event-2.jpg', 'dish-01.jpg', 'dish-08.jpg',
    'dish-03.jpg', 'dish-10.jpg', 'banner-img.png', 'team-02.png',
    'subscribe-us.png', 'team-04.png', 'team-01.png', 'team-03.png'
];

async function optimizeImages() {
    console.log('Starting image optimization...');

    for (const image of largeImages) {
        const imagePath = path.join(imageDir, image);
        const webpPath = path.join(imageDir, image.replace(/\.(jpg|png)$/, '.webp'));

        if (!fs.existsSync(imagePath)) {
            console.log(`Skipping ${image} - file not found`);
            continue;
        }

        console.log(`Processing ${image}...`);

        // Create WebP version
        const quality = image.includes('team') ? 85 : 75; // Higher quality for team photos
        const cmd = `cwebp -q ${quality} "${imagePath}" -o "${webpPath}"`;

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`Failed to create WebP for ${image}: ${error.message}`);
                return;
            }

            if (fs.existsSync(webpPath)) {
                const originalSize = fs.statSync(imagePath).size;
                const webpSize = fs.statSync(webpPath).size;
                const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

                console.log(`✓ ${image}: ${formatBytes(originalSize)} → ${formatBytes(webpSize)} (${savings}% smaller)`);
            }
        });
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Install cwebp if not available
function checkAndInstallCwebp() {
    exec('cwebp -version', (error, stdout, stderr) => {
        if (error) {
            console.log('cwebp not found. Please install it first:');
            console.log('Windows: Download from https://developers.google.com/speed/webp/download');
            console.log('Or use: choco install webp');
            return;
        }
        optimizeImages();
    });
}

checkAndInstallCwebp();