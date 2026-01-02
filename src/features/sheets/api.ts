/**
 * Google Sheets API連携ロジック
 * フロントエンドから直接Google APIを叩く関数を実装
 */

/**
 * スプレッドシートIDをURLから抽出する
 * @param input スプレッドシートのURLまたはID
 * @returns スプレッドシートID
 */
export const extractSpreadsheetId = (input: string): string => {
  // URL形式の場合: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
  const urlMatch = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (urlMatch) {
    return urlMatch[1]
  }
  // ID形式の場合: そのまま返す
  return input.trim()
}

/**
 * スプレッドシートの末尾行にデータを追加する
 * @param spreadsheetId スプレッドシートID
 * @param values 追加するデータ（文字列配列）
 * @returns APIレスポンス
 */
export const appendToSheet = async (spreadsheetId: string, values: string[]): Promise<any> => {
  const token = sessionStorage.getItem('googleAccessToken')
  if (!token) {
    throw new Error('認証トークンが見つかりません。Googleアカウントでログインしてください。')
  }

  // スプレッドシートIDを抽出（URL形式の場合に対応）
  const extractedId = extractSpreadsheetId(spreadsheetId)
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${extractedId}/values/A1:append?valueInputOption=USER_ENTERED`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [values] // 2次元配列 [ ["列1", "列2", "列3"] ]
    })
  })

  if (!response.ok) {
    const error = await response.json()
    const errorMessage = error.error?.message || 'スプレッドシートへの書き込みに失敗しました'
    
    // 認証エラーの場合（401 Unauthorized）
    if (response.status === 401 || errorMessage.includes('invalid authentication credentials') || errorMessage.includes('OAuth 2 access token')) {
      // トークンをクリア
      sessionStorage.removeItem('googleAccessToken')
      throw new Error('認証トークンが無効です。再度Googleアカウントでログインしてください。')
    }
    
    // Google Sheets APIが有効化されていない場合のエラーハンドリング
    if (errorMessage.includes('Google Sheets API has not been used') || 
        errorMessage.includes('API has not been used') ||
        errorMessage.includes('it is disabled')) {
      const projectId = errorMessage.match(/project (\d+)/)?.[1] || '917670325982'
      const enableUrl = `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectId}`
      throw new Error(`Google Sheets APIが有効化されていません。\n\n以下の手順で有効化してください:\n1. 以下のリンクを開いてGoogle Sheets APIを有効化してください:\n${enableUrl}\n\n2. 有効化後、数分待ってから再度お試しください。`)
    }
    
    throw new Error(errorMessage)
  }
  
  return await response.json()
}

/**
 * スプレッドシートからデータを読み取る
 * @param spreadsheetId スプレッドシートID
 * @param range 読み取る範囲（例: "Sheet1!A1:D10"）
 * @returns データ配列
 */
export const readFromSheet = async (spreadsheetId: string, range: string = 'Sheet1!A1:Z1000'): Promise<string[][]> => {
  const token = sessionStorage.getItem('googleAccessToken')
  if (!token) {
    throw new Error('認証トークンが見つかりません。Googleアカウントでログインしてください。')
  }

  // スプレッドシートIDを抽出（URL形式の場合に対応）
  const extractedId = extractSpreadsheetId(spreadsheetId)
  
  // rangeパラメータをURLエンコード（特殊文字やクエリパラメータを除去）
  // rangeからクエリパラメータ（?以降）を除去
  const cleanRange = range.split('?')[0].split('&')[0]
  const encodedRange = encodeURIComponent(cleanRange)
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${extractedId}/values/${encodedRange}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })

  if (!response.ok) {
    const error = await response.json()
    const errorMessage = error.error?.message || 'スプレッドシートからの読み取りに失敗しました'
    
    // 認証エラーの場合（401 Unauthorized）
    if (response.status === 401 || errorMessage.includes('invalid authentication credentials') || errorMessage.includes('OAuth 2 access token')) {
      // トークンをクリア
      sessionStorage.removeItem('googleAccessToken')
      throw new Error('認証トークンが無効です。再度Googleアカウントでログインしてください。')
    }
    
    // Google Sheets APIが有効化されていない場合のエラーハンドリング
    if (errorMessage.includes('Google Sheets API has not been used') || 
        errorMessage.includes('API has not been used') ||
        errorMessage.includes('it is disabled')) {
      const projectId = errorMessage.match(/project (\d+)/)?.[1] || '917670325982'
      const enableUrl = `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectId}`
      throw new Error(`Google Sheets APIが有効化されていません。\n\n以下の手順で有効化してください:\n1. 以下のリンクを開いてGoogle Sheets APIを有効化してください:\n${enableUrl}\n\n2. 有効化後、数分待ってから再度お試しください。`)
    }
    
    throw new Error(errorMessage)
  }
  
  const data = await response.json()
  return data.values || []
}

/**
 * 新しいスプレッドシートを作成する
 * @param title スプレッドシートのタイトル
 * @param sampleData サンプルデータ（ヘッダー行 + データ行）
 * @returns 作成されたスプレッドシートのIDとURL
 */
export const createSpreadsheet = async (title: string, sampleData: string[][]): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const token = sessionStorage.getItem('googleAccessToken')
  if (!token) {
    throw new Error('認証トークンが見つかりません。Googleアカウントでログインしてください。')
  }

  // スプレッドシートを作成
  const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets'
  
  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
      sheets: [{
        properties: {
          title: 'Sheet1',
        }
      }]
    })
  })

  if (!createResponse.ok) {
    const error = await createResponse.json()
    const errorMessage = error.error?.message || 'スプレッドシートの作成に失敗しました'
    
    // Google Sheets APIが有効化されていない場合のエラーハンドリング
    if (errorMessage.includes('Google Sheets API has not been used') || 
        errorMessage.includes('API has not been used') ||
        errorMessage.includes('it is disabled')) {
      const projectId = errorMessage.match(/project (\d+)/)?.[1] || '917670325982'
      const enableUrl = `https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=${projectId}`
      throw new Error(`Google Sheets APIが有効化されていません。\n\n以下の手順で有効化してください:\n1. 以下のリンクを開いてGoogle Sheets APIを有効化してください:\n${enableUrl}\n\n2. 有効化後、数分待ってから再度お試しください。`)
    }
    
    throw new Error(errorMessage)
  }

  const createData = await createResponse.json()
  const spreadsheetId = createData.spreadsheetId
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`

  // サンプルデータがある場合、書き込む
  if (sampleData && sampleData.length > 0) {
    const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`
    
    await fetch(writeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: sampleData
      })
    })
  }

  return {
    spreadsheetId,
    spreadsheetUrl
  }
}

/**
 * スプレッドシートの特定の行を更新する
 * @param spreadsheetId スプレッドシートID
 * @param range 更新する範囲（例: "Sheet1!A2:D2"）
 * @param values 更新するデータ（文字列配列）
 * @returns APIレスポンス
 */
export const updateSheetRow = async (spreadsheetId: string, range: string, values: string[]): Promise<any> => {
  const token = sessionStorage.getItem('googleAccessToken')
  if (!token) {
    throw new Error('認証トークンが見つかりません。Googleアカウントでログインしてください。')
  }

  const extractedId = extractSpreadsheetId(spreadsheetId)
  // rangeパラメータをURLエンコード
  const cleanRange = range.split('?')[0].split('&')[0]
  const encodedRange = encodeURIComponent(cleanRange)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${extractedId}/values/${encodedRange}?valueInputOption=USER_ENTERED`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [values]
    })
  })

  if (!response.ok) {
    const error = await response.json()
    const errorMessage = error.error?.message || 'スプレッドシートの更新に失敗しました'
    throw new Error(errorMessage)
  }

  return await response.json()
}

/**
 * スプレッドシートのタイトル（名前）を取得する
 * @param spreadsheetId スプレッドシートID
 * @returns スプレッドシートのタイトル
 */
export const getSpreadsheetTitle = async (spreadsheetId: string): Promise<string> => {
  const token = sessionStorage.getItem('googleAccessToken')
  if (!token) {
    throw new Error('認証トークンが見つかりません。Googleアカウントでログインしてください。')
  }

  const extractedId = extractSpreadsheetId(spreadsheetId)
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${extractedId}?fields=properties.title`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })

  if (!response.ok) {
    const error = await response.json()
    const errorMessage = error.error?.message || 'スプレッドシートのタイトル取得に失敗しました'
    throw new Error(errorMessage)
  }

  const data = await response.json()
  return data.properties?.title || '無題のスプレッドシート'
}

/**
 * スプレッドシートの特定の行を削除する
 * @param spreadsheetId スプレッドシートID
 * @param sheetName シート名（例: "Sheet1"）
 * @param rowIndex 削除する行のインデックス（1ベース、ヘッダー行は1）
 * @returns APIレスポンス
 */
export const deleteSheetRow = async (spreadsheetId: string, sheetName: string, rowIndex: number): Promise<any> => {
  const token = sessionStorage.getItem('googleAccessToken')
  if (!token) {
    throw new Error('認証トークンが見つかりません。Googleアカウントでログインしてください。')
  }

  const extractedId = extractSpreadsheetId(spreadsheetId)
  
  // まず、スプレッドシートのメタデータを取得してシートIDを取得
  const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${extractedId}`
  const metadataResponse = await fetch(metadataUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })

  if (!metadataResponse.ok) {
    const error = await metadataResponse.json()
    const errorMessage = error.error?.message || 'スプレッドシートのメタデータ取得に失敗しました'
    throw new Error(errorMessage)
  }

  const metadata = await metadataResponse.json()
  const sheet = metadata.sheets?.find((s: any) => s.properties.title === sheetName)
  if (!sheet) {
    throw new Error(`シート "${sheetName}" が見つかりません`)
  }

  const sheetId = sheet.properties.sheetId

  // 行を削除するリクエスト
  const deleteUrl = `https://sheets.googleapis.com/v4/spreadsheets/${extractedId}:batchUpdate`
  const deleteResponse = await fetch(deleteUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheetId,
            dimension: 'ROWS',
            startIndex: rowIndex - 1, // 0ベースに変換
            endIndex: rowIndex
          }
        }
      }]
    })
  })

  if (!deleteResponse.ok) {
    const error = await deleteResponse.json()
    const errorMessage = error.error?.message || '行の削除に失敗しました'
    throw new Error(errorMessage)
  }

  return await deleteResponse.json()
}

