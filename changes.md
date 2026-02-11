# Changes

This file tracks modernization and maintenance updates made to the project.

## Current updates

- Fixed broken jQuery runtime URL that prevented scripts from loading.
- Updated CDN dependencies for current compatibility:
  - jQuery `1.12.4` (legacy-plugin compatible)
  - Bootstrap `4.6.2` bundle
- Replaced legacy menu and scroll plugin behavior with vanilla JS:
  - Removed SlickNav dependency
  - Added `assets/js/vanilla-menu-scroll.js` for responsive menu + scroll-to-top
- Replaced Isotope portfolio filtering with vanilla filtering:
  - Removed Isotope dependency
  - Category filtering now runs through `assets/js/modern-enhancements.js`
- Added progressive enhancement features in `assets/js/modern-enhancements.js`:
  - Live search (movies/news)
  - Persistent favorites (`localStorage`)
  - Favorites-only filter
  - Recently opened trailers widget (`localStorage`)
  - Accent theme toggle
  - External link hardening (`noopener noreferrer`)
  - Lazy loading for non-critical images
- Added UI improvements in `assets/css/style.css` and responsive updates in `assets/css/responsive.css` for new modules/components.
- Added PWA support:
  - `manifest.webmanifest`
  - `service-worker.js`
  - `assets/js/sw-register.js`
