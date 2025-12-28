import { useState, useEffect } from 'react'
import { Save, Lightbulb, Target, BarChart3, Sparkles, Compass, Package, ClipboardList, UserCheck, Calendar, Settings, Search, FileText, ShoppingCart, Building2, Truck, CreditCard, Users, Briefcase, FileCheck, BarChart, PieChart, TrendingUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { App } from '../../types'

// テンプレート定義（目的特化型）- 多数のテンプレートを追加
const allTemplates = [
  {
    id: 'crm' as const,
    name: '顧客管理（CRM）',
    description: '顧客情報、商談管理、活動履歴',
    icon: UserCheck,
    color: 'purple',
    category: '営業・マーケティング',
    preview: '顧客一覧、商談パイプライン、活動履歴タイムライン、営業ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'inventory' as const,
    name: '在庫管理',
    description: '在庫の入出荷、在庫数管理、ロケーション管理',
    icon: Package,
    color: 'blue',
    category: '在庫・物流',
    preview: '在庫一覧表、入出荷履歴、在庫数ダッシュボード、ロケーション管理画面',
    author: 'AppTalentHub',
  },
  {
    id: 'daily-report' as const,
    name: '日報・活動報告',
    description: '日々の業務活動の記録と共有',
    icon: ClipboardList,
    color: 'green',
    category: '業務管理',
    preview: '日報入力フォーム、活動一覧、カレンダー表示、チーム共有ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'reservation' as const,
    name: '予約管理',
    description: '会議室、設備、サービスの予約管理',
    icon: Calendar,
    color: 'orange',
    category: '予約・スケジュール',
    preview: '予約カレンダー、空き状況表示、予約フォーム、利用履歴一覧',
    author: 'AppTalentHub',
  },
  {
    id: 'document-management' as const,
    name: '文書管理',
    description: '契約書、資料、ファイルの一元管理',
    icon: FileText,
    color: 'blue',
    category: '文書・情報管理',
    preview: '文書一覧、フォルダ階層、検索機能、バージョン管理画面',
    author: 'AppTalentHub',
  },
  {
    id: 'e-commerce' as const,
    name: 'EC管理',
    description: '商品管理、注文処理、在庫連携',
    icon: ShoppingCart,
    color: 'green',
    category: 'EC・販売',
    preview: '商品一覧、注文管理画面、在庫状況、売上ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'asset-management' as const,
    name: '資産管理',
    description: '固定資産、設備、備品の管理',
    icon: Building2,
    color: 'purple',
    category: '資産・設備',
    preview: '資産一覧、設備台帳、メンテナンス履歴、資産評価ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'logistics' as const,
    name: '物流管理',
    description: '配送管理、配送ルート最適化',
    icon: Truck,
    color: 'orange',
    category: '在庫・物流',
    preview: '配送一覧、ルートマップ、配送状況追跡、配送実績ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'expense-management' as const,
    name: '経費精算',
    description: '経費申請、承認フロー、集計',
    icon: CreditCard,
    color: 'blue',
    category: '財務・会計',
    preview: '経費申請フォーム、承認フロー、経費一覧、集計レポート',
    author: 'AppTalentHub',
  },
  {
    id: 'hr-management' as const,
    name: '人事管理',
    description: '従業員情報、勤怠管理、評価',
    icon: Users,
    color: 'green',
    category: '人事・労務',
    preview: '従業員一覧、勤怠管理画面、評価シート、人事統計ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'project-management' as const,
    name: 'プロジェクト管理',
    description: 'タスク管理、進捗管理、リソース管理',
    icon: Briefcase,
    color: 'purple',
    category: 'プロジェクト',
    preview: 'プロジェクト一覧、ガントチャート、タスクボード、進捗ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'quality-control' as const,
    name: '品質管理',
    description: '検査記録、不良品管理、改善活動',
    icon: FileCheck,
    color: 'orange',
    category: '品質・製造',
    preview: '検査記録一覧、不良品管理画面、改善活動ログ、品質指標ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'sales-analysis' as const,
    name: '売上分析',
    description: '売上データの可視化と分析',
    icon: BarChart,
    color: 'blue',
    category: '分析・レポート',
    preview: '売上グラフ、時系列分析、商品別売上、地域別分析ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'budget-management' as const,
    name: '予算管理',
    description: '予算計画、実績管理、差異分析',
    icon: PieChart,
    color: 'green',
    category: '財務・会計',
    preview: '予算計画表、実績入力画面、差異分析グラフ、予算ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'performance-tracking' as const,
    name: '業績管理',
    description: 'KPI追跡、目標管理、ダッシュボード',
    icon: TrendingUp,
    color: 'purple',
    category: '分析・レポート',
    preview: 'KPI一覧、目標設定画面、進捗グラフ、業績ダッシュボード',
    author: 'AppTalentHub',
  },
  {
    id: 'custom' as const,
    name: 'カスタム',
    description: 'ゼロから自由に設計',
    icon: Settings,
    color: 'slate',
    category: 'その他',
    preview: '自由にカスタマイズ可能な画面構成',
    author: 'AppTalentHub',
  },
]

const PolicyTab = () => {
  const { apps, activeAppId, updateApp } = useApp()
  const app = apps.find(a => a.id === activeAppId)
  
  const [searchQuery, setSearchQuery] = useState('')

  // デフォルトでCRMを選択
  useEffect(() => {
    if (app && !app.template) {
      updateApp(app.id, { template: 'crm' })
    }
  }, [app, updateApp])
  
  const [formData, setFormData] = useState({
    appName: '営業活動報告アプリ',
    description: '日々の営業活動を記録し、チーム内で共有するアプリ',
    currentIssue: '情報が個人のメモ帳やバラバラのExcelに散らばっており、ナレッジが共有されていない。',
    solution: '訪問記録を一元管理し、外出先からでもスマホで入力・閲覧できるようにする。',
    kpi: '入力率100%達成と、商談の次回アクション設定率の向上。',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // 保存処理（実際の実装ではAPI呼び出し）
    console.log('Policy data saved:', formData)
    alert('保存しました。AIに学習させました。')
  }

  const handleTemplateSelect = (templateId: typeof allTemplates[number]['id']) => {
    if (app) {
      updateApp(app.id, { template: templateId as App['template'] })
    }
  }

  // 検索フィルタリング
  const filteredTemplates = allTemplates.filter(template => {
    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query)
    )
  })

  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Template Selection */}
        <div className="card mb-8">
          <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center">
            <Target size={20} className="mr-2 text-primary-500" /> Step 1: Strategy - テンプレート選択
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            目的特化型テンプレートから選択してください。各テンプレートには、その業務に必要な標準的なビジネスロジック（在庫引き当て、ステータス遷移など）がプリセットされています。
          </p>
          
          {/* 検索バー */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="テンプレートを検索... (例: 在庫、日報、顧客管理、予約など)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
            />
            {searchQuery && (
              <div className="mt-2 text-sm text-slate-500">
                {filteredTemplates.length}件のテンプレートが見つかりました
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon
              const isSelected = app?.template === template.id
              const colorClasses: Record<string, string> = {
                blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
                green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
                purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
                orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
                slate: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100',
              }
              const selectedClasses = isSelected ? 'ring-2 ring-primary-500 ring-offset-2 border-primary-500' : ''
              
              return (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-4 border-2 rounded-xl transition text-left relative ${colorClasses[template.color as keyof typeof colorClasses]} ${selectedClasses} hover:shadow-md`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      選択中
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      template.color === 'blue' ? 'bg-blue-600' :
                      template.color === 'green' ? 'bg-green-600' :
                      template.color === 'purple' ? 'bg-purple-600' :
                      template.color === 'orange' ? 'bg-orange-600' :
                      'bg-slate-600'
                    }`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm">{template.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{template.category}</p>
                    </div>
                  </div>
                  <p className="text-xs opacity-80 mb-2">{template.description}</p>
                  <p className="text-xs opacity-60 mb-3">作成者: {template.author}</p>
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                    <p className="text-xs font-semibold mb-2 opacity-90">プレビュー:</p>
                    <div className="w-full h-32 bg-white rounded-lg border border-current border-opacity-20 overflow-hidden shadow-sm p-2">
                      {template.id === 'inventory' && (
                        <div className="h-full flex flex-col gap-1">
                          <div className="flex gap-1">
                            <div className="flex-1 h-4 bg-blue-200 rounded"></div>
                            <div className="flex-1 h-4 bg-blue-200 rounded"></div>
                            <div className="flex-1 h-4 bg-blue-200 rounded"></div>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-1">
                            <div className="bg-slate-100 rounded p-1">
                              <div className="h-2 bg-slate-300 rounded mb-1"></div>
                              <div className="h-1 bg-slate-200 rounded"></div>
                            </div>
                            <div className="bg-slate-100 rounded p-1">
                              <div className="h-2 bg-slate-300 rounded mb-1"></div>
                              <div className="h-1 bg-slate-200 rounded"></div>
                            </div>
                            <div className="bg-slate-100 rounded p-1">
                              <div className="h-2 bg-slate-300 rounded mb-1"></div>
                              <div className="h-1 bg-slate-200 rounded"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      {template.id === 'daily-report' && (
                        <div className="h-full flex gap-2">
                          <div className="flex-1 bg-green-50 rounded p-1.5">
                            <div className="h-2 bg-green-200 rounded mb-1"></div>
                            <div className="h-1 bg-green-100 rounded mb-1"></div>
                            <div className="h-1 bg-green-100 rounded"></div>
                          </div>
                          <div className="w-16 bg-green-50 rounded p-1.5">
                            <div className="grid grid-cols-2 gap-0.5">
                              {[...Array(6)].map((_, i) => (
                                <div key={i} className={`h-3 rounded ${i < 2 ? 'bg-green-300' : 'bg-green-100'}`}></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {template.id === 'crm' && (
                        <div className="h-full flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <div className="flex-1 h-6 bg-purple-100 rounded"></div>
                            <div className="w-6 h-6 bg-purple-200 rounded-full"></div>
                          </div>
                          <div className="flex-1 bg-purple-50 rounded p-1.5">
                            <div className="h-2 bg-purple-200 rounded mb-1"></div>
                            <div className="h-1 bg-purple-100 rounded"></div>
                          </div>
                          <div className="flex gap-1">
                            <div className="flex-1 h-3 bg-purple-100 rounded"></div>
                            <div className="flex-1 h-3 bg-purple-200 rounded"></div>
                          </div>
                        </div>
                      )}
                      {template.id === 'reservation' && (
                        <div className="h-full bg-orange-50 rounded p-1.5">
                          <div className="grid grid-cols-7 gap-0.5 mb-1">
                            {[...Array(7)].map((_, i) => (
                              <div key={i} className={`h-2 rounded ${i === 2 ? 'bg-orange-300' : 'bg-orange-100'}`}></div>
                            ))}
                          </div>
                          <div className="grid grid-cols-4 gap-1">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className={`h-4 rounded ${i === 0 ? 'bg-orange-300' : 'bg-orange-100'}`}></div>
                            ))}
                          </div>
                        </div>
                      )}
                      {template.id === 'document-management' && (
                        <div className="h-full flex gap-1.5">
                          <div className="w-12 bg-blue-50 rounded p-1.5">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="h-3 bg-blue-200 rounded mb-1"></div>
                            ))}
                          </div>
                          <div className="flex-1 bg-blue-50 rounded p-1.5">
                            <div className="h-2 bg-blue-200 rounded mb-1"></div>
                            <div className="h-1 bg-blue-100 rounded mb-1"></div>
                            <div className="h-1 bg-blue-100 rounded"></div>
                          </div>
                        </div>
                      )}
                      {template.id === 'e-commerce' && (
                        <div className="h-full grid grid-cols-2 gap-1.5">
                          <div className="bg-green-50 rounded p-1.5">
                            <div className="h-8 bg-green-200 rounded mb-1"></div>
                            <div className="h-2 bg-green-100 rounded"></div>
                          </div>
                          <div className="bg-green-50 rounded p-1.5">
                            <div className="h-8 bg-green-200 rounded mb-1"></div>
                            <div className="h-2 bg-green-100 rounded"></div>
                          </div>
                        </div>
                      )}
                      {template.id === 'asset-management' && (
                        <div className="h-full flex flex-col gap-1">
                          <div className="flex gap-1">
                            <div className="w-8 h-8 bg-purple-200 rounded"></div>
                            <div className="flex-1">
                              <div className="h-2 bg-purple-100 rounded mb-1"></div>
                              <div className="h-1 bg-purple-50 rounded"></div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <div className="w-8 h-8 bg-purple-200 rounded"></div>
                            <div className="flex-1">
                              <div className="h-2 bg-purple-100 rounded mb-1"></div>
                              <div className="h-1 bg-purple-50 rounded"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      {template.id === 'logistics' && (
                        <div className="h-full bg-orange-50 rounded p-1.5">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-4 h-4 bg-orange-300 rounded"></div>
                            <div className="flex-1 h-2 bg-orange-200 rounded"></div>
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-4 h-4 bg-orange-300 rounded"></div>
                            <div className="flex-1 h-2 bg-orange-200 rounded"></div>
                          </div>
                          <div className="h-6 bg-orange-100 rounded"></div>
                        </div>
                      )}
                      {template.id === 'expense-management' && (
                        <div className="h-full bg-blue-50 rounded p-1.5">
                          <div className="h-3 bg-blue-200 rounded mb-1"></div>
                          <div className="flex gap-1 mb-1">
                            <div className="flex-1 h-2 bg-blue-100 rounded"></div>
                            <div className="w-8 h-2 bg-blue-300 rounded"></div>
                          </div>
                          <div className="h-2 bg-blue-100 rounded"></div>
                        </div>
                      )}
                      {template.id === 'hr-management' && (
                        <div className="h-full flex gap-1.5">
                          <div className="w-8 h-8 bg-green-200 rounded-full"></div>
                          <div className="flex-1 bg-green-50 rounded p-1.5">
                            <div className="h-2 bg-green-200 rounded mb-1"></div>
                            <div className="h-1 bg-green-100 rounded"></div>
                          </div>
                        </div>
                      )}
                      {template.id === 'project-management' && (
                        <div className="h-full bg-purple-50 rounded p-1.5">
                          <div className="flex gap-1 mb-1">
                            <div className="flex-1 h-2 bg-purple-200 rounded"></div>
                            <div className="w-4 h-2 bg-purple-300 rounded"></div>
                          </div>
                          <div className="flex gap-1 mb-1">
                            <div className="flex-1 h-2 bg-purple-200 rounded"></div>
                            <div className="w-6 h-2 bg-purple-300 rounded"></div>
                          </div>
                          <div className="h-4 bg-purple-100 rounded"></div>
                        </div>
                      )}
                      {template.id === 'quality-control' && (
                        <div className="h-full bg-orange-50 rounded p-1.5">
                          <div className="h-2 bg-orange-200 rounded mb-1"></div>
                          <div className="grid grid-cols-3 gap-0.5 mb-1">
                            {[...Array(6)].map((_, i) => (
                              <div key={i} className={`h-2 rounded ${i < 3 ? 'bg-orange-300' : 'bg-orange-100'}`}></div>
                            ))}
                          </div>
                          <div className="h-2 bg-orange-100 rounded"></div>
                        </div>
                      )}
                      {template.id === 'sales-analysis' && (
                        <div className="h-full bg-blue-50 rounded p-1.5">
                          <div className="h-8 bg-blue-200 rounded mb-1 flex items-end gap-0.5 px-1 pb-1">
                            {[4, 6, 3, 5, 7, 4].map((h, i) => (
                              <div key={i} className="flex-1 bg-blue-400 rounded-t" style={{ height: `${h * 4}px` }}></div>
                            ))}
                          </div>
                          <div className="h-1 bg-blue-100 rounded"></div>
                        </div>
                      )}
                      {template.id === 'budget-management' && (
                        <div className="h-full bg-green-50 rounded p-1.5">
                          <div className="flex items-center justify-center h-12 mb-1">
                            <div className="w-12 h-12 border-4 border-green-300 border-t-green-500 rounded-full"></div>
                          </div>
                          <div className="h-2 bg-green-200 rounded"></div>
                        </div>
                      )}
                      {template.id === 'performance-tracking' && (
                        <div className="h-full bg-purple-50 rounded p-1.5">
                          <div className="flex items-end gap-0.5 h-8 mb-1">
                            {[3, 5, 4, 6, 5, 7].map((h, i) => (
                              <div key={i} className="flex-1 bg-purple-300 rounded-t" style={{ height: `${h * 3}px` }}></div>
                            ))}
                          </div>
                          <div className="h-1 bg-purple-100 rounded"></div>
                        </div>
                      )}
                      {template.id === 'custom' && (
                        <div className="h-full bg-slate-50 rounded p-1.5 flex items-center justify-center">
                          <div className="text-center">
                            <Settings className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                            <div className="h-1 bg-slate-200 rounded w-16"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* アプリの方針・コンセプト - カスタムテンプレート選択時のみ表示 */}
        {app?.template === 'custom' && (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                  <Compass className="mr-3 text-primary-600" size={28} /> アプリの方針・コンセプト
                </h2>
                <p className="text-slate-500 mt-2">
                  ここに入力された内容は、AIがデータの分析やグラフ作成、デザイン提案を行う際の<br/>
                  <span className="font-bold text-slate-700 underline decoration-primary-300 decoration-2">
                    最も重要な判断基準（プロンプト）
                  </span>
                  として使用されます。
                </p>
              </div>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save size={18} />
                <span>保存してAIに学習させる</span>
              </button>
            </div>

            {/* Card 1: Identity */}
            <div className="card mb-6">
              <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center">
                <Target size={20} className="mr-2 text-primary-500" /> アプリの基本情報
              </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">アプリ名</label>
                <input
                  type="text"
                  value={formData.appName}
                  onChange={(e) => handleChange('appName', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  どんなアプリなのか? (概要)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="textarea-field"
                />
              </div>
            </div>
          </div>

            {/* Card 2: Problem & Solution */}
            <div className="card mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
              <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center">
                <Lightbulb size={20} className="mr-2 text-orange-500" /> 課題と解決策
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">現状の課題（Before）</label>
                  <textarea
                    value={formData.currentIssue}
                    onChange={(e) => handleChange('currentIssue', e.target.value)}
                    rows={6}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none h-32 bg-orange-50/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">どうやって解決するのか？（After）</label>
                  <textarea
                    value={formData.solution}
                    onChange={(e) => handleChange('solution', e.target.value)}
                    rows={6}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none h-32 bg-primary-50/30"
                  />
                </div>
              </div>
          </div>

            {/* Card 3: Success Metrics */}
            <div className="card mb-6">
              <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center">
                <BarChart3 size={20} className="mr-2 text-green-500" /> 成果指標
              </h3>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">その成果はどうやって図るのか？（KPI・目標）</label>
                <div className="flex items-start">
                  <textarea
                    value={formData.kpi}
                    onChange={(e) => handleChange('kpi', e.target.value)}
                    rows={4}
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none h-20 mr-4"
                  />
                  <div className="w-1/3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500">
                    <div className="flex items-center mb-2 font-bold text-slate-600">
                      <Sparkles size={12} className="mr-1 text-purple-500" /> AIのアドバイス
                    </div>
                    「入力率」や「アクション設定率」は数値化しやすいため、グラフダッシュボードで自動的に追跡ウィジェットを作成することをお勧めします。
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PolicyTab


