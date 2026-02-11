"use strict";

const CACHE_VERSION = "animefreak-v3";
const RUNTIME_CACHE = "animefreak-runtime-v3";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./top-movies.html",
  "./news.html",
  "./news-details.html",
  "./movie-details.html",
  "./FStudio.html",
  "./assets/css/style.css",
  "./assets/css/responsive.css",
  "./assets/css/preloader.css",
  "./assets/js/main.js",
  "./assets/js/vanilla-menu-scroll.js",
  "./assets/js/modern-enhancements.js",
  "./assets/js/sw-register.js",
  "./assets/js/owl.carousel.min.js",
  "./assets/img/favcion.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;

  if (!sameOrigin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() =>
          caches.match("./index.html").then((fallback) => fallback || Response.error())
        );
    })
  );
});
