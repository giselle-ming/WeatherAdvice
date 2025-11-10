import React, { useState, useEffect } from "react";
import { geocodeCity, fetchCurrentWeather } from "./api/weather";
import NeedCard from "./components/NeedCard";
import ConfigModal from "./components/ConfigModal";

const DEFAULT_THRESHOLDS = {
  jacketTemp: 18,
  jacketWind: 20,
  glovesTemp: 8,
};

export default function App() {
  const [city, setCity] = useState("Location...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [thresholds, setThresholds] = useState(() => {
    const saved = localStorage.getItem("weatherThresholds");
    return saved ? JSON.parse(saved) : DEFAULT_THRESHOLDS;
  });

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
    return tempC <= thresholds.jacketTemp || windKmh >= thresholds.jacketWind;
  }
  function needGloves(tempC) {
    return tempC <= thresholds.glovesTemp;
  }

  const handleSaveThresholds = (newThresholds) => {
    setThresholds(newThresholds);
    localStorage.setItem("weatherThresholds", JSON.stringify(newThresholds));
  };

  return (
    <div className="app">
      <header className="top">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h1>Weather</h1>
          <button
            className="settings-button"
            onClick={() => setIsConfigOpen(true)}
          >
            ⚙️
          </button>
        </div>
        <form onSubmit={handleSearch} className="search">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => city === "Location..." && setCity("")}
            placeholder="Search city..."
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        values={thresholds}
        onSave={handleSaveThresholds}
      />

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
                    ? "Bring it —> possible rain"
                    : "Not needed —> clear skies ahead"
                }
              />

              <NeedCard
                title="Jacket"
                needed={needJacket(data.temperature, data.windspeed)}
                note={
                  needJacket(data.temperature, data.windspeed)
                    ? "Yes, bring it!!"
                    : "Not needed"
                }
                emphasize
              />

              <NeedCard
                title="Gloves"
                needed={needGloves(data.temperature)}
                note={
                  needGloves(data.temperature)
                    ? "Yes —> it's cold"
                    : "Not needed"
                }
              />

              <NeedCard
                title="Scarf"
                needed={needScarf(data.temperature)}
                note={
                  needScarf(data.temperature)
                    ? "Yes —> it's freezing"
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
