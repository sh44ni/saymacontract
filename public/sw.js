self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  return self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Empty fetch listener is enough to pass browser PWA install checks 
  // without messing with Next.js specific caching right now.
});
