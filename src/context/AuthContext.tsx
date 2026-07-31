import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  biometricLogin: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const userData = await SecureStore.getItemAsync('rafeeq_user');
      if (userData) setUser(JSON.parse(userData));
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    // Mock auth - in production calls FastAPI backend
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'admin',
        token: 'mock_jwt_token_' + Date.now()
      };
      await SecureStore.setItemAsync('rafeeq_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    }
    return false;
  }

  async function register(name: string, email: string, password: string): Promise<boolean> {
    if (name && email && password.length >= 6) {
      return login(email, password);
    }
    return false;
  }

  async function logout() {
    await SecureStore.deleteItemAsync('rafeeq_user');
    setUser(null);
  }

  async function biometricLogin(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return false;
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) return false;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'تحقق هويتك للدخول إلى رفيق',
      fallbackLabel: 'استخدم كلمة المرور'
    });
    if (result.success) {
      const userData = await SecureStore.getItemAsync('rafeeq_user');
      if (userData) {
        setUser(JSON.parse(userData));
        return true;
      }
    }
    return false;
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      biometricLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
