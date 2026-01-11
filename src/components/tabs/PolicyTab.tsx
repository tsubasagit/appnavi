import { useState, useEffect } from 'react'
import { Save, Lightbulb, Target, BarChart3, Sparkles, Compass, Search, X, Settings, Upload, Download, Github, Loader2, AlertCircle, Globe, UserCheck, Calendar, ClipboardList, RefreshCw } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { App } from '../../types'
import { allTemplates, Template } from '../../utils/templates'
import { fetchTemplates, installAsset, uploadAsset, AssetMetadata } from '../../utils/githubAsset'
import { fetchTemplatesFromServer, TemplateServerTemplate } from '../../utils/templateServer'

const PolicyTab = () => {
  const { apps, activeAppId, updateApp } = useApp()
  const app = apps.find(a => a.id === activeAppId)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<Template | null>(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [githubTemplates, setGithubTemplates] = useState<AssetMetadata[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [serverTemplates, setServerTemplates] = useState<TemplateServerTemplate[]>([])
  const [isLoadingServerTemplates, setIsLoadingServerTemplates] = useState(false)

  // デフォルトでCRMを選択
  useEffect(() => {
    if (app && !app.template) {
      updateApp(app.id, { template: 'crm' })
    }
  }, [app, updateApp])

  // テンプレートサーバーからテンプレートを取得
  useEffect(() => {
    const loadServerTemplates = async () => {
      setIsLoadingServerTemplates(true)
      try {
        const templates = await fetchTemplatesFromServer()
        setServerTemplates(templates)
      } catch (error) {
        console.error('テンプレートサーバーからの取得エラー:', error)
        // エラーが発生しても続行（ローカルテンプレートのみ表示）
      } finally {
        setIsLoadingServerTemplates(false)
      }
    }
    
    loadServerTemplates()
  }, [])
  
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

  const [isAILoading, setIsAILoading] = useState(false)
  const [aiSuggestion, setAISuggestion] = useState<any>(null)

  const handleSave = async () => {
    // 保存処理
    console.log('Policy data saved:', formData)
    
    // AI提案を生成
    setIsAILoading(true)
    try {
      const { generateAISuggestion } = await import('../../utils/ai')
      const suggestion = await generateAISuggestion(formData)
      setAISuggestion(suggestion)
      
      // 提案されたテンプレートがあれば適用
      if (suggestion.template && app) {
        updateApp(app.id, { template: suggestion.template as App['template'] })
      }
      
      alert('保存しました。AIが最適なテンプレートとUI構成を提案しました。')
    } catch (error) {
      console.error('AI提案の生成に失敗しました:', error)
      alert('保存しました。AI提案の生成に失敗しましたが、手動で設定を続けることができます。')
    } finally {
      setIsAILoading(false)
    }
  }

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplateForModal(template)
    setIsTemplateModalOpen(true)
  }

  const handleTemplateSelect = async () => {
    if (app && selectedTemplateForModal) {
      // 確認ダイアログを表示
      setIsConfirmDialogOpen(true)
    }
  }

  const confirmTemplateChange = async () => {
    if (app && selectedTemplateForModal) {
      setIsConfirmDialogOpen(false)
      
      // テンプレートIDとtemplateフィールドを更新（Firestoreの取得に失敗しても続行）
      const templateId = selectedTemplateForModal.id
      const templateValue = templateId as App['template']
      
      try {
        // テンプレートIDとtemplateフィールドを更新
        await updateApp(app.id, {
          templateId: templateId,
          template: templateValue,
        })
        
        console.log('テンプレートIDを更新しました:', templateId)
        
        // Firestoreからテンプレート情報を取得（オプション、エラーは無視）
        try {
          const { getTemplate } = await import('../../utils/firestore')
          const templateData = await getTemplate(templateId)
          
          if (templateData && templateData.uiStructure) {
            // テンプレートのUI構成を適用
            const uiStructure = templateData.uiStructure
            
            // テーマ設定を適用
            if (uiStructure.theme) {
              await updateApp(app.id, {
                theme: uiStructure.theme,
              })
            }
            
            console.log('テンプレートのUI構成を適用しました:', templateData.name)
          }
        } catch (firestoreError: any) {
          // Firestoreからの取得に失敗しても、テンプレートIDの更新は成功しているので続行
          // エラーはログに記録するだけで、ユーザーには表示しない
          console.log('Firestoreからテンプレート情報を取得できませんでした（テンプレートが未作成の可能性があります）:', firestoreError?.message)
        }
        
        setIsTemplateModalOpen(false)
        setSelectedTemplateForModal(null)
        
        // 成功メッセージ（Firestoreの取得に失敗しても、テンプレートIDの更新は成功している）
        alert(`テンプレート「${selectedTemplateForModal.name}」を適用しました。`)
      } catch (error: any) {
        console.error('テンプレート適用エラー:', error)
        setIsTemplateModalOpen(false)
        setSelectedTemplateForModal(null)
        alert(`テンプレートの適用に失敗しました: ${error?.message || '不明なエラー'}`)
      }
    }
  }

  // テンプレートサーバーからのテンプレートをTemplate型に変換
  const convertedServerTemplates: Template[] = serverTemplates.map(serverTemplate => {
    // アイコンをマッピング（既存のテンプレートと同じアイコンを使用）
    const iconMap: Record<string, any> = {
      'crm': UserCheck,
      'google-calendar-group': Calendar,
      'daily-report': ClipboardList,
      'auto-integration': RefreshCw,
    }
    
    return {
      id: serverTemplate.templateId,
      name: serverTemplate.name,
      description: serverTemplate.description,
      icon: iconMap[serverTemplate.templateId] || Target,
      color: serverTemplate.color,
      category: serverTemplate.category,
      preview: serverTemplate.features?.join('、') || serverTemplate.description,
      author: serverTemplate.author,
    }
  })

  // ローカルテンプレートとサーバーテンプレートを統合（重複を避ける）
  const allAvailableTemplates = [
    ...allTemplates,
    ...convertedServerTemplates.filter(
      serverTemplate => !allTemplates.some(local => local.id === serverTemplate.id)
    ),
  ]

  // 検索フィルタリング
  const filteredTemplates = allAvailableTemplates?.filter(template => {
    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query)
    )
  }) || []

  // allTemplatesが読み込まれていない場合のエラーハンドリング
  if (!allTemplates || allTemplates.length === 0) {
    return (
      <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <p className="text-slate-600">テンプレートを読み込んでいます...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-black p-6 md:p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Template Selection */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Target size={20} className="mr-2 text-primary-500 dark:text-primary-400" />
              <h3 className="font-bold text-lg text-slate-700 dark:text-white">Step 1: Strategy - テンプレート選択</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={async () => {
                  setIsLoadingServerTemplates(true)
                  try {
                    const templates = await fetchTemplatesFromServer()
                    setServerTemplates(templates)
                    alert(`${templates.length}件のテンプレートをサーバーから取得しました。`)
                  } catch (error) {
                    alert('テンプレートサーバーからテンプレートを取得できませんでした。')
                    console.error(error)
                  } finally {
                    setIsLoadingServerTemplates(false)
                  }
                }}
                className="btn-secondary flex items-center space-x-2"
                disabled={isLoadingServerTemplates}
                title="テンプレートサーバーから最新のテンプレートを取得"
              >
                <Globe size={16} />
                <span>{isLoadingServerTemplates ? '取得中...' : 'サーバーから取得'}</span>
              </button>
              <button
                onClick={async () => {
                  setIsLoadingTemplates(true)
                  try {
                    const templates = await fetchTemplates()
                    setGithubTemplates(templates)
                    setIsInstallModalOpen(true)
                  } catch (error) {
                    alert('GitHubからテンプレートを取得できませんでした。')
                    console.error(error)
                  } finally {
                    setIsLoadingTemplates(false)
                  }
                }}
                className="btn-secondary flex items-center space-x-2"
                disabled={isLoadingTemplates}
              >
                <Download size={16} />
                <span>新規インストール</span>
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-secondary flex items-center space-x-2 relative"
                title="OSS版のみ"
              >
                <Upload size={16} />
                <span>アップロード</span>
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] px-1 rounded">OSS</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            目的特化型テンプレートから選択してください。各テンプレートには、その業務に必要な標準的なビジネスロジック（在庫引き当て、ステータス遷移など）がプリセットされています。
          </p>
          
          {/* 検索バー */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="テンプレートを検索... (例: 在庫、日報、顧客管理、予約など)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
            {searchQuery && (
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {filteredTemplates.length}件のテンプレートが見つかりました
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon
              // templateIdとtemplateの両方をチェック
              const currentTemplateId = app?.templateId || app?.template
              const isSelected = currentTemplateId === template.id
              const isFromServer = serverTemplates.some(st => st.templateId === template.id)
              const colorClasses: Record<string, string> = {
                blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
                green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
                purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300',
                orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300',
                slate: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900/20 dark:border-slate-800 dark:text-slate-300',
              }
              const selectedClasses = isSelected ? 'ring-2 ring-primary-500 ring-offset-2 border-primary-500' : ''
              
              return (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`p-4 border-2 rounded-xl transition text-left relative ${colorClasses[template.color as keyof typeof colorClasses]} ${selectedClasses} hover:shadow-md`}
                >
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    {isSelected && (
                      <div className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        選択中
                      </div>
                    )}
                    {isFromServer && (
                      <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Globe size={10} />
                        サーバー
                      </div>
                    )}
                  </div>
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
                      {template.id === 'google-calendar-group' && (
                        <div className="h-full bg-orange-50 rounded p-1.5">
                          <div className="grid grid-cols-7 gap-0.5 mb-1">
                            {[...Array(7)].map((_, i) => (
                              <div key={i} className={`h-2 rounded ${i === 2 || i === 4 ? 'bg-orange-300' : 'bg-orange-100'}`}></div>
                            ))}
                          </div>
                          <div className="flex gap-1 mb-1">
                            <div className="flex-1 h-3 bg-orange-200 rounded"></div>
                            <div className="w-8 h-3 bg-orange-300 rounded"></div>
                          </div>
                          <div className="flex gap-1">
                            <div className="flex-1 h-3 bg-orange-200 rounded"></div>
                            <div className="w-8 h-3 bg-orange-300 rounded"></div>
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
                      {template.id === 'auto-integration' && (
                        <div className="h-full bg-blue-50 rounded p-1.5">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                            <div className="flex-1 h-2 bg-blue-200 rounded"></div>
                            <div className="w-4 h-2 bg-blue-400 rounded"></div>
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                            <div className="flex-1 h-2 bg-blue-200 rounded"></div>
                            <div className="w-4 h-2 bg-blue-400 rounded"></div>
                          </div>
                          <div className="h-4 bg-blue-100 rounded flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
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
                disabled={isAILoading}
              >
                {isAILoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>AIが分析中...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>保存してAIに学習させる</span>
                  </>
                )}
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

      {/* テンプレート詳細モーダル */}
      {isTemplateModalOpen && selectedTemplateForModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setIsTemplateModalOpen(false)
            setSelectedTemplateForModal(null)
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedTemplateForModal.color === 'blue' ? 'bg-blue-600' :
                  selectedTemplateForModal.color === 'green' ? 'bg-green-600' :
                  selectedTemplateForModal.color === 'purple' ? 'bg-purple-600' :
                  selectedTemplateForModal.color === 'orange' ? 'bg-orange-600' :
                  'bg-slate-600'
                }`}>
                  {(() => {
                    const Icon = selectedTemplateForModal.icon
                    return <Icon className="w-6 h-6 text-white" />
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedTemplateForModal.name}</h2>
                  <p className="text-sm text-slate-500">{selectedTemplateForModal.category}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsTemplateModalOpen(false)
                  setSelectedTemplateForModal(null)
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* モーダルコンテンツ */}
            <div className="p-6 space-y-6">
              {/* 説明 */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">説明</h3>
                <p className="text-slate-600">{selectedTemplateForModal.description}</p>
              </div>

              {/* 作成者 */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">作成者</h3>
                <p className="text-slate-600">{selectedTemplateForModal.author}</p>
              </div>

              {/* プレビュー */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">プレビュー</h3>
                <p className="text-sm text-slate-600 mb-3">{selectedTemplateForModal.preview}</p>
                <div className="w-full h-48 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden shadow-sm p-3">
                  {selectedTemplateForModal.id === 'inventory' && (
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
                  {selectedTemplateForModal.id === 'daily-report' && (
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
                  {selectedTemplateForModal.id === 'crm' && (
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
                        <div className="flex-1 h-4 bg-purple-100 rounded"></div>
                        <div className="flex-1 h-4 bg-purple-100 rounded"></div>
                      </div>
                    </div>
                  )}
                  {selectedTemplateForModal.id === 'reservation' && (
                    <div className="h-full bg-orange-50 rounded p-2">
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className="h-2 bg-orange-200 rounded"></div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`h-8 rounded ${i < 2 ? 'bg-orange-300' : 'bg-orange-100'}`}></div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!['inventory', 'daily-report', 'crm', 'reservation'].includes(selectedTemplateForModal.id) && (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                      プレビュー画像
                    </div>
                  )}
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setIsTemplateModalOpen(false)
                    setSelectedTemplateForModal(null)
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleTemplateSelect}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
                >
                  このテンプレートに変更
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* インストールモーダル */}
      {isInstallModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setIsInstallModalOpen(false)
            setGithubTemplates([])
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Github className="w-6 h-6 text-slate-700" />
                  <h2 className="text-2xl font-bold text-slate-900">GitHubからテンプレートをインストール</h2>
                </div>
                <button
                  onClick={() => {
                    setIsInstallModalOpen(false)
                    setGithubTemplates([])
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                GitHubリポジトリ（tsubasagit/AppNavi-asset）から利用可能なテンプレートをインストールできます。
              </p>
            </div>
            <div className="p-6">
              {githubTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">利用可能なテンプレートが見つかりませんでした。</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {githubTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-900">{template.name}</h3>
                          <p className="text-xs text-slate-500">v{template.version}</p>
                        </div>
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">作成者: {template.author}</p>
                        <button
                          onClick={async () => {
                            try {
                              await installAsset(template)
                              setIsInstallModalOpen(false)
                              setGithubTemplates([])
                            } catch (error) {
                              alert('インストールに失敗しました。')
                              console.error(error)
                            }
                          }}
                          className="btn-primary text-xs px-3 py-1"
                        >
                          インストール
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* アップロードモーダル */}
      {isUploadModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Upload className="w-6 h-6 text-slate-700" />
                  <h2 className="text-2xl font-bold text-slate-900">テンプレートをアップロード</h2>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-slate-600 mb-6">
                テンプレートをGitHubリポジトリ（tsubasagit/AppNavi-asset）にアップロードします。
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-700 mb-2">
                  <strong>アップロード方法:</strong>
                </p>
                <ol className="text-sm text-slate-600 list-decimal list-inside space-y-1">
                  <li>GitHubリポジトリ（<a href="https://github.com/tsubasagit/AppNavi-asset" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">tsubasagit/AppNavi-asset</a>）にアクセス</li>
                  <li>templatesディレクトリに新しいテンプレートフォルダを作成</li>
                  <li>metadata.jsonとテンプレートファイルを追加</li>
                  <li>Pull Requestを作成してレビューを依頼</li>
                </ol>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  閉じる
                </button>
                <a
                  href="https://github.com/tsubasagit/AppNavi-asset"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Github size={16} />
                  <span>GitHubで開く</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* テンプレート変更確認ダイアログ */}
      {isConfirmDialogOpen && selectedTemplateForModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsConfirmDialogOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ダイアログヘッダー */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">テンプレート変更の確認</h3>
            </div>

            {/* ダイアログコンテンツ */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white font-medium mb-2">
                      テンプレート「{selectedTemplateForModal.name}」に変更しますか？
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        <strong className="text-yellow-800 dark:text-yellow-200">⚠️ 注意事項</strong>
                      </p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                        <li>今まで作ったページがすべて消えます</li>
                        <li>データが消えることはありません</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ダイアログフッター */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setIsConfirmDialogOpen(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                キャンセル
              </button>
              <button
                onClick={confirmTemplateChange}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                このテンプレートに変更する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PolicyTab


