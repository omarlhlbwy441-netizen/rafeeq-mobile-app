import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "https://rafeeq-api.onrender.com";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem("access_token");
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || `HTTP ${response.status}`);
    }

    return data;
  }

  // Auth
  async register(email: string, username: string, password: string, fullName?: string) {
    return this.request("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password, full_name: fullName }),
    });
  }

  async login(username: string, password: string) {
    const data = await this.request("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    await AsyncStorage.setItem("access_token", data.access_token);
    await AsyncStorage.setItem("refresh_token", data.refresh_token);
    return data;
  }

  async logout() {
    await this.request("/api/v1/auth/logout", { method: "POST" });
    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
  }

  async getMe() {
    return this.request("/api/v1/auth/me");
  }

  // Users
  async updateProfile(fullName?: string, avatarUrl?: string) {
    return this.request("/api/v1/users/me", {
      method: "PATCH",
      body: JSON.stringify({ full_name: fullName, avatar_url: avatarUrl }),
    });
  }

  // Stores
  async createStore(name: string, slug: string, description?: string) {
    return this.request("/api/v1/stores/", {
      method: "POST",
      body: JSON.stringify({ name, slug, description }),
    });
  }

  async listStores(skip = 0, limit = 20) {
    return this.request(`/api/v1/stores/?skip=${skip}&limit=${limit}`);
  }

  async myStores() {
    return this.request("/api/v1/stores/my");
  }

  async getStore(storeId: number) {
    return this.request(`/api/v1/stores/${storeId}`);
  }

  // Products
  async createProduct(storeId: number, name: string, price: number, stock = 0, description?: string) {
    return this.request(`/api/v1/products/?store_id=${storeId}`, {
      method: "POST",
      body: JSON.stringify({ name, price, stock, description }),
    });
  }

  async listProducts(storeId: number, skip = 0, limit = 50) {
    return this.request(`/api/v1/products/store/${storeId}?skip=${skip}&limit=${limit}`);
  }

  // Admin
  async adminDashboard() {
    return this.request("/api/v1/admin/dashboard");
  }

  async adminUsers(skip = 0, limit = 100) {
    return this.request(`/api/v1/admin/users?skip=${skip}&limit=${limit}`);
  }

  // Health
  async healthCheck() {
    return this.request("/health");
  }
}

export const api = new ApiClient(API_BASE);
export default api;
