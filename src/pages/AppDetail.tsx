import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'
import PolicyTab from '../components/tabs/PolicyTab'
import DataTab from '../components/tabs/DataTab'
import UITab from '../components/tabs/UITab'
import GraphTab from '../components/tabs/GraphTab'
import SettingsTab from '../components/tabs/SettingsTab'
import { Compass, Database, PenTool, BarChart3, Settings } from 'lucide-react'

const AppDetail = () => {
  useParams<{ appId: string }>()
  const [activeTab, setActiveTab] = useState<'policy' | 'data' | 'design' | 'graph' | 'settings'>('policy')

  const tabs = [
    { id: 'policy' as const, icon: Compass, label: '方針' },
    { id: 'data' as const, icon: Database, label: 'データ' },
    { id: 'design' as const, icon: PenTool, label: 'デザイン' },
    { id: 'graph' as const, icon: BarChart3, label: 'グラフ' },
    { id: 'settings' as const, icon: Settings, label: '設定' },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/apps" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900">サンプルアプリ</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="アプリ内を検索..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sub Sidebar */}
          <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-primary-600 text-white font-medium'
                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Tab Content */}
          <main className="flex-1 overflow-auto bg-white">
            {activeTab === 'policy' && <PolicyTab />}
            {activeTab === 'data' && <DataTab />}
            {activeTab === 'design' && <UITab />}
            {activeTab === 'graph' && <GraphTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppDetail


