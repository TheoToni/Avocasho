import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { getExpenses } from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";

export default function History() {
  const [transactions, setTransactions] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  const loadTransactions = async () => {
    const expenses = await getExpenses();
    setTransactions(
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  };

  const renderTransaction = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.transactionCard,
        pressed && styles.cardPressed,
      ]}
      onPress={() => {
        /* Handle transaction details view */
      }}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.amount}>$ {item.amount.toFixed(2)}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Filter/Sort Options */}
      <View style={styles.filterContainer}>
        <Pressable style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color="#fff" />
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
        <Pressable style={styles.filterButton}>
          <MaterialIcons name="sort" size={24} color="#fff" />
          <Text style={styles.filterText}>Sort</Text>
        </Pressable>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="receipt-long" size={48} color="#fff" />
          <Text style={styles.emptyStateText}>No expenses yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first expense to start tracking
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#A8E890",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  filterText: {
    color: "#fff",
    fontSize: 16,
  },
  listContainer: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardLeft: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
  cardRight: {
    marginLeft: 16,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyStateSubtext: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
    marginTop: 8,
  },
});
