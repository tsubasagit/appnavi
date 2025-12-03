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
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <Link to="/apps" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-slate-800">サンプルアプリ</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="アプリ内を検索..."
              className="pl-9 pr-4 py-1.5 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-64 transition-all"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
            U
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* App Sidebar - Vertical Icon Bar */}
        <div className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-4 space-y-4 z-10">
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
  )
}

export default AppDetail


