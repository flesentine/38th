const CACHE = "weekend-luxe-v8";
const APP_SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest", "./assets/weekend-luxe-logo.svg"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.url.includes("api.gold-api.com")) {
    const freshUrl = new URL(request.url);
    freshUrl.searchParams.set("_fresh", String(Date.now()));
    const freshRequest = new Request(freshUrl.toString(), {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      redirect: "follow",
      headers: { Accept: "application/json" }
    });
    event.respondWith(fetch(freshRequest).catch(() => fetch(request, { cache: "no-store" })));
    return;
  }

  if (request.url.includes("api.open-meteo.com")) {
    event.respondWith(fetch(request, { cache: "no-store" }).catch(() => caches.match(request)));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
      return response;
    }))
  );
});