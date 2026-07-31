import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  theme: 'dark' | 'light';
  language: 'ar' | 'en';
  notifications: boolean;
  biometric: boolean;
  backendUrl: string;
  isOnline: boolean;
  activeAgents: string[];
  logs: string[];
  metrics: any;
}

type Action =
  | { type: 'SET_THEME'; payload: 'dark' | 'light' }
  | { type: 'SET_LANGUAGE'; payload: 'ar' | 'en' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_BIOMETRIC' }
  | { type: 'SET_BACKEND_URL'; payload: string }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'ADD_LOG'; payload: string }
  | { type: 'SET_METRICS'; payload: any }
  | { type: 'ACTIVATE_AGENT'; payload: string }
  | { type: 'DEACTIVATE_AGENT'; payload: string };

const initialState: AppState = {
  theme: 'dark',
  language: 'ar',
  notifications: true,
  biometric: false,
  backendUrl: 'http://localhost:8000',
  isOnline: true,
  activeAgents: [],
  logs: [],
  metrics: {}
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_THEME': return { ...state, theme: action.payload };
    case 'SET_LANGUAGE': return { ...state, language: action.payload };
    case 'TOGGLE_NOTIFICATIONS': return { ...state, notifications: !state.notifications };
    case 'TOGGLE_BIOMETRIC': return { ...state, biometric: !state.biometric };
    case 'SET_BACKEND_URL': return { ...state, backendUrl: action.payload };
    case 'SET_ONLINE': return { ...state, isOnline: action.payload };
    case 'ADD_LOG': return { ...state, logs: [action.payload, ...state.logs].slice(0, 500) };
    case 'SET_METRICS': return { ...state, metrics: action.payload };
    case 'ACTIVATE_AGENT':
      return { ...state, activeAgents: [...state.activeAgents, action.payload] };
    case 'DEACTIVATE_AGENT':
      return { ...state, activeAgents: state.activeAgents.filter(a => a !== action.payload) };
    default: return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
