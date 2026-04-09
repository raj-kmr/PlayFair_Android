import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

type ChartDataPoint = {
  day?: string;
  week?: string;
  minutes: number;
};

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
  const values = safeData.map((d) => d.minutes > 0 ? d.minutes : 0.1);

  // console.log("Chart Values:", values);
  // console.log("Chart Labels:", labels);

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
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(0, 255, 153, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(30, 30, 30, ${opacity})`,
      }}
      style={{
        borderRadius: 10,
      }}
    ></LineChart>
  );
}
