# Weekend Luxe

A polished, installable single-page web app for the July 11–12, 2026 birthday weekend:

- Saturday: Aloha Stacks, 24k bullion in the DTLA Jewelry District, Fountain Coffee Room, Rodeo Drive, Beverly Hills sign, Greystone Mansion.
- Sunday: relaxed morning, Sawdust Art Festival, Laguna Beach walk, confirmed 7:15 PM dinner at Splashes.
- Live weather cards for DTLA, Beverly Hills, Rancho Santa Margarita and Laguna Beach using Open-Meteo.
- Gold dealer quote calculator.
- Persistent itinerary and packing checklists stored in the browser.
- Installable PWA support and offline app shell.

## Live site

https://flesentine.github.io/38th/

## Run locally

Because the weather API and service worker work best over HTTP, start a local server from this folder:

### macOS / Windows / Linux with Python

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

The HTML will also open directly by double-clicking `index.html`, but install/offline mode is unavailable under `file://`.

## Weather API

The app uses Open-Meteo and requires no API key. Forecast requests are made directly from the browser for the fixed weekend dates and locations.

## Customize

Edit the itinerary in `index.html`. The countdown list and weather locations are near the top of `app.js`.
