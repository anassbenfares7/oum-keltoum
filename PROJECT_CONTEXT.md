# OUM KELTOUM Restaurant Website - Development Context

## Project Overview
- **Type**: Multi-page restaurant website (Moroccan cuisine)
- **Technology**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Version**: v0.6 with Node.js build tools
- **Domain**: oumkeltoum.ma

## Current Status
- **Git Backup Commit**: `cb6d34e` - Safe restore point
- **Last Updated**: 2025-09-19
- **Developer**: Anass benfares

## Completed Issues ✅
1. **Fixed broken author link** - Changed all footer author links from `href=""` to `href="mailto:contact@anassbenfares.com"`
   - Files updated: about.html, contact.html, index.html, menu.html, reservation.html

## Remaining Issues 🔄
### Priority 1 - Critical
2. **Fix menu lightbox empty src** - Empty `src=""` in menu.html lightbox
3. **Add missing error handling** - Implement try-catch blocks in JavaScript
4. **Add noscript fallbacks** - For critical interactive elements

### Priority 2 - Performance
5. **Implement proper lazy loading** - Add `loading="lazy"` to non-critical images
6. **Optimize image loading** - Convert key images to WebP format

### Priority 3 - Code Quality
7. **Create navigation component** - Extract repeated navigation into reusable HTML includes
8. **Add consistent alt text** - Improve accessibility for all images
9. **Fix mixed language attributes** - Proper lang tags for French/Arabic content
10. **Standardize file naming** - Consistent image naming convention

### Priority 4 - Security & SEO
11. **Add security headers** - Implement CSP and other security headers
12. **Update structured data** - Make schema.org data more dynamic
13. **Fix open social links** - Add proper social media URLs
14. **Add meta viewport consistency** - Ensure all pages have proper viewport settings

### Priority 5 - Build Process
15. **Create build script** - Automate minification and optimization
16. **Add image optimization pipeline** - Automated image compression
17. **Implement cache busting** - Version control for assets
18. **Add development/production configs** - Different settings for environments

## Technical Details
- **Total HTML Files**: 5 (index, about, menu, contact, reservation)
- **Image Files**: 82+ in assets/images/
- **CSS Files**: 6 (including minified versions)
- **JavaScript Files**: 8 (including minified versions)
- **External Dependencies**: Bootstrap 5, Font Awesome, AOS, Slick Carousel, jQuery

## Key Commands
```bash
# Check current status
git status

# View changes
git diff

# Revert to backup (if needed)
git reset --hard cb6d34e

# View backup commit details
git show cb6d34e
```

## Project Structure
```
oum-keltoum v0.6+node.modules/
├── index.html          # Main page
├── about.html          # About page
├── menu.html           # Menu page with JSON data
├── contact.html        # Contact form
├── reservation.html    # Reservation system
├── assets/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   ├── images/        # 82+ image files
│   └── fonts/         # Web fonts
├── node_modules/      # Dependencies
├── package.json       # Project config
└── .git/             # Version control
```

## Next Steps
When starting a new session:
1. Read this file first
2. Continue from the next priority issue
3. Update this file after each fix
4. Create backup commits as needed

---
**Last Updated**: 2025-09-19
**Next Issue**: #2 - Fix menu lightbox empty src