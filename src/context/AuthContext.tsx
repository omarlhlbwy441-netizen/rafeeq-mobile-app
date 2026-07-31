import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        const user = await api.getMe();
        setState({ user, isLoading: false, isAuthenticated: true });
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } catch {
      await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  };

  const login = async (username: string, password: string) => {
    await api.login(username, password);
    const user = await api.getMe();
    setState({ user, isLoading: false, isAuthenticated: true });
  };

  const register = async (email: string, username: string, password: string, fullName?: string) => {
    await api.register(email, username, password, fullName);
    await login(username, password);
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  };

  const refreshUser = async () => {
    const user = await api.getMe();
    setState(prev => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
