import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Pressable } from "react-native";
import Dashboard from "./screens/Dashboard";
import History from "./screens/History";
import AddExpense from "./screens/AddExpense";
import Settings from "./screens/Settings";
import Colors from "./constants/Colors";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Drawer.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#333",
          },
          headerTitleStyle: {
            color: "#fff",
          },
          headerTintColor: "#fff",
          drawerStyle: {
            backgroundColor: "#fff",
          },
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#557C55",
          drawerActiveBackgroundColor: "#333",
          drawerItemStyle: {
            borderRadius: 8,
          },
          sceneContainerStyle: {
            backgroundColor: "#A8E890",
          },
        }}
      >
        <Drawer.Screen name="Dashboard" component={Dashboard} />
        <Drawer.Screen name="History" component={History} />
        <Drawer.Screen name="AddExpense" component={AddExpense} />
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
