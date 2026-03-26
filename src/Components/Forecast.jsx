export default function Forecast({ data }) {
  return (
    <div className="forecast">
      {data.map((item, i) => {
        const icon = item.weather[0].icon;

        return (
          <div key={i} className="forecast-card">
            <p>{item.dt_txt.split(" ")[0]}</p>
            <img src={`https://openweathermap.org/img/wn/${icon}.png`} />
            <p>{item.main.temp}°C</p>
          </div>
        );
      })}
    </div>
  );
}