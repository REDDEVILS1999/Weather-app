export default function WeatherCard({ data }) {
  const icon = data.weather[0].icon;

  return (
    <div className="card">
      <h2>{data.name}</h2>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
      <h1>{data.main.temp}°C</h1>
      <p>{data.weather[0].main}</p>
    </div>
  );
}