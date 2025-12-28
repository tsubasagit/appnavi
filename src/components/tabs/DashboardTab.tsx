import { CheckCircle2, Circle, Settings, Rocket, Bell, Megaphone } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const DashboardTab = () => {
  const { apps, activeAppId } = useApp()
  const app = apps.find(a => a.id === activeAppId)

  // ビルド進捗を計算
  const getBuildProgress = () => {
    if (!app?.buildProgress) return 0
    const steps = [app.buildProgress.strategy, app.buildProgress.design, app.buildProgress.data]
    return steps.filter(Boolean).length / 3 * 100
  }

  const progress = getBuildProgress()

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
    <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Dashboard Section */}
        <div className="mb-8 space-y-6">
          {/* App Overview */}
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">アプリ概要</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  「One App, One Mission」— このアプリは特定の業務目的のために設計されています。
                  <br />
                  <span className="text-sm font-semibold text-indigo-700">
                    エンジニア・ベンダー向け: 万能なERPを目指さず、目的ごとに独立したアプリ（コンテナ群）を立ち上げます。
                    各アプリは独立したDBとUIを持ち、シンプルで高速。必要であれば、API経由でアプリ間連携を行います。
                  </span>
                </p>
                {app?.mission && (
                  <div className="bg-white/50 rounded-lg p-3 border border-blue-200">
                    <p className="text-sm font-medium text-slate-700 mb-1">目的（Mission）:</p>
                    <p className="text-sm text-slate-600">{app.mission}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Builder Message for Engineers */}
          <div className="card bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">For Engineers & Vendors</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Appnavi v2.0は、車輪の再発明を終わらせるための「エンジン」です。
                  面倒な基礎工事はAppnaviに任せ、あなたは「顧客固有のラストワンマイル」の課題解決に技術を使ってください。
                </p>
                <div className="bg-white/50 rounded-lg p-3 border border-indigo-200 text-sm">
                  <p className="font-semibold text-slate-900 mb-2">出力物:</p>
                  <ul className="space-y-1 text-slate-700">
                    <li>• 完全に独立したDockerプロジェクト（docker-compose.yml + ソースコード）</li>
                    <li>• Self-Contained: 外部依存なしで単独動作可能</li>
                    <li>• Hackable: 生成されたコードは標準的なReact/Node.js構成であり、自由に改変可能</li>
                    <li>• 「1顧客 1リポジトリ」の原則で、顧客ごとのカスタマイズをGitで管理</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Build Progress */}
          {app?.buildProgress && (
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-4">ビルド進捗</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">全体進捗</span>
                  <span className="text-sm font-bold text-slate-900">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${
                  app.buildProgress.strategy 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {app.buildProgress.strategy ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                    <h4 className="font-bold text-slate-900">Step 1: Strategy</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    目的特化型テンプレートを選択し、スキーマとロジックを設定
                  </p>
                </div>
                <div className={`p-4 rounded-lg border-2 ${
                  app.buildProgress.design 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {app.buildProgress.design ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                    <h4 className="font-bold text-slate-900">Step 2: Design</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    テーマエンジンでブランディングとUIを設定
                  </p>
                </div>
                <div className={`p-4 rounded-lg border-2 ${
                  app.buildProgress.data 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {app.buildProgress.data ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                    <h4 className="font-bold text-slate-900">Step 3: Data</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    データソースを接続し、Zero Migrationを実現
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* お知らせ一覧 */}
          <div className="card">
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
        </div>
      </div>
    </div>
  )
}

export default DashboardTab

