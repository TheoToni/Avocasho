import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function WeeklySpendingChart() {
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [50, 120, 85, 70, 200, 150, 95],
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      },
    ],
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Weekly Spending</Text>
      <LineChart
        data={lineData}
        width={Dimensions.get("window").width - 32}
        height={220}
        chartConfig={{
          backgroundColor: "#A8E890",
          backgroundGradientFrom: "#A8E890",
          backgroundGradientTo: "#A8E890",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#A8E890",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

const styles = {
  section: {
    marginBottom: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
};
