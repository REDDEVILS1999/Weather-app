import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import SearchBar from "./Components/SearchBar";
import WeatherCard from "./Components/WeatherCard";
import Forecast from "./Components/Forecast";
import ChartComp from "./Components/Chart";
import Loader from "./Components/Loader";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const processForecast = (list) => {
    const dailyMap = {};

    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      const hour = item.dt_txt.split(" ")[1];

      if (hour === "12:00:00" || hour === "15:00:00") {
        if (!dailyMap[date]) {
          dailyMap[date] = item;
        }
      }
    });

    return Object.values(dailyMap).slice(0, 5);
  };

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    try {
      setLoading(true);

      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      setWeather(weatherRes.data);
      setForecast(processForecast(forecastRes.data.list));

      setHistory((prev) => [cityName, ...prev.slice(0, 4)]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Error fetching data");
    }
  };

  const fetchByLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        setLoading(true);

        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        setWeather(weatherRes.data);
        setForecast(processForecast(forecastRes.data.list));

        setLoading(false);
      } catch {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchByLocation();
  }, []);

  const getBackground = () => {
    if (!weather) return "";

    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("cloud")) return "cloudy";
    if (condition.includes("rain")) return "rainy";
    if (condition.includes("clear")) return "clear";
    if (condition.includes("haze")) return "haze";

    return "";
  };

  return (
    <div className={`dashboard ${getBackground()}`}>
      <h1>Weather Dashboard</h1>

      <SearchBar onSearch={fetchWeather} />

      <div className="history">
        {history.map((item, i) => (
          <button key={i} onClick={() => fetchWeather(item)}>
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {weather && <WeatherCard data={weather} />}
          {forecast.length > 0 && <ChartComp forecast={forecast} />}
          {forecast.length > 0 && <Forecast data={forecast} />}
        </>
      )}
    </div>
  );
}

export default App;