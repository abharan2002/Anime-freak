# Anime-freak

Modernized legacy static anime site with non-breaking progressive enhancements.

## What was upgraded

- Fixed broken jQuery runtime URL that prevented scripts from loading.
- Updated CDN dependencies to stable current versions for this stack:
  - jQuery `1.12.4` (legacy-plugin compatible, corrected URL)
  - Bootstrap `4.6.2` (bundle)
- Replaced legacy menu + scroll behavior with vanilla JS:
  - Removed SlickNav plugin dependency
  - Added `assets/js/vanilla-menu-scroll.js` for responsive menu + smooth scroll-to-top behavior
- Replaced Isotope-based portfolio filtering with vanilla filtering:
  - Removed Isotope plugin dependency
  - Category filtering now runs through `assets/js/modern-enhancements.js` and works with search/favorites together
- Added `assets/js/modern-enhancements.js` with new features:
  - Live search from the existing header search bar (movies + news)
  - Persistent movie favorites (saved in `localStorage`)
  - Favorites-only filter on movie grids
  - Recently opened trailer history widget (saved in `localStorage`)
  - Accent theme toggle (Rose/Teal)
  - Safer external links (`noopener noreferrer`)
  - Lazy loading for non-critical images
- Added UI polish layer in `assets/css/style.css`:
  - Design tokens via CSS variables
  - Better card hover states
  - Focus styling and control button styles
- Added PWA layer:
  - `manifest.webmanifest`
  - `service-worker.js`
  - `assets/js/sw-register.js` (wired into all pages)

## Project structure

- `index.html`, `top-movies.html`, `news.html`, `FStudio.html`, `news-details.html`, `movie-details.html`
- `assets/css/style.css`
- `assets/js/main.js` (legacy behavior)
- `assets/js/vanilla-menu-scroll.js` (vanilla responsive menu + scroll module)
- `assets/js/modern-enhancements.js` (new non-breaking features)
- `service-worker.js` + `manifest.webmanifest` (PWA/offline support)

## Run locally

Open any HTML file directly in a browser, or run a static server from this folder.

Example:

```bash
python3 -m http.server 8123
```

Then open [http://localhost:8123](http://localhost:8123).
