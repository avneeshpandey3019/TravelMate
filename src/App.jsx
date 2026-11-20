
import { useState } from "react";
import "./App.css";

function App() {
  // Budget Calculator States
  const [hotelCost, setHotelCost] = useState(0);
  const [foodCost, setFoodCost] = useState(0);
  const [transportCost, setTransportCost] = useState(0);
  const [otherCost, setOtherCost] = useState(0);

  // Weather States
  const [weatherCity, setWeatherCity] = useState("Kanpur");
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  // Calculate Total Budget
  const totalBudget =
    Number(hotelCost) +
    Number(foodCost) +
    Number(transportCost) +
    Number(otherCost);

  // Get Weather Information
  const getWeather = async () => {
    if (!weatherCity.trim()) {
      setWeatherError("Please enter a city name.");
      return;
    }

    try {
      setLoadingWeather(true);
      setWeatherError("");
      setWeather(null);

      // Find city coordinates
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(weatherCity)}&count=1`
      );

      if (!geoResponse.ok) {
        throw new Error("Unable to find the city.");
      }

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setWeatherError("City not found. Please try another city.");
        return;
      }

      const city = geoData.results[0];

      // Get weather using coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`
      );

      if (!weatherResponse.ok) {
        throw new Error("Unable to get weather information.");
      }

      const weatherData = await weatherResponse.json();

      setWeather({
        city: city.name,
        country: city.country,
        temperature: weatherData.current.temperature_2m,
        feelsLike: weatherData.current.apparent_temperature,
        humidity: weatherData.current.relative_humidity_2m,
        wind: weatherData.current.wind_speed_10m,
      });
    } catch (error) {
      setWeatherError("Weather could not be loaded. Please try again.");
    } finally {
      setLoadingWeather(false);
    }
  };

  return (
    <main>
      {/* Travel Budget Calculator */}
      <section className="budget-section">
        <span className="eyebrow">TRAVELMATE</span>

        <h1>Travel Budget Calculator</h1>

        <p>Plan your journey without losing track of your expenses.</p>

        <div className="budget-grid">
          <div className="budget-input">
            <label>🏨 Accommodation (₹)</label>
            <input
              type="number"
              min="0"
              value={hotelCost}
              onChange={(e) => setHotelCost(e.target.value)}
              placeholder="Enter hotel cost"
            />
          </div>

          <div className="budget-input">
            <label>🍔 Food (₹)</label>
            <input
              type="number"
              min="0"
              value={foodCost}
              onChange={(e) => setFoodCost(e.target.value)}
              placeholder="Enter food cost"
            />
          </div>

          <div className="budget-input">
            <label>🚕 Transport (₹)</label>
            <input
              type="number"
              min="0"
              value={transportCost}
              onChange={(e) => setTransportCost(e.target.value)}
              placeholder="Enter transport cost"
            />
          </div>

          <div className="budget-input">
            <label>🛍️ Other Expenses (₹)</label>
            <input
              type="number"
              min="0"
              value={otherCost}
              onChange={(e) => setOtherCost(e.target.value)}
              placeholder="Enter other expenses"
            />
          </div>
        </div>

        <div className="budget-total">
          <span>Estimated Total Budget</span>
          <h2>₹{totalBudget.toLocaleString("en-IN")}</h2>
          <p>Your budget updates automatically.</p>
        </div>
      </section>

      {/* Weather Section */}
      <section className="weather-section">
        <span className="eyebrow">TRAVEL WEATHER</span>

        <h2>Check Destination Weather</h2>

        <p>Know the weather before starting your journey.</p>

        <div className="weather-search">
          <input
            type="text"
            value={weatherCity}
            onChange={(e) => setWeatherCity(e.target.value)}
            placeholder="Enter city name"
          />

          <button
            type="button"
            onClick={getWeather}
            disabled={loadingWeather}
          >
            {loadingWeather ? "Checking..." : "Check Weather"}
          </button>
        </div>

        {weatherError && (
          <p className="weather-error">{weatherError}</p>
        )}

        {weather && (
          <div className="weather-card">
            <h3>
              {weather.city}, {weather.country}
            </h3>

            <h1>🌤️ {weather.temperature}°C</h1>

            <p>Feels like: {weather.feelsLike}°C</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind Speed: {weather.wind} km/h</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
