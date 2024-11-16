import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { saveBudget, getBudget } from "../utils/storage";
import Colors from "../constants/Colors";

export default function Settings({ navigation }) {
  const [budget, setBudget] = useState("");

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    const currentBudget = await getBudget();
    setBudget(currentBudget.toString());
  };

  const handleSave = async () => {
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      Alert.alert("Invalid Budget", "Please enter a valid budget amount");
      return;
    }

    const success = await saveBudget(budgetNum);
    if (success) {
      Alert.alert("Success", "Budget updated successfully");
      navigation.goBack();
    } else {
      Alert.alert("Error", "Failed to save budget");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Budget Settings</Text>

      <Text style={styles.label}>Set Monthly Budget</Text>
      <TextInput
        style={styles.input}
        value={budget}
        onChangeText={setBudget}
        keyboardType="decimal-pad"
        placeholder="Enter monthly budget"
        placeholderTextColor={Colors.textSecondary}
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Budget</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 30,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.overlay20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
