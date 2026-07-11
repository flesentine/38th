const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const WEEKEND = {
  saturday: "2026-07-11",
  sunday: "2026-07-12",
  timezone: "America/Los_Angeles"
};

const stops = [
  {
    id: "sat-drive",
    day: "saturday",
    name: "Leave RSM for Downtown LA",
    start: "2026-07-11T08:15:00-07:00",
    end: "2026-07-11T10:00:00-07:00",
    leaveBy: "2026-07-11T08:15:00-07:00",
    detail: "Drive to the DTLA Jewelry District.",
    map: "https://maps.apple.com/?saddr=Rancho+Santa+Margarita%2C+CA&daddr=St.+Vincent+Jewelry+Center%2C+650+S+Hill+St%2C+Los+Angeles%2C+CA&dirflg=d"
  },
  {
    id: "sat-gold",
    day: "saturday",
    name: "Buy 24k investment bullion",
    start: "2026-07-11T10:00:00-07:00",
    end: "2026-07-11T11:15:00-07:00",
    leaveBy: "2026-07-11T08:15:00-07:00",
    detail: "Compare premium and same-day buyback quotes.",
    map: "https://maps.apple.com/?daddr=St.+Vincent+Jewelry+Center%2C+650+S+Hill+St%2C+Los+Angeles%2C+CA&dirflg=d"
  },
  {
    id: "sat-coffee",
    day: "saturday",
    name: "Fountain Coffee Room attempt",
    start: "2026-07-11T12:15:00-07:00",
    end: "2026-07-11T13:15:00-07:00",
    leaveBy: "2026-07-11T11:15:00-07:00",
    detail: "Walk-in counter at The Beverly Hills Hotel.",
    map: "https://maps.apple.com/?daddr=Fountain+Coffee+Room%2C+Beverly+Hills+Hotel%2C+Beverly+Hills%2C+CA&dirflg=d"
  },
  {
    id: "sat-hotel",
    day: "saturday",
    name: "Explore the Pink Palace",
    start: "2026-07-11T13:15:00-07:00",
    end: "2026-07-11T14:00:00-07:00",
    leaveBy: "2026-07-11T13:15:00-07:00",
    detail: "Walk the public areas and take photos.",
    map: "https://maps.apple.com/?daddr=The+Beverly+Hills+Hotel%2C+Beverly+Hills%2C+CA&dirflg=d"
  },
  {
    id: "sat-rodeo",
    day: "saturday",
    name: "Rodeo Drive + Two Rodeo",
    start: "2026-07-11T14:00:00-07:00",
    end: "2026-07-11T15:45:00-07:00",
    leaveBy: "2026-07-11T13:40:00-07:00",
    detail: "Window-shop and enjoy a relaxed afternoon.",
    map: "https://maps.apple.com/?daddr=Two+Rodeo+Drive%2C+Beverly+Hills%2C+CA&dirflg=d"
  },
  {
    id: "sat-sign",
    day: "saturday",
    name: "Beverly Hills sign + Lily Pond",
    start: "2026-07-11T15:45:00-07:00",
    end: "2026-07-11T16:15:00-07:00",
    leaveBy: "2026-07-11T15:30:00-07:00",
    detail: "Quick family photo stop.",
    map: "https://maps.apple.com/?daddr=Beverly+Hills+Sign+and+Lily+Pond%2C+Beverly+Hills%2C+CA&dirflg=d"
  },
  {
    id: "sat-greystone",
    day: "saturday",
    name: "Greystone Mansion gardens",
    start: "2026-07-11T16:15:00-07:00",
    end: "2026-07-11T17:15:00-07:00",
    leaveBy: "2026-07-11T16:00:00-07:00",
    detail: "Finish with a quieter garden walk.",
    map: "https://maps.apple.com/?daddr=Greystone+Mansion+and+Gardens%2C+905+Loma+Vista+Dr%2C+Beverly+Hills%2C+CA&dirflg=d"
  },
  {
    id: "sun-breakfast",
    day: "sunday",
    name: "Aloha Stacks birthday breakfast",
    start: "2026-07-12T09:30:00-07:00",
    end: "2026-07-12T10:45:00-07:00",
    leaveBy: "2026-07-12T09:15:00-07:00",
    detail: "Start the birthday with a relaxed breakfast.",
    map: "https://maps.apple.com/?daddr=Aloha+Stacks%2C+Rancho+Santa+Margarita%2C+CA&dirflg=d"
  },
  {
    id: "sun-morning",
    day: "sunday",
    name: "Relax at home and get ready",
    start: "2026-07-12T10:45:00-07:00",
    end: "2026-07-12T14:15:00-07:00",
    leaveBy: "2026-07-12T10:45:00-07:00",
    detail: "Card, flowers or gift, then downtime at home."
  },
  {
    id: "sun-drive",
    day: "sunday",
    name: "Leave RSM for Laguna Beach",
    start: "2026-07-12T14:15:00-07:00",
    end: "2026-07-12T15:15:00-07:00",
    leaveBy: "2026-07-12T14:15:00-07:00",
    detail: "Build in traffic and parking time.",
    map: "https://maps.apple.com/?saddr=Rancho+Santa+Margarita%2C+CA&daddr=Sawdust+Art+Festival%2C+935+Laguna+Canyon+Rd%2C+Laguna+Beach%2C+CA&dirflg=d"
  },
  {
    id: "sun-sawdust",
    day: "sunday",
    name: "Sawdust Art Festival",
    start: "2026-07-12T15:15:00-07:00",
    end: "2026-07-12T17:30:00-07:00",
    leaveBy: "2026-07-12T14:15:00-07:00",
    detail: "Browse art, demonstrations, crafts and snacks.",
    map: "https://maps.apple.com/?daddr=Sawdust+Art+Festival%2C+935+Laguna+Canyon+Rd%2C+Laguna+Beach%2C+CA&dirflg=d"
  },
  {
    id: "sun-ocean",
    day: "sunday",
    name: "Ocean walk or Laguna shops",
    start: "2026-07-12T17:30:00-07:00",
    end: "2026-07-12T18:30:00-07:00",
    leaveBy: "2026-07-12T17:20:00-07:00",
    detail: "Choose Heisler Park, Main Beach, shops or gelato.",
    map: "https://maps.apple.com/?daddr=Heisler+Park%2C+Laguna+Beach%2C+CA&dirflg=d"
  },
  {
    id: "sun-arrive",
    day: "sunday",
    name: "Arrive at Surf & Sand",
    start: "2026-07-12T18:30:00-07:00",
    end: "2026-07-12T19:15:00-07:00",
    leaveBy: "2026-07-12T18:10:00-07:00",
    detail: "Valet and settle in before dinner.",
    map: "https://maps.apple.com/?daddr=Surf+and+Sand+Resort%2C+1555+S+Coast+Hwy%2C+Laguna+Beach%2C+CA&dirflg=d"
  },
  {
    id: "sun-dinner",
    day: "sunday",
    name: "Birthday dinner at Splashes",
    start: "2026-07-12T19:15:00-07:00",
    end: "2026-07-12T21:15:00-07:00",
    leaveBy: "2026-07-12T18:30:00-07:00",
    detail: "Confirmed oceanfront dinner for three.",
    map: "https://maps.apple.com/?daddr=Splashes+Restaurant%2C+1555+S+Coast+Hwy%2C+Laguna+Beach%2C+CA&dirflg=d"
  }
].map(stop => ({
  ...stop,
  startMs: new Date(stop.start).getTime(),
  endMs: new Date(stop.end).getTime(),
  leaveByMs: new Date(stop.leaveBy).getTime()
}));

const weatherLocations = [
  { name: "DTLA", latitude: 34.0522, longitude: -118.2437, date: WEEKEND.saturday, day: "Saturday", group: "saturday" },
  { name: "Beverly Hills", latitude: 34.0736, longitude: -118.4004, date: WEEKEND.saturday, day: "Saturday", group: "saturday" },
  { name: "RSM", latitude: 33.6409, longitude: -117.6031, date: WEEKEND.sunday, day: "Sunday", group: "sunday" },
  { name: "Laguna Beach", latitude: 33.5427, longitude: -117.7854, date: WEEKEND.sunday, day: "Sunday", group: "sunday" }
];

const weatherMap = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"], 3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"], 48: ["Rime fog", "🌫️"], 51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌧️"], 61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  71: ["Light snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"], 80: ["Rain showers", "🌦️"],
  81: ["Rain showers", "🌧️"], 82: ["Heavy showers", "⛈️"], 95: ["Thunderstorm", "⛈️"],
  96: ["Storm with hail", "⛈️"], 99: ["Severe storm", "⛈️"]
};

const GOLD_API_URL = "https://api.gold-api.com/price/XAU/USD";
const GOLD_CACHE_KEY = "weekend-luxe-live-gold";
let lastGoldFetchAt = 0;
let goldRequestInFlight = null;
let deferredInstallPrompt;

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function formatClock(ms) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: WEEKEND.timezone
  }).format(new Date(ms));
}

function formatDistance(ms) {
  if (ms <= 0) return "Now";
  const minutes = Math.max(0, Math.round(ms / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
}

function calendarDayInPacific(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: WEEKEND.timezone
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function automaticDay() {
  const date = calendarDayInPacific();
  if (date >= WEEKEND.sunday) return "sunday";
  return "saturday";
}

function setDay(day, { userInitiated = false } = {}) {
  const normalized = day === "sunday" ? "sunday" : "saturday";
  $$(".day-tab").forEach(tab => {
    const active = tab.dataset.day === normalized;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  $$(".day-panel").forEach(panel => {
    const active = panel.id === normalized;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });

  if (userInitiated) sessionStorage.setItem("weekend-luxe-day-session", normalized);
  document.documentElement.dataset.activeDay = normalized;
}

function setupTabs() {
  const tabs = $$(".day-tab");
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setDay(tab.dataset.day, { userInitiated: true }));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      setDay(tabs[nextIndex].dataset.day, { userInitiated: true });
    });
  });

  const sessionDay = sessionStorage.getItem("weekend-luxe-day-session");
  setDay(sessionDay || automaticDay());
}

function findStatus(now = Date.now()) {
  const current = stops.find(stop => now >= stop.startMs && now < stop.endMs);
  const next = stops.find(stop => stop.startMs > now);
  const previous = [...stops].reverse().find(stop => stop.endMs <= now);
  return { current, next, previous };
}

function updateDayOfStatus() {
  const now = Date.now();
  const { current, next, previous } = findStatus(now);
  const nowStop = $("#nowStop");
  const nowDetail = $("#nowDetail");
  const nextStop = $("#nextStop");
  const countdown = $("#countdown");
  const leaveBy = $("#leaveBy");
  const leaveDetail = $("#leaveDetail");
  const mapButton = $("#nextMapButton");

  let actionStop = current?.map ? current : next;

  if (current) {
    nowStop.textContent = current.name;
    nowDetail.textContent = `${current.detail} Ends around ${formatClock(current.endMs)}.`;
    if (!sessionStorage.getItem("weekend-luxe-day-session")) setDay(current.day);
  } else if (next) {
    const isLongGap = previous && next.startMs - now > 90 * 60_000;
    nowStop.textContent = isLongGap ? "Free time" : "Getting ready";
    nowDetail.textContent = previous
      ? `${previous.name} is complete.`
      : "Your weekend plan is ready.";
  } else {
    nowStop.textContent = "Weekend complete";
    nowDetail.textContent = "Everything on the itinerary is wrapped.";
  }

  if (next) {
    nextStop.textContent = next.name;
    countdown.textContent = `Starts in ${formatDistance(next.startMs - now)} · ${formatClock(next.startMs)}`;
    leaveBy.textContent = next.leaveByMs <= now ? "Now" : formatClock(next.leaveByMs);
    leaveDetail.textContent = next.leaveByMs <= now
      ? "Head out when you’re ready."
      : `${formatDistance(next.leaveByMs - now)} from now.`;
  } else {
    nextStop.textContent = "No more scheduled stops";
    countdown.textContent = "Great memories";
    leaveBy.textContent = "—";
    leaveDetail.textContent = "Nothing else to rush to.";
  }

  if (actionStop?.map) {
    mapButton.hidden = false;
    mapButton.href = actionStop.map;
    mapButton.textContent = current?.map ? "Open current stop in Apple Maps" : "Go to next stop in Apple Maps";
    mapButton.setAttribute("aria-label", `${mapButton.textContent}: ${actionStop.name}`);
  } else {
    mapButton.hidden = true;
    mapButton.removeAttribute("href");
  }

  const date = calendarDayInPacific();
  document.body.classList.toggle("is-weekend-day", date === WEEKEND.saturday || date === WEEKEND.sunday);
  highlightActiveCard(current, next);
}

function highlightActiveCard(current, next) {
  $$(".stop-card").forEach(card => {
    card.classList.toggle("is-current", card.dataset.stopId === current?.id);
    card.classList.toggle("is-next", !current && card.dataset.stopId === next?.id);
  });
}

function setCardCompletion(input) {
  const card = input.closest(".stop-card");
  if (!card) return;
  card.classList.toggle("is-complete", input.checked);
  card.setAttribute("aria-expanded", String(!input.checked));
  const label = input.closest("label");
  if (label) {
    const textNode = [...label.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = input.checked ? " Completed" : " Done";
  }
}

function loadChecks() {
  $$("input[type='checkbox'][data-check]").forEach(input => {
    const key = `weekend-luxe:${input.dataset.check}`;
    input.checked = localStorage.getItem(key) === "true";
    setCardCompletion(input);
    input.addEventListener("change", () => {
      localStorage.setItem(key, String(input.checked));
      setCardCompletion(input);
      updateDayOfStatus();
      showToast(input.checked ? "Stop marked complete" : "Stop reopened");
    });
  });
}

function renderWeatherLoading() {
  $("#weatherGrid").innerHTML = weatherLocations.map(location => `
    <article class="weather-card glass loading-shimmer" data-weather-day="${location.group}">
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
    timezone: WEEKEND.timezone,
    start_date: location.date,
    end_date: location.date
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { cache: "no-store" });
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

async function loadWeather({ announce = false } = {}) {
  renderWeatherLoading();
  try {
    const results = await Promise.all(weatherLocations.map(async location => ({
      location,
      weather: await fetchLocationWeather(location)
    })));

    $("#weatherGrid").innerHTML = results.map(({ location, weather }) => {
      const [condition, icon] = weatherMap[weather.code] || ["Mixed conditions", "🌤️"];
      return `
        <article class="weather-card glass" data-weather-day="${location.group}">
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
    if (announce) showToast("Forecast refreshed");
  } catch (error) {
    console.error(error);
    $("#weatherGrid").innerHTML = `
      <div class="weather-error">
        <strong>Weather could not load.</strong> Check your connection and try Refresh Weather. The rest of the app still works offline.
      </div>
    `;
    if (announce) showToast("Could not refresh weather");
  }
}

function updateQuote() {
  const spot = Number($("#spotPrice")?.value);
  const dealer = Number($("#dealerPrice")?.value);
  const buyback = Number($("#buybackPrice")?.value);
  const result = $("#quoteResult");
  if (!result) return;

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

function isWeekendMarketClosed(date = new Date()) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: WEEKEND.timezone
  }).format(date);
  return weekday === "Sat" || weekday === "Sun";
}

function normalizeGoldTimestamp(payload) {
  const candidates = [payload?.updatedAt, payload?.updated_at, payload?.timestamp, payload?.date];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const value = typeof candidate === "number" && candidate < 10_000_000_000 ? candidate * 1000 : candidate;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

function formatGoldTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: WEEKEND.timezone,
    timeZoneName: "short"
  }).format(date);
}

function createGoldPanel() {
  const spotInput = $("#spotPrice");
  const calculator = spotInput?.closest(".calculator-grid");
  if (!calculator || $("#liveGoldPrice")) return;

  const panel = document.createElement("div");
  panel.className = "gold-live-panel";
  panel.setAttribute("aria-live", "polite");
  panel.innerHTML = `
    <div class="gold-live-copy">
      <span class="gold-live-label">Latest available XAU/USD quote · 1 troy oz</span>
      <strong id="liveGoldPrice">Loading latest gold quote…</strong>
      <small id="goldUpdatedAt">Connecting to Gold API</small>
    </div>
    <button id="refreshGold" class="button button-secondary" type="button">
      <span class="gold-refresh-label">Refresh quote</span>
      <span class="gold-spinner" aria-hidden="true"></span>
    </button>
  `;

  const note = document.createElement("p");
  note.className = "gold-api-note";
  note.textContent = "The latest available market quote automatically fills the calculator. Dealer retail prices will normally be higher.";
  calculator.before(panel, note);

  $("#refreshGold").addEventListener("click", () => loadGoldPrice({ announce: true, force: true }));
}

function displayGoldPrice(payload, { savedValue = false } = {}) {
  const price = Number(payload?.price);
  if (!(price > 0)) throw new Error("Gold API returned an invalid price");

  $("#liveGoldPrice").textContent = `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)} / oz`;

  const sourceTime = normalizeGoldTimestamp(payload);
  const fetchedTime = new Date(payload.fetchedAt || payload.savedAt || Date.now());
  const marketNote = isWeekendMarketClosed() ? "Weekend market closed" : "Latest market quote";
  const sourceNote = sourceTime ? `Quote as of ${formatGoldTime(sourceTime)}` : `Retrieved ${formatGoldTime(fetchedTime)}`;
  $("#goldUpdatedAt").textContent = `${marketNote} · ${sourceNote}${savedValue ? " · saved value" : ""}`;
  $("#spotPrice").value = price.toFixed(2);
  updateQuote();
}

function setGoldRefreshing(refreshing) {
  const panel = $(".gold-live-panel");
  const button = $("#refreshGold");
  panel?.classList.toggle("is-refreshing", refreshing);
  if (button) button.disabled = refreshing;
}

async function loadGoldPrice({ announce = false, force = false } = {}) {
  if (goldRequestInFlight) return goldRequestInFlight;
  if (!force && Date.now() - lastGoldFetchAt < 30_000) return;

  const priceElement = $("#liveGoldPrice");
  const updatedElement = $("#goldUpdatedAt");
  if (!priceElement || !updatedElement) return;

  setGoldRefreshing(true);
  if (!priceElement.textContent || priceElement.textContent.includes("Loading")) {
    priceElement.textContent = "Loading latest gold quote…";
  }
  updatedElement.textContent = "Refreshing the newest available quote…";

  goldRequestInFlight = (async () => {
    try {
      const freshUrl = `${GOLD_API_URL}?_fresh=${Date.now()}`;
      const response = await fetch(freshUrl, {
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`Gold API returned ${response.status}`);
      const saved = { ...(await response.json()), fetchedAt: new Date().toISOString() };
      localStorage.setItem(GOLD_CACHE_KEY, JSON.stringify(saved));
      lastGoldFetchAt = Date.now();
      displayGoldPrice(saved);
      if (announce) showToast("Latest gold quote refreshed");
    } catch (error) {
      console.error(error);
      try {
        const cached = JSON.parse(localStorage.getItem(GOLD_CACHE_KEY));
        if (cached) {
          displayGoldPrice(cached, { savedValue: true });
          if (announce) showToast("Using the last saved gold quote");
          return;
        }
      } catch (cacheError) {
        console.error(cacheError);
      }
      priceElement.textContent = "Gold quote unavailable";
      updatedElement.textContent = "Enter spot price manually below";
      if (announce) showToast("Could not refresh gold quote");
    } finally {
      setGoldRefreshing(false);
      goldRequestInFlight = null;
    }
  })();

  return goldRequestInFlight;
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

function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    $("#installButton").hidden = false;
  });

  $("#installButton")?.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $("#installButton").hidden = true;
  });
}

function setupRefreshEvents() {
  $("#refreshWeather")?.addEventListener("click", () => loadWeather({ announce: true }));
  $("#shareButton")?.addEventListener("click", sharePlan);
  [$("#spotPrice"), $("#dealerPrice"), $("#buybackPrice")].filter(Boolean)
    .forEach(input => input.addEventListener("input", updateQuote));

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      updateDayOfStatus();
      loadGoldPrice({ force: true });
    }
  });
  window.addEventListener("focus", () => loadGoldPrice({ force: true }));
  window.addEventListener("online", () => {
    loadGoldPrice({ force: true });
    loadWeather();
  });
}

function init() {
  setupTabs();
  loadChecks();
  createGoldPanel();
  setupInstallPrompt();
  setupRefreshEvents();
  loadWeather();
  loadGoldPrice({ force: true });
  updateDayOfStatus();

  setInterval(updateDayOfStatus, 30_000);
  setInterval(() => loadGoldPrice(), 60_000);

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(console.error));
  }
}

init();