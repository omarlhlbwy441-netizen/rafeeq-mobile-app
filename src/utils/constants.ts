export const COLORS = {
  primary: '#0ea5e9',
  secondary: '#8b5cf6',
  accent: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  background: '#0a0a0f',
  surface: '#111118',
  surfaceLight: '#1a1a24',
  border: '#1e293b',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDark: '#64748b'
};

export const AGENTS: Agent[] = [
  { id: 'wolf_alpha', name: 'WolfAlpha', role: 'System Architect', description: 'مهندس النظام الرئيسي', icon: 'hardware-chip', status: 'active', color: '#0ea5e9' },
  { id: 'code_wolf', name: 'CodeWolf', role: 'Developer', description: 'مطور الأكواد والبرمجيات', icon: 'code-slash', status: 'idle', color: '#10b981' },
  { id: 'design_wolf', name: 'DesignWolf', role: 'UI/UX Designer', description: 'مصمم الواجهات والتجربة', icon: 'color-palette', status: 'idle', color: '#8b5cf6' },
  { id: 'data_wolf', name: 'DataWolf', role: 'Data Scientist', description: 'عالم البيانات والتحليل', icon: 'bar-chart', status: 'idle', color: '#f59e0b' },
  { id: 'security_wolf', name: 'SecurityWolf', role: 'Security Expert', description: 'خبير الأمان والحماية', icon: 'shield-checkmark', status: 'active', color: '#ef4444' },
  { id: 'cloud_wolf', name: 'CloudWolf', role: 'DevOps Engineer', description: 'مهندس السحابة والبنية', icon: 'cloud', status: 'idle', color: '#06b6d4' },
  { id: 'test_wolf', name: 'TestWolf', role: 'QA Engineer', description: 'مهندس الجودة والاختبار', icon: 'checkmark-circle', status: 'idle', color: '#84cc16' },
  { id: 'doc_wolf', name: 'DocWolf', role: 'Technical Writer', description: 'كاتب التوثيق الفني', icon: 'document-text', status: 'idle', color: '#ec4899' },
  { id: 'game_wolf', name: 'GameWolf', role: 'Game Developer', description: 'مطور الألعاب', icon: 'game-controller', status: 'idle', color: '#f97316' },
  { id: 'media_wolf', name: 'MediaWolf', role: 'Media Producer', description: 'منتج الوسائط المتعددة', icon: 'film', status: 'idle', color: '#d946ef' }
];

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}
