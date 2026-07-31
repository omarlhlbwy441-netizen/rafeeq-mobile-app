import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, createTheme } from '@rneui/themed';

import { AppProvider } from '@context/AppContext';
import { AuthProvider } from '@context/AuthContext';

// Screens
import ThankYouEgyptScreen from '@screens/ThankYouEgyptScreen';
import LoginScreen from '@screens/LoginScreen';
import DashboardScreen from '@screens/DashboardScreen';
import AppScreen from '@screens/AppScreen';
import SessionDashboardScreen from '@screens/SessionDashboardScreen';
import AgentsScreen from '@screens/AgentsScreen';
import AIEngineScreen from '@screens/AIEngineScreen';
import EvolutionScreen from '@screens/EvolutionScreen';
import GitHubScreen from '@screens/GitHubScreen';
import GamesScreen from '@screens/GamesScreen';
import VideoScreen from '@screens/VideoScreen';
import WebArchitectScreen from '@screens/WebArchitectScreen';
import DatabaseScreen from '@screens/DatabaseScreen';
import MigrationScreen from '@screens/MigrationScreen';
import MonitoringScreen from '@screens/MonitoringScreen';
import DevOpsScreen from '@screens/DevOpsScreen';
import TestsScreen from '@screens/TestsScreen';
import ScriptsScreen from '@screens/ScriptsScreen';
import HealthScreen from '@screens/HealthScreen';
import SettingsScreen from '@screens/SettingsScreen';
import TerminalScreen from '@screens/TerminalScreen';
import WebViewScreen from '@screens/WebViewScreen';

export type RootStackParamList = {
  ThankYou: undefined;
  Login: undefined;
  Main: undefined;
  WebView: { uri: string; title: string };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const theme = createTheme({
  darkColors: {
    primary: '#0ea5e9',
    secondary: '#8b5cf6',
    background: '#0a0a0f',
    card: '#111118',
    text: '#e2e8f0',
    border: '#1e293b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  mode: 'dark'
});

const screenOptions: StackNavigationOptions = { headerShown: false };
const drawerOptions: DrawerNavigationOptions = {
  drawerStyle: {
    backgroundColor: '#0a0a0f',
    width: 280
  },
  drawerActiveTintColor: '#0ea5e9',
  drawerInactiveTintColor: '#94a3b8',
  headerStyle: { backgroundColor: '#111118' },
  headerTintColor: '#e2e8f0'
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          switch (route.name) {
            case 'Dashboard': iconName = focused ? 'grid' : 'grid-outline'; break;
            case 'Agents': iconName = focused ? 'people' : 'people-outline'; break;
            case 'Terminal': iconName = focused ? 'terminal' : 'terminal-outline'; break;
            case 'App': iconName = focused ? 'apps' : 'apps-outline'; break;
            case 'Settings': iconName = focused ? 'settings' : 'settings-outline'; break;
            default: iconName = 'ellipse';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#111118',
          borderTopColor: '#1e293b',
          paddingBottom: 5,
          height: 60
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Agents" component={AgentsScreen} />
      <Tab.Screen name="Terminal" component={TerminalScreen} />
      <Tab.Screen name="App" component={AppScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={drawerOptions}>
      <Drawer.Screen name="Home" component={MainTabs} options={{ drawerIcon: ({color}: any) => <Ionicons name="home-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="AI Engine" component={AIEngineScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="hardware-chip-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Evolution" component={EvolutionScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="sync-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="GitHub Manager" component={GitHubScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="logo-github" size={22} color={color} /> }} />
      <Drawer.Screen name="Games" component={GamesScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="game-controller-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Video Architect" component={VideoScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="videocam-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Web Architect" component={WebArchitectScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="globe-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Database" component={DatabaseScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="server-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Migration" component={MigrationScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="arrow-forward-circle-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Monitoring" component={MonitoringScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="pulse-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="DevOps" component={DevOpsScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="cube-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Tests" component={TestsScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="checkmark-circle-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Scripts" component={ScriptsScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="code-slash-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Health" component={HealthScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="fitness-outline" size={22} color={color} /> }} />
      <Drawer.Screen name="Sessions" component={SessionDashboardScreen} options={{ drawerIcon: ({color}: any) => <Ionicons name="layers-outline" size={22} color={color} /> }} />
    </Drawer.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ThankYou" component={ThankYouEgyptScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="WebView" component={WebViewScreen} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsReady(true), 1500);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <AppProvider>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="light" />
            </NavigationContainer>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
