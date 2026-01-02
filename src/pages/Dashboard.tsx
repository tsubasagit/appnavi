import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  TrendingUp, 
  Users, 
  FileText, 
  Package, 
  ClipboardList, 
  UserCheck, 
  Calendar,
  Rocket,
  CheckCircle2,
  Circle,
  ArrowRight,
  Layers,
  Database,
  Palette,
  Settings,
  Bell,
  Megaphone
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// テンプレート定義（目的特化型）
const templates = [
  {
    id: 'inventory' as const,
    name: '在庫管理',
    description: '在庫の入出荷、在庫数管理、ロケーション管理',
    icon: Package,
    color: 'blue',
    schema: ['items', 'transactions', 'locations'],
  },
  {
    id: 'daily-report' as const,
    name: '日報・活動報告',
    description: '日々の業務活動の記録と共有',
    icon: ClipboardList,
    color: 'green',
    schema: ['activities', 'reports', 'statuses'],
  },
  {
    id: 'crm' as const,
    name: '顧客管理（CRM）',
    description: '顧客情報、商談管理、活動履歴',
    icon: UserCheck,
    color: 'purple',
    schema: ['customers', 'deals', 'activities'],
  },
  {
    id: 'reservation' as const,
    name: '予約管理',
    description: '会議室、設備、サービスの予約管理',
    icon: Calendar,
    color: 'orange',
    schema: ['resources', 'bookings', 'schedules'],
  },
  {
    id: 'custom' as const,
    name: 'カスタム',
    description: 'ゼロから自由に設計',
    icon: Settings,
    color: 'slate',
    schema: [],
  },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const { createNewApp, apps } = useApp()

  const handleCreateNewApp = (templateId?: typeof templates[number]['id']) => {
    const newAppId = createNewApp(templateId)
    navigate(`/apps/${newAppId}`)
  }

  // お知らせデータ（サンプル）
  const announcements = [
    {
      id: '1',
      title: 'AppNavi v2.0 リリースのお知らせ',
      content: '新しい「One App, One Mission」アーキテクチャが利用可能になりました。',
      date: '2024-01-15',
      type: 'info' as const,
      isNew: true,
    },
    {
      id: '2',
      title: 'メンテナンス予定',
      content: '2024年1月20日 2:00-4:00にメンテナンスを実施します。',
      date: '2024-01-10',
      type: 'warning' as const,
      isNew: false,
    },
    {
      id: '3',
      title: '新機能: Docker出力機能',
      content: 'アプリをDockerプロジェクトとして出力できるようになりました。',
      date: '2024-01-08',
      type: 'success' as const,
      isNew: false,
    },
  ]

  const getAnnouncementIcon = (type: 'info' | 'warning' | 'success') => {
    switch (type) {
      case 'info':
        return <Bell className="w-5 h-5 text-blue-600" />
      case 'warning':
        return <Megaphone className="w-5 h-5 text-orange-600" />
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      default:
        return <Bell className="w-5 h-5 text-slate-600" />
    }
  }

  const getAnnouncementBgColor = (type: 'info' | 'warning' | 'success') => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'warning':
        return 'bg-orange-50 border-orange-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  return (
    <div className="p-6 md:p-8">
      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-6 h-6 text-primary-600" />
          <h1 className="text-3xl font-bold text-slate-900">Appnavi Builder</h1>
        </div>
        <p className="text-slate-600">
          「One App, One Mission」— 目的特化型アプリを3ステップで構築
        </p>
      </div>

      {/* お知らせ一覧 */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">お知らせ一覧</h3>
        </div>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-4 rounded-lg border-2 ${getAnnouncementBgColor(announcement.type)} transition hover:shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAnnouncementIcon(announcement.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 text-sm">{announcement.title}</h4>
                    {announcement.isNew && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        新着
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{announcement.content}</p>
                  <p className="text-xs text-slate-500">{announcement.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">シングルパーパス方式</h3>
            <p className="text-slate-700 leading-relaxed">
              WordPressが「ブログ」のためにインストールされるように、Appnaviは「特定の業務（在庫管理、日報、予約など）」のために個別にインスタンス化されます。
              各アプリは独立したDBとUIを持ち、シンプルで高速。必要であれば、API経由でアプリ間連携を行います。
            </p>
          </div>
        </div>
      </div>


      {/* Template Selection */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">新規アプリを作成</h2>
            <p className="text-sm text-slate-600 mt-1">目的特化型テンプレートから選択</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => {
            const Icon = template.icon
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
              green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
              purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
              orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
              slate: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100',
            }
            return (
              <button
                key={template.id}
                onClick={() => handleCreateNewApp(template.id)}
                className={`p-6 border-2 rounded-xl transition text-left ${colorClasses[template.color]}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    template.color === 'blue' ? 'bg-blue-600' :
                    template.color === 'green' ? 'bg-green-600' :
                    template.color === 'purple' ? 'bg-purple-600' :
                    template.color === 'orange' ? 'bg-orange-600' :
                    'bg-slate-600'
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{template.name}</h3>
                </div>
                <p className="text-sm opacity-80 mb-3">{template.description}</p>
                {template.schema.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.schema.map((schema) => (
                      <span key={schema} className="text-xs px-2 py-1 bg-white/50 rounded">
                        {schema}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Existing Apps Quick Access */}
      {apps.length > 0 && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">既存のアプリ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => {
              const template = templates.find(t => t.id === app.template)
              const TemplateIcon = template?.icon || FileText
              
              return (
                <Link
                  key={app.id}
                  to={`/apps/${app.id}`}
                  className="block p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <TemplateIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">{app.name}</h3>
                  </div>
                  {app.mission && (
                    <p className="text-sm text-slate-600">{app.mission}</p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Architecture Info */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900">Step 1: Strategy</h3>
          </div>
          <p className="text-sm text-slate-700">
            目的特化型テンプレートを選択。在庫管理、日報、CRMなど、業務に最適なスキーマとロジックがプリセットされます。
          </p>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900">Step 2: Design</h3>
          </div>
          <p className="text-sm text-slate-700">
            テーマエンジンでブランディング。プライマリカラー、フォント、UIキットを適用し、顧客のブランドに合わせます。
          </p>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-slate-900">Step 3: Data</h3>
          </div>
          <p className="text-sm text-slate-700">
            データソースを接続。Google Sheets/Excelを直接DBとして使用するか、PostgreSQLに移行。Zero Migrationを実現。
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
