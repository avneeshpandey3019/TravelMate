
import { useState } from "react";
import "./App.css";

const destinations = [
  {
    name: "Bali",
    country: "Indonesia",
    category: "Beach",
    price: 25000,
    description: "Tropical beaches and peaceful escapes.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Mountain",
    price: 65000,
    description: "Beautiful mountains and snowy landscapes.",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900",
  },
  {
    name: "Paris",
    country: "France",
    category: "City",
    price: 55000,
    description: "Explore beautiful streets and iconic architecture.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900",
  },
  {
    name: "Maldives",
    country: "Maldives",
    category: "Beach",
    price: 45000,
    description: "Relax beside crystal-clear tropical waters.",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900",
  },
  {
    name: "Manali",
    country: "India",
    category: "Mountain",
    price: 12000,
    description: "Enjoy mountain views and scenic valleys.",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900",
  },
  {
    name: "Tokyo",
    country: "Japan",
    category: "City",
    price: 70000,
    description: "Discover modern culture and traditional Japan.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900",
  },
];

function App() {
  // Destination search
  const [search, setSearch] = useState("");

  // Trip planner
  const [tripDestination, setTripDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [tripMessage, setTripMessage] = useState("");

  // Budget calculator
  const [hotelCost, setHotelCost] = useState(0);
  const [foodCost, setFoodCost] = useState(0);
  const [transportCost, setTransportCost] = useState(0);
  const [otherCost, setOtherCost] = useState(0);

  const totalBudget =
    Number(hotelCost) +
    Number(foodCost) +
    Number(transportCost) +
    Number(otherCost);

  // Weather checker
  const [weatherCity, setWeatherCity] = useState("Kanpur");
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const filteredDestinations = destinations.filter((place) => {
    const text = `${place.name} ${place.country} ${place.category}`;
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const createTrip = (event) => {
    event.preventDefault();

    if (!tripDestination.trim() || !travelDate) {
      setTripMessage("Please enter a destination and travel date.");
      return;
    }

    setTripMessage(
      `Your trip to ${tripDestination} for ${travelers} traveller(s) is planned for ${travelDate}!`
    );
  };

  const getWeather = async () => {
    if (!weatherCity.trim()) {
      setWeatherError("Please enter a city name.");
      return;
    }

    try {
      setLoadingWeather(true);
      setWeatherError("");
      setWeather(null);

      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(weatherCity)}&count=1`
      );

      if (!geoResponse.ok) {
        throw new Error("Unable to find city.");
      }

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setWeatherError("City not found. Please try another city.");
        return;
      }

      const city = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`
      );

      if (!weatherResponse.ok) {
        throw new Error("Unable to get weather.");
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
      {/* Navigation */}
      <header className="navbar">
        <a href="#home" className="logo">
          <span>✈</span> TravelMate
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#destinations">Destinations</a>
          <a href="#planner">Trip Planner</a>
          <a href="#budget">Budget</a>
          <a href="#weather">Weather</a>
        </nav>

        <a href="#planner" className="nav-button">
          Plan a Trip
        </a>
      </header>

      {/* Homepage Hero */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <span className="hero-tag">YOUR SMART TRAVEL COMPANION</span>

          <h1>
            Explore the world.
            <br />
            <span>Travel smarter.</span>
          </h1>

          <p>
            Discover amazing destinations, plan your journeys,
            manage your budget and make every trip memorable
            with TravelMate.
          </p>

          <div className="hero-buttons">
            <a href="#destinations" className="primary-button">
              Explore Destinations →
            </a>
            <a href="#planner" className="secondary-button">
              Plan My Trip
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <strong>Explore</strong>
              <span>New places</span>
            </div>
            <div>
              <strong>Plan</strong>
              <span>Smarter trips</span>
            </div>
            <div>
              <strong>Enjoy</strong>
              <span>Every journey</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"
            alt="Beautiful travel destination"
          />
          <div className="image-note">
            <span>🌍</span>
            <div>
              <strong>Your next adventure</strong>
              <p>Starts right here</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section destinations-section" id="destinations">
        <div className="section-heading">
          <span className="eyebrow">FIND YOUR NEXT ADVENTURE</span>
          <h2>Popular Destinations</h2>
          <p>Discover places worth travelling to.</p>
        </div>

        <input
          className="destination-search"
          type="text"
          placeholder="Search destinations, countries or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="destination-grid">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((place) => (
              <article className="destination-card" key={place.name}>
                <img src={place.image} alt={place.name} />

                <div className="destination-info">
                  <span className="category">{place.category}</span>
                  <h3>{place.name}, {place.country}</h3>
                  <p>{place.description}</p>

                  <div className="destination-bottom">
                    <span>
                      From <strong>₹{place.price.toLocaleString("en-IN")}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setTripDestination(place.name);
                        document.getElementById("planner").scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      Plan Trip →
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="no-results">No destinations found. Try another search.</p>
          )}
        </div>
      </section>

      {/* Trip Planner */}
      <section className="section planner-section" id="planner">
        <div className="section-heading">
          <span className="eyebrow">START YOUR JOURNEY</span>
          <h2>Plan Your Next Trip</h2>
          <p>Enter a few details to start organising your journey.</p>
        </div>

        <form className="planner-form" onSubmit={createTrip}>
          <div className="form-field">
            <label>Destination</label>
            <input
              type="text"
              value={tripDestination}
              onChange={(e) => setTripDestination(e.target.value)}
              placeholder="Where do you want to go?"
            />
          </div>

          <div className="form-field">
            <label>Travel Date</label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-field">
            <label>Number of Travellers</label>
            <input
              type="number"
              min="1"
              max="50"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-button">
            Create Trip →
          </button>
        </form>

        {tripMessage && <p className="trip-message">{tripMessage}</p>}
      </section>

      {/* Budget Calculator */}
      <section className="section budget-section" id="budget">
        <div className="section-heading">
          <span className="eyebrow">TRAVEL WITHOUT WORRIES</span>
          <h2>Travel Budget Calculator</h2>
          <p>Keep track of your estimated travel expenses.</p>
        </div>

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

      {/* Weather */}
      <section className="section weather-section" id="weather">
        <div className="section-heading">
          <span className="eyebrow">CHECK BEFORE YOU GO</span>
          <h2>Destination Weather</h2>
          <p>Check current weather conditions for your destination.</p>
        </div>

        <div className="weather-search">
          <input
            type="text"
            value={weatherCity}
            onChange={(e) => setWeatherCity(e.target.value)}
            placeholder="Enter city name"
          />

          <button
            type="button"
            className="primary-button"
            onClick={getWeather}
            disabled={loadingWeather}
          >
            {loadingWeather ? "Checking..." : "Check Weather"}
          </button>
        </div>

        {weatherError && <p className="weather-error">{weatherError}</p>}

        {weather && (
          <div className="weather-card">
            <h3>{weather.city}, {weather.country}</h3>
            <h2>🌤️ {weather.temperature}°C</h2>
            <p>Feels like: {weather.feelsLike}°C</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind Speed: {weather.wind} km/h</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="#home" className="logo">
          ✈ TravelMate
        </a>
        <p>Your Journey, Intelligently Planned.</p>
        <p>© {new Date().getFullYear()} TravelMate. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default App;
