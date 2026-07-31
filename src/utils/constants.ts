export const APP_NAME = "رفيق";
export const APP_VERSION = "3.0.0";
export const APP_TAGLINE = "Your Intelligent AI Companion";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://rafeeq-api.onrender.com";

export const COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#0ea5e9",
  background: "#0a0a0f",
  surface: "#12121a",
  border: "#1e1e2e",
  text: "#ffffff",
  textMuted: "#888888",
} as const;

export const ROUTES = {
  THANK_YOU: "ThankYouEgypt",
  LOGIN: "Login",
  DASHBOARD: "Dashboard",
  STORE: "Store",
  PROFILE: "Profile",
  SETTINGS: "Settings",
  ADMIN: "Admin",
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  THEME: "app_theme",
  LANGUAGE: "app_language",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  MERCHANT: "merchant",
  USER: "user",
} as const;
