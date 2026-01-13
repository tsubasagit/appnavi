/**
 * データソースタイプの定義
 * 将来の拡張（Firebase、Supabaseなど）を見据えた設計
 */

// データソースタイプの定義
export type DataSourceType = 
  | 'google-sheets'  // Googleスプレッドシート
  | 'excel'          // Excelファイル
  | 'csv'            // CSVファイル
  | 'postgresql'     // PostgreSQL（将来実装予定）
  | 'firebase'       // Firebase（将来実装予定）
  | 'supabase'       // Supabase（将来実装予定）

// データソースタイプのメタデータ
export interface DataSourceTypeMetadata {
  type: DataSourceType
  label: string
  description: string
  icon?: string
  available: boolean // 現在利用可能かどうか
}

// データソースタイプのメタデータ一覧
export const DATA_SOURCE_TYPES: Record<DataSourceType, DataSourceTypeMetadata> = {
  'google-sheets': {
    type: 'google-sheets',
    label: 'Googleスプレッドシート',
    description: 'Googleスプレッドシートをデータソースとして使用します',
    available: true,
  },
  'excel': {
    type: 'excel',
    label: 'Excelファイル',
    description: 'Excelファイルをアップロードして使用します',
    available: false, // 将来実装予定
  },
  'csv': {
    type: 'csv',
    label: 'CSVファイル',
    description: 'CSVファイルをアップロードして使用します',
    available: false, // 将来実装予定
  },
  'postgresql': {
    type: 'postgresql',
    label: 'PostgreSQL',
    description: 'PostgreSQLデータベースに接続します',
    available: false, // 将来実装予定
  },
  'firebase': {
    type: 'firebase',
    label: 'Firebase',
    description: 'Firebase Firestoreに接続します',
    available: false, // 将来実装予定
  },
  'supabase': {
    type: 'supabase',
    label: 'Supabase',
    description: 'Supabaseデータベースに接続します',
    available: false, // 将来実装予定
  },
}

// 利用可能なデータソースタイプのみを取得
export const getAvailableDataSourceTypes = (): DataSourceTypeMetadata[] => {
  return Object.values(DATA_SOURCE_TYPES).filter(metadata => metadata.available)
}

// データソースタイプのメタデータを取得
export const getDataSourceTypeMetadata = (type: DataSourceType): DataSourceTypeMetadata => {
  return DATA_SOURCE_TYPES[type]
}

// データソースタイプが利用可能かどうかを確認
export const isDataSourceTypeAvailable = (type: DataSourceType): boolean => {
  return DATA_SOURCE_TYPES[type]?.available ?? false
}
