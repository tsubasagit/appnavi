/**
 * Firestore データベース型定義
 * AppNavi Firestore データベース設計書に基づく
 */

import { Timestamp } from 'firebase/firestore'

// ============================================================================
// 1. ユーザー・組織管理 (Identity & IAM)
// ============================================================================

export interface FirestoreUser {
  email: string
  role: 'user' | 'vendor' | 'admin'
  displayName?: string
  avatar?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Organization {
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  ownerId: string
  memberIds: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================================================
// 2. アプリケーション定義 (Core Engine)
// ============================================================================

export interface App {
  title: string
  ownerId: string
  organizationId?: string
  templateId: string                     // 現在選択されているテンプレートID
  templateVersion?: string               // テンプレートバージョン（オプション、変更履歴用）
  theme: ThemeConfig
  deployedVersion?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor?: string
  fontFamily?: string
  borderRadius?: string
  darkMode?: boolean
}

export interface Page {
  layout: LayoutConfig
  components: ComponentConfig[]
  title: string
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface LayoutConfig {
  type: 'grid' | 'flex' | 'list'
  columns?: number
  rows?: number
  gap?: string
  // JSON形式で保存される柔軟なレイアウト情報
  [key: string]: any
}

export interface ComponentConfig {
  id: string
  type: string
  position: {
    x: number
    y: number
    width?: number
    height?: number
  }
  props: Record<string, any>
  dataSourceId?: string
}

export interface DataSource {
  type: 'google_sheet' | 'excel' | 'csv' | 'api'
  name: string
  config: DataSourceConfig
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface DataSourceConfig {
  // Google Sheets の場合
  spreadsheetId?: string
  sheetName?: string
  range?: string
  
  // Excel/CSV の場合
  fileUrl?: string
  
  // API の場合
  apiEndpoint?: string
  apiKey?: string
  headers?: Record<string, string>
}

export interface Deployment {
  environment: 'dev' | 'prod'
  version: string
  deployedAt: FirebaseFirestore.Timestamp
  deployedBy: string
  status: 'success' | 'failed' | 'pending'
  buildId?: string
  errorMessage?: string
}

// ============================================================================
// 3. マーケットプレイス・ベンダー資産 (B2B2B Assets)
// ============================================================================

export interface Plugin {
  vendorId: string
  name: string
  description: string
  category: string
  latestVersion: string
  assetUrl: string
  iconUrl?: string
  tags: string[]
  isPublic: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PluginVersion {
  version: string
  changelog: string
  dependencies: Record<string, string>
  assetUrl: string
  publishedAt: FirebaseFirestore.Timestamp
  publishedBy: string
}

export interface Template {
  // 基本情報
  templateId: string                    // テンプレートID（例: 'crm', 'inventory', 'daily-report'）
  name: string                          // テンプレート名（例: '顧客管理（CRM）'）
  description: string                   // 説明文
  category: string                      // カテゴリ（例: '営業・マーケティング', '業務管理'）
  
  // 表示用情報
  iconUrl?: string                      // アイコン画像URL（オプション）
  previewImageUrl?: string              // プレビュー画像URL（オプション）
  color: string                         // テーマカラー（例: '#8b5cf6'）
  
  // メタデータ
  vendorId?: string                     // ベンダーID（システム提供の場合は空）
  isPublic: boolean                     // 公開フラグ（true: 全ユーザーが利用可能）
  tags: string[]                        // タグ（検索・フィルタ用）
  
  // UI構成（テンプレート変更時に適用される）
  uiStructure: TemplateUIStructure      // UI構成定義
  
  // データ構造の推奨
  recommendedSchema?: RecommendedSchema  // 推奨データスキーマ（オプション）
  
  // 管理情報
  version: string                        // テンプレートバージョン（例: '1.0.0'）
  createdAt: Timestamp
  updatedAt: Timestamp
}

// UI構成定義（テンプレート変更時に適用される）
export interface TemplateUIStructure {
  // テーマ設定
  theme: {
    primaryColor: string                 // プライマリカラー（例: '#8b5cf6'）
    secondaryColor?: string              // セカンダリカラー（オプション）
    fontFamily?: string                  // フォントファミリー（オプション）
    borderRadius?: string                // 角丸（オプション）
    darkMode?: boolean                   // ダークモード対応（オプション）
  }
  
  // ページ構成
  pages: TemplatePage[]                  // デフォルトページ構成
  
  // ダッシュボード構成（オプション）
  dashboard?: {
    kpiCards?: KPICardConfig[]           // KPIカード設定
    charts?: ChartConfig[]               // グラフ設定
    layout?: 'grid' | 'list' | 'custom'  // レイアウトタイプ
  }
}

// テンプレートページ定義
export interface TemplatePage {
  id: string                             // ページID（例: 'dashboard', 'list', 'detail'）
  name: string                           // ページ名（例: 'ダッシュボード', '一覧', '詳細'）
  path: string                           // パス（例: '/', '/list', '/detail/:id'）
  layout: {
    type: 'grid' | 'flex' | 'list'       // レイアウトタイプ
    columns?: number                     // グリッド列数（gridの場合）
    gap?: string                         // 間隔
  }
  
  // コンポーネント構成
  components: TemplateComponent[]         // ページ内のコンポーネント
  
  // データソースマッピング
  dataSourceMapping?: {                  // データソースとのマッピング
    [componentId: string]: {
      dataSourceId?: string              // データソースID
      columnMapping?: Record<string, string>  // 列マッピング
    }
  }
  
  order: number                          // 表示順序
}

// テンプレートコンポーネント定義
export interface TemplateComponent {
  id: string                             // コンポーネントID（例: 'c_header_1', 'c_table_1'）
  type: TemplateComponentType            // コンポーネントタイプ
  
  // 位置・サイズ
  position: {
    x: number                            // X座標（グリッドの場合）
    y: number                            // Y座標（グリッドの場合）
    width?: number                       // 幅（グリッド列数）
    height?: number                      // 高さ（グリッド行数）
  }
  
  // プロパティ
  props: Record<string, any>             // コンポーネント固有のプロパティ
  
  // データソース関連
  dataSourceId?: string                  // 関連するデータソースID（オプション）
  dataMapping?: {                        // データマッピング（オプション）
    [key: string]: string                // プロパティ名 -> データ列名
  }
}

// テンプレートコンポーネントタイプ
export type TemplateComponentType = 
  | 'heading'                            // 見出し
  | 'text'                               // テキスト
  | 'table'                              // テーブル
  | 'form'                               // フォーム
  | 'chart'                              // グラフ
  | 'kpi_card'                           // KPIカード
  | 'button'                             // ボタン
  | 'filter'                             // フィルター
  | 'search'                             // 検索
  | 'calendar'                           // カレンダー
  | 'timeline'                           // タイムライン
  | 'card'                               // カード
  | 'list'                               // リスト

// 推奨データスキーマ
export interface RecommendedSchema {
  // 推奨カラム定義
  columns: RecommendedColumn[]           // 推奨カラム一覧
  
  // サンプルデータ（オプション）
  sampleData?: {
    headers: string[]                     // ヘッダー行
    rows: string[][]                     // データ行（最大10行程度）
  }
  
  // データ型の説明
  dataTypes?: Record<string, string>     // カラム名 -> データ型（例: 'string', 'number', 'date'）
}

// 推奨カラム定義
export interface RecommendedColumn {
  name: string                           // カラム名
  type: 'string' | 'number' | 'date' | 'boolean'  // データ型
  required: boolean                      // 必須フラグ
  description: string                    // 説明
  example?: string                       // 例（オプション）
}

// KPIカード設定
export interface KPICardConfig {
  id: string                             // KPIカードID
  label: string                          // ラベル（例: '総顧客数'）
  dataSource: string                     // データソース（例: 'count(customers)'）
  icon?: string                          // アイコン名（例: 'Users'）
  format?: 'number' | 'currency' | 'percentage'  // 表示形式
  color?: string                         // カラー（オプション）
}

// グラフ設定
export interface ChartConfig {
  id: string                             // グラフID
  type: 'bar' | 'line' | 'pie' | 'area'  // グラフタイプ
  title: string                          // タイトル
  dataSource: string                     // データソース
  xAxis?: string                         // X軸カラム名
  yAxis?: string                         // Y軸カラム名
  groupBy?: string                       // グループ化カラム（オプション）
}

// 後方互換性のため、既存のAppStructure型も保持
export interface AppStructure {
  app: Partial<App>
  pages: Partial<Page>[]
  dataSources: Partial<DataSource>[]
  theme: ThemeConfig
}

// ============================================================================
// 4. システム設定・その他
// ============================================================================

export interface SystemSettings {
  maintenanceMode: boolean
  maintenanceMessage?: string
  announcements: Announcement[]
  featureFlags: Record<string, boolean>
  updatedAt: FirebaseFirestore.Timestamp
}

export interface Announcement {
  id: string
  title: string
  content: string  // messageからcontentに変更（MyApps.tsxの形式に合わせる）
  type: 'info' | 'warning' | 'error' | 'success'
  date: Timestamp  // 公開日（表示用のdateフィールド）
  startDate?: Timestamp  // 開始日（オプション）
  endDate?: Timestamp  // 終了日（オプション）
  isActive: boolean  // アクティブフラグ
  isNew: boolean  // 新着フラグ（MyApps.tsxで使用）
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Feedback {
  userId?: string
  email?: string
  type: 'bug' | 'feature' | 'question' | 'other'
  subject: string
  message: string
  userAgent?: string
  url?: string
  createdAt: FirebaseFirestore.Timestamp
  status: 'new' | 'in-progress' | 'resolved' | 'closed'
}

// ============================================================================
// コレクション名の定数
// ============================================================================

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  APPS: 'apps',
  PAGES: 'pages',
  DATA_SOURCES: 'dataSources',
  DEPLOYMENTS: 'deployments',
  PLUGINS: 'plugins',
  PLUGIN_VERSIONS: 'versions',
  TEMPLATES: 'templates',
  SYSTEM_SETTINGS: 'system_settings',
  FEEDBACK: 'feedback',
  ANNOUNCEMENTS: 'announcements',
} as const

// ============================================================================
// サブコレクションのパスヘルパー
// ============================================================================

export const getSubCollectionPath = {
  pages: (appId: string) => `${FIRESTORE_COLLECTIONS.APPS}/${appId}/${FIRESTORE_COLLECTIONS.PAGES}`,
  dataSources: (appId: string) => `${FIRESTORE_COLLECTIONS.APPS}/${appId}/${FIRESTORE_COLLECTIONS.DATA_SOURCES}`,
  deployments: (appId: string) => `${FIRESTORE_COLLECTIONS.APPS}/${appId}/${FIRESTORE_COLLECTIONS.DEPLOYMENTS}`,
  pluginVersions: (pluginId: string) => `${FIRESTORE_COLLECTIONS.PLUGINS}/${pluginId}/${FIRESTORE_COLLECTIONS.PLUGIN_VERSIONS}`,
} as const

