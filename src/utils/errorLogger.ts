/**
 * エラーロガーユーティリティ
 * ログイン時のエラーをキャプチャしてlocalStorageに保存
 */

export interface ErrorLog {
  type: 'error' | 'warn' | 'unhandled' | 'unhandledRejection' | 'catch'
  message?: any
  args?: any[]
  filename?: string
  lineno?: number
  colno?: number
  error?: any
  reason?: any
  stack?: string
  code?: string
  timestamp: string
}

export interface LoginErrorRecord {
  timestamp: string
  errors: ErrorLog[]
  userEmail?: string
  error?: any
}

/**
 * ログイン時のエラーを取得
 */
export const getLoginErrors = (): LoginErrorRecord[] => {
  try {
    return JSON.parse(localStorage.getItem('loginErrors') || '[]')
  } catch {
    return []
  }
}

/**
 * グローバルエラーを取得
 */
export const getGlobalErrors = (): ErrorLog[] => {
  try {
    return JSON.parse(localStorage.getItem('globalErrors') || '[]')
  } catch {
    return []
  }
}

/**
 * すべてのエラーをクリア
 */
export const clearAllErrors = () => {
  localStorage.removeItem('loginErrors')
  localStorage.removeItem('globalErrors')
}

/**
 * エラーをコンソールに表示
 */
export const displayErrors = () => {
  const loginErrors = getLoginErrors()
  const globalErrors = getGlobalErrors()
  
  console.group('📋 記録されたエラー')
  
  if (loginErrors.length > 0) {
    console.group('🔐 ログイン時のエラー')
    loginErrors.forEach((record, index) => {
      console.group(`エラー記録 #${index + 1} (${record.timestamp})`)
      if (record.userEmail) {
        console.log('ユーザー:', record.userEmail)
      }
      record.errors.forEach((error, errorIndex) => {
        console.group(`エラー ${errorIndex + 1} (${error.type})`)
        console.log('タイムスタンプ:', error.timestamp)
        if (error.message) console.log('メッセージ:', error.message)
        if (error.code) console.log('コード:', error.code)
        if (error.stack) console.log('スタック:', error.stack)
        if (error.args) console.log('引数:', error.args)
        console.groupEnd()
      })
      if (record.error) {
        console.log('キャッチされたエラー:', record.error)
      }
      console.groupEnd()
    })
    console.groupEnd()
  }
  
  if (globalErrors.length > 0) {
    console.group('🌐 グローバルエラー')
    globalErrors.forEach((error, index) => {
      console.group(`エラー #${index + 1} (${error.type})`)
      console.log('タイムスタンプ:', error.timestamp)
      if (error.message) console.log('メッセージ:', error.message)
      if (error.filename) console.log('ファイル:', error.filename, `(${error.lineno}:${error.colno})`)
      if (error.stack) console.log('スタック:', error.stack)
      console.groupEnd()
    })
    console.groupEnd()
  }
  
  if (loginErrors.length === 0 && globalErrors.length === 0) {
    console.log('✅ エラーは記録されていません')
  }
  
  console.groupEnd()
  
  return { loginErrors, globalErrors }
}

// 開発環境では、コンソールで `window.displayErrors()` を呼び出せるようにする
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).displayErrors = displayErrors
  (window as any).getLoginErrors = getLoginErrors
  (window as any).getGlobalErrors = getGlobalErrors
  (window as any).clearAllErrors = clearAllErrors
}



