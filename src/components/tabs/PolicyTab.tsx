import { useState, useEffect } from 'react'
import { Save, Lightbulb, Target, BarChart3, Sparkles, Compass, Search, X, Settings, Upload, Loader2, AlertCircle, Globe, UserCheck, Calendar, ClipboardList, RefreshCw, Github, Download, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { App } from '../../types'
import { allTemplates, Template } from '../../utils/templates'
import { uploadAsset } from '../../utils/githubAsset'
import { fetchTemplatesFromAssetSite, AssetSiteTemplate } from '../../utils/assetSite'

const PolicyTab = () => {
  const { apps, activeAppId, updateApp } = useApp()
  const { user: authUser } = useAuth()
  const app = apps.find(a => a.id === activeAppId)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<Template | null>(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [assetSiteTemplates, setAssetSiteTemplates] = useState<AssetSiteTemplate[]>([])
  const [isLoadingAssetSiteTemplates, setIsLoadingAssetSiteTemplates] = useState(false)
  const [installedTemplateIds, setInstalledTemplateIds] = useState<Set<string>>(new Set())
  const [isInstallingTemplate, setIsInstallingTemplate] = useState<string | null>(null)
  const [templatePages, setTemplatePages] = useState<string[]>([]) // テンプレートのページ一覧


  // 外部サイトからテンプレートを取得（初回のみ自動読み込み）
  useEffect(() => {
    const loadAssetSiteTemplates = async () => {
      setIsLoadingAssetSiteTemplates(true)
      try {
        const templates = await fetchTemplatesFromAssetSite(false) // キャッシュを使用
        setAssetSiteTemplates(templates)
      } catch (error) {
        console.error('外部サイトからのテンプレート取得エラー:', error)
        // エラーが発生しても続行（ローカルテンプレートのみ表示）
      } finally {
        setIsLoadingAssetSiteTemplates(false)
      }
    }
    
    loadAssetSiteTemplates()
  }, [])

  // インストール済みテンプレートIDを取得
  useEffect(() => {
    const loadInstalledTemplates = async () => {
      try {
        const { getInstalledTemplates } = await import('../../utils/firestore')
        const installed = await getInstalledTemplates()
        const installedIds = new Set(installed.map(t => t.templateId))
        
        // isDefault: trueのテンプレート（CRMとblank-page）を確実にインストール済みとして追加
        // これらは全ユーザーがデフォルトで利用可能
        const defaultTemplateIds = ['crm', 'blank-page']
        defaultTemplateIds.forEach(id => {
          installedIds.add(id)
        })
        
        setInstalledTemplateIds(installedIds)
        console.log('[PolicyTab] インストール済みテンプレート:', Array.from(installedIds))
        console.log('[PolicyTab] デフォルトテンプレート（isDefault: true）:', defaultTemplateIds)
      } catch (error) {
        console.error('インストール済みテンプレートの取得エラー:', error)
        // エラーが発生しても、デフォルトテンプレートは確実にインストール済みとして扱う
        const defaultTemplateIds = ['crm', 'blank-page']
        setInstalledTemplateIds(new Set(defaultTemplateIds))
      }
    }
    
    loadInstalledTemplates()
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

  // テンプレートインストール処理
  const handleInstallTemplate = async (assetTemplate: AssetSiteTemplate) => {
    if (isInstallingTemplate) return
    
    setIsInstallingTemplate(assetTemplate.templateId)
    try {
      // 詳細データを取得
      const { fetchTemplateDetails } = await import('../../utils/assetSite')
      const details = await fetchTemplateDetails(assetTemplate)
      
      // Firestoreにインストール
      const { installTemplateFromAssetSite } = await import('../../utils/firestore')
      await installTemplateFromAssetSite(assetTemplate, details)
      
      // インストール済みリストを更新
      setInstalledTemplateIds(prev => new Set([...prev, assetTemplate.templateId]))
      
      alert(`テンプレート「${assetTemplate.name}」をインストールしました。\n\nこれで、このテンプレートを選択して使用できます。`)
    } catch (error: any) {
      console.error('テンプレートインストールエラー:', error)
      alert(`テンプレートのインストールに失敗しました: ${error?.message || '不明なエラー'}`)
    } finally {
      setIsInstallingTemplate(null)
    }
  }

  // テンプレート詳細を表示（インストール不要）
  const handleViewTemplateDetails = async (template: Template) => {
    setSelectedTemplateForModal(template)
    setIsTemplateModalOpen(true)
    
    // テンプレートのページ一覧を取得
    try {
      const { getTemplate } = await import('../../utils/firestore')
      const templateData = await getTemplate(template.id)
      
      console.log('[PolicyTab] テンプレート詳細取得:', {
        templateId: template.id,
        templateData: templateData,
        hasUiStructure: !!templateData?.uiStructure,
        hasPages: !!templateData?.uiStructure?.pages,
        pagesCount: templateData?.uiStructure?.pages?.length || 0,
        pages: templateData?.uiStructure?.pages
      })
      
      if (templateData && templateData.uiStructure && templateData.uiStructure.pages) {
        const pageNames = templateData.uiStructure.pages.map(page => page.name)
        setTemplatePages(pageNames)
        console.log('[PolicyTab] テンプレートのページ一覧:', pageNames)
      } else {
        console.warn('[PolicyTab] テンプレートにページ情報がありません。Firestoreのテンプレートデータを確認してください。')
        setTemplatePages([])
      }
    } catch (error: any) {
      console.error('[PolicyTab] テンプレート詳細の取得エラー:', error)
      setTemplatePages([])
    }
  }

  // テンプレートを選択（インストール済みのみ）
  const handleSelectTemplate = (template: Template) => {
    // インストール済みテンプレートのみ選択可能
    if (!installedTemplateIds.has(template.id)) {
      alert('このテンプレートを使用するには、まずインストールが必要です。\n\nテンプレートカードの「インストール」ボタンをクリックしてください。')
      return
    }
    
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
      
      // 外部サイトから取得したテンプレートの詳細情報を取得
      const assetTemplate = assetSiteTemplates.find(t => t.templateId === templateId)
      const templateMetadata = assetTemplate ? {
        schemaUrl: assetTemplate.schemaUrl,
        viewsUrl: assetTemplate.viewsUrl,
        sampleDataUrl: assetTemplate.sampleDataUrl,
        version: assetTemplate.version,
        updatedAt: assetTemplate.updatedAt,
      } : undefined
      
      try {
        // テンプレートIDとtemplateフィールド、メタデータを更新
        await updateApp(app.id, {
          templateId: templateId,
          template: templateValue,
          templateMetadata: templateMetadata,
        })
        
        console.log('テンプレートIDを更新しました:', templateId)
        
        // Firestoreからテンプレート情報を取得（オプション、エラーは無視）
        try {
          const { getTemplate } = await import('../../utils/firestore')
          const templateData = await getTemplate(templateId)
          
          if (templateData && templateData.uiStructure) {
            // テンプレートのUI構成を適用
            const uiStructure = templateData.uiStructure
            
            // ページ構成をFirestoreに保存
            if (uiStructure.pages && uiStructure.pages.length > 0) {
              const { createPage } = await import('../../utils/firestore')
              
              // 各ページをFirestoreに保存
              for (const templatePage of uiStructure.pages) {
                const pageId = templatePage.id || `page_${Date.now()}`
                
                // TemplatePage型からPage型に変換
                // ComponentConfig型: { id, type, position, props, dataSourceId? }
                const pageData = {
                  title: templatePage.name,
                  layout: templatePage.layout || { type: 'grid', columns: 12, gap: '1rem' },
                  components: (templatePage.components || []).map(comp => ({
                    id: comp.id,
                    type: comp.type as string, // TemplateComponentTypeからstringに変換
                    position: comp.position || { x: 0, y: 0, width: 12, height: 1 },
                    props: comp.props || {},
                    dataSourceId: comp.dataSourceId,
                  })),
                  order: templatePage.order || 0,
                }
                
                try {
                  if (!authUser?.id) {
                    throw new Error('ログインが必要です')
                  }
                  await createPage(authUser.id, app.id, pageId, pageData)
                  console.log(`ページ "${templatePage.name}" (${pageId}) を作成しました`)
                } catch (pageError: any) {
                  console.error(`ページ "${templatePage.name}" の作成エラー:`, pageError)
                  // ページ作成エラーは続行（他のページは作成を試みる）
                }
              }
              
              console.log(`テンプレートの${uiStructure.pages.length}個のページを作成しました`)
            }
            
            // テーマ設定は現在のApp型ではサポートされていないため、コメントアウト
            // 将来的にテーマ設定をサポートする場合は、App型にthemeフィールドを追加する必要があります
            // if (uiStructure.theme) {
            //   await updateApp(app.id, {
            //     theme: uiStructure.theme,
            //   })
            // }
            
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

  // 外部サイトからのテンプレートをTemplate型に変換
  const convertedAssetSiteTemplates: Template[] = assetSiteTemplates.map(assetTemplate => {
    // アイコンをマッピング（既存のテンプレートと同じアイコンを使用）
    const iconMap: Record<string, any> = {
      'crm': UserCheck,
      'google-calendar-group': Calendar,
      'daily-report': ClipboardList,
      'auto-integration': RefreshCw,
    }
    
    return {
      id: assetTemplate.templateId,
      name: assetTemplate.name,
      description: assetTemplate.description,
      icon: iconMap[assetTemplate.templateId] || Target,
      color: assetTemplate.color,
      category: assetTemplate.category,
      preview: assetTemplate.features?.join('、') || assetTemplate.description,
      author: assetTemplate.author,
    }
  })

  // すべてのテンプレートを統合（重複を避ける）
  const filteredAssetTemplates = convertedAssetSiteTemplates.filter(
    assetTemplate => !allTemplates.some(local => local.id === assetTemplate.id)
  )

  // デバッグ: ログ出力（useEffectではなく、直接実行）
  if (assetSiteTemplates.length > 0) {
    console.log('=== 外部サイトから取得したテンプレート ===')
    console.log(`取得件数: ${assetSiteTemplates.length}件`)
    assetSiteTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ID: ${template.templateId}, 名前: ${template.name}`)
    })
    
    console.log('=== 変換後の外部サイトテンプレート ===')
    console.log(`変換件数: ${convertedAssetSiteTemplates.length}件`)
    convertedAssetSiteTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ID: ${template.id}, 名前: ${template.name}`)
    })
    
    console.log('=== ローカルテンプレート ===')
    console.log(`ローカル件数: ${allTemplates.length}件`)
    allTemplates.forEach((template, index) => {
      console.log(`${index + 1}. ID: ${template.id}, 名前: ${template.name}`)
    })
    
    console.log('=== フィルタリング結果 ===')
    console.log(`外部サイトテンプレート: ${convertedAssetSiteTemplates.length}件`)
    console.log(`ローカルテンプレート: ${allTemplates.length}件`)
    console.log(`重複除外後の外部サイトテンプレート: ${filteredAssetTemplates.length}件`)
    console.log(`統合後の総テンプレート数: ${allTemplates.length + filteredAssetTemplates.length}件`)
    
    // 重複しているテンプレートIDを表示
    const duplicateIds = convertedAssetSiteTemplates
      .filter(assetTemplate => allTemplates.some(local => local.id === assetTemplate.id))
      .map(t => t.id)
    if (duplicateIds.length > 0) {
      console.log(`重複しているテンプレートID: ${duplicateIds.join(', ')}`)
    }
    
    // 新規のテンプレートIDを表示
    const newTemplateIds = filteredAssetTemplates.map(t => t.id)
    if (newTemplateIds.length > 0) {
      console.log(`新規テンプレートID: ${newTemplateIds.join(', ')}`)
    } else {
      console.log('新規テンプレートなし（すべてローカルと重複）')
    }
  }

  // blank-pageを最初に、その他をその後に配置
  const blankPageTemplate = allTemplates.find(t => t.id === 'blank-page')
  const otherTemplates = allTemplates.filter(t => t.id !== 'blank-page')
  const allAvailableTemplates = [
    ...(blankPageTemplate ? [blankPageTemplate] : []),
    ...otherTemplates,
    ...filteredAssetTemplates,
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
                  setIsLoadingAssetSiteTemplates(true)
                  try {
                    // キャッシュをクリアしてから取得
                    const { clearAssetSiteCache } = await import('../../utils/assetSite')
                    clearAssetSiteCache()
                    console.log('[PolicyTab] キャッシュをクリアしました')
                    
                    const templates = await fetchTemplatesFromAssetSite(true) // 強制更新
                    setAssetSiteTemplates(templates)
                    
                    console.log('[PolicyTab] 取得結果:', {
                      件数: templates.length,
                      テンプレートID: templates.map(t => t.templateId)
                    })
                    
                    if (templates.length > 0) {
                      // バージョン情報を含めたメッセージ
                      const templateList = templates.map(t => 
                        `- ${t.name} (${t.templateId})${t.version ? ` v${t.version}` : ''}${t.updatedAt ? ` - 更新: ${new Date(t.updatedAt).toLocaleDateString('ja-JP')}` : ''}`
                      ).join('\n')
                      
                      // 更新チェック
                      const { checkTemplateUpdates } = await import('../../utils/assetSite')
                      const hasUpdates = assetSiteTemplates.length > 0 && 
                        checkTemplateUpdates(assetSiteTemplates, templates)
                      
                      const updateMessage = hasUpdates ? '\n\n⚠️ テンプレートの更新を検出しました。' : ''
                      
                      alert(`${templates.length}件のテンプレートを外部サイトから取得しました。${updateMessage}\n\n取得したテンプレート:\n${templateList}`)
                    } else {
                      alert('外部サイトからテンプレートを取得できませんでした。\n\n考えられる原因:\n- 外部サイト（https://tsubasagit.github.io/AppNavi-asset/）にアクセスできない\n- CORS設定の問題\n- ネットワークエラー\n\nキャッシュがあれば、次回はキャッシュから読み込みます。')
                    }
                  } catch (error: any) {
                    const errorMessage = error?.message || '不明なエラー'
                    alert(`外部サイトからテンプレートを取得できませんでした。\n\nエラー: ${errorMessage}\n\n考えられる原因:\n- 外部サイト（https://tsubasagit.github.io/AppNavi-asset/）にアクセスできない\n- CORS設定の問題\n- ネットワークエラー`)
                    console.error('[PolicyTab] 外部サイトからのテンプレート取得エラー:', error)
                  } finally {
                    setIsLoadingAssetSiteTemplates(false)
                  }
                }}
                className="btn-secondary flex items-center space-x-2"
                disabled={isLoadingAssetSiteTemplates}
                title="外部サイトから最新のテンプレートを取得"
              >
                <RefreshCw size={16} className={isLoadingAssetSiteTemplates ? 'animate-spin' : ''} />
                <span>{isLoadingAssetSiteTemplates ? '取得中...' : '外部サイトから更新'}</span>
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
              const colorClasses: Record<string, string> = {
                blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
                green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
                purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300',
                orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300',
                slate: 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900/20 dark:border-slate-800 dark:text-slate-300',
              }
              const selectedClasses = isSelected ? 'ring-2 ring-primary-500 ring-offset-2 border-primary-500' : ''
              
              const isInstalled = installedTemplateIds.has(template.id)
              const assetTemplate = assetSiteTemplates.find(t => t.templateId === template.id)
              const isInstalling = isInstallingTemplate === template.id
              
              return (
                <div
                  key={template.id}
                  className={`p-4 border-2 rounded-xl transition text-left relative ${colorClasses[template.color as keyof typeof colorClasses]} ${selectedClasses} ${!isInstalled ? 'opacity-75' : ''}`}
                >
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    {isSelected && (
                      <div className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        選択中
                      </div>
                    )}
                    {isInstalled && (
                      <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        インストール済み
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
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs opacity-60">作成者: {template.author}</p>
                    {(() => {
                      // 外部サイトから取得したテンプレートの場合はバージョン情報を表示
                      const assetTemplate = assetSiteTemplates.find(t => t.templateId === template.id)
                      if (assetTemplate?.version) {
                        return (
                          <div className="flex items-center gap-1">
                            <span className="text-xs opacity-60 font-semibold">v{assetTemplate.version}</span>
                            {assetTemplate.updatedAt && (
                              <span className="text-xs opacity-50">
                                ({new Date(assetTemplate.updatedAt).toLocaleDateString('ja-JP')})
                              </span>
                            )}
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
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
                  
                  {/* 詳細を見るボタン（統一） */}
                  <div className="mt-4 pt-3 border-t border-current border-opacity-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewTemplateDetails(template)
                      }}
                      className="w-full btn-secondary flex items-center justify-center space-x-2 py-2 text-sm"
                    >
                      <BarChart3 size={16} />
                      <span>詳細を見る</span>
                    </button>
                  </div>
                </div>
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
            setTemplatePages([]) // モーダルを閉じる際にページ一覧をクリア
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
                  setTemplatePages([]) // モーダルを閉じる際にページ一覧をクリア
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

              {/* 外部サイトからのテンプレート詳細情報 */}
              {(() => {
                const assetTemplate = assetSiteTemplates.find(t => t.templateId === selectedTemplateForModal.id)
                if (assetTemplate) {
                  return (
                    <>
                      {/* 機能一覧 */}
                      {assetTemplate.features && assetTemplate.features.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2">主な機能</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {assetTemplate.features.map((feature, index) => (
                              <li key={index} className="text-slate-600 text-sm">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* バージョン情報 */}
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2">バージョン情報</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">バージョン:</span>
                            <span className="font-semibold">{assetTemplate.version || 'N/A'}</span>
                          </div>
                          {assetTemplate.updatedAt && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">更新日時:</span>
                              <span className="font-semibold">{new Date(assetTemplate.updatedAt).toLocaleDateString('ja-JP')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* リンク */}
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2">関連リンク</h3>
                        <div className="space-y-2">
                          {assetTemplate.demoUrl && (
                            <a
                              href={assetTemplate.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
                            >
                              <Globe size={16} />
                              <span>デモを見る</span>
                            </a>
                          )}
                          {assetTemplate.schemaUrl && (
                            <a
                              href={assetTemplate.schemaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
                            >
                              <BarChart3 size={16} />
                              <span>スキーマ定義</span>
                            </a>
                          )}
                          {assetTemplate.sampleDataUrl && (
                            <a
                              href={assetTemplate.sampleDataUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
                            >
                              <ClipboardList size={16} />
                              <span>サンプルデータ</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* タグ */}
                      {assetTemplate.tags && assetTemplate.tags.length > 0 && (
                        <div>
                          <h3 className="font-bold text-slate-900 mb-2">タグ</h3>
                          <div className="flex flex-wrap gap-2">
                            {assetTemplate.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )
                }
                return null
              })()}

              {/* ページ一覧 */}
              {templatePages.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">作成されるページ</h3>
                  <ul className="space-y-1">
                    {templatePages.map((pageName, index) => (
                      <li key={index} className="text-slate-600 text-sm flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                        {pageName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
                    setTemplatePages([])
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  キャンセル
                </button>
                {(() => {
                  const assetTemplate = assetSiteTemplates.find(t => t.templateId === selectedTemplateForModal.id)
                  const isInstalled = installedTemplateIds.has(selectedTemplateForModal.id)
                  const isInstalling = isInstallingTemplate === selectedTemplateForModal.id
                  
                  if (!isInstalled && assetTemplate) {
                    // 未インストールの場合：インストールボタンを表示
                    return (
                      <button
                        onClick={async () => {
                          setIsTemplateModalOpen(false)
                          await handleInstallTemplate(assetTemplate)
                          setSelectedTemplateForModal(null)
                          setTemplatePages([])
                        }}
                        disabled={isInstalling}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isInstalling ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>インストール中...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            <span>インストール</span>
                          </>
                        )}
                      </button>
                    )
                  } else if (isInstalled) {
                    // インストール済みの場合：選択するボタンを表示
                    return (
                      <button
                        onClick={() => {
                          setIsTemplateModalOpen(false)
                          setTemplatePages([])
                          // 確認ダイアログを表示
                          handleTemplateSelect()
                        }}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center space-x-2"
                      >
                        <Target size={18} />
                        <span>選択する</span>
                      </button>
                    )
                  } else {
                    // その他の場合（ローカルテンプレートなど）：選択するボタンを表示
                    return (
                      <button
                        onClick={() => {
                          setIsTemplateModalOpen(false)
                          setTemplatePages([])
                          // 確認ダイアログを表示
                          handleTemplateSelect()
                        }}
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium flex items-center space-x-2"
                      >
                        <Target size={18} />
                        <span>選択する</span>
                      </button>
                    )
                  }
                })()}
              </div>
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


