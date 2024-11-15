import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View } from "react-native";
import Dashboard from "./screens/Dashboard";
import History from "./screens/History";
import AddExpense from "./screens/AddExpense";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Drawer.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#A8E890",
          },
          headerTitleStyle: {
            color: "#fff",
          },
          headerTintColor: "#fff",
          drawerStyle: {
            backgroundColor: "#A8E890",
          },
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#557C55",
          sceneContainerStyle: {
            backgroundColor: "#A8E890",
          },
        }}
      >
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="History" component={History} />
        <Drawer.Screen name="AddExpense" component={AddExpense} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
