const CACHE = "weekend-luxe-v9";
const APP_SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest", "./assets/weekend-luxe-logo.svg"];

const MOBILE_WEATHER_CSS = `
@media (max-width: 650px) {
  html[data-active-day="saturday"] .weather-card[data-weather-day="sunday"],
  html[data-active-day="sunday"] .weather-card[data-weather-day="saturday"] { display: none; }
  .weather-section.section-block { margin: 22px 0 30px; }
  .weather-section .section-heading { align-items: center; margin-bottom: 8px; }
  .weather-section .section-heading h2 { font-size: 1.45rem; }
  .weather-section .eyebrow { margin-bottom: 4px; font-size: .65rem; }
  .weather-section .section-note { display: none; }
  .weather-section .text-button { padding: 7px 4px; font-size: .76rem; }
  .weather-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .weather-card { min-height: 0; padding: 12px; border-radius: 16px; }
  .weather-card::after { width: 72px; height: 72px; right: -24px; top: -26px; }
  .weather-day { display: none; }
  .weather-icon { font-size: 1.45rem; }
  .weather-condition { margin: 8px 0 4px; font-size: .74rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .weather-temps { gap: 4px; flex-wrap: wrap; }
  .weather-high { font-size: 1.48rem; }
  .weather-low { font-size: .68rem; }
  .weather-stats { display: grid; justify-content: start; gap: 2px; margin-top: 6px; font-size: .66rem; }
}
`;

async function appendMobileWeatherCss(response) {
  if (!response) return new Response(MOBILE_WEATHER_CSS, { headers: { "Content-Type": "text/css; charset=utf-8" } });
  const css = await response.text();
  const headers = new Headers(response.headers);
  headers.set("Content-Type", "text/css; charset=utf-8");
  return new Response(`${css}\n${MOBILE_WEATHER_CSS}`, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

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
  const url = new URL(request.url);

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

  if (url.pathname.endsWith("/styles.css")) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .catch(() => caches.match(request))
        .then(appendMobileWeatherCss)
    );
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