AOS.init({
  offset: '140', // 50% viewport height ka offset
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


// Header scroll behavior
document.addEventListener('DOMContentLoaded', () => {

  // --- Header Scroll Effect (Your existing code) ---
  const header = document.querySelector('header');
  const headerClass = document.querySelector('.header');

  // A check to make sure the header elements exist before running the code
  if (header && headerClass) {
    const checkScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
        headerClass.classList.remove('my-3');
        headerClass.classList.add('my-2');
        sessionStorage.setItem('scrolled', 'true');
        
      } else {
        header.classList.remove('scrolled');
        headerClass.classList.add('my-3');
        headerClass.classList.remove('my-2');
        sessionStorage.removeItem('scrolled');
      }
    };

    // Check scroll position on page load
    if (sessionStorage.getItem('scrolled') === 'true') {
      header.classList.add('scrolled');
    }
    window.addEventListener('scroll', checkScroll);  
    checkScroll(); // Initial check
  }


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
                  ${category.items && category.items[0] ? `
                    <img class="img-fluid" loading="lazy" src="./assets/${category.items[0].imageURL}" alt="${category.items[0].name}">
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
                  ${item.imageURL ? `<a class="voir-photo-link" data-image="./assets/${item.imageURL}">Voir photo</a>` : ''}
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

// Lightbox functionality
function initializeLightbox() {
  const lightbox = document.querySelector('.menu-lightbox');
  const lightboxContent = lightbox.querySelector('.menu-lightbox-content');
  const lightboxImage = lightbox.querySelector('.menu-lightbox-image');
  const lightboxPlaceholder = lightbox.querySelector('.menu-lightbox-placeholder');
  const lightboxTitle = lightbox.querySelector('.menu-lightbox-title');
  const closeButton = lightbox.querySelector('.menu-lightbox-close');

  // Précharger les images
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error('Image not found'));
      img.src = url;
    });
  }

  // Function to open lightbox
  async function openLightbox(imageUrl, title) {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lightboxTitle.textContent = title;

    // Afficher un état de chargement
    lightboxImage.style.display = 'none';
    lightboxPlaceholder.style.display = 'flex';
    lightboxPlaceholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Chargement...</p>';

    try {
      // Tenter de charger l'image
      await preloadImage(imageUrl);
      lightboxImage.src = imageUrl;
      lightboxImage.style.display = 'block';
      lightboxPlaceholder.style.display = 'none';
    } catch (error) {
      // En cas d'erreur, afficher le placeholder
      lightboxImage.style.display = 'none';
      lightboxPlaceholder.style.display = 'flex';
      lightboxPlaceholder.innerHTML = '<i class="fas fa-image"></i><p>Image non disponible</p>';
    }
  }

  // Function to close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImage.src = '';
      lightboxTitle.textContent = '';
    }, 200);
  }

  // Cache pour les états des images
  const imageCache = new Map();

  // Event delegation for "Voir photo" links with debouncing
  let lastClickTime = 0;
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('voir-photo-link')) {
      e.preventDefault();
      
      // Debouncing pour éviter les clics multiples
      const now = Date.now();
      if (now - lastClickTime < 500) return;
      lastClickTime = now;

      const imageUrl = e.target.dataset.image;
      const title = e.target.closest('.item-wrapper').querySelector('h5').textContent;
      
      if (imageUrl) {
        openLightbox(imageUrl, title);
      }
    }
  });

  // Close lightbox when clicking close button
  closeButton.addEventListener('click', closeLightbox);

  // Close lightbox when clicking outside the content
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox with Escape key
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
