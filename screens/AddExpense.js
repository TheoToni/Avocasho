import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { saveExpense } from "../utils/storage";

export default function AddExpense({ navigation }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    if (!amount || !description || !category) {
      // Add your preferred validation/error message here
      return;
    }

    try {
      const newExpense = {
        amount: parseFloat(amount),
        description,
        category,
        date: new Date().toISOString(),
        id: Date.now().toString(),
      };

      await saveExpense(newExpense);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding expense:", error);
      // Add your preferred error handling here
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount ($)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="What did you spend on?"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g., Food, Transport, Shopping"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Add Expense</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#A8E890",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#A8E890",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
