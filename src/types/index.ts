export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  status: 'active' | 'idle' | 'busy';
  color: string;
}

export interface EvolutionTask {
  id: string;
  type: 'code' | 'fix' | 'optimize' | 'create';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  updated_at: string;
}

export interface HealthStatus {
  status: string;
  db: { connected: boolean; latency: number };
  redis: { connected: boolean; latency: number };
  cpu: number;
  memory: number;
  uptime: number;
}

export interface MetricPoint {
  timestamp: number;
  value: number;
  label: string;
}

export interface ScriptAction {
  name: string;
  command: string;
  description: string;
  icon: string;
}

export interface DatabaseTable {
  name: string;
  rows: number;
  size: string;
  lastUpdated: string;
}

export interface GameProject {
  id: string;
  name: string;
  genre: string;
  engine: string;
  status: string;
  progress: number;
}

export interface VideoProject {
  id: string;
  title: string;
  duration: string;
  status: string;
  thumbnail: string;
}

export interface WebProject {
  id: string;
  domain: string;
  framework: string;
  status: string;
  ssl: boolean;
}
