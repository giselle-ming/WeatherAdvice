import React, { useState } from "react";
import { geocodeCity, fetchCurrentWeather } from "./api/weather";
import NeedCard from "./components/NeedCard";

export default function App() {
  const [city, setCity] = useState("Location...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function handleSearch(e) {
    e?.preventDefault();
    if (!city) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const geo = await geocodeCity(city);
      if (!geo) throw new Error("City not found");
      const weather = await fetchCurrentWeather(geo.latitude, geo.longitude);
      setData({
        city: geo.name + (geo.country ? ", " + geo.country : ""),
        ...weather,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }

  function needUmbrella(weathercode) {
    return weathercode >= 51 || weathercode >= 80 || weathercode >= 95;
  }
  function needJacket(tempC, windKmh) {
    return tempC <= 18 || windKmh >= 20;
  }
  function needGloves(tempC) {
    return tempC <= 8;
  }

  return (
    <div className="app">
      <header className="top">
        <h1>Weather</h1>
        <form onSubmit={handleSearch} className="search">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <main>
        {loading && <div className="card big">Loading…</div>}
        {error && <div className="card big error">{error}</div>}

        {data && (
          <>
            <section className="card hero">
              <div className="left">
                <div className="location">Now in {data.city}</div>
                <div className="temp">{Math.round(data.temperature)}°</div>
                <div className="desc">{data.description}</div>
                <div className="subdesc">Sunny and breezy</div>
              </div>

              <div className="right">
                <div className="stat">
                  <div className="label">Feels Like</div>
                  <div className="big">{Math.round(data.temperature)}°</div>
                </div>
                <div className="stat">
                  <div className="label">Wind Speed</div>
                  <div className="big">{Math.round(data.windspeed)} km/h</div>
                </div>
              </div>
            </section>

            <h2>What You Need Today</h2>
            <section className="grid">
              <NeedCard
                title="Umbrella"
                needed={needUmbrella(data.weathercode)}
                note={
                  needUmbrella(data.weathercode)
                    ? "Bring it — possible rain"
                    : "Not needed — clear skies ahead"
                }
              />

              <NeedCard
                title="Jacket"
                needed={needJacket(data.temperature, data.windspeed)}
                note={
                  needJacket(data.temperature, data.windspeed)
                    ? "Yes, bring it — it's chilly"
                    : "Not needed — mild weather"
                }
                emphasize
              />

              <NeedCard
                title="Gloves"
                needed={needGloves(data.temperature)}
                note={
                  needGloves(data.temperature)
                    ? "Yes — it's cold"
                    : "Not needed"
                }
              />
            </section>
          </>
        )}

        {!data && !loading && !error && (
          <div className="card big">
            Enter a city and press Search to see what you need today.
          </div>
        )}
      </main>
    </div>
  );
}
