import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { getExpenses } from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import Colors from "../constants/Colors";

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState("date-desc"); // default sort

  const CATEGORIES = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Other",
  ];

  const SORT_OPTIONS = [
    { id: "date-desc", label: "Newest First" },
    { id: "date-asc", label: "Oldest First" },
    { id: "amount-desc", label: "Highest Amount" },
    { id: "amount-asc", label: "Lowest Amount" },
  ];

  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
    }, [])
  );

  const loadTransactions = async () => {
    const expenses = await getExpenses();
    const sorted = sortTransactions(expenses, sortBy);
    setTransactions(sorted);
    setFilteredTransactions(sorted);
  };

  const applyFilters = () => {
    let result = [...transactions];

    if (activeFilters.length > 0) {
      result = result.filter((transaction) =>
        activeFilters.includes(transaction.category)
      );
    }

    // Apply sorting
    result = sortTransactions(result, sortBy);

    setFilteredTransactions(result);
  };

  const sortTransactions = (items, sortType) => {
    return [...items].sort((a, b) => {
      switch (sortType) {
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    applyFilters();
  }, [activeFilters, sortBy, transactions]);

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

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter by Category</Text>
          <View style={styles.categoriesContainer}>
            {CATEGORIES.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryChip,
                  activeFilters.includes(category) && styles.categoryChipActive,
                ]}
                onPress={() => {
                  setActiveFilters((prev) =>
                    prev.includes(category)
                      ? prev.filter((c) => c !== category)
                      : [...prev, category]
                  );
                }}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    activeFilters.includes(category) &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.clearButton]}
              onPress={() => setActiveFilters([])}
            >
              <Text style={styles.modalButtonText}>Clear All</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.applyButton]}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.modalButtonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  const SortModal = () => (
    <Modal
      visible={showSortModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sort By</Text>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.sortOption,
                sortBy === option.id && styles.sortOptionActive,
              ]}
              onPress={() => {
                setSortBy(option.id);
                setShowSortModal(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === option.id && styles.sortOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Pressable
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <MaterialIcons name="filter-list" size={24} color={Colors.white} />
          <Text style={styles.filterText}>
            Filter {activeFilters.length > 0 && `(${activeFilters.length})`}
          </Text>
        </Pressable>
        <Pressable
          style={styles.filterButton}
          onPress={() => setShowSortModal(true)}
        >
          <MaterialIcons name="sort" size={24} color={Colors.white} />
          <Text style={styles.filterText}>Sort</Text>
        </Pressable>
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons
            name="receipt-long"
            size={48}
            color={Colors.textPrimary}
          />
          <Text style={[styles.emptyStateText, { color: Colors.textPrimary }]}>
            {transactions.length === 0
              ? "No expenses yet"
              : "No matching expenses"}
          </Text>
          <Text
            style={[styles.emptyStateSubtext, { color: Colors.textSecondary }]}
          >
            {transactions.length === 0
              ? "Add your first expense to start tracking"
              : "Try adjusting your filters"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal />
      <SortModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: Colors.background,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  filterText: {
    color: Colors.white,
    fontSize: 16,
  },
  listContainer: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cardRight: {
    marginLeft: 16,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyStateSubtext: {
    color: Colors.white,
    fontSize: 16,
    opacity: 0.8,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryChipText: {
    color: Colors.primary,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: Colors.overlay20,
  },
  applyButton: {
    backgroundColor: Colors.primary,
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  sortOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: Colors.background,
  },
  sortOptionActive: {
    backgroundColor: Colors.primary,
  },
  sortOptionText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  sortOptionTextActive: {
    color: Colors.white,
  },
});
