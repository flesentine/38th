const itinerary = [
  { name: "Aloha Stacks breakfast", date: "2026-07-11T07:45:00-07:00" },
  { name: "Buy 24k bullion in DTLA", date: "2026-07-11T10:00:00-07:00" },
  { name: "Fountain Coffee Room", date: "2026-07-11T12:15:00-07:00" },
  { name: "Rodeo Drive", date: "2026-07-11T14:00:00-07:00" },
  { name: "Greystone Mansion", date: "2026-07-11T16:15:00-07:00" },
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
    text: "Saturday: DTLA gold + Beverly Hills. Sunday: Sawdust + Splashes in Laguna Beach.",
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
