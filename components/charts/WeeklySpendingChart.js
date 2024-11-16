import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getExpenses } from "../../utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../../constants/Colors";

export default function WeeklySpendingChart() {
  const [weeklyData, setWeeklyData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  });

  useFocusEffect(
    React.useCallback(() => {
      loadWeeklyData();
    }, [])
  );

  const loadWeeklyData = async () => {
    const expenses = await getExpenses();

    // Get dates for current week (Monday to Sunday)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    monday.setHours(0, 0, 0, 0);

    // Initialize daily totals
    const dailyTotals = Array(7).fill(0);

    // Calculate total for each day
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      // Only include expenses from current week
      if (expenseDate >= monday && expenseDate <= today) {
        const dayIndex = expenseDate.getDay();
        // Convert Sunday (0) to index 6, and Monday (1) to index 0
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        dailyTotals[adjustedIndex] += expense.amount;
      }
    });

    setWeeklyData({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: dailyTotals,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        },
      ],
    });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Weekly Spending</Text>
      {weeklyData.datasets[0].data.some((value) => value > 0) ? (
        <LineChart
          data={weeklyData}
          width={Dimensions.get("window").width - 32}
          height={220}
          chartConfig={{
            backgroundColor: Colors.primary,
            backgroundGradientFrom: Colors.primary,
            backgroundGradientTo: Colors.primary,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: Colors.primary,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No expenses this week</Text>
        </View>
      )}
    </View>
  );
}

const styles = {
  section: {
    marginBottom: 24,
    backgroundColor: Colors.overlay20,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: Colors.white,
    fontSize: 16,
    opacity: 0.8,
  },
};
