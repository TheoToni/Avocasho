import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEY = "expenses";

export const BUDGET_KEY = "@budget";

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

export const saveBudget = async (amount) => {
  try {
    await AsyncStorage.setItem(BUDGET_KEY, amount.toString());
    return true;
  } catch (error) {
    console.error("Error saving budget:", error);
    return false;
  }
};

export const getBudget = async () => {
  try {
    const budget = await AsyncStorage.getItem(BUDGET_KEY);
    return budget ? parseFloat(budget) : 3000; // Default budget is 3000
  } catch (error) {
    console.error("Error getting budget:", error);
    return 3000; // Return default if error
  }
};

export const deleteExpense = async (id) => {
  try {
    const expenses = await getExpenses();
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));
    return true;
  } catch (error) {
    console.error("Error deleting expense:", error);
    return false;
  }
};
