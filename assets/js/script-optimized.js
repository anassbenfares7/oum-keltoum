AOS.init({
  offset: '140', // 50% viewport height ka offset
});

// Include components functionality
document.addEventListener("DOMContentLoaded", function() {
  // Load all components with data-include attribute
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(include => {
    const file = include.getAttribute('data-include');
    fetch(file)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(content => {
        include.innerHTML = content;
        // Reinitialize any scripts that might be needed for the included content
        if (file.includes('nav-desktop') || file.includes('nav-mobile')) {
          // Reinitialize header functionality
          const hamburgerIcon = document.getElementById("hamburger");
          const hamburgerCrossIcon = document.getElementById("hamburger-cross");
          const mobileMenu = document.getElementById("mobile-menu");

          if (hamburgerIcon && mobileMenu) {
            hamburgerIcon.addEventListener("click", function () {
              mobileMenu.style.transform = "translateX(0%)";
            });
          }

          if (hamburgerCrossIcon) {
            hamburgerCrossIcon.addEventListener("click", function() {
              if (mobileMenu) mobileMenu.style.transform = "translateX(-100%)";
            });
          }
        }
      })
      .catch(error => {
        console.error('Error loading component:', file, error);
        include.innerHTML = `<div class="alert alert-warning">Component not found: ${file}</div>`;
      });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  try {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.display = 'none';
      }, 3000);
    }
  } catch (error) {
    console.error('Error handling loader:', error);
  }
});

// Header functionality
var getHamburgerIcon = document.getElementById("hamburger");
var getHamburgerCrossIcon = document.getElementById("hamburger-cross");
var getMobileMenu = document.getElementById("mobile-menu");
// Open / Close mobile menu (guarded)
function closeMenu() {
    if (getMobileMenu) getMobileMenu.style.transform = "translateX(-100%)";
}

if (getHamburgerIcon && getMobileMenu) {
  getHamburgerIcon.addEventListener("click", function () {
    getMobileMenu.style.transform = "translateX(0%)";
  });
}

if (getHamburgerCrossIcon) {
  getHamburgerCrossIcon.addEventListener("click", closeMenu);
}

// Close the mobile menu if clicking outside of it (guarded)
document.addEventListener("click", function(event) {
    var isClickInsideMenu = getMobileMenu && getMobileMenu.contains(event.target);
    var isClickOnIcon = getHamburgerIcon && getHamburgerIcon.contains(event.target);

    if (!isClickInsideMenu && !isClickOnIcon) {
        closeMenu();
    }
});


// Header scroll behavior - Optimized approach
window.addEventListener('load', function() {
  const header = document.querySelector('header');

  if (header) {
    // Set header styles
    Object.assign(header.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      zIndex: '9999',
      transition: 'all 0.3s ease-in-out',
      backgroundColor: 'rgba(0,0,0,0.8)'
    });
  }

  let lastScrollPosition = window.pageYOffset;
  let isHeaderHidden = false;

  // Simple scroll function
  window.addEventListener('scroll', function() {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
      // Scrolling down - hide header
      if (!isHeaderHidden) {
        header.style.transform = 'translateY(-100px)';
        isHeaderHidden = true;
      }
    } else if (currentScrollPosition < lastScrollPosition) {
      // Scrolling up - show header
      if (isHeaderHidden) {
        header.style.transform = 'translateY(0)';
        isHeaderHidden = false;
      }
    }

    lastScrollPosition = currentScrollPosition;
  });
});

// Also try DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  // DOM loaded - initialize components
});


  // --- Smooth Scroll Back To Top (New code added here) ---
  const backToTopButton = document.getElementById('back-to-top');

  // Check if the button actually exists on the page
  if (backToTopButton) {
  
    // Add a click event listener
    backToTopButton.addEventListener('click', function(event) {
      
      // Prevent the default link behavior (which adds the '#' to the URL)
      event.preventDefault();
      
      // Now, smoothly scroll the window to the top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});

// Slider initialization

// Load and render menu data
async function loadMenuData() {
  try {
    const response = await fetch('./assets/js/menu.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading menu data:', error);
    return null;
  }
}

// Render category indicators
function renderCategoryIndicators(categories) {
  const indicatorsWrapper = document.querySelector('.slider-indicators-wrapper');
  const indicators = categories.map((category, index) => `
    <div class="slider-indicators">
      <div class="indicators-icon ${index === 0 ? 'active' : ''} text-center">
        <i class="${category.icon} fa-2x"></i>
      </div>
      <div class="indicators-title text-center fs-6 mt-2 flex-wrap">
        <h5>${category.name}</h5>
      </div>
    </div>
  `).join('');
  indicatorsWrapper.innerHTML = indicators;
}

// Render menu items
function renderMenuItems(categories) {
  const menuContainer = document.getElementById('our-menus');
  const menuItems = categories.map((category, i) => `
    <div>
      <div class="row py-3">
        <h3 class="menu-category-title">${category.name}</h3>
              <div class="col-lg-5">
                <div class="pb-5 pb-lg-0">
                  ${category.items && category.items[0] && category.items[0].imageURL ? `
                    <img class="img-fluid" loading="lazy" src="./assets/${category.items[0].imageURL}" alt="${category.items[0].name}" onerror="this.onerror=null; this.src='./assets/images/banner-img.png';">
                  ` : `
                    <div class="menu-image-placeholder">
                      <i class="fas fa-image"></i>
                    </div>
                  `}
                </div>
              </div>
        <div class="col-lg-7">
          ${category.items.map(item => `
            <div class="item-wrapper d-flex justify-content-between">
              <div class="item-left">
                <h5>${item.name}</h5>
                <p>${item.description}</p>
              </div>
              <div class="item-right">
                <span class="item-price">
                  ${item.price}
                  <a class="voir-photo-link" data-image="${item.imageURL ? `./assets/${item.imageURL}` : 'not-available'}" data-name="${item.name}">Voir photo</a>
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
  menuContainer.innerHTML = menuItems;
}

// Initialize menu sliders
function initializeSliders() {
  $('#our-menus').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    adaptiveHeight: true, // <-- ADD THIS LINE
    speed: 300,
    asNavFor: '.slider-indicators-wrapper',
    draggable: false,
    swipe: false,
  });

  $('.slider-indicators-wrapper').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: '#our-menus',
    dots: false,
    arrows: true,
    focusOnSelect: true,
    draggable: false,
    swipe: false,
    prevArrow: '<button class="slide-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>',
    nextArrow: '<button class="slide-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>',
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 1,
          arrows: true,
        }
      }
    ]
  });
}


// Initialize menu system
async function initializeMenu() {
  try {
    // First, check if the main menu container exists on the current page.
    const menuContainer = document.getElementById('our-menus');

    // If the container is NOT found, stop the function immediately.
    if (!menuContainer) {
      return;
    }

    // If the container IS found, proceed with building the menu.
    const menuData = await loadMenuData();
    if (menuData) {
      renderCategoryIndicators(menuData.categories);
      renderMenuItems(menuData.categories);
      initializeSliders();
      // Note: do not call addMoroccanDecorations() automatically to avoid
      // inline style changes that can break the original design.
    }
  } catch (error) {
    console.error('Error initializing menu:', error);
  }
}

// Add Moroccan decorative elements
// addMoroccanDecorations is intentionally left out of the automatic init
// to avoid unexpected inline style changes. The function can be
// re-enabled later if a visual QA pass approves it.


// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMenu);

// // Custom animation for Our Menu slider
// $('#our-menus').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
//   var $nextSlide = $(slick.$slides[nextSlide]);
//   var $currentSlide = $(slick.$slides[currentSlide]);

//   // Set initial state for the next slide
//   $nextSlide.css({
//     'transform': 'translateY(10%)',
//     'opacity': 0,
//   });

//   // Animate the next slide into view after a short delay
//   setTimeout(function() {
//     $nextSlide.css({
//       'transform': 'translateY(0)',
//       'opacity': 1,
//       'transition': 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
//     });
//   }, 50); 
// });

// Testimonials Slider
try {
  $('.testimonials .slider-content').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    speed: 300,
    asNavFor: '.testimonials .slider-nav',
    draggable: true,
    swipe: true,
  });

  // Navigation Slider for Testimonials
  $('.testimonials .slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.testimonials .slider-content',
    dots: false,
    focusOnSelect: true,
    centerMode: true, // Center the active slide
    centerPadding: '0px',
    draggable: true,
    swipe: true,
    arrows: false, // Disable navigation arrows
    infinite: true,
  });
} catch (error) {
  console.error('Error initializing testimonials slider:', error);
}

// Our Chefs Slider
try {
  $('.our-chefs .our-chef-slider-wrapper').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    focusOnSelect: true,
    centerMode: true, // Center the active slide
    centerPadding: '0px',
    fade: false,
    speed: 300,
    draggable: false,
    swipe: false,
    prevArrow: '<button class="slide-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>',
    nextArrow: '<button class="slide-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>',
    responsive: [
      {
        breakpoint: 990,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  });
} catch (error) {
  console.error('Error initializing chefs slider:', error);
}

// Story Slider
try {
  $('.story-content').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    speed: 300,
    asNavFor: '.story-indicators .row',
    draggable: true,
    swipe: true,
  });

  // Navigation Slider for Story
  $('.story-indicators > .row').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: '.story-content',
    dots: false,
    focusOnSelect: true,
    centerPadding: '0px',
    draggable: true,
    swipe: true,
    arrows: false, // Disable navigation arrows
    infinite: true,
    prevArrow: '<button class="slide-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>',
    nextArrow: '<button class="slide-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  });
} catch (error) {
  console.error('Error initializing story slider:', error);
}

// Partner Slider
try {
  $('.partner-slider').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    speed: 300,
    draggable: true,
    swipe: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });
} catch (error) {
  console.error('Error initializing partner slider:', error);
}


try {
  $('.chef-choise-slider').slick({
    slidesToShow: 3,
    vertical: true,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    speed: 300,
    draggable: true,
    swipe: true,
    responsive: [
      {
        breakpoint: 786,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1,
        }
      }
    ]
  });

  // Add click events for the chevron icons
  $('.chef-choise-icons .fa-chevron-up').on('click', function() {
    $('.chef-choise-slider').slick('slickPrev');
  });

  $('.chef-choise-icons .fa-chevron-down').on('click', function() {
    $('.chef-choise-slider').slick('slickNext');
  });
} catch (error) {
  console.error('Error initializing chef choice slider:', error);
}

// Update copyright year
try {
  document.getElementById('copyrightCurrentYear').textContent = new Date().getFullYear();
} catch (error) {
  console.error('Error updating copyright year:', error);
}

// Lightbox functionality with advanced animations
function initializeLightbox() {
  const lightbox = document.querySelector('.menu-lightbox');
  const lightboxContent = lightbox.querySelector('.menu-lightbox-content');
  const lightboxImage = lightbox.querySelector('.menu-lightbox-image');
  const lightboxPlaceholder = lightbox.querySelector('.menu-lightbox-placeholder');
  const lightboxTitle = lightbox.querySelector('.menu-lightbox-title');
  const closeButton = lightbox.querySelector('.menu-lightbox-close');

  // Enhanced image preloading with cache
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error('Image not found'));
      img.src = url;
    });
  }

  // Advanced open lightbox with elastic overshoot animation
  async function openLightbox(imageUrl, title, clickElement) {
    // Get click position for animation origin
    const clickRect = clickElement.getBoundingClientRect();
    const clickX = clickRect.left + clickRect.width / 2;
    const clickY = clickRect.top + clickRect.height / 2;

    // Show lightbox first
    lightbox.style.display = 'flex';
    lightbox.classList.remove('closing');

    // Set transform origin to click position for origin-based animation
    const content = lightbox.querySelector('.menu-lightbox-content');
    content.style.transformOrigin = `${clickX}px ${clickY}px`;

    // Force reflow to apply transform origin
    content.offsetHeight;

    // Trigger animation with elastic overshoot effect
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxTitle.textContent = title;
    });

    // Show loading state with modern spinner
    lightboxImage.style.display = 'none';
    lightboxPlaceholder.style.display = 'flex';
    lightboxPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Chargement...</p>';

    // Handle image not available case
    if (imageUrl === 'not-available') {
      setTimeout(() => {
        lightboxImage.style.display = 'none';
        lightboxPlaceholder.style.display = 'flex';
        lightboxPlaceholder.innerHTML = '<i class="fas fa-image"></i><p>Image non disponible</p>';
      }, 300);
      return;
    }

    // Load image with enhanced error handling
    try {
      await preloadImage(imageUrl);
      lightboxImage.src = imageUrl;
      lightboxImage.style.display = 'block';
      lightboxPlaceholder.style.display = 'none';
    } catch (error) {
      setTimeout(() => {
        lightboxImage.style.display = 'none';
        lightboxPlaceholder.style.display = 'flex';
        lightboxPlaceholder.innerHTML = '<i class="fas fa-image"></i><p>Image non disponible</p>';
      }, 300);
    }
  }

  // Enhanced close lightbox with smooth return animation
  function closeLightbox(clickElement) {
    lightbox.classList.add('closing');
    lightbox.classList.remove('active');

    // Remove active state from all voir photo links
    document.querySelectorAll('.voir-photo-link').forEach(link => {
      link.classList.remove('lightbox-active');
    });

    // If click element provided, animate back to origin
    if (clickElement) {
      const clickRect = clickElement.getBoundingClientRect();
      const clickX = clickRect.left + clickRect.width / 2;
      const clickY = clickRect.top + clickRect.height / 2;

      const content = lightbox.querySelector('.menu-lightbox-content');
      content.style.transformOrigin = `${clickX}px ${clickY}px`;
    }

    // Clean up after animation completes
    setTimeout(() => {
      lightbox.style.display = 'none';
      lightbox.classList.remove('closing');
      document.body.style.overflow = '';
      lightboxImage.src = '';
      lightboxTitle.textContent = '';
    }, 600);
  }

  // Enhanced event delegation with improved interaction feedback
  let lastClickTime = 0;
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('voir-photo-link')) {
      e.preventDefault();

      // Debouncing to prevent multiple rapid clicks
      const now = Date.now();
      if (now - lastClickTime < 500) return;
      lastClickTime = now;

      // Add active state animation to clicked link
      e.target.classList.add('lightbox-active');

      const imageUrl = e.target.dataset.image;
      const title = e.target.dataset.name || e.target.closest('.item-wrapper').querySelector('h5').textContent;

      if (imageUrl) {
        openLightbox(imageUrl, title, e.target);
      }
    }
  });

  // Close button functionality
  closeButton.addEventListener('click', () => closeLightbox());

  // Close when clicking outside content
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const menuContainer = document.getElementById('our-menus');
  if (menuContainer) {
    initializeLightbox();
  }
});