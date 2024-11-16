import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import WeeklySpendingChart from "../components/charts/WeeklySpendingChart";
import CategorySpendingChart from "../components/charts/CategorySpendingChart";
import { getExpenses, getBudget, deleteExpense } from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../constants/Colors";

export default function Dashboard({ navigation }) {
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(3000);
  const [budgetLeft, setBudgetLeft] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    const expenses = await getExpenses();
    const currentBudget = await getBudget();
    setMonthlyBudget(currentBudget);

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
    setBudgetLeft(currentBudget - monthlyTotal);
    setRecentTransactions(expenses.slice(0, 5)); // Get 5 most recent transactions
  };

  const handleDeleteTransaction = (transaction) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteExpense(transaction.id);
            if (success) {
              loadDashboardData(); // Refresh the data
            } else {
              Alert.alert("Error", "Failed to delete transaction");
            }
          },
        },
      ]
    );
  };

  const renderTransaction = (transaction) => (
    <TouchableOpacity
      key={transaction.id}
      style={styles.transaction}
      onLongPress={() => handleDeleteTransaction(transaction)}
      delayLongPress={500}
    >
      <MaterialIcons name="shopping-bag" size={24} color={Colors.textPrimary} />
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{transaction.description}</Text>
        <Text style={styles.transactionDate}>
          {new Date(transaction.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>
          -${transaction.amount.toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteTransaction(transaction)}
          style={styles.deleteButton}
        >
          <MaterialIcons
            name="delete-outline"
            size={24}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.amount}>${budgetLeft.toFixed(2)}</Text>
          <Text style={styles.period}>From ${monthlyBudget.toFixed(2)}</Text>
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
          recentTransactions.map(renderTransaction)
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
        <MaterialIcons name="add" size={24} color={Colors.primary} />
        <Text style={styles.addButtonText}>Add New Expense</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    width: "48%",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  amount: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  period: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    color: Colors.primary,
    fontSize: 16,
  },
  transactionDate: {
    color: Colors.primary,
    opacity: 0.8,
    fontSize: 12,
  },
  transactionAmount: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  noTransactions: {
    color: Colors.white,
    textAlign: "center",
    padding: 20,
    opacity: 0.8,
  },
  transactionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
  },
});
