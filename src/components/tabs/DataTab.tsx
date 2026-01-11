import { useState, useEffect } from 'react'
import { RefreshCw, Download, CheckCircle2, ExternalLink, ShieldCheck, FileSpreadsheet, Table as TableIcon, Plus, ChevronRight, Filter, Search, X, Database, Wrench, Save, Trash2 } from 'lucide-react'
import { signInWithGoogle, signInWithGoogleRedirect, auth } from '../../utils/firebase'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { appendToSheet, extractSpreadsheetId, readFromSheet, createSpreadsheet, getSpreadsheetTitle } from '../../features/sheets/api'
import { getRequiredColumns, getSampleData } from '../../utils/templateColumns'
import { createDataSource, getDataSources, deleteDataSource } from '../../utils/firestore'

const DataTab = () => {
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null)
  const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [spreadsheetId, setSpreadsheetId] = useState('')
  const [testData, setTestData] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [sheetData, setSheetData] = useState<string[][]>([])
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([])
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [connectionError, setConnectionError] = useState<string>('')
  const [isCreatingSheet, setIsCreatingSheet] = useState(false)
  const [deletingSourceId, setDeletingSourceId] = useState<string | null>(null)
  const { dataSources, apps, activeAppId, updateApp, setDataSources } = useApp()
  const { currentUser, user: authUser } = useAuth()
  const app = apps.find(a => a.id === activeAppId)
  
  // テンプレートに必要なカラムを取得
  const requiredColumns = app?.template ? getRequiredColumns(app.template) : []
  const templateSampleData = app?.template ? getSampleData(app.template) : []

  // 認証状態の監視（AppNaviのログイン状態とGoogle Sheets API用のアクセストークンを確認）
  useEffect(() => {
    const checkAuthStatus = () => {
      // AppNaviでGoogle認証でログインしている場合
      const isAppNaviLoggedIn = currentUser || authUser
      const hasGoogleToken = sessionStorage.getItem('googleAccessToken')
      
      if (isAppNaviLoggedIn && hasGoogleToken) {
        // 既にログイン済みで、アクセストークンもある場合
        setIsConnected(true)
        console.log('DataTab - AppNaviのGoogle認証と連携済み:', {
          email: currentUser?.email || authUser?.email,
          hasToken: !!hasGoogleToken
        })
      } else if (isAppNaviLoggedIn && !hasGoogleToken) {
        // AppNaviでログインしているが、Google Sheets API用のアクセストークンがない場合
        setIsConnected(false)
        console.log('DataTab - AppNaviでログイン済みですが、Google Sheets API用のアクセストークンが必要です')
      } else {
        // AppNaviでログインしていない場合
        setIsConnected(false)
      }
    }

    // 初回チェック
    checkAuthStatus()

    // 認証状態の変更を監視
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      checkAuthStatus()
    })
    
    return () => unsubscribe()
  }, [currentUser, authUser])

  // データソースが選択されたときにデータを読み込む
  useEffect(() => {
    const loadSelectedSheetData = async () => {
      if (!selectedSheet) {
        setSheetData([])
        setSheetHeaders([])
        return
      }

      // 選択されたデータソースを取得
      const selectedDataSource = dataSources.find(ds => ds.name === selectedSheet)
      if (!selectedDataSource || !selectedDataSource.url) {
        setSheetData([])
        setSheetHeaders([])
        return
      }

      const token = sessionStorage.getItem('googleAccessToken')
      if (!token) {
        return
      }

      try {
        setIsLoadingPreview(true)
        const extractedId = extractSpreadsheetId(selectedDataSource.url)
        // 最新のデータの10件分だけ取得（ヘッダー1行 + データ10行 = 合計11行）
        const data = await readFromSheet(extractedId, 'Sheet1!A1:Z11')
        
        const headers = data.length > 0 ? (data[0] || []) : []
        // データ行を取得（最大10行）
        const rows = data.length > 1 ? data.slice(1, 11) : []
        
        setSheetHeaders(headers)
        setSheetData(rows)
      } catch (error: any) {
        console.error('データ読み込みエラー:', error)
        setConnectionError(error?.message || 'データの読み込みに失敗しました')
      } finally {
        setIsLoadingPreview(false)
      }
    }

    loadSelectedSheetData()
  }, [selectedSheet, dataSources])

  // データソースからデータを取得（現在は空）
  // 注意: テンプレートのサンプルデータは templateSampleData として定義されています

  // Google認証処理（AppNaviのGoogle認証と連携）
  const handleGoogleAuth = async () => {
    try {
      setIsAuthenticating(true)
      console.log('DataTab - Google認証を開始')
      
      // 既にAppNaviでログインしている場合の確認
      const isAppNaviLoggedIn = currentUser || authUser
      const existingToken = sessionStorage.getItem('googleAccessToken')
      
      console.log('DataTab - 認証状態確認:', {
        isAppNaviLoggedIn,
        hasToken: !!existingToken,
        currentUserEmail: currentUser?.email || authUser?.email
      })
      
      if (isAppNaviLoggedIn && existingToken) {
        // 既にログイン済みで、アクセストークンもある場合
        console.log('DataTab - 既にAppNaviのGoogle認証と連携済みです')
        setIsConnected(true)
        setIsAuthenticating(false)
        return
      }
      
      // AppNaviでログインしているが、アクセストークンがない場合
      if (isAppNaviLoggedIn && !existingToken) {
        const confirmed = window.confirm(
          `AppNaviでログイン中のGoogleアカウント（${currentUser?.email || authUser?.email}）で、Google Sheets APIへのアクセス権限を追加しますか？\n\n同じGoogleアカウントを使用するため、再度ログインする必要はありません。`
        )
        
        if (!confirmed) {
          console.log('DataTab - 認証がキャンセルされました')
          setIsAuthenticating(false)
          return
        }
      }
      
      console.log('DataTab - signInWithGoogleを呼び出し...')
      
      // まずポップアップ方式を試す
      try {
        const authenticatedUser = await signInWithGoogle()
        console.log('DataTab - Google認証成功:', authenticatedUser?.email)
        
        // 認証成功後、少し待ってから接続状態を設定（AuthContextの状態更新を待つ）
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // アクセストークンが保存されているか確認
        const token = sessionStorage.getItem('googleAccessToken')
        console.log('DataTab - アクセストークン確認:', { hasToken: !!token })
        
        if (token) {
          setIsConnected(true)
          console.log('DataTab - Google Sheets API用のアクセストークンを取得しました')
        } else {
          console.warn('DataTab - アクセストークンが保存されていません')
          setIsConnected(true) // トークンがなくても接続状態にする（後で再認証可能）
        }
      } catch (popupError: any) {
        console.error('DataTab - ポップアップ認証エラー:', popupError)
        
        // ポップアップがブロックされた場合、リダイレクト方式にフォールバック
        if (popupError?.code === 'auth/popup-blocked' || popupError?.code === 'auth/popup-closed-by-user') {
          console.log('DataTab - ポップアップがブロックされました。リダイレクト方式に切り替えます...')
          const confirmed = window.confirm(
            'ポップアップがブロックされました。\n\nリダイレクト方式で認証を続けますか？\n（このページから移動しますが、認証後に戻ってきます）'
          )
          
          if (confirmed) {
            console.log('DataTab - リダイレクト方式で認証を開始...')
            await signInWithGoogleRedirect()
            // リダイレクトされるため、ここには到達しない
            // ただし、リダイレクトが開始されたことを確認
            console.log('DataTab - リダイレクトが開始されました')
            return
          } else {
            console.log('DataTab - リダイレクト認証がキャンセルされました')
            throw new Error('認証がキャンセルされました')
          }
        } else {
          // その他のエラーは再スロー
          console.error('DataTab - 認証エラー（再スロー）:', popupError)
          throw popupError
        }
      }
    } catch (error: any) {
      console.error('DataTab - 認証エラー（最終）:', error)
      const errorMessage = error?.message || error?.code || '認証に失敗しました'
      
      // ユーザーフレンドリーなエラーメッセージ
      let userMessage = '認証に失敗しました'
      if (error?.code === 'auth/popup-blocked') {
        userMessage = 'ポップアップがブロックされました。ブラウザの設定でポップアップを許可してください。'
      } else if (error?.code === 'auth/popup-closed-by-user') {
        userMessage = '認証ウィンドウが閉じられました。再度お試しください。'
      } else if (error?.code === 'auth/cancelled-popup-request') {
        userMessage = '認証がキャンセルされました。再度お試しください。'
      } else if (errorMessage) {
        userMessage = errorMessage
      }
      
      alert(userMessage)
    } finally {
      console.log('DataTab - 認証処理を終了（setIsAuthenticating(false)）')
      setIsAuthenticating(false)
    }
  }

  // スプレッドシート接続処理
  const handleConnectSpreadsheet = async () => {
    if (!spreadsheetId.trim()) {
      alert('スプレッドシートIDまたはURLを入力してください')
      return
    }

    try {
      setIsConnecting(true)
      setIsLoadingPreview(true)
      setConnectionError('')
      const extractedId = extractSpreadsheetId(spreadsheetId)
      
      // 最新のデータの10件分だけ取得（ヘッダー1行 + データ10行 = 合計11行）
      const data = await readFromSheet(extractedId, 'Sheet1!A1:Z11')
      
      // ヘッダー行を取得（データがない場合でも空配列を設定）
      const headers = data.length > 0 ? (data[0] || []) : []
      // データ行を取得（最大10行）
      const rows = data.length > 1 ? data.slice(1, 11) : []
      
      setSheetHeaders(headers)
      setSheetData(rows)
      
      // アプリのデータソース情報を更新（ローカルstate）
      if (app && activeAppId) {
        updateApp(activeAppId, {
          dataSource: {
            type: 'google-sheets',
            sheetId: extractedId,
            url: spreadsheetId.includes('http') ? spreadsheetId : undefined
          }
        })

        // Firestoreにデータソース情報を保存（次回ログイン時に表示されるように）
        try {
          const sourceId = `source-${Date.now()}`
          const spreadsheetUrl = spreadsheetId.includes('http') ? spreadsheetId : `https://docs.google.com/spreadsheets/d/${extractedId}`
          
          // スプレッドシートのタイトルを取得
          let spreadsheetTitle = '無題のスプレッドシート'
          try {
            spreadsheetTitle = await getSpreadsheetTitle(extractedId)
          } catch (error) {
            console.warn('スプレッドシートタイトルの取得に失敗:', error)
          }
          
          const dataSourceName = spreadsheetTitle
          
          await createDataSource(activeAppId, sourceId, {
            type: 'google_sheet',
            name: dataSourceName,
            config: {
              spreadsheetId: extractedId,
              sheetName: 'Sheet1',
              range: 'A1:Z1000'
            }
          })
          
          // Firestoreから最新のデータソースを取得して更新
          // 少し待ってから取得することで、Firestoreへの書き込みが確実に反映される
          await new Promise(resolve => setTimeout(resolve, 300))
          const firestoreDataSources = await getDataSources(activeAppId)
          const convertedDataSources = firestoreDataSources.map(ds => ({
            id: ds.id,
            name: ds.name,
            type: ds.type === 'google_sheet' ? 'google-sheets' : ds.type === 'excel' ? 'excel' : 'csv',
            url: ds.config.fileUrl || (ds.config.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${ds.config.spreadsheetId}` : undefined),
            lastSynced: ds.updatedAt?.toDate?.()?.toISOString()
          }))
          
          // データソースリストを更新（即座に表示されるように）
          setDataSources(convertedDataSources)
          
          // 接続したデータソースを選択状態にする
          setSelectedSheet(dataSourceName)
          
          console.log('データソースを更新しました:', convertedDataSources)
        } catch (error) {
          console.error('データソースの保存エラー:', error)
          // エラーが発生しても接続は成功として扱う（ローカルstateは更新済み）
        }
      }

      // 接続成功後、接続状態を設定してプレビューを表示
      // モーダルは閉じずに、プレビューを表示する
      setIsConnected(true)
      setConnectionError('')
      
      // データソースリストを更新（バックグラウンドで実行）
      // エラーが発生しても接続は成功として扱う
      const refreshDataSources = async () => {
        try {
          if (activeAppId) {
            // 少し待ってから取得することで、Firestoreへの書き込みが確実に反映される
            await new Promise(resolve => setTimeout(resolve, 500))
            const firestoreDataSources = await getDataSources(activeAppId)
            const convertedDataSources = firestoreDataSources.map(ds => ({
              id: ds.id,
              name: ds.name,
              type: ds.type === 'google_sheet' ? 'google-sheets' : ds.type === 'excel' ? 'excel' : 'csv',
              url: ds.config.fileUrl || (ds.config.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${ds.config.spreadsheetId}` : undefined),
              lastSynced: ds.updatedAt?.toDate?.()?.toISOString()
            }))
            setDataSources(convertedDataSources)
            console.log('データソースを再取得して更新しました:', convertedDataSources)
          }
        } catch (error) {
          console.error('データソースの再取得エラー:', error)
          // エラーが発生しても接続は成功として扱う
        }
      }
      
      // バックグラウンドでデータソースリストを更新
      refreshDataSources()
    } catch (error: any) {
      console.error('接続エラー:', error)
      const errorMessage = error?.message || '接続に失敗しました'
      setConnectionError(errorMessage)
      setIsConnected(false)
      
      // 認証エラーの場合、トークンをクリアして再認証を促す
      if (errorMessage.includes('認証トークンが無効') || errorMessage.includes('invalid authentication credentials')) {
        sessionStorage.removeItem('googleAccessToken')
        setIsConnected(false)
        // ユーザーに再認証を促すメッセージを表示
        alert('認証トークンが無効です。再度Googleアカウントでログインしてください。')
      }
    } finally {
      setIsConnecting(false)
      setIsLoadingPreview(false)
    }
  }

  // データ送信処理
  const handleSubmitData = async () => {
    if (!testData.trim()) {
      alert('データを入力してください')
      return
    }

    const currentSpreadsheetId = app?.dataSource?.sheetId || spreadsheetId
    if (!currentSpreadsheetId) {
      alert('スプレッドシートが接続されていません。先にスプレッドシートを接続してください。')
      return
    }

    try {
      setIsSubmitting(true)
      // テストデータを配列に変換（カンマ区切りを想定）
      const values = testData.split(',').map(v => v.trim())
      
      await appendToSheet(currentSpreadsheetId, values)
      alert('データを追加しました！')
      setTestData('')
    } catch (error: any) {
      console.error('送信エラー:', error)
      alert(`データの追加に失敗しました: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // データソース選択
  const handleDataSourceSelect = (source: 'spreadsheet' | 'firebase' | 'supabase') => {
    if (source === 'spreadsheet') {
      handleGoogleAuth()
    } else {
      alert(`${source === 'firebase' ? 'Firebase' : 'Supabase'}からの追加は工事中です`)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Database className="mr-2 text-primary-600 dark:text-primary-400" size={24} /> Step 3: Data - データソース接続
            </h2>
            <p className="text-sm text-slate-600 dark:text-white mt-1">
              データソースを接続して、アプリで使用するデータを管理します。
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sub Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-700 text-sm">データリスト</h3>
          <p className="text-xs text-slate-400 mt-1">連携中のシート一覧</p>
        </div>
        <div className="p-2 space-y-1 flex-1 overflow-y-auto">
          {dataSources.length > 0 ? (
            dataSources.map((ds) => (
              <div
                key={ds.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition group ${
                  selectedSheet === ds.name
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div
                  onClick={() => setSelectedSheet(ds.name)}
                  className="flex items-center space-x-2 flex-1 cursor-pointer min-w-0"
                >
                  <FileSpreadsheet size={18} className={selectedSheet === ds.name ? 'text-primary-600' : 'text-green-600 flex-shrink-0'} />
                  <span className="truncate flex-1">{ds.name}</span>
                </div>
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    const confirmed = window.confirm(
                      `「${ds.name}」の設定を解除しますか？\n\nこの操作は取り消せません。`
                    )
                    if (!confirmed) return

                    try {
                      setDeletingSourceId(ds.id)
                      if (activeAppId) {
                        await deleteDataSource(activeAppId, ds.id)
                        
                        // データソースリストを更新
                        const firestoreDataSources = await getDataSources(activeAppId)
                        const convertedDataSources = firestoreDataSources.map(ds => ({
                          id: ds.id,
                          name: ds.name,
                          type: ds.type === 'google_sheet' ? 'google-sheets' : ds.type === 'excel' ? 'excel' : 'csv',
                          url: ds.config.fileUrl || (ds.config.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${ds.config.spreadsheetId}` : undefined),
                          lastSynced: ds.updatedAt?.toDate?.()?.toISOString()
                        }))
                        setDataSources(convertedDataSources)
                        
                        // 削除したデータソースが選択されていた場合、選択を解除
                        if (selectedSheet === ds.name) {
                          setSelectedSheet(null)
                          setSheetData([])
                          setSheetHeaders([])
                        }
                      }
                    } catch (error) {
                      console.error('データソースの削除エラー:', error)
                      alert('データソースの削除に失敗しました')
                    } finally {
                      setDeletingSourceId(null)
                    }
                  }}
                  disabled={deletingSourceId === ds.id}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-100 text-red-600 hover:text-red-700 disabled:opacity-50 ${
                    deletingSourceId === ds.id ? 'opacity-100' : ''
                  }`}
                  title="設定を解除"
                >
                  {deletingSourceId === ds.id ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              <p>データソースがありません</p>
              <p className="text-xs mt-1">データを追加してください</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => {
              // モーダルを開く際に状態をリセット
              setIsConnected(false)
              setSpreadsheetId('')
              setTestData('')
              setSheetData([])
              setSheetHeaders([])
              setColumnMapping({})
              setConnectionError('')
              setIsAddDataModalOpen(true)
            }}
            className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:border-primary-400 hover:text-primary-600 transition flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>新しい連携を追加</span>
          </button>
        </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
        {/* Breadcrumb & Tools */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center text-sm text-slate-500">
            <span>データ管理</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="font-bold text-slate-800">{selectedSheet || 'データソースを選択'}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="リスト内を検索..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
            />
          </div>
        </div>

        {/* Info Banner with Security Assurance */}
        {selectedSheet && (
        <div className="bg-white border border-green-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 border border-green-100 shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-slate-800 text-sm">Googleスプレッドシートと連携中</h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold border border-green-200 flex items-center">
                  <CheckCircle2 size={12} className="mr-1" />
                  安全に連携済み
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-500 mb-1">
                <ShieldCheck size={12} className="mr-1 text-green-600" />
                <span>元のスプレッドシートは保護されます（アプリからの編集は反映されません）</span>
              </div>
              <div className="flex items-center text-xs text-slate-400">
                <span className="mr-2">連携先:</span>
                <div className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-200 font-mono text-slate-600">
                  <span className="truncate max-w-[200px] md:max-w-xs">https://docs.google.com/spreadsheets/d/1BxiMvs0...</span>
                  <button className="ml-2 text-primary-600 hover:text-primary-800">
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-800 transition shadow-sm whitespace-nowrap">
            連携設定を確認
          </button>
        </div>
        )}

        {/* Data Table Card */}
        {selectedSheet ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 justify-between items-center bg-white">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={async () => {
                    if (!selectedSheet) return
                    const selectedDataSource = dataSources.find(ds => ds.name === selectedSheet)
                    if (!selectedDataSource || !selectedDataSource.url) return
                    
                    const token = sessionStorage.getItem('googleAccessToken')
                    if (!token) {
                      alert('Googleアカウントでログインしてください')
                      return
                    }

                    try {
                      setIsLoadingPreview(true)
                      const extractedId = extractSpreadsheetId(selectedDataSource.url)
                      // 最新のデータの10件分だけ取得（ヘッダー1行 + データ10行 = 合計11行）
                      const data = await readFromSheet(extractedId, 'Sheet1!A1:Z11')
                      
                      const headers = data.length > 0 ? (data[0] || []) : []
                      // データ行を取得（最大10行）
                      const rows = data.length > 1 ? data.slice(1, 11) : []
                      
                      setSheetHeaders(headers)
                      setSheetData(rows)
                    } catch (error: any) {
                      console.error('データ読み込みエラー:', error)
                      alert(error?.message || 'データの読み込みに失敗しました')
                    } finally {
                      setIsLoadingPreview(false)
                    }
                  }}
                  disabled={isLoadingPreview}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition shadow-sm disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isLoadingPreview ? 'animate-spin' : ''} />
                  <span>最新データ取得</span>
                </button>
                <span className="text-slate-500 text-sm">全 {sheetData.length} 件</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    // モーダルを開く際に状態をリセット
                    setIsConnected(false)
                    setSpreadsheetId('')
                    setTestData('')
                    setSheetData([])
                    setSheetHeaders([])
                    setColumnMapping({})
                    setConnectionError('')
                    setIsAddDataModalOpen(true)
                  }}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition shadow-sm"
                >
                  <Plus size={16} />
                  <span>新規データ追加</span>
                </button>
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200" title="絞り込み">
                  <Filter size={16} />
                </button>
                <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                  <Download size={16} />
                  <span>CSV保存</span>
                </button>
              </div>
            </div>

            {/* Table */}
            {sheetData.length > 0 && sheetHeaders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      {sheetHeaders.map((col, idx) => (
                        <th key={idx} className="px-6 py-4">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheetData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        {sheetHeaders.map((col, colIdx) => (
                          <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                            {row[colIdx] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-sm">
                <p>データを読み込んでいます...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* データソース未選択時のメッセージ */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-12 text-center">
              <Database className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">データソースを選択</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                左側のサイドバーからデータソースを選択するか、新しいデータソースを追加してください。
              </p>
              <button 
                onClick={() => {
                  // モーダルを開く際に状態をリセット
                  setIsConnected(false)
                  setSpreadsheetId('')
                  setTestData('')
                  setSheetData([])
                  setSheetHeaders([])
                  setColumnMapping({})
                  setConnectionError('')
                  setIsAddDataModalOpen(true)
                }}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>データソースを追加</span>
              </button>
            </div>

            {/* テンプレートのデータサンプルへのリンク */}
            {app?.template && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    テンプレートのデータサンプル
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    このテンプレート（{app.template}）のデータサンプルを確認できます
                  </p>
                  <a
                    href={`https://appnavi-asset.com/templates/${app.template}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 btn-primary"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>データサンプルを見る</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        </main>
      </div>

      {/* 新規データ追加モーダル */}
      {isAddDataModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddDataModalOpen(false)
            }
          }}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {!isConnected ? 'スプレッドシート接続' : 'スプレッドシート設定'}
              </h2>
              <button
                onClick={() => {
                  setIsAddDataModalOpen(false)
                  // モーダルを閉じる際に、接続が完了していない場合は状態をリセット
                  if (!isConnected) {
                    setIsConnected(false)
                    setSpreadsheetId('')
                    setTestData('')
                    setSheetData([])
                    setSheetHeaders([])
                    setColumnMapping({})
                    setConnectionError('')
                  }
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {!isConnected ? (
                <>
                  {/* Google認証 */}
                  {!sessionStorage.getItem('googleAccessToken') ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        {(currentUser || authUser) ? (
                          <>
                            <div className="flex items-start space-x-3 mb-3">
                              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                                  AppNaviでログイン済み
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  ログイン中のGoogleアカウント: <span className="font-mono">{currentUser?.email || authUser?.email}</span>
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                  Google Sheets APIへのアクセス権限を追加するため、同じGoogleアカウントで認証を完了してください。
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={handleGoogleAuth}
                              disabled={isAuthenticating}
                              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                              {isAuthenticating ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>認証中...</span>
                                </>
                              ) : (
                                <>
                                  <FileSpreadsheet className="w-4 h-4" />
                                  <span>Google Sheets APIへのアクセスを許可</span>
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                              まず、Googleアカウントでログインしてください。スプレッドシートへのアクセス権限が必要です。
                            </p>
                            <button
                              onClick={handleGoogleAuth}
                              disabled={isAuthenticating}
                              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                              {isAuthenticating ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>認証中...</span>
                                </>
                              ) : (
                                <>
                                  <FileSpreadsheet className="w-4 h-4" />
                                  <span>Googleアカウントでログイン</span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* スプレッドシートID入力 */
                    <div className="space-y-4">
                      {/* テンプレートに必要なカラム表示 */}
                      {app?.template && requiredColumns.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                            このテンプレートに必要なカラム
                          </h3>
                          <div className="space-y-1">
                            {requiredColumns.map((col, index) => (
                              <div key={index} className="flex items-center space-x-2 text-xs">
                                <span className={`px-2 py-0.5 rounded ${col.required ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                  {col.required ? '必須' : '任意'}
                                </span>
                                <span className="font-medium text-blue-800 dark:text-blue-300">{col.name}</span>
                                <span className="text-blue-600 dark:text-blue-400">({col.type})</span>
                                <span className="text-blue-500 dark:text-blue-500">- {col.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* サンプルデータ表示 */}
                      {app?.template && templateSampleData.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            推奨サンプルデータ
                          </h3>
                          <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto max-h-48">
                              <table className="border-collapse w-full text-xs">
                                <thead className="bg-slate-100 dark:bg-slate-800">
                                  <tr>
                                    {templateSampleData[0]?.map((header, index) => (
                                      <th
                                        key={index}
                                        className="border border-slate-300 dark:border-slate-700 px-2 py-1 text-left font-semibold text-slate-700 dark:text-slate-300"
                                      >
                                        {header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900">
                                  {templateSampleData.slice(1).map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                      {templateSampleData[0]?.map((_, colIndex) => (
                                        <td
                                          key={colIndex}
                                          className="border border-slate-300 dark:border-slate-700 px-2 py-1 text-slate-900 dark:text-slate-100"
                                        >
                                          {row[colIndex] || ''}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              if (!sessionStorage.getItem('googleAccessToken')) {
                                alert('まずGoogleアカウントでログインしてください')
                                return
                              }
                              
                              try {
                                setIsCreatingSheet(true)
                                const templateName = app?.name || 'AppNaviアプリ'
                                const result = await createSpreadsheet(`${templateName} - データ`, templateSampleData)
                                
                                // 作成されたスプレッドシートのURLを入力欄に設定
                                setSpreadsheetId(result.spreadsheetUrl)
                                setConnectionError('')
                                
                                alert(`サンプルスプレッドシートを作成しました。\n\nURL: ${result.spreadsheetUrl}\n\n「スプレッドシートに接続」ボタンをクリックして接続してください。`)
                                
                                // 新しいタブでスプレッドシートを開く
                                window.open(result.spreadsheetUrl, '_blank')
                              } catch (error: any) {
                                console.error('スプレッドシート作成エラー:', error)
                                setConnectionError(error?.message || 'スプレッドシートの作成に失敗しました')
                              } finally {
                                setIsCreatingSheet(false)
                              }
                            }}
                            disabled={isCreatingSheet}
                            className="mt-3 w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
                          >
                            {isCreatingSheet ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>作成中...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>推奨サンプルスプレッドシートを新規作成</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {connectionError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                                接続エラー
                              </p>
                              <p className="text-xs text-red-700 dark:text-red-300 whitespace-pre-line">
                                {connectionError}
                              </p>
                              {connectionError.includes('Google Sheets API') && (
                                <div className="mt-3">
                                  <a
                                    href={connectionError.match(/https:\/\/[^\s]+/)?.[0] || 'https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=917670325982'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-2 text-sm text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 underline"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    <span>Google Sheets APIを有効化する</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                          スプレッドシートIDまたはURL
                        </label>
                        <input
                          type="text"
                          value={spreadsheetId}
                          onChange={(e) => {
                            setSpreadsheetId(e.target.value)
                            setConnectionError('') // 入力時にエラーをクリア
                          }}
                          placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XGA5xFMKkFrJ6Ze8a6e18jH62z-TuG6hpRHo/edit または 1BxiMVs0XGA5xFMKkFrJ6Ze8a6e18jH62z-TuG6hpRHo"
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          GoogleスプレッドシートのURLまたはIDを入力してください
                        </p>
                      </div>
                      <button
                        onClick={handleConnectSpreadsheet}
                        disabled={isConnecting || !spreadsheetId.trim()}
                        className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {isConnecting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>接続中...</span>
                          </>
                        ) : (
                          <>
                            <FileSpreadsheet className="w-4 h-4" />
                            <span>スプレッドシートに接続</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* データプレビューとマッピング設定 */
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        スプレッドシートに接続済み
                      </p>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      {app?.dataSource?.sheetId || extractSpreadsheetId(spreadsheetId)}
                    </p>
                  </div>

                  {/* データプレビュー */}
                  {isLoadingPreview ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
                      <span className="ml-2 text-slate-600 dark:text-slate-400">データを読み込み中...</span>
                    </div>
                  ) : sheetHeaders.length > 0 ? (
                    <>
                      {/* スプレッドシートのカラム一覧 */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                          スプレッドシートのカラム一覧
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {sheetHeaders.map((header, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300"
                            >
                              {header || `列${index + 1}`}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                          スプレッドシートに {sheetHeaders.length} 個のカラムが見つかりました
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                          スプレッドシートのプレビュー
                        </label>
                        <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                          <div className="overflow-x-auto max-h-64">
                            <table className="border-collapse w-full text-sm">
                              <thead className="bg-slate-100 dark:bg-slate-800">
                                <tr>
                                  {sheetHeaders.map((header, index) => (
                                    <th
                                      key={index}
                                      className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-300"
                                    >
                                      {header || `列${index + 1}`}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-slate-900">
                                {sheetData.map((row, rowIndex) => (
                                  <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                    {sheetHeaders.map((_, colIndex) => (
                                      <td
                                        key={colIndex}
                                        className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-900 dark:text-slate-100"
                                      >
                                        {row[colIndex] || ''}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          スプレッドシートのヘッダー行とデータ（最大10行）を表示しています
                        </p>
                      </div>

                      {/* 列マッピング設定 */}
                      {requiredColumns.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">
                            列のマッピング設定
                          </label>
                          <div className="space-y-2">
                            {requiredColumns.map((col) => (
                              <div key={col.name} className="flex items-center space-x-2">
                                <label className="text-sm text-slate-600 dark:text-slate-400 w-24 flex items-center space-x-1">
                                  <span>{col.name}</span>
                                  {col.required && (
                                    <span className="text-red-500 text-xs">*</span>
                                  )}
                                </label>
                                <select
                                  value={columnMapping[col.name] || ''}
                                  onChange={(e) =>
                                    setColumnMapping({
                                      ...columnMapping,
                                      [col.name]: e.target.value,
                                    })
                                  }
                                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                  <option value="">選択してください</option>
                                  {sheetHeaders.map((header, index) => (
                                    <option key={index} value={header}>
                                      {header || `列${index + 1}`}
                                    </option>
                                  ))}
                                </select>
                                <span className="text-xs text-slate-500 dark:text-slate-400 w-16">
                                  ({col.type})
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            スプレッドシートのどの列をどの項目に使うか選択してください（*は必須項目です）
                          </p>
                        </div>
                      )}

                      <button
                        onClick={async () => {
                          // 設定を保存してモーダルを閉じる
                          // データソースリストを更新してから閉じる
                          try {
                            if (activeAppId) {
                              const firestoreDataSources = await getDataSources(activeAppId)
                              const convertedDataSources = firestoreDataSources.map(ds => ({
                                id: ds.id,
                                name: ds.name,
                                type: ds.type === 'google_sheet' ? 'google-sheets' : ds.type === 'excel' ? 'excel' : 'csv',
                                url: ds.config.fileUrl || (ds.config.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${ds.config.spreadsheetId}` : undefined),
                                lastSynced: ds.updatedAt?.toDate?.()?.toISOString()
                              }))
                              setDataSources(convertedDataSources)
                              
                              // 接続したデータソースを選択状態にする
                              if (convertedDataSources.length > 0) {
                                const latestSource = convertedDataSources[convertedDataSources.length - 1]
                                setSelectedSheet(latestSource.name)
                              }
                            }
                          } catch (error) {
                            console.error('データソースの取得エラー:', error)
                            // エラーが発生してもモーダルは閉じる
                          }
                          
                          setIsAddDataModalOpen(false)
                          // 状態をリセット（次回開くときにクリーンな状態にする）
                          setIsConnected(false)
                          setSpreadsheetId('')
                          setSheetData([])
                          setSheetHeaders([])
                          setColumnMapping({})
                        }}
                        className="w-full btn-primary flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>設定を保存して閉じる</span>
                      </button>
                    </>
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
                      <TableIcon className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                        スプレッドシートにデータがありません
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                        スプレッドシートに接続は成功しましたが、データが見つかりませんでした。
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          スプレッドシートにデータを追加してから、再度「スプレッドシートに接続」ボタンをクリックしてください。
                        </p>
                        {sheetHeaders.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                              検出されたカラム:
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {sheetHeaders.map((header, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded text-xs text-yellow-800 dark:text-yellow-200"
                                >
                                  {header || `列${index + 1}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTab


