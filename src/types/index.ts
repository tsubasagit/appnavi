// アプリの型定義（v2.0: シングルパーパス方式）
export interface App {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  template: 'inventory' | 'daily-report' | 'crm' | 'reservation' | 'custom' | 'document-management' | 'e-commerce' | 'asset-management' | 'logistics' | 'expense-management' | 'hr-management' | 'project-management' | 'quality-control' | 'sales-analysis' | 'budget-management' | 'performance-tracking' | null; // 目的特化型テンプレート
  mission: string; // 「One App, One Mission」の目的
  dataSource: {
    type: 'google-sheets' | 'excel' | 'csv' | 'postgresql';
    url?: string;
    fileName?: string;
    sheetId?: string;
  };
  status: 'published' | 'draft' | 'building'; // building: ビルド中
  buildProgress?: {
    strategy: boolean; // Step 1: Strategy完了
    design: boolean; // Step 2: Design完了
    data: boolean; // Step 3: Data完了
  };
  lastUpdated: string;
  views: number;
  createdAt: string;
  deployment?: {
    dockerGenerated: boolean;
    repositoryUrl?: string;
  };
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















