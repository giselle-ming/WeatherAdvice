/**
 * Geocode a city name into latitude and longitude coordinates.
 * @param {string} name City name to geocode.
 * @return {Promise<Object>} Geocoded city object with name, country, latitude and longitude.
 * @throws {Error} Geocoding failed.
 */
export async function geocodeCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name
  )}&count=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");
  const json = await res.json();
  if (!json.results || json.results.length === 0) return null;
  const r = json.results[0];
  return {
    name: r.name,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  };
}

/**
 * Fetch the current weather data from the Open-Meteo API.
 * @param {number} latitude Latitude coordinate of the location.
 * @param {number} longitude Longitude coordinate of the location.
 * @return {Promise<Object>} Current weather data object with temperature (°C), windspeed (km/h), weathercode, description, and humidity (%).
 * @throws {Error} Weather fetch failed.
 */
export async function fetchCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&timezone=auto&temperature_unit=celsius&windspeed_unit=kmh`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather fetch failed");
  const json = await res.json();
  const cw = json.current_weather;
  let humidity = null;
  try {
    if (json.hourly && json.hourly.time && json.hourly.relativehumidity_2m) {
      const nowISO = cw.time;
      const idx = json.hourly.time.indexOf(nowISO);
      if (idx !== -1) humidity = json.hourly.relativehumidity_2m[idx];
    }
  } catch (e) {
    humidity = null;
  }

  return {
    temperature: cw.temperature,
    windspeed: cw.windspeed,
    weathercode: cw.weathercode,
    description: decodeWeathercode(cw.weathercode),
    humidity: humidity,
  };
}

/**
 * Decodes the Open-Meteo weathercode into a human-readable description.
 * @param {number} code The Open-Meteo weathercode.
 * @return {string} Human-readable description of the weather.
 */
function decodeWeathercode(code) {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
  if (code >= 45 && code <= 48) return "Fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "Rain";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "Snow";
  if (code >= 95) return "Thunderstorm";
  return "Weather";
}
