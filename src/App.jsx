import { useState } from "react";
import "./App.css";

const destinations = [
  {
    name: "Bali",
    country: "Indonesia",
    category: "Beach",
    price: 25000,
    description: "Tropical beaches, lush landscapes and peaceful escapes.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Mountain",
    price: 65000,
    description: "Beautiful mountain views and unforgettable alpine scenery.",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1000",
  },
  {
    name: "Paris",
    country: "France",
    category: "City",
    price: 55000,
    description: "Discover charming streets, cafes and iconic architecture.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000",
  },
  {
    name: "Maldives",
    country: "Maldives",
    category: "Beach",
    price: 45000,
    description: "Relax beside crystal-clear waters and white sandy beaches.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000",
  },
  {
    name: "Manali",
    country: "India",
    category: "Mountain",
    price: 12000,
    description: "Enjoy mountain views, pine forests and scenic valleys.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1000",
  },
  {
    name: "Tokyo",
    country: "Japan",
    category: "City",
    price: 70000,
    description: "Experience modern city life alongside traditional culture.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000",
  },
];

const itineraryDays = [
  {
    day: "DAY 01",
    title: "Arrival & Explore",
    activities: ["Arrive and check in", "Explore nearby attractions", "Try a local restaurant", "Enjoy a relaxed evening"],
  },
  {
    day: "DAY 02",
    title: "Discover Highlights",
    activities: ["Start with breakfast", "Visit popular attractions", "Explore local food spots", "Watch the sunset"],
  },
  {
    day: "DAY 03",
    title: "Culture & Departure",
    activities: ["Visit local markets", "Experience local culture", "Shop for souvenirs", "Prepare for departure"],
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [tripDestination, setTripDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [tripMessage, setTripMessage] = useState("");
  const [tripCreated, setTripCreated] = useState(false);

  const [hotelCost, setHotelCost] = useState("");
  const [foodCost, setFoodCost] = useState("");
  const [transportCost, setTransportCost] = useState("");
  const [otherCost, setOtherCost] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");

  const [weatherCity, setWeatherCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const totalBudget =
    Number(hotelCost || 0) +
    Number(foodCost || 0) +
    Number(transportCost || 0) +
    Number(otherCost || 0);

  const budgetPerPerson =
    Number(travelers) > 0 ? totalBudget / Number(travelers) : totalBudget;

  const filteredDestinations = destinations.filter((place) => {
    const searchable = `${place.name} ${place.country} ${place.category}`.toLowerCase();
    const matchesSearch = searchable.includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || place.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const createTrip = (event) => {
    event.preventDefault();

    if (!tripDestination.trim() || !travelDate || Number(travelers) < 1) {
      setTripMessage("Please enter a destination, travel date and valid number of travellers.");
      setTripCreated(false);
      return;
    }

    setTripMessage(
      `Your trip to ${tripDestination} for ${travelers} traveller(s) is planned for ${travelDate}.`
    );
    setTripCreated(true);
  };

  const getWeather = async () => {
    if (!weatherCity.trim()) {
      setWeatherError("Please enter a city name.");
      setWeather(null);
      return;
    }

    try {
      setLoadingWeather(true);
      setWeatherError("");
      setWeather(null);

      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(weatherCity)}&count=1`
      );
      if (!geoResponse.ok) throw new Error("Unable to find city.");

      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) {
        setWeatherError("City not found. Please try another city.");
        return;
      }

      const city = geoData.results[0];
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`
      );
      if (!weatherResponse.ok) throw new Error("Unable to get weather.");

      const weatherData = await weatherResponse.json();
      setWeather({
        city: city.name,
        country: city.country,
        temperature: weatherData.current.temperature_2m,
        feelsLike: weatherData.current.apparent_temperature,
        humidity: weatherData.current.relative_humidity_2m,
        wind: weatherData.current.wind_speed_10m,
      });
    } catch {
      setWeatherError("Weather could not be loaded. Please try again.");
    } finally {
      setLoadingWeather(false);
    }
  };

  const formatRupees = (amount) => `₹${Math.round(amount).toLocaleString("en-IN")}`;

  return (
    <main>
      <header className="navbar">
        <a href="#home" className="logo"><span className="logo-mark">✈</span> TravelMate</a>
        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#destinations">Destinations</a>
          <a href="#planner">Trip Planner</a>
          <a href="#budget">Budget</a>
          <a href="#weather">Weather</a>
        </nav>
        <a href="#planner" className="nav-button">Plan a Trip <span>↗</span></a>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <span className="hero-tag"><span className="tag-dot" /> YOUR SMART TRAVEL COMPANION</span>
          <h1>Make every journey <span>extraordinary.</span></h1>
          <p>Find inspiring places, organise your plans and keep your travel budget in check — all in one place.</p>
          <div className="hero-buttons">
            <a href="#destinations" className="primary-button">Explore destinations <span>→</span></a>
            <a href="#planner" className="secondary-button">Plan my trip</a>
          </div>
          <div className="hero-trust">
            <div className="avatar-stack"><span>✦</span><span>✈</span><span>◎</span></div>
            <p><strong>Your next adventure starts here.</strong><br />Plan smarter. Travel happier.</p>
          </div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400" alt="Suitcase and travel essentials ready for a journey" />
          <div className="floating-card floating-card-top"><span className="floating-icon">✦</span><div><strong>Travel made simple</strong><small>Everything in one place</small></div></div>
          <div className="floating-card floating-card-bottom"><span className="location-icon">⌖</span><div><small>YOUR NEXT STOP</small><strong>Somewhere beautiful</strong></div></div>
        </div>
      </section>

      <section className="quick-strip" aria-label="TravelMate features">
        <div><span>✧</span><strong>Discover</strong><small>Find places to love</small></div>
        <div><span>⌁</span><strong>Organise</strong><small>Keep plans together</small></div>
        <div><span>₹</span><strong>Budget</strong><small>Track your expenses</small></div>
        <div><span>☼</span><strong>Explore</strong><small>Check destination weather</small></div>
      </section>

      <section className="section destinations-section" id="destinations">
        <div className="section-heading section-heading-row">
          <div><span className="eyebrow">A LITTLE INSPIRATION</span><h2>Find your <span>happy place.</span></h2><p>Explore destinations for your next memorable escape.</p></div>
          <span className="section-count">06 DESTINATIONS</span>
        </div>
        <div className="destination-tools">
          <div className="search-wrap"><span>⌕</span><input className="destination-search" type="search" placeholder="Search places, countries..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="category-filters">
            {["All", "Beach", "Mountain", "City"].map((category) => (
              <button key={category} type="button" className={`filter-button ${activeCategory === category ? "active" : ""}`} onClick={() => setActiveCategory(category)}>{category}</button>
            ))}
          </div>
        </div>
        <div className="destination-grid">
          {filteredDestinations.length > 0 ? filteredDestinations.map((place) => (
            <article className="destination-card" key={place.name}>
              <div className="destination-image-wrap"><img src={place.image} alt={`${place.name}, ${place.country}`} /><span className="category">{place.category}</span></div>
              <div className="destination-info">
                <h3>{place.name}, {place.country}</h3><p>{place.description}</p>
                <div className="destination-bottom"><span className="price-label">Starting from <strong>{formatRupees(place.price)}</strong></span><button type="button" onClick={() => { setTripDestination(place.name); document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" }); }}>Plan trip <span>↗</span></button></div>
              </div>
            </article>
          )) : <p className="no-results">No destinations found. Try another search or category.</p>}
        </div>
      </section>

      <section className="section planner-section" id="planner">
        <div className="section-heading"><span className="eyebrow">LET'S GET YOU THERE</span><h2>Your trip, <span>your way.</span></h2><p>Share a few details and start putting your journey together.</p></div>
        <form className="planner-form" onSubmit={createTrip}>
          <div className="form-field"><label htmlFor="trip-destination">Where to?</label><input id="trip-destination" type="text" value={tripDestination} onChange={(e) => setTripDestination(e.target.value)} placeholder="Enter a destination" /></div>
          <div className="form-field"><label htmlFor="travel-date">When are you going?</label><input id="travel-date" type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} min={new Date().toISOString().split("T")[0]} /></div>
          <div className="form-field"><label htmlFor="travellers">Travellers</label><input id="travellers" type="number" min="1" max="50" value={travelers} onChange={(e) => setTravelers(e.target.value)} /></div>
          <button type="submit" className="primary-button planner-submit">Create my trip <span>→</span></button>
        </form>
        {tripMessage && <div className={`trip-message ${tripCreated ? "success" : "error"}`}>{tripCreated ? "✓ " : "!"} {tripMessage}</div>}
        {tripCreated && <div className="itinerary-panel">
          <div className="itinerary-heading"><div><span className="eyebrow">A STARTING POINT FOR YOUR ADVENTURE</span><h3>Your 3-day itinerary for {tripDestination}</h3><p>A flexible sample plan. Adjust activities to your interests and local conditions.</p></div><span className="itinerary-badge">SAMPLE PLAN</span></div>
          <div className="itinerary-grid">
            {itineraryDays.map((day) => <article className="itinerary-card" key={day.day}><span className="itinerary-day">{day.day}</span><h4>{day.title}</h4><ul>{day.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul></article>)}
          </div>
        </div>}
      </section>

      <section className="section budget-section" id="budget">
        <div className="section-heading"><span className="eyebrow">SPEND SMART, TRAVEL FAR</span><h2>Know your <span>travel budget.</span></h2><p>Add your estimated expenses and see the total update instantly.</p></div>
        <div className="budget-layout">
          <div className="budget-grid">
            <div className="budget-input"><label htmlFor="hotel-cost"><span>⌂</span> Accommodation</label><div className="currency-input"><span>₹</span><input id="hotel-cost" type="number" min="0" value={hotelCost} onChange={(e) => setHotelCost(e.target.value)} placeholder="0" /></div></div>
            <div className="budget-input"><label htmlFor="food-cost"><span>♧</span> Food & drinks</label><div className="currency-input"><span>₹</span><input id="food-cost" type="number" min="0" value={foodCost} onChange={(e) => setFoodCost(e.target.value)} placeholder="0" /></div></div>
            <div className="budget-input"><label htmlFor="transport-cost"><span>⌁</span> Transport</label><div className="currency-input"><span>₹</span><input id="transport-cost" type="number" min="0" value={transportCost} onChange={(e) => setTransportCost(e.target.value)} placeholder="0" /></div></div>
            <div className="budget-input"><label htmlFor="other-cost"><span>✧</span> Activities & other</label><div className="currency-input"><span>₹</span><input id="other-cost" type="number" min="0" value={otherCost} onChange={(e) => setOtherCost(e.target.value)} placeholder="0" /></div></div>
            <div className="budget-input budget-limit-input"><label htmlFor="budget-limit">Your budget limit (optional)</label><div className="currency-input"><span>₹</span><input id="budget-limit" type="number" min="0" value={budgetLimit} onChange={(e) => setBudgetLimit(e.target.value)} placeholder="Set a limit" /></div></div>
          </div>
          <aside className="budget-total">
            <span className="budget-total-label">YOUR ESTIMATED TOTAL</span><strong className="budget-amount">{formatRupees(totalBudget)}</strong>
            <div className="budget-divider" />
            <div className="budget-stat"><span>Travellers</span><strong>{travelers || 1}</strong></div>
            <div className="budget-stat"><span>Estimated per person</span><strong>{formatRupees(budgetPerPerson)}</strong></div>
            {budgetLimit && Number(budgetLimit) > 0 && <div className={`budget-status ${totalBudget > Number(budgetLimit) ? "over" : "under"}`}>{totalBudget > Number(budgetLimit) ? "You are over your budget limit." : `You have ${formatRupees(Number(budgetLimit) - totalBudget)} left.`}</div>}
            <p>These are estimates based on the amounts you enter.</p>
          </aside>
        </div>
      </section>

      <section className="section weather-section" id="weather">
        <div className="section-heading"><span className="eyebrow">A LITTLE FORECAST CHECK</span><h2>What's the weather <span>like there?</span></h2><p>Check current conditions before you set off.</p></div>
        <div className="weather-panel">
          <div className="weather-search"><div className="search-wrap"><span>⌕</span><input type="text" value={weatherCity} onChange={(e) => setWeatherCity(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") getWeather(); }} placeholder="Enter a city, e.g. Jaipur" /></div><button type="button" className="primary-button" onClick={getWeather} disabled={loadingWeather}>{loadingWeather ? "Checking..." : "Check weather →"}</button></div>
          {weatherError && <p className="weather-error">{weatherError}</p>}
          {weather && <div className="weather-card"><div><span className="eyebrow">CURRENT WEATHER</span><h3>{weather.city}, {weather.country}</h3></div><strong className="weather-temperature">{weather.temperature}°C</strong><div className="weather-details"><span>Feels like <strong>{weather.feelsLike}°C</strong></span><span>Humidity <strong>{weather.humidity}%</strong></span><span>Wind <strong>{weather.wind} km/h</strong></span></div></div>}
          <p className="weather-note">Weather data provided by Open-Meteo. Forecast conditions can change.</p>
        </div>
      </section>

      <footer className="footer">
        <a href="#home" className="logo"><span className="logo-mark">✈</span> TravelMate</a>
        <p>Your Journey, Intelligently Planned.</p>
        <div className="footer-links"><a href="#destinations">Destinations</a><a href="#planner">Trip Planner</a><a href="#budget">Budget</a><a href="#weather">Weather</a></div>
        <small>© {new Date().getFullYear()} TravelMate. All rights reserved.</small>
      </footer>
    </main>
  );
}

export default App;
