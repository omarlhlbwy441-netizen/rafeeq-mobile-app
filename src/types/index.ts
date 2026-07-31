export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  role: "admin" | "merchant" | "user";
  is_active: boolean;
  is_verified: boolean;
  avatar_url: string | null;
  created_at: string;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  owner_id: number;
  is_active: boolean;
  commission_rate: number;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  store_id: number;
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface HealthStatus {
  status: string;
  version: string;
  environment: string;
  database: string;
  redis: string;
  timestamp: string;
}

export interface ApiError {
  detail: string;
}

export type Theme = "dark" | "light" | "system";

export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  theme: Theme;
}
