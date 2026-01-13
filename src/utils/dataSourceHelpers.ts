/**
 * データソース関連のヘルパー関数
 * 将来の拡張（Firebase、Supabaseなど）を見据えた設計
 */

import { DataSourceType, getDataSourceTypeMetadata, isDataSourceTypeAvailable } from '../types/dataSource'
import { App } from '../types'

/**
 * アプリのデータソースタイプを取得
 * デフォルトは 'google-sheets'
 */
export const getAppDataSourceType = (app: App | undefined): DataSourceType => {
  if (!app) {
    return 'google-sheets'
  }
  
  // データソースタイプが設定されている場合
  if (app.dataSource?.type) {
    // 利用可能なタイプかどうかを確認
    if (isDataSourceTypeAvailable(app.dataSource.type)) {
      return app.dataSource.type
    }
    // 利用不可の場合は、デフォルトにフォールバック
    console.warn(`データソースタイプ "${app.dataSource.type}" は現在利用できません。デフォルトの "google-sheets" を使用します。`)
    return 'google-sheets'
  }
  
  // デフォルトは 'google-sheets'
  return 'google-sheets'
}

/**
 * データソースタイプが設定されているかどうかを確認
 */
export const hasDataSourceType = (app: App | undefined): boolean => {
  return !!app?.dataSource?.type
}

/**
 * データソースタイプのラベルを取得
 */
export const getDataSourceTypeLabel = (type: DataSourceType): string => {
  return getDataSourceTypeMetadata(type).label
}

/**
 * データソースタイプの説明を取得
 */
export const getDataSourceTypeDescription = (type: DataSourceType): string => {
  return getDataSourceTypeMetadata(type).description
}

/**
 * データソースタイプに応じた接続が必要かどうかを確認
 * 例: Google Sheetsは認証が必要、CSVはファイルアップロードのみ
 */
export const requiresAuthentication = (type: DataSourceType): boolean => {
  switch (type) {
    case 'google-sheets':
    case 'firebase':
    case 'supabase':
    case 'postgresql':
      return true
    case 'excel':
    case 'csv':
      return false
    default:
      return false
  }
}

/**
 * データソースタイプに応じた接続方法を取得
 */
export const getConnectionMethod = (type: DataSourceType): 'oauth' | 'upload' | 'connection-string' | 'api-key' => {
  switch (type) {
    case 'google-sheets':
      return 'oauth'
    case 'firebase':
    case 'supabase':
      return 'api-key'
    case 'postgresql':
      return 'connection-string'
    case 'excel':
    case 'csv':
      return 'upload'
    default:
      return 'oauth'
  }
}
