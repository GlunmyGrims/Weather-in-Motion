import { todayDate } from "./utils.js";

const EXIT_MS = 420;

function animateResult(renderFn) {
  const divRender = document.querySelector(".weather__result");
  const isEmpty = divRender.innerHTML.trim() === "";

  if (isEmpty) {
    renderFn(divRender);
    divRender.classList.remove("is-exiting");
    requestAnimationFrame(() => {
      divRender.classList.add("is-entering", "has-content");
    });
  } else {
    divRender.classList.remove("is-entering", "has-content");
    divRender.classList.add("is-exiting");

    setTimeout(() => {
      divRender.classList.remove("is-exiting");
      renderFn(divRender);
      requestAnimationFrame(() => {
        divRender.classList.add("is-entering", "has-content");
      });
    }, EXIT_MS);
  }
}

export function renderWeather(data) {
  animateResult((divRender) => {
    divRender.innerHTML = `
    <div class="weather__card glass">
      <div class="weather__card--inline">
        <div class="weather__location">
          <h2 class="weather__city">${data.city}, ${data.country}</h2>
          <p>${todayDate()}</p>
        </div>
        <div class="weather__icon glass">
          <img src="https://openweathermap.org/img/wn/${data.icon ?? "01d"}@2x.png" alt="${data.weatherCondition}" />
        </div>
      </div>
      <div class="weather__temp--display glass">
        <p class="weather__temp">${data.temperature}°</p>
        <p class="weather__condition">${data.weatherCondition}</p>
      </div>
      <div class="weather__utils">
        <div class="glass">
          <p class="weather__utils--label">Humidity</p>
          <p class="weather__utils--value">${data.humidity}%</p>
        </div>
        <div class="glass">
          <p class="weather__utils--label">Wind</p>
          <p class="weather__utils--value">${data.wind} Km/h</p>
        </div>
        <div class="glass">
          <p class="weather__utils--label">Main</p>
          <p class="weather__utils--value">${data.main}</p>
        </div>
      </div>
    </div>`;
  });
}

export function renderError(message) {
  animateResult((divRender) => {
    divRender.innerHTML = `<p>${message}</p>`;
  });
}

export function loading() {
  animateResult((divRender) => {
    divRender.innerHTML = `
    <div class="weather__loading">
      <span></span><span></span><span></span><span></span><span></span>
    </div>`;
  });
}

const body = document.querySelector(".weather");

const themes = [
  "weather-clear",
  "weather-clouds",
  "weather-rain",
  "weather-snow",
  "weather-mist",
  "weather-thunderstorm",
];

const weatherTheme = {
  Clear: "weather-clear",
  Clouds: "weather-clouds",
  Drizzle: "weather-rain",
  Rain: "weather-rain",
  Thunderstorm: "weather-thunderstorm",
  Snow: "weather-snow",
  Mist: "weather-mist",
  Fog: "weather-mist",
  Haze: "weather-mist",
  Smoke: "weather-mist",
};

export function setTheme(weather) {
  body.classList.remove(...themes);
  body.classList.add(weatherTheme[weather] ?? "weather-clear");
}

const backgroundVideo = document.querySelector(".weather__video");

const weatherBackgroundTheme = {
  Clear:
    "img/dramatic-clouds-drifting-across-a-blue-sky-2026-01-21-12-13-22-utc.mp4",
  Clouds:
    "img/dark-dramatic-clouds-moving-across-the-sky-2026-01-21-12-13-29-utc.mp4",
  Drizzle:
    "img/Rainy-Weather-In-A-Forest-Of-Green-Trees-2025-12-17-13-15-09-Utc.mp4",
  Rain: "img/Rainy-Weather-In-A-Forest-Of-Green-Trees-2025-12-17-13-15-09-Utc.mp4",
  Thunderstorm:
    "img/stormy-dark-clouds-swirling-at-night-timelapse-2026-01-21-11-59-51-utc.mp4",
  Snow: "img/Snow-Falling-Heavily-In-The-Forest-2025-12-17-04-22-33-Utc.mp4",
  Mist: "img/time-lapse-of-fog-in-a-fir-forest-vale-amazing-ma-2025-12-17-21-29-12-utc.mov",
  Fog: "img/time-lapse-of-fog-in-a-fir-forest-vale-amazing-ma-2025-12-17-21-29-12-utc.mov",
  Haze: "img/time-lapse-of-fog-in-a-fir-forest-vale-amazing-ma-2025-12-17-21-29-12-utc.mov",
  Smoke:
    "img/time-lapse-of-fog-in-a-fir-forest-vale-amazing-ma-2025-12-17-21-29-12-utc.mov",
};

let backgroundVideoB = null;

function ensureDualVideo() {
  if (backgroundVideoB) return;
  backgroundVideoB = backgroundVideo.cloneNode(true);
  backgroundVideoB.style.opacity = "0";
  backgroundVideoB.style.transition =
    "opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1)";
  backgroundVideo.parentNode.insertBefore(
    backgroundVideoB,
    backgroundVideo.nextSibling,
  );
  backgroundVideo.style.transition =
    "opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1)";
}

export function backgroundWeather(weather) {
  ensureDualVideo();

  const newSrc =
    weatherBackgroundTheme[weather] ??
    "img/clouds-drifting-across-the-blue-sky-2025-12-17-19-28-48-utc.mov";

  const aIsActive = parseFloat(backgroundVideo.style.opacity || "1") > 0.5;
  const incoming = aIsActive ? backgroundVideoB : backgroundVideo;
  const outgoing = aIsActive ? backgroundVideo : backgroundVideoB;

  incoming.src = newSrc;
  incoming.load();
  incoming.play().catch(() => {});
  incoming.style.opacity = "0";

  incoming.addEventListener(
    "canplay",
    function onCanPlay() {
      incoming.removeEventListener("canplay", onCanPlay);
      incoming.style.opacity = "1";
      outgoing.style.opacity = "0";
      setTimeout(() => outgoing.pause(), 1200);
    },
    { once: true },
  );
}
