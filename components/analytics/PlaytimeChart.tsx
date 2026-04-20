import { Dimensions, View, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth - 64; // Account for padding

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
  const values = safeData.map((d) => (d.minutes > 0 ? d.minutes : 0.1));

  if (values.length === 0 || safeData.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={chartWidth}
        height={220}
        yAxisSuffix="m"
        yAxisInterval={Math.max(...values) > 60 ? 60 : Math.max(...values, 30)}
        chartConfig={{
          backgroundColor: "#1e293b",
          backgroundGradientFrom: "#1e293b",
          backgroundGradientTo: "#0f172a",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(167, 139, 250, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
          propsForBackgroundLines: {
            stroke: "#334155",
            strokeWidth: 1,
            strokeDasharray: "4, 4",
          },
          propsForVerticalLines: {
            stroke: "#334155",
            strokeWidth: 1,
          },
          style: {
            borderRadius: 12,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  chart: {
    borderRadius: 12,
  },
});
