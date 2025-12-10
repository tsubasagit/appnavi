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
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [apps, setApps] = useState<App[]>([])
  const [activeAppId, setActiveAppId] = useState<string | null>(null)
  const [policyData, setPolicyData] = useState<PolicyData | null>(null)
  const [uiConfig, setUIConfig] = useState<UIConfig | null>(null)
  const [dataSources, setDataSources] = useState<DataSource[]>([])

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








