import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEY = "expenses";

export const saveExpense = async (expense) => {
  try {
    const expenses = await AsyncStorage.getItem(STORAGE_KEY);
    const existingExpenses = expenses ? JSON.parse(expenses) : [];

    const newExpense = {
      id: expense.id || Date.now().toString(),
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      date: expense.date || new Date().toISOString(),
    };

    existingExpenses.push(newExpense);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingExpenses));
    return newExpense;
  } catch (error) {
    console.error("Error saving expense:", error);
    throw error;
  }
};

export const getExpenses = async () => {
  try {
    const expenses = await AsyncStorage.getItem(STORAGE_KEY);
    return expenses ? JSON.parse(expenses) : [];
  } catch (error) {
    console.error("Error getting expenses:", error);
    return [];
  }
};

export const clearExpenses = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing expenses:", error);
  }
};
