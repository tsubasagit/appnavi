import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, 
  ClipboardList, 
  UserCheck, 
  Calendar,
  Settings,
  FileText,
  Plus,
  Layers,
  Rocket
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

const AppList = () => {
  const navigate = useNavigate()
  const { createNewApp, apps } = useApp()

  const handleCreateNewApp = (templateId?: typeof templates[number]['id']) => {
    const newAppId = createNewApp(templateId)
    navigate(`/apps/${newAppId}`)
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

      {/* Existing Apps Selection */}
      {apps.length > 0 && (
        <div className="card mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">アプリを選択</h2>
            <p className="text-sm text-slate-600">
              最初のアプリを選択してください。（あとで）変更もできます
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => {
              const template = templates.find(t => t.id === app.template)
              const TemplateIcon = template?.icon || FileText
              
              return (
                <button
                  key={app.id}
                  onClick={() => navigate(`/apps/${app.id}`)}
                  className="p-6 border-2 border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 transition text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <TemplateIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{app.name}</h3>
                  </div>
                  {app.mission && (
                    <p className="text-sm text-slate-600 mb-2">{app.mission}</p>
                  )}
                  {app.template && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                        {templates.find(t => t.id === app.template)?.name || 'カスタム'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        app.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : app.status === 'building'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {app.status === 'published' ? '公開中' : 
                         app.status === 'building' ? 'ビルド中' : '下書き'}
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

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
    </div>
  )
}

export default AppList

