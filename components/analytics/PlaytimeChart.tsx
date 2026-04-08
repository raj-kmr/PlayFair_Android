import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

type ChartDataPoint = {
  day?: string;
  week?: string;
  minutes: number;
}

interface Props {
  data: ChartDataPoint[];
}

// Reusable chart component
export default function PlaytimeChart({ data }: Props) {
  const safeData = data.filter(
    (d) =>
      d &&
      typeof d.minutes === "number" &&
      !isNaN(d.minutes) &&
      isFinite(d.minutes),
  );

  const labels = safeData.map((d) => d.day?.slice(5, 10) || "X");
  const values = safeData.map((d) => d.minutes);

  if (values.length === 0) {
    return null;
  }
  return (
    <LineChart
      data={{
        labels,
        datasets: [{ data: values }],
      }}
      width={screenWidth - 20}
      height={220}
      yAxisSuffix="m"
      chartConfig={{
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: () => "#00ff99",
        labelColor: () => "#1e1e1e",
      }}
      style={{
        borderRadius: 10,
      }}
    ></LineChart>
  );
}
