import { CheckCircle2, Circle, Settings, Rocket, Bell, Megaphone, Users, TrendingUp, Briefcase, AlertCircle, PieChart, BarChart3, TrendingDown, Clock, CheckCircle, Package, ClipboardList, Calendar, Truck, RefreshCw, Database } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// テンプレート名を取得する関数（PolicyTabと同じ定義を使用）
const getTemplateName = (templateId: string | null | undefined): string => {
  if (!templateId) return 'テンプレート未選択'
  
  const templateNames: Record<string, string> = {
    'crm': '顧客管理（CRM）',
    'inventory': '在庫管理',
    'daily-report': '日報チェック',
    'reservation': '予約管理',
    'google-calendar-group': 'Googleカレンダーのグループ化',
    'auto-integration': '自動連携',
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


  // CRMテンプレート用のダッシュボード（紫色のテーマ）
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

    return (
      <div className="space-y-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 md:p-8 rounded-xl">
        {/* ヘッダー */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            顧客管理（CRM）ダッシュボード
          </h2>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
            顧客情報、商談管理、活動履歴を一元管理
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-4 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">{kpi.value}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">{kpi.label}</div>
                {kpi.change && (
                  <div className={`text-xs font-medium ${
                    kpi.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                    kpi.changeType === 'warning' ? 'text-red-600 dark:text-red-400' :
                    'text-purple-600 dark:text-purple-400'
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
            {[
              { title: '顧客属性グラフ', description: '業界別・地域別の円グラフ', icon: PieChart },
              { title: '売上/商談の推移', description: '過去6ヶ月の棒グラフ', icon: BarChart3 },
              { title: 'ファネル分析', description: 'リード → 商談 → 成約 の歩留まり', icon: TrendingDown },
            ].map((chart, index) => {
              const ChartIcon = chart.icon
              return (
                <div key={index} className="bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                    <ChartIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                    {chart.title}
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-center">
                      <ChartIcon className="w-16 h-16 text-purple-400 dark:text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-purple-600 dark:text-purple-400">{chart.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: Actions & Logs */}
          <div className="space-y-6">
            {/* ToDo List */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                ToDoリスト / アラート
              </h3>
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-3 rounded-lg border ${
                      todo.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Circle className={`w-4 h-4 mt-0.5 ${
                        todo.priority === 'high' ? 'text-red-600 dark:text-red-400' : 'text-purple-400 dark:text-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-white">{todo.text}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{todo.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                最新のアクティビティ
              </h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-purple-100 dark:border-purple-800 last:border-0">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                        {activity.user === 'システム' ? 'S' : activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.time}</p>
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

  // 在庫管理テンプレート用のダッシュボード
  const renderInventoryDashboard = () => {
    const kpiData: Array<{ label: string; value: string; change: string | null; changeType: 'positive' | 'warning' | null; icon: any }> = [
      { label: '総在庫数', value: '2,450', change: '+120', changeType: 'positive', icon: Package },
      { label: '今月の入荷数', value: '85', change: null, changeType: null, icon: TrendingUp },
      { label: '今月の出荷数', value: '92', change: null, changeType: null, icon: Truck },
      { label: '在庫アラート', value: '5', change: '低在庫あり', changeType: 'warning', icon: AlertCircle },
    ]

    const todos: Array<{ id: number; text: string; time: string; priority: 'high' | 'medium' }> = [
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

  // 日報チェックテンプレート用のダッシュボード（緑色のテーマ）
  const renderDailyReportDashboard = () => {
    const kpiData = [
      { label: '本日の提出数', value: '12', change: '+2', changeType: 'positive' as const, icon: ClipboardList },
      { label: '未提出者数', value: '3', change: null, changeType: null, icon: AlertCircle },
      { label: '今週の提出率', value: '95%', change: '+2%', changeType: 'positive' as const, icon: CheckCircle },
      { label: '今月の報告数', value: '156', change: '+8', changeType: 'positive' as const, icon: TrendingUp },
    ]

    const todos = [
      { id: 1, text: '田中さんの日報が未提出です', time: '2時間前', priority: 'high' as const },
      { id: 2, text: '週次レポートの確認', time: '明日まで', priority: 'medium' as const },
    ]

    const activities = [
      { id: 1, user: '佐藤花子', action: '日報を提出しました', time: '10分前' },
      { id: 2, user: '鈴木一郎', action: '日報を提出しました', time: '1時間前' },
      { id: 3, user: 'システム', action: '日報の自動チェックが完了しました', time: '2時間前' },
    ]

    return (
      <div className="space-y-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 md:p-8 rounded-xl">
        {/* ヘッダー */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 flex items-center">
            <ClipboardList className="w-6 h-6 mr-2" />
            日報チェックダッシュボード
          </h2>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            日々の業務活動の記録とチェック、自動連携
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-lg border-2 border-green-200 dark:border-green-800 p-4 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-1">{kpi.value}</div>
                <div className="text-sm text-green-700 dark:text-green-300 mb-1">{kpi.label}</div>
                {kpi.change && (
                  <div className={`text-xs font-medium ${
                    kpi.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                    kpi.changeType === 'warning' ? 'text-red-600 dark:text-red-400' :
                    'text-green-600 dark:text-green-400'
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
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-green-200 dark:border-green-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                報告率グラフ
              </h3>
              <div className="h-64 flex items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-green-400 dark:text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600 dark:text-green-400">日別・週別の報告率推移</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-green-200 dark:border-green-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                活動カテゴリ分析
              </h3>
              <div className="h-64 flex items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-green-400 dark:text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600 dark:text-green-400">活動内容のカテゴリ別分布</p>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Actions & Logs */}
          <div className="space-y-6">
            {/* ToDo List */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-green-200 dark:border-green-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                ToDoリスト / アラート
              </h3>
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-3 rounded-lg border ${
                      todo.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Circle className={`w-4 h-4 mt-0.5 ${
                        todo.priority === 'high' ? 'text-red-600 dark:text-red-400' : 'text-green-400 dark:text-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-white">{todo.text}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{todo.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Activities */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-green-200 dark:border-green-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                最新のアクティビティ
              </h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-green-100 dark:border-green-800 last:border-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-600 dark:text-green-300">
                        {activity.user === 'システム' ? 'S' : activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.time}</p>
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

  // 予約管理テンプレート用のダッシュボード
  const renderReservationDashboard = () => {
    const kpiData: Array<{ label: string; value: string; change: string | null; changeType: 'positive' | 'warning' | null; icon: any }> = [
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
      <div className="space-y-6 bg-slate-50 dark:bg-black p-6 md:p-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{kpi.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">{kpi.label}</div>
                {kpi.change && (
                  <div className={`text-xs font-medium ${
                    kpi.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                    kpi.changeType === 'warning' ? 'text-red-600 dark:text-red-400' :
                    'text-slate-600 dark:text-slate-400'
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
              <div key={index} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  {index === 0 && <PieChart className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />}
                  {index === 1 && <BarChart3 className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />}
                  {index === 2 && <TrendingDown className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />}
                  {chart.title}
                </h3>
                <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    {index === 0 && <PieChart className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-2" />}
                    {index === 1 && <BarChart3 className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-2" />}
                    {index === 2 && <TrendingDown className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-2" />}
                    <p className="text-sm text-slate-500 dark:text-slate-400">{chart.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Actions & Logs */}
          <div className="space-y-6">
            {/* ToDo List */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                ToDoリスト / アラート
              </h3>
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-3 rounded-lg border ${
                      todo.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Circle className={`w-4 h-4 mt-0.5 ${
                        todo.priority === 'high' ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-white">{todo.text}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{todo.time}</p>
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

  // Googleカレンダー管理ダッシュボード（オレンジ色のテーマ）
  const renderGoogleCalendarDashboard = () => {
    const upcomingEvents = [
      { id: 1, title: '営業チーム定例会', time: '本日 10:00-11:00', group: '営業', status: 'upcoming' },
      { id: 2, title: 'プロジェクトX進捗会議', time: '本日 14:00-15:30', group: '開発', status: 'upcoming' },
      { id: 3, title: '新製品発表会', time: '明日 09:00-12:00', group: 'マーケティング', status: 'upcoming' },
    ]

    const recentActivities = [
      { id: 1, user: '山田', action: '「営業戦略会議」を更新しました', time: '5分前' },
      { id: 2, user: '佐藤', action: '「新製品発表会」に招待されました', time: '1時間前' },
      { id: 3, user: '鈴木', action: '「プロジェクトX進捗会議」の時間を変更しました', time: '2時間前' },
    ]

    return (
      <div className="space-y-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 md:p-8 rounded-xl">
        {/* ヘッダー */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Googleカレンダー管理ダッシュボード
          </h2>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
            グループ化されたカレンダーの一元管理と予定の可視化
          </p>
        </div>

        {/* KPIカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">本日の予定</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">5</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">+2件追加</p>
              </div>
              <Calendar className="w-10 h-10 text-orange-500 dark:text-orange-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">今週の参加予定</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">12</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">3グループ</p>
              </div>
              <Users className="w-10 h-10 text-orange-500 dark:text-orange-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">未対応の招待</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">1</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">-1件減少</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-500 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left & Center: Calendar and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* カレンダー表示エリア */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100">カレンダー表示</h3>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-8 text-center border border-orange-200 dark:border-orange-800">
                <Calendar className="w-20 h-20 mx-auto mb-4 text-orange-400 dark:text-orange-500" />
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">カレンダーコンポーネントは「デザイン」タブで設定できます</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6 shadow-lg">
                <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                  イベントタイプ別割合
                </h3>
                <div className="h-48 flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-orange-400 dark:text-orange-500 mx-auto mb-2" />
                    <p className="text-xs text-orange-600 dark:text-orange-400">会議、タスク、その他</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6 shadow-lg">
                <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                  グループ別イベント数
                </h3>
                <div className="h-48 flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-orange-400 dark:text-orange-500 mx-auto mb-2" />
                    <p className="text-xs text-orange-600 dark:text-orange-400">営業、開発、マーケティング</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Upcoming Events & Activities */}
          <div className="space-y-6">
            {/* 今後の予定一覧 */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100">今後の予定</h3>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-sm">{event.title}</h4>
                      <span className="px-2 py-0.5 bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                        {event.group}
                      </span>
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400">{event.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-orange-200 dark:border-orange-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
                最新のアクティビティ
              </h3>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-orange-100 dark:border-orange-800 last:border-0">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-300">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.time}</p>
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

  // 自動連携テンプレート用のダッシュボード
  const renderAutoIntegrationDashboard = () => {
    const kpiData = [
      { label: 'アクティブな連携', value: '8', change: '+2', changeType: 'positive' as const, icon: RefreshCw },
      { label: '本日の同期数', value: '156', change: null, changeType: null, icon: Database },
      { label: 'エラー数', value: '3', change: '-1', changeType: 'positive' as const, icon: AlertCircle },
      { label: '成功率', value: '98%', change: '+1%', changeType: 'positive' as const, icon: CheckCircle },
    ]

    const todos = [
      { id: 1, text: 'Salesforce連携でエラーが発生しています', time: '30分前', priority: 'high' as const },
      { id: 2, text: 'Googleカレンダー連携の設定確認', time: '本日16:00', priority: 'medium' as const },
    ]

    const activities = [
      { id: 1, user: 'システム', action: 'Googleカレンダー連携が正常に同期しました', time: '5分前' },
      { id: 2, user: 'システム', action: 'Slack連携が正常に同期しました', time: '10分前' },
      { id: 3, user: 'システム', action: 'Salesforce連携でエラーが発生しました', time: '30分前' },
    ]

    return (
      <div className="space-y-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 md:p-8 rounded-xl">
        {/* ヘッダー */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 flex items-center">
            <RefreshCw className="w-6 h-6 mr-2" />
            自動連携ダッシュボード
          </h2>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            各種サービスとの自動連携とデータ同期の管理
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-4 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">{kpi.value}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">{kpi.label}</div>
                {kpi.change && (
                  <div className={`text-xs font-medium ${
                    kpi.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                    kpi.changeType === 'warning' ? 'text-red-600 dark:text-red-400' :
                    'text-blue-600 dark:text-blue-400'
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
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                同期数の推移
              </h3>
              <div className="h-64 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-blue-400 dark:text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">過去7日間の同期数推移</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                サービス別同期数
              </h3>
              <div className="h-64 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-blue-400 dark:text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">Google Calendar、Slack、Salesforceなど</p>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Actions & Logs */}
          <div className="space-y-6">
            {/* ToDo List */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                ToDoリスト / アラート
              </h3>
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-3 rounded-lg border ${
                      todo.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Circle className={`w-4 h-4 mt-0.5 ${
                        todo.priority === 'high' ? 'text-red-600 dark:text-red-400' : 'text-blue-400 dark:text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-white">{todo.text}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{todo.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Activities */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-blue-200 dark:border-blue-800 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                最新のアクティビティ
              </h3>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-blue-100 dark:border-blue-800 last:border-0">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-300">
                        {activity.user === 'システム' ? 'S' : activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.time}</p>
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
    // templateIdとtemplateの両方をチェック
    const templateId = app?.templateId || app?.template
    
    if (templateId === 'crm') {
      return renderCRMDashboard()
    }
    
    if (templateId === 'inventory') {
      return renderInventoryDashboard()
    }
    
    if (templateId === 'daily-report') {
      return renderDailyReportDashboard()
    }
    
    if (templateId === 'reservation') {
      return renderReservationDashboard()
    }
    
    if (templateId === 'google-calendar-group') {
      return renderGoogleCalendarDashboard()
    }
    
    if (templateId === 'auto-integration') {
      return renderAutoIntegrationDashboard()
    }
    
    // デフォルト（テンプレート未選択時）
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            テンプレートを選択してください
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-md mx-auto">
            アプリを作成するには、まずテンプレートを選択する必要があります。
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-6 max-w-md mx-auto">
            テンプレートを選択すると、デザインやデータタブに進むことができます。
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>次のステップ:</strong> 方針タブでテンプレートを選択してください。
            </p>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="flex-1 bg-slate-50 dark:bg-black p-6 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Build Progress - 一番上に表示 */}
        {app?.buildProgress && (
          <div className="card mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">ビルド進捗</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">全体進捗</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border-2 ${
                app.buildProgress.strategy 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {app.buildProgress.strategy ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  )}
                  <h4 className="font-bold text-slate-900 dark:text-white">Step 1: Strategy</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  目的特化型テンプレートを選択し、スキーマとロジックを設定
                </p>
              </div>
              <div className={`p-4 rounded-lg border-2 ${
                app.buildProgress.design 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {app.buildProgress.design ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  )}
                  <h4 className="font-bold text-slate-900 dark:text-white">Step 2: Design</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  テーマエンジンでブランディングとUIを設定
                </p>
              </div>
              <div className={`p-4 rounded-lg border-2 ${
                app.buildProgress.data 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {app.buildProgress.data ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  )}
                  <h4 className="font-bold text-slate-900 dark:text-white">Step 3: Data</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  データソースを接続し、Zero Migrationを実現
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Template-based Dashboard */}
        {renderTemplateDashboard()}

      </div>
    </div>
  )
}

export default DashboardTab

