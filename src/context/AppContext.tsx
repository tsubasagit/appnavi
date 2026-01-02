import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { App, PolicyData, UIConfig, DataSource, User, Environment } from '../types'
import { useAuth } from './AuthContext'
import { getDataSources, getUserApps, deleteApp as deleteAppFromFirestore } from '../utils/firestore'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../utils/firestore'
import { FIRESTORE_COLLECTIONS } from '../types/firestore'

interface AppContextType {
  user: User | null
  apps: App[]
  activeAppId: string | null
  policyData: PolicyData | null
  uiConfig: UIConfig | null
  dataSources: DataSource[]
  // ベンダーモード関連
  isVendorMode: boolean
  environment: Environment
  // ダークモード関連
  isDarkMode: boolean
  toggleDarkMode: () => void
  setUser: (user: User | null) => void
  setApps: (apps: App[]) => void
  setActiveAppId: (id: string | null) => void
  setPolicyData: (data: PolicyData | null) => void
  setUIConfig: (config: UIConfig | null) => void
  setDataSources: (sources: DataSource[]) => void
  setEnvironment: (env: Environment) => void
  createNewApp: () => Promise<string>
  updateApp: (appId: string, updates: Partial<App>) => Promise<void>
  deleteApp: (appId: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [apps, setApps] = useState<App[]>([])
  const [activeAppId, setActiveAppId] = useState<string | null>(null)
  const [policyData, setPolicyData] = useState<PolicyData | null>(null)
  const [uiConfig, setUIConfig] = useState<UIConfig | null>(null)
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  // ベンダーモード関連のstate
  const [environment, setEnvironment] = useState<Environment>('dev')
  // ダークモード関連のstate
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // ローカルストレージから設定を読み込む
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })
  
  // AuthContextのユーザーをAppContextに同期
  useEffect(() => {
    setUser(authUser)
  }, [authUser])

  // ユーザーログイン時にFirestoreからアプリを読み込む
  useEffect(() => {
    const loadApps = async () => {
      if (authUser?.id) {
        try {
          console.log('AppContext - アプリを読み込み中... userId:', authUser.id, 'email:', authUser.email)
          const firestoreApps = await getUserApps(authUser.id, authUser.email)
          console.log('AppContext - Firestoreから取得したアプリ:', firestoreApps)
          
          // FirestoreのApp型をアプリのApp型に変換
          const convertedApps: App[] = firestoreApps.map(fsApp => {
            const appData = fsApp as any
            
            // createdAtとlastUpdatedの変換（Timestamp型の場合）
            let createdAt = appData.createdAt
            if (createdAt?.toDate) {
              createdAt = createdAt.toDate().toISOString().slice(0, 10)
            } else if (typeof createdAt === 'string') {
              createdAt = createdAt.slice(0, 10)
            } else {
              createdAt = new Date().toISOString().slice(0, 10)
            }
            
            let lastUpdated = appData.lastUpdated
            if (lastUpdated?.toDate) {
              lastUpdated = lastUpdated.toDate().toISOString().slice(0, 16).replace('T', ' ')
            } else if (typeof lastUpdated === 'string') {
              // 既に文字列の場合はそのまま使用
            } else {
              lastUpdated = new Date().toISOString().slice(0, 16).replace('T', ' ')
            }
            
            return {
              id: fsApp.id,
              name: appData.name || appData.title || '無題のアプリ',
              description: appData.description || '',
              template: appData.templateId || appData.template || 'custom',
              templateId: appData.templateId || appData.template || undefined, // templateIdも保持
              mission: appData.mission || '',
              dataSource: appData.dataSource || { type: 'google-sheets' },
              status: appData.status || 'building',
              buildProgress: appData.buildProgress || {
                strategy: false,
                design: false,
                data: false,
              },
              lastUpdated: lastUpdated,
              views: appData.views || 0,
              createdAt: createdAt,
              deployment: appData.deployment || {
                dockerGenerated: false,
              },
            }
          })
          
          console.log('AppContext - 変換後のアプリ:', convertedApps)
          setApps(convertedApps)
        } catch (error) {
          console.error('AppContext - アプリの読み込みエラー:', error)
          // エラーが発生しても空配列を設定
          setApps([])
        }
      } else {
        console.log('AppContext - ユーザーがログインしていません')
        // ユーザーがログインしていない場合は空配列
        setApps([])
      }
    }
    loadApps()
  }, [authUser?.id])

  // アクティブなアプリが変更されたら、そのアプリのデータソースをFirestoreから読み込む
  useEffect(() => {
    const loadDataSources = async () => {
      if (activeAppId && authUser?.id) {
        try {
          const firestoreDataSources = await getDataSources(activeAppId)
          // FirestoreのDataSource型をアプリのDataSource型に変換
          const convertedDataSources: DataSource[] = firestoreDataSources.map(ds => ({
            id: ds.id,
            name: ds.name,
            type: ds.type === 'google_sheet' ? 'google-sheets' : ds.type === 'excel' ? 'excel' : 'csv',
            url: ds.config.fileUrl || (ds.config.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${ds.config.spreadsheetId}` : undefined),
            lastSynced: ds.updatedAt?.toDate?.()?.toISOString()
          }))
          setDataSources(convertedDataSources)
        } catch (error) {
          console.error('データソースの読み込みエラー:', error)
          // エラーが発生しても空配列を設定（データソースがない場合も正常）
          setDataSources([])
        }
      } else {
        // アプリが選択されていない場合は空配列
        setDataSources([])
      }
    }
    loadDataSources()
  }, [activeAppId, authUser?.id])
  
  // ダークモードの切り替え
  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
  }
  
  // ダークモードの適用（初期化時と状態変更時）
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])
  
  // ベンダーモード判定: ユーザーのロールが 'vendor' または 'admin' の場合
  const isVendorMode = user?.role === 'vendor' || user?.role === 'admin'

  // 新規アプリを作成（v2.0: シングルパーパス方式）
  const createNewApp = async (templateId?: 'inventory' | 'daily-report' | 'crm' | 'reservation' | 'custom'): Promise<string> => {
    if (!authUser?.id) {
      throw new Error('ログインが必要です')
    }

    const newAppId = `app-${Date.now()}`
    const templateNames = {
      inventory: '在庫管理アプリ',
      'daily-report': '日報アプリ',
      crm: '顧客管理アプリ',
      reservation: '予約管理アプリ',
      custom: '新しいアプリ',
    }
    // デフォルトでcustomテンプレートを選択
    const defaultTemplate: 'custom' = 'custom'
    const selectedTemplate = templateId || defaultTemplate
    const newApp: App = {
      id: newAppId,
      name: templateNames[selectedTemplate],
      description: '',
      template: selectedTemplate,
      mission: '',
      dataSource: { type: 'google-sheets' },
      status: 'building',
      buildProgress: {
        strategy: false,
        design: false,
        data: false,
      },
      lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
      views: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      deployment: {
        dockerGenerated: false,
      },
    }

    // Firestoreに保存（アプリのApp型のデータをそのまま保存）
    try {
      const appRef = doc(db, FIRESTORE_COLLECTIONS.APPS, newAppId)
      await setDoc(appRef, {
        title: newApp.name,
        ownerId: authUser.id,
        // アプリのApp型のデータをそのまま保存（追加フィールドとして）
        ...newApp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('アプリの作成エラー:', error)
      throw error
    }

    // ローカルstateも更新
    setApps([...apps, newApp])
    setActiveAppId(newAppId)
    return newAppId
  }

  // アプリを更新
  const updateApp = async (appId: string, updates: Partial<App>) => {
    // ローカルstateを更新
    const updatedApps = apps.map(app => {
      if (app.id === appId) {
        const updated = { ...app, ...updates, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') }
        // templateIdが更新された場合、templateも同期
        if (updates.templateId !== undefined) {
          updated.template = updates.templateId as App['template']
        }
        return updated
      }
      return app
    })
    setApps(updatedApps)

    // Firestoreにも保存
    if (authUser?.id) {
      try {
        const appRef = doc(db, FIRESTORE_COLLECTIONS.APPS, appId)
        const appToUpdate = updatedApps.find(a => a.id === appId)
        if (appToUpdate) {
          // FirestoreにはtemplateIdとtemplateの両方を保存（後方互換性のため）
          const firestoreData: any = {
            title: appToUpdate.name,
            ownerId: authUser.id,
            ...appToUpdate,
            updatedAt: serverTimestamp(),
          }
          // templateIdが設定されている場合、Firestoreにも保存
          if (appToUpdate.templateId) {
            firestoreData.templateId = appToUpdate.templateId
          }
          await setDoc(appRef, firestoreData, { merge: true })
        }
      } catch (error) {
        console.error('アプリの更新エラー:', error)
        // エラーが発生してもローカルstateは更新済み
      }
    }
  }

  // アプリを削除
  const deleteApp = async (appId: string) => {
    try {
      // Firestoreから削除
      await deleteAppFromFirestore(appId)
      
      // ローカルstateからも削除
      setApps(apps.filter(app => app.id !== appId))
      
      // 削除したアプリがアクティブなアプリの場合、アクティブなアプリをクリア
      if (activeAppId === appId) {
        setActiveAppId(null)
      }
    } catch (error) {
      console.error('アプリの削除エラー:', error)
      throw error
    }
  }

  return (
    <AppContext.Provider
      value={{
        user,
        apps,
        activeAppId,
        policyData,
        uiConfig,
        dataSources,
        isVendorMode,
        environment,
        isDarkMode,
        toggleDarkMode,
        setUser,
        setApps,
        setActiveAppId,
        setPolicyData,
        setUIConfig,
        setDataSources,
        setEnvironment,
        createNewApp,
        updateApp,
        deleteApp,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}















