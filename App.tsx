import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";
import { AppProvider } from "./src/context/AppContext";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import StoreScreen from "./src/screens/StoreScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ThankYouEgyptScreen from "./src/screens/ThankYouEgyptScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "#0a0a0f" },
              headerTintColor: "#fff",
              headerTitleStyle: { fontWeight: "700" },
              contentStyle: { backgroundColor: "#0a0a0f" },
            }}
          >
            <Stack.Screen
              name="ThankYouEgypt"
              component={ThankYouEgyptScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: "رفيق Dashboard" }}
            />
            <Stack.Screen
              name="Store"
              component={StoreScreen}
              options={{ title: "My Store" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: "Profile" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}
