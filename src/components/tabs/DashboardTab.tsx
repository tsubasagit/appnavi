import { CheckCircle2, Circle, Settings, Rocket, Bell, Megaphone, Users, TrendingUp, Briefcase, AlertCircle, PieChart, BarChart3, TrendingDown, Clock, CheckCircle, Package, ClipboardList, Calendar, FileText, ShoppingCart, Building2, Truck, CreditCard } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// テンプレート名を取得する関数（PolicyTabと同じ定義を使用）
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

  // CRMテンプレート用のダッシュボード
  const renderCRMDashboard = () => {
    const kpiData = [
      { label: '総顧客数', value: '1,240', change: '+12', changeType: 'positive' as const, icon: Users },
      { label: '今月の新規リード', value: '45', change: null, changeType: null, icon: TrendingUp },
      { label: '対応中の商談数', value: '8', change: null, changeType: null, icon: Briefcase },
      { label: '本日の要対応タスク', value: '3', change: '期限切れあり', changeType: 'warning' as const, icon: AlertCircle },
    ]

    const todos = [
      { id: 1, text: 'A社の契約更新日が近づいています', time: '2日前', priority: 'high' as const },
      { id: 2, text: 'B様へのフォローアップ電話', time: '本日14:00', priority: 'medium' as const },
      { id: 3, text: 'C社への提案書送付', time: '明日まで', priority: 'medium' as const },
    ]

    const activities = [
      { id: 1, user: '山田太郎', action: 'C社のステータスを「商談中」に変更しました', time: '10分前' },
      { id: 2, user: 'システム', action: '新規顧客D社が登録されました', time: '1時間前' },
      { id: 3, user: '佐藤花子', action: 'E社の商談を「成約」に更新しました', time: '2時間前' },
    ]

    return renderDashboardLayout(kpiData, todos, activities, [
      { title: '顧客属性グラフ', description: '業界別・地域別の円グラフ' },
      { title: '売上/商談の推移', description: '過去6ヶ月の棒グラフ' },
      { title: 'ファネル分析', description: 'リード → 商談 → 成約 の歩留まり' },
    ])
  }

  // 在庫管理テンプレート用のダッシュボード
  const renderInventoryDashboard = () => {
    const kpiData = [
      { label: '総在庫数', value: '2,450', change: '+120', changeType: 'positive', icon: Package },
      { label: '今月の入荷数', value: '85', change: null, changeType: null, icon: TrendingUp },
      { label: '今月の出荷数', value: '92', change: null, changeType: null, icon: Truck },
      { label: '在庫アラート', value: '5', change: '低在庫あり', changeType: 'warning', icon: AlertCircle },
    ]

    const todos = [
      { id: 1, text: '商品Aの在庫が少なくなっています', time: '1時間前', priority: 'high' },
      { id: 2, text: '商品Bの入荷確認', time: '本日15:00', priority: 'medium' },
    ]

    const activities = [
      { id: 1, user: '山田太郎', action: '商品Cを入荷しました', time: '5分前' },
      { id: 2, user: 'システム', action: '商品Dの在庫が閾値を下回りました', time: '30分前' },
    ]

    return renderDashboardLayout(kpiData, todos, activities, [
      { title: '在庫推移グラフ', description: '過去6ヶ月の在庫数の推移' },
      { title: '入出荷分析', description: '入荷・出荷の傾向分析' },
      { title: 'ロケーション別在庫', description: '倉庫・ロケーション別の在庫分布' },
    ])
  }

  // 日報テンプレート用のダッシュボード
  const renderDailyReportDashboard = () => {
    const kpiData = [
      { label: '今月の報告数', value: '156', change: '+8', changeType: 'positive', icon: ClipboardList },
      { label: '本日の報告数', value: '12', change: null, changeType: null, icon: TrendingUp },
      { label: '未報告者数', value: '3', change: null, changeType: null, icon: AlertCircle },
      { label: '今週の平均報告率', value: '95%', change: '+2%', changeType: 'positive', icon: CheckCircle },
    ]

    const todos = [
      { id: 1, text: '田中さんの日報が未提出です', time: '2時間前', priority: 'high' },
      { id: 2, text: '週次レポートの確認', time: '明日まで', priority: 'medium' },
    ]

    const activities = [
      { id: 1, user: '佐藤花子', action: '日報を提出しました', time: '10分前' },
      { id: 2, user: '鈴木一郎', action: '日報を提出しました', time: '1時間前' },
    ]

    return renderDashboardLayout(kpiData, todos, activities, [
      { title: '報告率グラフ', description: '日別・週別の報告率推移' },
      { title: '活動カテゴリ分析', description: '活動内容のカテゴリ別分布' },
      { title: 'チーム別報告状況', description: 'チームごとの報告状況' },
    ])
  }

  // 予約管理テンプレート用のダッシュボード
  const renderReservationDashboard = () => {
    const kpiData = [
      { label: '本日の予約数', value: '24', change: null, changeType: null, icon: Calendar },
      { label: '今月の予約数', value: '312', change: '+15', changeType: 'positive', icon: TrendingUp },
      { label: 'キャンセル数', value: '8', change: '-2', changeType: 'positive', icon: AlertCircle },
      { label: '利用率', value: '78%', change: '+5%', changeType: 'positive', icon: CheckCircle },
    ]

    const todos = [
      { id: 1, text: '会議室Aの予約が重複しています', time: '30分前', priority: 'high' },
      { id: 2, text: '会議室Bの清掃確認', time: '本日16:00', priority: 'medium' },
    ]

    const activities = [
      { id: 1, user: '山田太郎', action: '会議室Cを予約しました', time: '5分前' },
      { id: 2, user: 'システム', action: '会議室Dの予約がキャンセルされました', time: '1時間前' },
    ]

    return renderDashboardLayout(kpiData, todos, activities, [
      { title: '予約カレンダー', description: '日別・週別の予約状況' },
      { title: '利用率グラフ', description: '施設・設備別の利用率' },
      { title: '予約傾向分析', description: '時間帯別・曜日別の予約傾向' },
    ])
  }

  // 共通のダッシュボードレイアウト関数
  const renderDashboardLayout = (
    kpiData: Array<{ label: string; value: string; change: string | null; changeType: 'positive' | 'warning' | null; icon: any }>,
    todos: Array<{ id: number; text: string; time: string; priority: 'high' | 'medium' }>,
    activities: Array<{ id: number; user: string; action: string; time: string }>,
    charts: Array<{ title: string; description: string }>
  ) => {
    return (
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</div>
                <div className="text-sm text-slate-600 mb-1">{kpi.label}</div>
                {kpi.change && (
                  <div className={`text-xs font-medium ${
                    kpi.changeType === 'positive' ? 'text-green-600' :
                    kpi.changeType === 'warning' ? 'text-red-600' :
                    'text-slate-600'
                  }`}>
                    {kpi.changeType === 'positive' && '▲'}
                    {kpi.change}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left & Center: Charts */}
          <div className="lg:col-span-2 space-y-6">
            {charts.map((chart, index) => (
              <div key={index} className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  {index === 0 && <PieChart className="w-5 h-5 mr-2 text-primary-600" />}
                  {index === 1 && <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />}
                  {index === 2 && <TrendingDown className="w-5 h-5 mr-2 text-primary-600" />}
                  {chart.title}
                </h3>
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-center">
                    {index === 0 && <PieChart className="w-16 h-16 text-slate-400 mx-auto mb-2" />}
                    {index === 1 && <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-2" />}
                    {index === 2 && <TrendingDown className="w-16 h-16 text-slate-400 mx-auto mb-2" />}
                    <p className="text-sm text-slate-500">{chart.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Actions & Logs */}
          <div className="space-y-6">
            {/* ToDo List */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-primary-600" />
                ToDoリスト / アラート
              </h3>
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-3 rounded-lg border ${
                      todo.priority === 'high' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Circle className={`w-4 h-4 mt-0.5 ${
                        todo.priority === 'high' ? 'text-red-600' : 'text-slate-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900">{todo.text}</p>
                        <p className="text-xs text-slate-500 mt-1">{todo.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-600" />
                最新のアクティビティ
              </h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-600">
                        {activity.user === 'システム' ? 'S' : activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
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

  // テンプレートに応じたダッシュボードを表示
  const renderTemplateDashboard = () => {
    if (app?.template === 'crm') {
      return renderCRMDashboard()
    }
    
    if (app?.template === 'inventory') {
      return renderInventoryDashboard()
    }
    
    if (app?.template === 'daily-report') {
      return renderDailyReportDashboard()
    }
    
    if (app?.template === 'reservation') {
      return renderReservationDashboard()
    }
    
    // デフォルト（テンプレート未選択時）
    return (
      <div className="space-y-6">
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
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Template-based Dashboard */}
        <div className="mb-8">
          {renderTemplateDashboard()}
        </div>

        {/* テンプレートが選択されていない場合のみ表示 */}
        {app?.template !== 'crm' && (
          <div className="space-y-6">
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
        )}
      </div>
    </div>
  )
}

export default DashboardTab

