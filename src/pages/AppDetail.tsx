import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Info, Github, Puzzle, Terminal } from 'lucide-react'
import DashboardTab from '../components/tabs/DashboardTab'
import PolicyTab from '../components/tabs/PolicyTab'
import DataTab from '../components/tabs/DataTab'
import UITab from '../components/tabs/UITab'
import GraphTab from '../components/tabs/GraphTab'
import SettingsTab from '../components/tabs/SettingsTab'
import AboutTab from '../components/tabs/AboutTab'
import PluginsTab from '../components/tabs/PluginsTab'
import LogicTab from '../components/tabs/LogicTab'
import EnvironmentSwitcher from '../components/EnvironmentSwitcher'
import TutorialModal from '../components/TutorialModal'
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
  const { apps, setActiveAppId, isVendorMode } = useApp()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'policy' | 'data' | 'design' | 'graph' | 'settings' | 'about' | 'plugins' | 'logic'>('dashboard')
  const [showTutorial, setShowTutorial] = useState(false)

  // アプリ情報を取得
  const app = apps.find(a => a.id === appId)

  // 新規アプリ作成時または初回アクセス時にチュートリアルを表示（一度だけ、セッション単位）
  useEffect(() => {
    if (app && appId) {
      // チュートリアルが完了している場合は表示しない
      const tutorialCompleted = localStorage.getItem('appnavi_tutorial_completed') === 'true'
      if (tutorialCompleted) {
        return
      }

      // このセッション中に既に表示したかチェック
      const sessionTutorialShown = sessionStorage.getItem(`tutorial_shown_${appId}`) === 'true'
      if (sessionTutorialShown) {
        return
      }

      // 少し待ってからチュートリアルを表示（画面の読み込みを待つ）
      const timer = setTimeout(() => {
        setShowTutorial(true)
        // このセッション中に表示済みとしてマーク
        sessionStorage.setItem(`tutorial_shown_${appId}`, 'true')
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [appId]) // appIdのみを依存配列にすることで、アプリの状態変更時には再実行されない

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

  // 基本タブ
  const basicTabs = [
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'ダッシュボード' },
    { id: 'policy' as const, icon: Compass, label: '方針' },
    { id: 'design' as const, icon: PenTool, label: 'デザイン' },
    { id: 'data' as const, icon: Database, label: 'データ' },
  ]

  // カスタマイズグループ（カスタマイズ + ベンダーモード用タブ）
  const customizationTabs = [
    { id: 'graph' as const, icon: Code, label: 'カスタマイズ' },
    ...(isVendorMode ? [
      { id: 'plugins' as const, icon: Puzzle, label: 'Plugins' },
      { id: 'logic' as const, icon: Terminal, label: 'Logic' },
    ] : []),
  ]

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-black">
      {/* Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/apps')}
            className="text-lg font-bold text-slate-800 dark:text-white hover:text-primary-600 transition cursor-pointer"
          >
            AppNavi - {app?.name || '新しいアプリ'}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {app?.template && (
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <p className="text-sm font-medium text-slate-700 dark:text-white">{getTemplateName(app.template)}</p>
            </div>
          )}
          {/* 環境切り替えスイッチ（ベンダーモード時のみ表示） */}
          {isVendorMode && <EnvironmentSwitcher />}
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
            U
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* App Sidebar - Vertical Icon Bar */}
        <div className="w-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-4 z-10 h-full">
          {/* 上部セクション */}
          <div className="flex-1 flex flex-col items-center space-y-4">
            {/* 基本タブ */}
            <div className="flex flex-col items-center space-y-4">
              {basicTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={24} className="mb-1" />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* カスタマイズグループ */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-px bg-slate-200 dark:bg-slate-700"></div>
              {customizationTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                const isVendorTab = tab.id === 'plugins' || tab.id === 'logic'
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${
                      isActive
                        ? isVendorTab
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shadow-sm'
                          : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white'
                    }`}
                    title={tab.label}
                  >
                    <Icon size={24} className="mb-1" />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 下部セクション */}
          <div className="flex flex-col items-center space-y-4">
            {/* 設定セクション（独立） */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-px bg-slate-200 dark:bg-slate-700"></div>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${
                  activeTab === 'settings'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white'
                }`}
                title="設定"
              >
                <Settings size={24} className="mb-1" />
                <span className="text-[10px] font-medium">設定</span>
              </button>
            </div>
            
            {/* Footer Links */}
            <div className="flex flex-col items-center space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setActiveTab('about')}
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${
                  activeTab === 'about'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white'
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
                className="flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white"
                title="GitHub"
              >
                <Github size={24} className="mb-1" />
                <span className="text-[10px] font-medium">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <main className="flex-1 overflow-auto bg-white dark:bg-black">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'policy' && <PolicyTab />}
          {activeTab === 'design' && <UITab />}
          {activeTab === 'data' && <DataTab />}
          {activeTab === 'graph' && <GraphTab />}
          {activeTab === 'settings' && <SettingsTab />}
          {activeTab === 'about' && <AboutTab />}
          {activeTab === 'plugins' && isVendorMode && <PluginsTab />}
          {activeTab === 'logic' && isVendorMode && <LogicTab />}
        </main>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal
          onClose={() => setShowTutorial(false)}
          onSkip={() => setShowTutorial(false)}
        />
      )}
    </div>
  )
}

export default AppDetail


