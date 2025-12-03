// デザインシステム - テーマ設定
export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb', // Primary Action
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      50: '#f0fdf4',
      600: '#16a34a',
    },
    danger: {
      50: '#fef2f2',
      500: '#ef4444',
    },
    ai: {
      100: '#f3e8ff',
      600: '#9333ea',
    },
  },
  layout: {
    sidebarWidth: '16rem', // w-64
    contentPadding: '1.5rem', // p-6
  },
} as const;

