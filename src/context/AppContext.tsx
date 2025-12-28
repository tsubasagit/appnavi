import { createContext, useContext, useState, ReactNode } from 'react'
import { App, PolicyData, UIConfig, DataSource, User } from '../types'

interface AppContextType {
  user: User | null
  apps: App[]
  activeAppId: string | null
  policyData: PolicyData | null
  uiConfig: UIConfig | null
  dataSources: DataSource[]
  setUser: (user: User | null) => void
  setApps: (apps: App[]) => void
  setActiveAppId: (id: string | null) => void
  setPolicyData: (data: PolicyData | null) => void
  setUIConfig: (config: UIConfig | null) => void
  setDataSources: (sources: DataSource[]) => void
  createNewApp: () => string
  updateApp: (appId: string, updates: Partial<App>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [apps, setApps] = useState<App[]>([])
  const [activeAppId, setActiveAppId] = useState<string | null>(null)
  const [policyData, setPolicyData] = useState<PolicyData | null>(null)
  const [uiConfig, setUIConfig] = useState<UIConfig | null>(null)
  const [dataSources, setDataSources] = useState<DataSource[]>([])

  // 新規アプリを作成（v2.0: シングルパーパス方式）
  const createNewApp = (templateId?: 'inventory' | 'daily-report' | 'crm' | 'reservation' | 'custom'): string => {
    const newAppId = `app-${Date.now()}`
    const templateNames = {
      inventory: '在庫管理アプリ',
      'daily-report': '日報アプリ',
      crm: '顧客管理アプリ',
      reservation: '予約管理アプリ',
      custom: '新しいアプリ',
    }
    // デフォルトでCRMを選択
    const defaultTemplate: 'crm' = 'crm'
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
    setApps([...apps, newApp])
    setActiveAppId(newAppId)
    return newAppId
  }

  // アプリを更新
  const updateApp = (appId: string, updates: Partial<App>) => {
    setApps(apps.map(app => 
      app.id === appId 
        ? { ...app, ...updates, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') }
        : app
    ))
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
        setUser,
        setApps,
        setActiveAppId,
        setPolicyData,
        setUIConfig,
        setDataSources,
        createNewApp,
        updateApp,
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















