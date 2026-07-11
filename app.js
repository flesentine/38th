const itinerary = [
  { name: "Leave RSM for Downtown LA", date: "2026-07-11T08:15:00-07:00" },
  { name: "Buy 24k bullion in DTLA", date: "2026-07-11T10:00:00-07:00" },
  { name: "Fountain Coffee Room", date: "2026-07-11T12:15:00-07:00" },
  { name: "Rodeo Drive", date: "2026-07-11T14:00:00-07:00" },
  { name: "Greystone Mansion", date: "2026-07-11T16:15:00-07:00" },
  { name: "Aloha Stacks birthday breakfast", date: "2026-07-12T09:30:00-07:00" },
  { name: "Relax at home and get ready", date: "2026-07-12T10:45:00-07:00" },
  { name: "Leave for Laguna", date: "2026-07-12T14:15:00-07:00" },
  { name: "Sawdust Art Festival", date: "2026-07-12T15:15:00-07:00" },
  { name: "Arrive at Surf & Sand", date: "2026-07-12T18:30:00-07:00" },
  { name: "Splashes birthday dinner", date: "2026-07-12T19:15:00-07:00" }
].map(item => ({ ...item, timestamp: new Date(item.date).getTime() }));

const weatherLocations = [
  { name: "DTLA", latitude: 34.0522, longitude: -118.2437, date: "2026-07-11", day: "Saturday" },
  { name: "Beverly Hills", latitude: 34.0736, longitude: -118.4004, date: "2026-07-11", day: "Saturday" },
  { name: "RSM", latitude: 33.6409, longitude: -117.6031, date: "2026-07-12", day: "Sunday" },
  { name: "Laguna Beach", latitude: 33.5427, longitude: -117.7854, date: "2026-07-12", day: "Sunday" }
];

const weatherMap = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌧️"],
  61: ["Light rain", "🌦️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "🌨️"],
  73: ["Snow", "🌨️"],
  75: ["Heavy snow", "❄️"],
  80: ["Rain showers", "🌦️"],
  81: ["Rain showers", "🌧️"],
  82: ["Heavy showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Storm with hail", "⛈️"],
  99: ["Severe storm", "⛈️"]
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function updateCountdown() {
  const now = Date.now();
  const next = itinerary.find(stop => stop.timestamp > now);
  const nextStop = $("#nextStop");
  const countdown = $("#countdown");

  if (!next) {
    nextStop.textContent = "Weekend complete";
    countdown.textContent = "Great memories";
    return;
  }

  const distance = next.timestamp - now;
  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance % 86_400_000) / 3_600_000);
  const minutes = Math.floor((distance % 3_600_000) / 60_000);

  nextStop.textContent = next.name;
  countdown.textContent = days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
}

function setDay(day) {
  $$(".day-tab").forEach(tab => {
    const active = tab.dataset.day === day;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  $$(".day-panel").forEach(panel => {
    const active = panel.id === day;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });

  localStorage.setItem("weekend-luxe-day", day);
}

function loadChecks() {
  $$("input[type=\"checkbox\"][data-check]").forEach(input => {
    const key = `weekend-luxe:${input.dataset.check}`;
    input.checked = localStorage.getItem(key) === "true";
    input.addEventListener("change", () => {
      localStorage.setItem(key, String(input.checked));
    });
  });
}

function renderWeatherLoading() {
  $("#weatherGrid").innerHTML = weatherLocations.map(location => `
    <article class="weather-card glass loading-shimmer">
      <div class="weather-top"><div><div class="weather-city">${location.name}</div><div class="weather-day">${location.day}</div></div><div class="weather-icon">…</div></div>
      <div class="weather-condition">Loading forecast…</div>
      <div class="weather-temps"><span class="weather-high">—</span></div>
    </article>
  `).join("");
}

async function fetchLocationWeather(location) {
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "America/Los_Angeles",
    start_date: location.date,
    end_date: location.date
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error(`Weather API returned ${response.status}`);
  const payload = await response.json();
  return {
    code: payload.daily.weather_code[0],
    high: payload.daily.temperature_2m_max[0],
    low: payload.daily.temperature_2m_min[0],
    rain: payload.daily.precipitation_probability_max[0],
    wind: payload.daily.wind_speed_10m_max[0]
  };
}

async function loadWeather() {
  renderWeatherLoading();
  try {
    const results = await Promise.all(weatherLocations.map(async location => ({
      location,
      weather: await fetchLocationWeather(location)
    })));

    $("#weatherGrid").innerHTML = results.map(({ location, weather }) => {
      const [condition, icon] = weatherMap[weather.code] || ["Mixed conditions", "🌤️"];
      return `
        <article class="weather-card glass">
          <div class="weather-top">
            <div><div class="weather-city">${location.name}</div><div class="weather-day">${location.day}</div></div>
            <div class="weather-icon" aria-hidden="true">${icon}</div>
          </div>
          <div class="weather-condition">${condition}</div>
          <div class="weather-temps"><span class="weather-high">${Math.round(weather.high)}°</span><span class="weather-low">Low ${Math.round(weather.low)}°F</span></div>
          <div class="weather-stats"><span>Rain ${Math.round(weather.rain ?? 0)}%</span><span>Wind ${Math.round(weather.wind ?? 0)} mph</span></div>
        </article>
      `;
    }).join("");
    localStorage.setItem("weekend-luxe-weather-updated", new Date().toISOString());
  } catch (error) {
    console.error(error);
    $("#weatherGrid").innerHTML = `
      <div class="weather-error">
        <strong>Weather could not load.</strong> Check your internet connection and try Refresh Weather. The rest of the app works offline.
      </div>
    `;
  }
}

function updateQuote() {
  const spot = Number($("#spotPrice").value);
  const dealer = Number($("#dealerPrice").value);
  const buyback = Number($("#buybackPrice").value);
  const result = $("#quoteResult");

  if (!(spot > 0 && dealer > 0)) {
    result.textContent = "Enter the dealer’s numbers to see the premium and round-trip spread.";
    return;
  }

  const premiumDollars = dealer - spot;
  const premiumPercent = (premiumDollars / spot) * 100;
  let html = `Dealer premium: <strong>$${premiumDollars.toFixed(2)} (${premiumPercent.toFixed(2)}%)</strong>.`;

  if (buyback > 0) {
    const spread = dealer - buyback;
    const spreadPercent = (spread / dealer) * 100;
    html += ` Buy/sell spread: <strong>$${spread.toFixed(2)} (${spreadPercent.toFixed(2)}%)</strong>.`;
  } else {
    html += " Add the buyback quote to reveal the real round-trip spread.";
  }

  if (premiumPercent > 7) html += " That premium is high for a full 1 oz mainstream bullion product—compare another dealer.";
  else if (premiumPercent > 4) html += " Compare at least one more quote before buying.";
  else html += " The premium looks relatively tight, but authenticity and buyback terms still matter.";

  result.innerHTML = html;
}

async function sharePlan() {
  const data = {
    title: "Weekend Luxe Birthday Plan",
    text: "Saturday: DTLA gold + Beverly Hills. Sunday: Aloha Stacks + Sawdust + Splashes in Laguna Beach.",
    url: window.location.href
  };
  try {
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(`${data.text} ${data.url}`);
      showToast("Plan link copied");
    }
  } catch (error) {
    if (error.name !== "AbortError") showToast("Could not share this time");
  }
}

let deferredInstallPrompt;
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  $("#installButton").hidden = false;
});

$("#installButton").addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $("#installButton").hidden = true;
});

$$(".day-tab").forEach(tab => tab.addEventListener("click", () => setDay(tab.dataset.day)));
$("#refreshWeather").addEventListener("click", () => { loadWeather(); showToast("Refreshing forecast"); });
$("#shareButton").addEventListener("click", sharePlan);
[$("#spotPrice"), $("#dealerPrice"), $("#buybackPrice")].forEach(input => input.addEventListener("input", updateQuote));

setDay(localStorage.getItem("weekend-luxe-day") || "saturday");
loadChecks();
loadWeather();
updateCountdown();
setInterval(updateCountdown, 30_000);

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(console.error));
}


// Live gold pricing and Apple Maps enhancements.
(() => {
  const GOLD_API_URL = "https://api.gold-api.com/price/XAU/USD";
  const GOLD_CACHE_KEY = "weekend-luxe-live-gold";
  const all = selector => [...document.querySelectorAll(selector)];

  all("a[href*='google.com/maps']").forEach(link => {
    try {
      const source = new URL(link.href);
      const destination = source.searchParams.get("destination") || source.searchParams.get("query");
      const origin = source.searchParams.get("origin");
      if (!destination) return;
      const apple = new URL("https://maps.apple.com/");
      if (origin) apple.searchParams.set("saddr", origin);
      apple.searchParams.set("daddr", destination);
      apple.searchParams.set("dirflg", "d");
      link.href = apple.toString();
      if (link.textContent.trim() === "Directions") link.textContent = "Apple Maps";
      if (link.textContent.trim() === "Route") link.textContent = "Open in Maps";
    } catch (error) {
      console.error("Could not convert map link", error);
    }
  });

  const footerNotes = all("footer p");
  if (footerNotes[1]) footerNotes[1].textContent = "Weather: Open-Meteo · Gold: Gold API · Directions: Apple Maps";

  const spotInput = document.querySelector("#spotPrice");
  const calculator = spotInput?.closest(".calculator-grid");
  if (!calculator) return;

  const panel = document.createElement("div");
  panel.className = "gold-live-panel";
  panel.setAttribute("aria-live", "polite");
  panel.innerHTML = `<div class="gold-live-copy"><span class="gold-live-label">Live XAU/USD spot · 1 troy oz</span><strong id="liveGoldPrice">Loading current gold price…</strong><small id="goldUpdatedAt">Connecting to Gold API</small></div><button id="refreshGold" class="button button-secondary" type="button">Refresh gold</button>`;
  const note = document.createElement("p");
  note.className = "gold-api-note";
  note.textContent = "Live market spot automatically fills the calculator. A dealer’s retail price will normally be higher.";
  calculator.before(panel, note);

  const style = document.createElement("style");
  style.textContent = `.gold-live-panel{display:flex;align-items:center;justify-content:space-between;gap:18px;margin:4px 0 10px;padding:18px;border-radius:18px;background:linear-gradient(125deg,rgba(12,23,32,.97),rgba(13,91,119,.92));color:#fff;box-shadow:0 16px 35px rgba(12,23,32,.18)}.gold-live-copy{display:grid;gap:4px}.gold-live-label{color:var(--gold-light);font-size:.73rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}#liveGoldPrice{font-size:clamp(1.55rem,4vw,2.2rem);line-height:1.1}#goldUpdatedAt{color:rgba(255,255,255,.72);font-size:.76rem}.gold-live-panel .button-secondary{background:#fff;color:var(--ink);white-space:nowrap}.gold-api-note{margin:0 0 16px;color:#67767d;font-size:.78rem}@media(max-width:620px){.gold-live-panel{align-items:stretch;flex-direction:column}.gold-live-panel .button{width:100%}}`;
  document.head.appendChild(style);

  const formatTime = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Updated recently";
    return `Updated ${new Intl.DateTimeFormat("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles", timeZoneName: "short" }).format(date)}`;
  };

  const display = (payload, stale = false) => {
    const price = Number(payload?.price);
    if (!(price > 0)) throw new Error("Gold API returned an invalid price");
    document.querySelector("#liveGoldPrice").textContent = `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price)} / oz`;
    document.querySelector("#goldUpdatedAt").textContent = `${formatTime(payload.updatedAt || payload.savedAt || new Date().toISOString())}${stale ? " · saved value" : " · live market spot"}`;
    spotInput.value = price.toFixed(2);
    updateQuote();
  };

  const load = async announce => {
    const priceElement = document.querySelector("#liveGoldPrice");
    const updatedElement = document.querySelector("#goldUpdatedAt");
    priceElement.textContent = "Loading current gold price…";
    updatedElement.textContent = "Connecting to Gold API";
    try {
      const response = await fetch(GOLD_API_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Gold API returned ${response.status}`);
      const saved = { ...(await response.json()), savedAt: new Date().toISOString() };
      localStorage.setItem(GOLD_CACHE_KEY, JSON.stringify(saved));
      display(saved);
      if (announce) showToast("Gold spot price refreshed");
    } catch (error) {
      console.error(error);
      try {
        const cached = JSON.parse(localStorage.getItem(GOLD_CACHE_KEY));
        if (cached) {
          display(cached, true);
          if (announce) showToast("Using the last saved gold price");
          return;
        }
      } catch (cacheError) {
        console.error(cacheError);
      }
      priceElement.textContent = "Gold price unavailable";
      updatedElement.textContent = "Enter spot price manually below";
      if (announce) showToast("Could not refresh gold price");
    }
  };

  document.querySelector("#refreshGold").addEventListener("click", () => load(true));
  load(false);
  setInterval(() => load(false), 60_000);
})();
