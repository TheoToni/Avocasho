import React from "react";
import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

export default function CategorySpendingChart() {
  const pieData = [
    {
      name: "Food",
      expense: 850,
      color: "#FF7F50",
      legendFontColor: "#fff",
    },
    {
      name: "Transport",
      expense: 450,
      color: "#87CEEB",
      legendFontColor: "#fff",
    },
    {
      name: "Shopping",
      expense: 650,
      color: "#98FB98",
      legendFontColor: "#fff",
    },
    {
      name: "Bills",
      expense: 500,
      color: "#DDA0DD",
      legendFontColor: "#fff",
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Spending by Category</Text>
      <PieChart
        data={pieData}
        width={Dimensions.get("window").width - 32}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        accessor="expense"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
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
