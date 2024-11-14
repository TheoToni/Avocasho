import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Dashboard from "./screens/Dashboard";
import History from "./screens/History";
import LinearGradient from "./components/GradientBackground";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Drawer.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerTransparent: true,
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
            backgroundColor: "#7FB77E",
          },
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerBackground: () => (
              <LinearGradient
                colors={["#A8E890", "#7FB77E"]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="History"
          component={History}
          options={{
            headerBackground: () => (
              <LinearGradient
                colors={["#A8E890", "#7FB77E"]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
