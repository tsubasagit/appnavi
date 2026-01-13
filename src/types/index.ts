// データソースタイプのインポート
import type { DataSourceType } from './dataSource'

// アプリの型定義（v2.0: シングルパーパス方式）
export interface App {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  template: 'crm' | 'google-calendar-group' | 'daily-report' | 'auto-integration' | 'custom' | null; // 目的特化型テンプレート（後方互換性のため保持）
  templateId?: string; // 現在選択されているテンプレートID（優先的に使用）
  templateMetadata?: {
    schemaUrl?: string; // テンプレートのスキーマURL
    viewsUrl?: string; // テンプレートのビュー定義URL
    sampleDataUrl?: string; // テンプレートのサンプルデータURL
    version?: string; // テンプレートのバージョン
    updatedAt?: string; // テンプレートの更新日時
  };
  mission: string; // 「One App, One Mission」の目的
  dataSource: {
    type: DataSourceType; // データソースタイプ（将来の拡張に対応）
    url?: string;
    fileName?: string;
    sheetId?: string;
    // 将来的に追加される可能性のあるフィールド
    // firebaseProjectId?: string;
    // supabaseUrl?: string;
    // supabaseKey?: string;
    // postgresqlConnectionString?: string;
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
  type: DataSourceType; // データソースタイプ（将来の拡張に対応）
  url?: string;
  fileName?: string;
  lastSynced?: string;
}

export type UserRole = 'user' | 'vendor' | 'admin'

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole; // デフォルトは 'user'
}

// デザイン・構成画面の型定義
export type ComponentType = 'heading' | 'kpi_grid' | 'table' | 'chart' | 'grid' | 'search' | 'form' | 'kanban' | 'calendar' | 'list' | 'card' | 'stats' | 'action_bar'

export interface ComponentConfig {
  id: string;
  type: ComponentType;
  label?: string;
  visible?: boolean;
  props?: Record<string, any>;
  dataSource?: string; // データバインディング用
}

export interface Page {
  id: number | string;
  name: string;
  path: string;
  template?: string;
}

export interface PageConfig {
  [pageId: string]: ComponentConfig[];
}

export interface UIState {
  activePageId: number | string | null;
  selectedComponentId: string | null;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface DesignConfig {
  pages: PageConfig;
  theme: ThemeConfig;
}

// ベンダーモード関連の型定義
export type Environment = 'dev' | 'prod'

export interface EnvironmentConfig {
  mode: Environment;
  dataSource: {
    dev: string;
    prod: string;
  };
}

export interface CodeOverride {
  componentId: string;
  overrideType: 'props' | 'logic' | 'render';
  code: string;
  environment: Environment;
  createdAt: string;
  updatedAt: string;
}















