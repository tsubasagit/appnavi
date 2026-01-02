/**
 * スプレッドシートデータを管理するカスタムフック
 */
import { useState, useEffect, useCallback } from 'react'
import { readFromSheet, appendToSheet, updateSheetRow, deleteSheetRow, extractSpreadsheetId } from '../features/sheets/api'

export interface SheetDataRow {
  id: number // 行番号（1ベース、ヘッダー行は0）
  data: string[]
}

export interface UseSheetDataReturn {
  headers: string[]
  rows: SheetDataRow[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  createRow: (values: string[]) => Promise<void>
  updateRow: (rowIndex: number, values: string[]) => Promise<void>
  deleteRow: (rowIndex: number) => Promise<void>
}

export const useSheetData = (
  spreadsheetId: string | null,
  sheetName: string = 'Sheet1',
  range?: string
): UseSheetDataReturn => {
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<SheetDataRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!spreadsheetId) {
      setHeaders([])
      setRows([])
      setError(null)
      return
    }

    // Google OAuthトークンの存在をチェック
    const token = sessionStorage.getItem('googleAccessToken')
    if (!token) {
      setError('Googleアカウントでログインしてください。データタブでGoogle認証を行ってください。')
      setHeaders([])
      setRows([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // デフォルトでは最新のデータの10件分だけ取得（ヘッダー1行 + データ10行 = 合計11行）
      // 範囲が指定されていない場合は、A1:Z11を取得
      const dataRange = range || `${sheetName}!A1:Z11`
      const data = await readFromSheet(spreadsheetId, dataRange)
      
      if (data.length === 0) {
        setHeaders([])
        setRows([])
        return
      }

      // ヘッダー行を取得
      const headerRow = data[0] || []
      setHeaders(headerRow)

      // データ行を取得（行番号を付与）
      // 最新のデータの10件分だけ取得（最大10行）
      const dataRows: SheetDataRow[] = data.slice(1, 11).map((row, index) => ({
        id: index + 2, // ヘッダー行が1なので、データ行は2から始まる
        data: row
      }))
      setRows(dataRows)
    } catch (err: any) {
      setError(err.message || 'データの読み込みに失敗しました')
      setHeaders([])
      setRows([])
    } finally {
      setIsLoading(false)
    }
  }, [spreadsheetId, sheetName, range])

  useEffect(() => {
    loadData()
  }, [loadData])

  const createRow = useCallback(async (values: string[]) => {
    if (!spreadsheetId) {
      throw new Error('スプレッドシートIDが設定されていません')
    }

    try {
      setError(null)
      await appendToSheet(spreadsheetId, values)
      // データを再読み込み
      await loadData()
    } catch (err: any) {
      setError(err.message || 'データの作成に失敗しました')
      throw err
    }
  }, [spreadsheetId, loadData])

  const updateRow = useCallback(async (rowIndex: number, values: string[]) => {
    if (!spreadsheetId) {
      throw new Error('スプレッドシートIDが設定されていません')
    }

    try {
      setError(null)
      const range = `${sheetName}!A${rowIndex}:${String.fromCharCode(64 + values.length)}${rowIndex}`
      await updateSheetRow(spreadsheetId, range, values)
      // データを再読み込み
      await loadData()
    } catch (err: any) {
      setError(err.message || 'データの更新に失敗しました')
      throw err
    }
  }, [spreadsheetId, sheetName, loadData])

  const deleteRow = useCallback(async (rowIndex: number) => {
    if (!spreadsheetId) {
      throw new Error('スプレッドシートIDが設定されていません')
    }

    try {
      setError(null)
      await deleteSheetRow(spreadsheetId, sheetName, rowIndex)
      // データを再読み込み
      await loadData()
    } catch (err: any) {
      setError(err.message || 'データの削除に失敗しました')
      throw err
    }
  }, [spreadsheetId, sheetName, loadData])

  return {
    headers,
    rows,
    isLoading,
    error,
    refresh: loadData,
    createRow,
    updateRow,
    deleteRow
  }
}

