import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Reusable chart component
export default function PlaytimeChart({ data }: any) {
  const safeData = data.filter(
    (d: any) =>
      d &&
      typeof d.minutes === "number" &&
      !isNaN(d.minutes) &&
      isFinite(d.minutes),
  );

  const labels = safeData.map((d: any) => d.day?.slice(5) || "X");
  const values = safeData.map((d: any) => d.minutes);

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
