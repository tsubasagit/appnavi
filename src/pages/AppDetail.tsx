import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Info, Github } from 'lucide-react'
import DashboardTab from '../components/tabs/DashboardTab'
import PolicyTab from '../components/tabs/PolicyTab'
import DataTab from '../components/tabs/DataTab'
import UITab from '../components/tabs/UITab'
import GraphTab from '../components/tabs/GraphTab'
import SettingsTab from '../components/tabs/SettingsTab'
import AboutTab from '../components/tabs/AboutTab'
import { Compass, Database, PenTool, Code, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'

// テンプレート名を取得する関数
const getTemplateName = (templateId: string | null | undefined): string => {
  if (!templateId) return 'テンプレート未選択'
  
  const templateNames: Record<string, string> = {
    'crm': '顧客管理（CRM）',
    'inventory': '在庫管理',
    'daily-report': '日報・活動報告',
    'reservation': '予約管理',
    'document-management': '文書管理',
    'e-commerce': 'EC管理',
    'asset-management': '資産管理',
    'logistics': '物流管理',
    'expense-management': '経費管理',
    'hr-management': '人事管理',
    'project-management': 'プロジェクト管理',
    'quality-control': '品質管理',
    'sales-analysis': '売上分析',
    'budget-management': '予算管理',
    'performance-tracking': 'パフォーマンス追跡',
    'custom': 'カスタム',
  }
  
  return templateNames[templateId] || templateId
}

const AppDetail = () => {
  const { appId } = useParams<{ appId: string }>()
  const navigate = useNavigate()
  const { apps, setActiveAppId } = useApp()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'policy' | 'data' | 'design' | 'graph' | 'settings' | 'about'>('dashboard')

  // アプリ情報を取得
  const app = apps.find(a => a.id === appId)

  // activeAppIdを設定
  useEffect(() => {
    if (appId) {
      setActiveAppId(appId)
    }
  }, [appId, setActiveAppId])

  // アプリが存在しない場合はアプリ一覧にリダイレクト
  useEffect(() => {
    if (appId && !app) {
      navigate('/apps')
    }
  }, [appId, app, navigate])

  const tabs = [
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'ダッシュボード' },
    { id: 'policy' as const, icon: Compass, label: '方針' },
    { id: 'design' as const, icon: PenTool, label: 'デザイン' },
    { id: 'data' as const, icon: Database, label: 'データ' },
    { id: 'graph' as const, icon: Code, label: 'カスタマイズ' },
    { id: 'settings' as const, icon: Settings, label: '設定' },
  ]

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('settings')}
            className="text-lg font-bold text-slate-800 hover:text-primary-600 transition cursor-pointer"
          >
            AppNavi - {app?.name || '新しいアプリ'}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {app?.template && (
            <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg">
              <p className="text-sm font-medium text-slate-700">{getTemplateName(app.template)}</p>
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
            U
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* App Sidebar - Vertical Icon Bar */}
        <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 space-y-4 z-10">
          {/* Main Tabs */}
          <div className="flex-1 flex flex-col items-center space-y-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <Icon size={24} className="mb-1" />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
          
          {/* Footer Links */}
          <div className="flex flex-col items-center space-y-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setActiveTab('about')}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${
                activeTab === 'about'
                  ? 'bg-primary-50 text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
              title="About"
            >
              <Info size={24} className="mb-1" />
              <span className="text-[10px] font-medium">About</span>
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              title="GitHub"
            >
              <Github size={24} className="mb-1" />
              <span className="text-[10px] font-medium">GitHub</span>
            </a>
          </div>
        </div>

        {/* Tab Content */}
        <main className="flex-1 overflow-auto bg-white">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'policy' && <PolicyTab />}
          {activeTab === 'design' && <UITab />}
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'graph' && <GraphTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'about' && <AboutTab />}
        </main>
      </div>
    </div>
  )
}

export default AppDetail


