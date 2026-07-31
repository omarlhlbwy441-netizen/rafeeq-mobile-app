import axios from 'axios';
import { Agent, EvolutionTask, GitHubRepo, HealthStatus, DatabaseTable, GameProject, VideoProject, WebProject } from '@types';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
  // Add auth token if available
  return config;
});

export const ApiService = {
  // Health
  getHealth: () => api.get<HealthStatus>('/health'),
  getDbHealth: () => api.get('/health/db'),
  getRedisHealth: () => api.get('/health/redis'),
  getMetrics: () => api.get('/health/metrics'),

  // Auth
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),

  // Agents
  getAgents: () => api.get<Agent[]>('/agents'),
  chatWithAgent: (id: string, message: string) => api.post(`/agents/${id}/chat`, { message }),

  // Evolution
  triggerEvolution: () => api.post('/evolution/trigger'),
  getEvolutionTasks: () => api.get<EvolutionTask[]>('/evolution/tasks'),

  // GitHub
  getGitHubStatus: () => api.get('/github/status'),
  getRepos: () => api.get<GitHubRepo[]>('/github/repos'),
  syncRepo: (name: string) => api.post(`/github/sync/${name}`),

  // Games
  getGames: () => api.get<GameProject[]>('/games'),
  createGame: (data: any) => api.post('/games', data),

  // Videos
  getVideos: () => api.get<VideoProject[]>('/videos'),
  createVideo: (data: any) => api.post('/videos', data),

  // Websites
  getWebsites: () => api.get<WebProject[]>('/websites'),
  createWebsite: (data: any) => api.post('/websites', data),

  // Database
  getTables: () => api.get<DatabaseTable[]>('/db/tables'),
  runQuery: (query: string) => api.post('/db/query', { query }),

  // Scripts
  runScript: (name: string) => api.post(`/scripts/run/${name}`),

  // WebSocket
  connectWebSocket: (url: string) => new WebSocket(url)
};

export default api;
