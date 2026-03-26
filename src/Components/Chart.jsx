import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function ChartComp({ forecast }) {
  const data = {
    labels: forecast.map((f) => f.dt_txt.split(" ")[0]),
    datasets: [
      {
        label: "Temperature",
        data: forecast.map((f) => f.main.temp),
        borderColor: "blue",
      },
    ],
  };

  return <Line data={data} />;
}