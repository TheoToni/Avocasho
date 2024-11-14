import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function History() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History Screen</Text>
      <Text style={styles.text}>Your history content goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    backgroundColor: "#A8E890",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
});