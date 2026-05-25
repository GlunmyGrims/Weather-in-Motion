export const API_KEY = "e26c21b903479976624083cf8f1df796";
import {
  backgroundWeather,
  loading,
  renderError,
  renderWeather,
  setTheme,
} from "./Ui.js";

const LOADING_MIN_MS = 800;

const button = document.querySelector(".weather__button");
const input = document.querySelector(".weather__input");

async function handleInteraction(event) {
  if (event.type === "click" || event.key === "Enter") {
    const cityInput = document.querySelector(".weather__input");

    if (!validInput(cityInput.value)) {
      renderError("Oops, that city doesn't seem to exist. Try another one.");
      return;
    }

    loading();
    button.disabled = true;
    button.classList.add("is-loading");

    const [data] = await Promise.all([
      getWeather(cityInput.value),
      new Promise((resolve) => setTimeout(resolve, LOADING_MIN_MS)),
    ]);

    button.disabled = false;
    button.classList.remove("is-loading");

    if (!data || data.error) {
      renderError(data?.error ?? "Unknown error.");
    } else {
      renderWeather(data);
      setTheme(data.main);
      backgroundWeather(data.main);
    }

    cityInput.value = "";
  }
}

button.addEventListener("click", handleInteraction);
input.addEventListener("keydown", handleInteraction);

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`,
    );

    if (!response.ok) {
      const dataError = await response.json();
      return { error: `${response.status}: ${dataError.message}` };
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys.country,
      temperature: kelvinToCelsius(data.main.temp),
      weatherCondition: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      main: data.weather[0].main,
      wind: data.wind.speed,
    };
  } catch {
    return { error: "Network error." };
  }
}

function kelvinToCelsius(temp) {
  return Math.round(temp - 273.15);
}

function validInput(city) {
  return /^[\p{L}\s]{2,}$/u.test(city.trim());
}
