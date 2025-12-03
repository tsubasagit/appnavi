// アプリの型定義
export interface App {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  dataSource: {
    type: 'google-sheets' | 'excel' | 'csv';
    url?: string;
    fileName?: string;
  };
  status: 'published' | 'draft';
  lastUpdated: string;
  views: number;
  createdAt: string;
}

export interface PolicyData {
  appName: string;
  description: string;
  currentIssue: string;
  solution: string;
  kpi: string;
}

export interface UIConfig {
  layoutType: 'list' | 'card' | 'calendar' | 'template' | 'ai';
  themeColor: string;
  visibleColumns: string[];
}

export interface DataSource {
  id: string;
  name: string;
  type: 'google-sheets' | 'excel' | 'csv';
  url?: string;
  fileName?: string;
  lastSynced?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

