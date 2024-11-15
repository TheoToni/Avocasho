import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import WeeklySpendingChart from "../components/charts/WeeklySpendingChart";
import CategorySpendingChart from "../components/charts/CategorySpendingChart";
import { getExpenses } from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Dashboard({ navigation }) {
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    const expenses = await getExpenses();

    // Calculate total spent this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const monthlyTotal = thisMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    setTotalSpent(monthlyTotal);
    setRecentTransactions(expenses.slice(0, 5)); // Get 5 most recent transactions
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Spent</Text>
          <Text style={styles.amount}>${totalSpent.toFixed(2)}</Text>
          <Text style={styles.period}>This Month</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Budget Left</Text>
          <Text style={styles.amount}>$550.00</Text>
          <Text style={styles.period}>From $3,000</Text>
        </View>
      </View>

      {/* Charts */}
      <WeeklySpendingChart />
      {/* <CategorySpendingChart /> */}

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {recentTransactions.length === 0 ? (
          <Text style={styles.noTransactions}>No transactions yet</Text>
        ) : (
          recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transaction}>
              <MaterialIcons name="shopping-bag" size={24} color="#fff" />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>
                  {transaction.description}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.transactionAmount}>
                -${transaction.amount.toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Quick Add Button */}
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        onPress={() => navigation.navigate("AddExpense")}
      >
        <MaterialIcons name="add" size={24} color="#A8E890" />
        <Text style={styles.addButtonText}>Add New Expense</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A8E890",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 12,
    width: "48%",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
  amount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  period: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    color: "#fff",
    fontSize: 16,
  },
  transactionDate: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 12,
  },
  transactionAmount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: "#A8E890",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  noTransactions: {
    color: "#fff",
    textAlign: "center",
    padding: 20,
    opacity: 0.8,
  },
});
