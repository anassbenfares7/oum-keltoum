// WebP Support Detection and Loading
class WebPSupport {
  constructor() {
    this.supported = false;
    this.checkWebPSupport();
  }

  checkWebPSupport() {
    // Create a test image to check WebP support
    const testWebP = new Image();
    testWebP.onload = testWebP.onerror = () => {
      this.supported = (testWebP.height === 2);
      this.initializeWebPImages();
    };
    testWebP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  initializeWebPImages() {
    if (this.supported) {
      this.replaceImagesWithWebP();
      this.addWebPFallback();
    }
  }

  replaceImagesWithWebP() {
    // Find all img elements with srcset
    const images = document.querySelectorAll('img[srcset]');

    images.forEach(img => {
      const srcset = img.getAttribute('srcset');
      if (srcset) {
        const newSrcset = this.convertSrcsetToWebP(srcset);
        if (newSrcset) {
          img.setAttribute('srcset', newSrcset);
        }
      }

      // Also convert regular src if it's an image
      const src = img.getAttribute('src');
      if (src && this.isImageFile(src)) {
        const webpSrc = this.convertToWebP(src);
        if (webpSrc) {
          img.setAttribute('src', webpSrc);
        }
      }
    });

    // Find all img elements without srcset
    const allImages = document.querySelectorAll('img:not([srcset])');
    allImages.forEach(img => {
      const src = img.getAttribute('src');
      if (src && this.isImageFile(src)) {
        const webpSrc = this.convertToWebP(src);
        if (webpSrc) {
          img.setAttribute('src', webpSrc);
        }
      }
    });
  }

  convertSrcsetToWebP(srcset) {
    return srcset.split(',').map(item => {
      const [url, descriptor] = item.trim().split(' ');
      const webpUrl = this.convertToWebP(url);
      return webpUrl ? `${webpUrl} ${descriptor}` : item;
    }).join(', ');
  }

  convertToWebP(url) {
    if (!url || !this.isImageFile(url)) return url;

    // Skip if already WebP
    if (url.toLowerCase().includes('.webp')) return url;

    // Skip external URLs
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    // Convert to WebP
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  isImageFile(url) {
    return /\.(jpg|jpeg|png)$/i.test(url);
  }

  addWebPFallback() {
    // Add CSS to handle WebP fallback
    const style = document.createElement('style');
    style.textContent = `
      .webp-fallback {
        display: none;
      }
      .no-webp .webp-fallback {
        display: block;
      }
      .no-webp .webp-only {
        display: none;
      }
    `;
    document.head.appendChild(style);

    // Add class to html element
    document.documentElement.classList.add('webp-supported');

    // Create a noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = '<style>.no-webp .webp-only { display: none !important; }</style>';
    document.head.appendChild(noscript);
  }

  // Method to create picture elements for better WebP support
  createPictureElement(originalSrc, alt, sizes, srcset) {
    const picture = document.createElement('picture');

    // WebP source
    const webpSource = document.createElement('source');
    webpSource.setAttribute('type', 'image/webp');

    if (srcset) {
      const webpSrcset = this.convertSrcsetToWebP(srcset);
      webpSource.setAttribute('srcset', webpSrcset);
    } else {
      const webpSrc = this.convertToWebP(originalSrc);
      webpSource.setAttribute('srcset', webpSrc);
    }

    if (sizes) {
      webpSource.setAttribute('sizes', sizes);
    }

    // Original source
    const originalSource = document.createElement('source');
    originalSource.setAttribute('srcset', originalSrc);

    if (sizes) {
      originalSource.setAttribute('sizes', sizes);
    }

    // Fallback img
    const img = document.createElement('img');
    img.setAttribute('src', originalSrc);
    img.setAttribute('alt', alt || '');
    img.setAttribute('loading', 'lazy');

    picture.appendChild(webpSource);
    picture.appendChild(originalSource);
    picture.appendChild(img);

    return picture;
  }

  // Method to preload WebP images
  preloadWebPImages() {
    if (!this.supported) return;

    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && this.isImageFile(src)) {
        const webpSrc = this.convertToWebP(src);
        if (webpSrc) {
          const link = document.createElement('link');
          link.setAttribute('rel', 'preload');
          link.setAttribute('as', 'image');
          link.setAttribute('href', webpSrc);
          document.head.appendChild(link);
        }
      }
    });
  }
}

// Initialize WebP support when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const webpSupport = new WebPSupport();

  // Make it globally available
  window.WebPSupport = webpSupport;

  // Initialize after a short delay to ensure all images are loaded
  setTimeout(() => {
    webpSupport.preloadWebPImages();
  }, 1000);
});

// Handle dynamic content loading
function handleDynamicContent() {
  if (window.WebPSupport) {
    window.WebPSupport.replaceImagesWithWebP();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebPSupport;
} else if (typeof define === 'function' && define.amd) {
  define([], function() { return WebPSupport; });
}