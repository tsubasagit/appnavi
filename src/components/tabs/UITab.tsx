import { useState, useEffect } from 'react'
import { Monitor, Smartphone, Eye, Rocket, Plus, Search, Sparkles, X, FileSpreadsheet, FileText, LayoutDashboard, ClipboardList } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const UITab = () => {
  const [selectedLayout] = useState('list')
  const [previewMode, setPreviewMode] = useState<'pc' | 'mobile'>('pc')
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [appStructureTab, setAppStructureTab] = useState<'screens' | 'components'>('screens')
  const [selectedScreen, setSelectedScreen] = useState<string | null>('一覧ページ')
  const [isNewScreenModalOpen, setIsNewScreenModalOpen] = useState(false)
  const { dataSources } = useApp()

  const sampleData = [
    { 日時: '2023/10/24', 担当者: '山田 太郎', 顧客名: '株式会社A', 案件名: '商談', ステータス: '完了' },
    { 日時: '2023/10/24', 担当者: '鈴木 花子', 顧客名: 'B商事', 案件名: '定期訪問', ステータス: '進行中' },
    { 日時: '2023/10/23', 担当者: '佐藤 次郎', 顧客名: 'Cテック', 案件名: 'トラブル対応', ステータス: '完了' },
  ]

  // データソース（AppContextから取得、なければサンプルデータを使用）
  const sampleDataSources = [
    {
      id: '1',
      name: '営業活動報告テーブル',
      type: 'google-sheets' as const,
      lastSynced: '2023/11/01',
      generatedScreens: '一覧（検索/フィルター付き）、詳細/編集フォーム',
    },
    {
      id: '2',
      name: '在庫管理台帳(Excel)',
      type: 'excel' as const,
      lastSynced: '2023/10/25',
      generatedScreens: '一覧（グラフ付き）、詳細/在庫更新フォーム',
    },
  ]
  
  // AppContextのデータソースを拡張形式に変換
  const availableDataSources = dataSources.length > 0 
    ? dataSources.map(ds => ({
        ...ds,
        generatedScreens: ds.type === 'google-sheets' 
          ? '一覧（検索/フィルター付き）、詳細/編集フォーム'
          : '一覧（グラフ付き）、詳細/在庫更新フォーム',
        lastSynced: ds.lastSynced || '未同期',
      }))
    : sampleDataSources

  // テンプレートリスト
  const templates = [
    {
      id: 'blank',
      name: '空白のページから開始',
      description: '自由にデザインできます。データ連携は後からいつでも可能です。',
      dataRequired: false,
      icon: Plus,
    },
    {
      id: 'dashboard',
      name: '総合ダッシュボード',
      description: '複数のデータソースに対応。全体像を把握するのに最適です。',
      dataRequired: true,
      dataCount: '複数',
      icon: LayoutDashboard,
    },
    {
      id: 'form',
      name: 'データ入力フォーム',
      description: 'データソース：1つ必須（登録用）。手動でのデータ入力に便利です。',
      dataRequired: true,
      dataCount: '1つ必須',
      icon: FileText,
    },
    {
      id: 'kanban',
      name: 'カンバン/タスクリスト',
      description: 'データソース：1つ必須（タスク用）。進捗を視覚的に管理できます。',
      dataRequired: true,
      dataCount: '1つ必須',
      icon: ClipboardList,
    },
  ]

  const handleDataSourceClick = (dataSourceId: string) => {
    // ダミー: 画面生成APIを呼び出す
    alert(`データソース ${dataSourceId} から画面を生成します`)
    setIsNewScreenModalOpen(false)
  }

  const handleTemplateClick = (templateId: string) => {
    // ダミー: テンプレート選択後の画面名入力ステップ
    alert(`テンプレート ${templateId} を選択しました。画面名を入力してください。`)
    setIsNewScreenModalOpen(false)
  }

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNewScreenModalOpen) {
        setIsNewScreenModalOpen(false)
      }
    }
    if (isNewScreenModalOpen) {
      document.addEventListener('keydown', handleEscape)
      // モーダルが開いている時は背景のスクロールを無効化
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isNewScreenModalOpen])

  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case 'google-sheets':
        return <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-xs">GS</div>
      case 'excel':
        return <FileSpreadsheet className="w-8 h-8 text-green-600" />
      default:
        return <FileText className="w-8 h-8 text-slate-400" />
    }
  }

  return (
    <div className="flex h-full">
      {/* New Screen Modal */}
      {isNewScreenModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // 背景クリックでモーダルを閉じる
            if (e.target === e.currentTarget) {
              setIsNewScreenModalOpen(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">新しい画面を作成</h2>
              <button
                onClick={() => setIsNewScreenModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Section 1: AI Auto-generation from Data */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  データからAI自動生成 (No Codeの最適解)
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  既存のデータソースを選択するだけで、AIが実用的な画面セット（一覧、詳細、編集フォーム）を自動構築します。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDataSources.map((dataSource, index) => (
                    <div
                      key={dataSource.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                        index === 0
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      onClick={() => handleDataSourceClick(dataSource.id)}
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        {getDataSourceIcon(dataSource.type)}
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 mb-1">{dataSource.name}</h4>
                          <p className="text-xs text-slate-600 mb-2">{dataSource.generatedScreens}</p>
                          <p className="text-xs text-slate-500">最終更新: {dataSource.lastSynced}</p>
                        </div>
                      </div>
                      <button
                        className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                          index === 0
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        このデータで生成開始
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Templates */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  テンプレートから作成(用途に合わせたガイド)
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  デザイン済みのレイアウトから始められます。必要なデータソースは後から連携可能です。プレビュー画像を確認してから選択してください。
                </p>
                <div className="space-y-3">
                  {templates.map((template) => {
                    const Icon = template.icon
                    return (
                      <div
                        key={template.id}
                        className="border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition"
                        onClick={() => handleTemplateClick(template.id)}
                      >
                        <div className="flex items-start space-x-4">
                          {template.id === 'blank' ? (
                            <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                              <Plus className="w-6 h-6 text-slate-400" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-8 h-8 text-slate-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 mb-1">{template.name}</h4>
                            <p className="text-sm text-slate-600 mb-2">{template.description}</p>
                            {template.dataRequired && (
                              <p className="text-xs text-slate-500">
                                データ連携：<span className="font-medium">{template.dataCount}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Left Panel - App Structure & Add Elements */}
      <aside className="w-80 bg-slate-50 border-r border-slate-200 p-6 overflow-auto">
        {/* App Structure Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-900">App Structure</h3>
            <button 
              onClick={() => setIsNewScreenModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
            >
              <Plus size={16} />
              <span>新規画面</span>
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-3">
            <button
              onClick={() => setAppStructureTab('screens')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                appStructureTab === 'screens'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Screens
            </button>
            <button
              onClick={() => setAppStructureTab('components')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                appStructureTab === 'components'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Components
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Q Find screen..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Screen/Component List */}
          {appStructureTab === 'screens' && (
            <div className="space-y-1">
              <button
                onClick={() => setSelectedScreen('一覧ページ')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                  selectedScreen === '一覧ページ'
                    ? 'bg-primary-50 border-2 border-primary-300 text-primary-700 font-medium'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {selectedScreen === '一覧ページ' && (
                  <span className="w-2 h-2 bg-primary-600 rounded-full inline-block mr-2"></span>
                )}
                一覧ページ
              </button>
              <button
                onClick={() => setSelectedScreen('詳細ページ')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                  selectedScreen === '詳細ページ'
                    ? 'bg-primary-50 border-2 border-primary-300 text-primary-700 font-medium'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                詳細ページ
              </button>
              <button
                onClick={() => setSelectedScreen('設定画面')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                  selectedScreen === '設定画面'
                    ? 'bg-primary-50 border-2 border-primary-300 text-primary-700 font-medium'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                設定画面
              </button>
              <button
                onClick={() => setSelectedScreen('ログイン')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                  selectedScreen === 'ログイン'
                    ? 'bg-primary-50 border-2 border-primary-300 text-primary-700 font-medium'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                ログイン
              </button>
            </div>
          )}

          {appStructureTab === 'components' && (
            <div className="space-y-1">
              <p className="text-sm text-slate-500 px-4 py-2">コンポーネント一覧</p>
            </div>
          )}
        </div>


        {selectedElement && (
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              右側のプレビュー画面で変更したい箇所をクリックすると、ここに設定が表示されます。
            </p>
          </div>
        )}
      </aside>

      {/* Right Panel - Preview */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Preview Controls */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('pc')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  previewMode === 'pc'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                <Monitor className="w-4 h-4 inline mr-1" />
                PC
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  previewMode === 'mobile'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                <Smartphone className="w-4 h-4 inline mr-1" />
                Mobile
              </button>
            </div>
            <span className="text-sm text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              自動保存済み
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>プレビュー</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Rocket className="w-4 h-4" />
              <span>公開する</span>
            </button>
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="flex-1 overflow-auto bg-slate-100 p-8">
          <div
            className={`bg-white rounded-xl shadow-lg border-2 border-dashed border-slate-300 mx-auto ${
              previewMode === 'mobile' ? 'max-w-sm' : 'max-w-5xl'
            }`}
          >
            {/* App Header */}
            <div
              className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl cursor-pointer"
              onClick={() => setSelectedElement('header')}
            >
              <h2 className="font-bold">営業活動報告</h2>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                U
              </div>
            </div>

            {/* Hint Banner */}
            <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <span>変更したい箇所をクリックしてください</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedLayout === 'list' && (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">日時</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">担当者</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">顧客名</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">案件名</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-600">{row.日時}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{row.担当者}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{row.顧客名}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{row.案件名}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className="text-green-600 font-medium">{row.ステータス}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UITab


