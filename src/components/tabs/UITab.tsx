import { useState, useEffect } from 'react'
import {
  PenTool,
  Database,
  Zap,
  Settings,
  Layout,
  Layers,
  Plus,
  MoreVertical,
  Table,
  Type,
  Container,
  MousePointerClick,
  Eye,
  Rocket,
  Search,
  Filter,
  ChevronRight,
  X,
  List,
  LayoutGrid,
  Calendar,
  FileText,
  Sparkles,
  Edit,
  Copy,
  Trash2,
} from 'lucide-react'

// 型定義
type Screen = {
  id: string
  name: string
  path: string
}

type Component = {
  id: string
  type: 'table' | 'text' | 'container' | 'button' | 'header' | 'search'
  name: string
  children?: Component[]
}

type GlobalMode = 'design' | 'data' | 'automate' | 'settings'

const UITab = () => {
  // グローバルモード
  const [globalMode, setGlobalMode] = useState<GlobalMode>('design')

  // 左サイドバー
  const [leftTab, setLeftTab] = useState<'screens' | 'components'>('screens')
  const [screens, setScreens] = useState<Screen[]>([
    { id: '1', name: '一覧ページ', path: '/list' },
    { id: '2', name: '詳細ページ', path: '/detail' },
    { id: '3', name: '設定画面', path: '/settings' },
    { id: '4', name: 'ログイン', path: '/login' },
  ])
  const [activeScreenId, setActiveScreenId] = useState('1')
  const [showNewScreenModal, setShowNewScreenModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  // コンポーネントツリー
  const [components, setComponents] = useState<Component[]>([
    {
      id: 'header-1',
      type: 'header',
      name: 'ヘッダー',
    },
    {
      id: 'search-1',
      type: 'search',
      name: '検索バー',
    },
    {
      id: 'table-1',
      type: 'table',
      name: '営業活動報告テーブル',
    },
  ])

  // メインエリア
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>('table-1')

  // 右サイドバー
  const [inspectorTab, setInspectorTab] = useState<'general' | 'style' | 'data' | 'actions'>('general')

  // サンプルデータ
  const tableData = [
    { 日時: '2023/10/24', 担当者: '山田太郎', 顧客名: '株式会社A', 案件名: '商談', ステータス: '完了' },
    { 日時: '2023/10/24', 担当者: '鈴木花子', 顧客名: 'B商事', 案件名: '定期訪問', ステータス: '進行中' },
    { 日時: '2023/10/23', 担当者: '佐藤次郎', 顧客名: 'Cテック', 案件名: 'トラブル対応', ステータス: '完了' },
    { 日時: '2023/10/22', 担当者: '高橋優子', 顧客名: 'D産業', 案件名: '初回提案', ステータス: '保留' },
  ]

  // 選択されたコンポーネントを取得
  const selectedComponent = components.find((c) => c.id === selectedComponentId)

  // スクリーン操作
  const handleScreenAction = (screenId: string, action: 'rename' | 'duplicate' | 'delete') => {
    if (action === 'delete') {
      if (confirm('このページを削除してもよろしいですか？')) {
        setScreens(screens.filter((s) => s.id !== screenId))
        if (activeScreenId === screenId && screens.length > 1) {
          setActiveScreenId(screens.find((s) => s.id !== screenId)?.id || screens[0].id)
        }
      }
    } else if (action === 'duplicate') {
      const screen = screens.find((s) => s.id === screenId)
      if (screen) {
        const newScreen: Screen = {
          id: Date.now().toString(),
          name: `${screen.name} のコピー`,
          path: `${screen.path}-copy`,
        }
        setScreens([...screens, newScreen])
        setActiveScreenId(newScreen.id)
      }
    } else if (action === 'rename') {
      const newName = prompt('新しいページ名を入力してください:', screens.find((s) => s.id === screenId)?.name)
      if (newName) {
        setScreens(screens.map((s) => (s.id === screenId ? { ...s, name: newName } : s)))
      }
    }
  }

  // 新規スクリーン作成
  const handleCreateScreen = (layoutType: string) => {
    const layouts: Record<string, { name: string; path: string }> = {
      list: { name: 'リスト一覧', path: '/list' },
      card: { name: 'カード型', path: '/card' },
      calendar: { name: 'カレンダー', path: '/calendar' },
      template: { name: 'テンプレート', path: '/template' },
      ai: { name: 'AI生成', path: '/ai-generated' },
    }

    const layout = layouts[layoutType]
    if (layout) {
      const newScreen: Screen = {
        id: Date.now().toString(),
        name: layout.name,
        path: layout.path,
      }
      setScreens([...screens, newScreen])
      setActiveScreenId(newScreen.id)
      setShowNewScreenModal(false)
    }
  }

  // コンポーネントクリック
  const handleComponentClick = (componentId: string) => {
    setSelectedComponentId(componentId)
  }

  // 要素追加
  const handleAddElement = (type: Component['type']) => {
    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type,
      name: type === 'table' ? 'テーブル' : type === 'text' ? 'テキスト' : type === 'container' ? 'コンテナ' : 'ボタン',
    }
    setComponents([...components, newComponent])
    setSelectedComponentId(newComponent.id)
  }

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null)
      }
    }
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openMenuId])

  return (
    <div className="flex h-full bg-slate-50">
      {/* A. グローバルナビゲーション (64px固定) */}
      <div className="w-16 bg-white border-r border-slate-200 flex flex-col items-center py-4 space-y-4">
        <button
          onClick={() => setGlobalMode('design')}
          className={`w-12 h-12 flex items-center justify-center rounded-lg transition ${
            globalMode === 'design'
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
          title="Design"
        >
          <PenTool size={20} />
        </button>
        <button
          onClick={() => setGlobalMode('data')}
          className={`w-12 h-12 flex items-center justify-center rounded-lg transition ${
            globalMode === 'data'
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
          title="Data"
        >
          <Database size={20} />
        </button>
        <button
          onClick={() => setGlobalMode('automate')}
          className={`w-12 h-12 flex items-center justify-center rounded-lg transition ${
            globalMode === 'automate'
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
          title="Automate"
        >
          <Zap size={20} />
        </button>
        <button
          onClick={() => setGlobalMode('settings')}
          className={`w-12 h-12 flex items-center justify-center rounded-lg transition ${
            globalMode === 'settings'
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* B. 左サイドバー (280px固定) */}
      <div className="w-[280px] bg-white border-r border-slate-200 flex flex-col h-full">
        {/* ヘッダー */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">App Structure</h2>
          <button
            onClick={() => setShowNewScreenModal(true)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* タブ切り替え */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setLeftTab('screens')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition ${
              leftTab === 'screens'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Screens
          </button>
          <button
            onClick={() => setLeftTab('components')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition ${
              leftTab === 'components'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Components
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="flex-1 overflow-auto">
          {leftTab === 'screens' ? (
            <div className="p-2">
              {/* 検索バー */}
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Q Find screen..."
                  className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* スクリーン一覧 */}
              <div className="space-y-1">
                {screens.map((screen) => (
                  <div
                    key={screen.id}
                    className={`group relative flex items-center justify-between px-2 py-1.5 rounded text-sm cursor-pointer transition ${
                      activeScreenId === screen.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      setActiveScreenId(screen.id)
                      setOpenMenuId(null)
                    }}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      {activeScreenId === screen.id && (
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 flex-shrink-0"></span>
                      )}
                      <span className="truncate">{screen.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(openMenuId === screen.id ? null : screen.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition"
                    >
                      <MoreVertical size={14} />
                    </button>
                    {openMenuId === screen.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleScreenAction(screen.id, 'rename')
                            setOpenMenuId(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                        >
                          <Edit size={14} />
                          <span>Rename</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleScreenAction(screen.id, 'duplicate')
                            setOpenMenuId(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                        >
                          <Copy size={14} />
                          <span>Duplicate</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleScreenAction(screen.id, 'delete')
                            setOpenMenuId(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-2">
              {/* コンポーネントツリー */}
              <div className="space-y-1">
                {components.map((component) => (
                  <div
                    key={component.id}
                    className={`px-2 py-1.5 rounded text-sm cursor-pointer transition ${
                      selectedComponentId === component.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => handleComponentClick(component.id)}
                  >
                    <div className="flex items-center">
                      <Layers size={14} className="mr-2" />
                      <span>{component.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 要素追加エリア */}
        <div className="p-4 border-t border-slate-200">
          <div className="text-xs font-medium text-slate-600 mb-2">ADD ELEMENTS</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAddElement('table')}
              className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <Table size={20} className="text-slate-600 mb-1" />
              <span className="text-xs text-slate-600">Table</span>
            </button>
            <button
              onClick={() => handleAddElement('text')}
              className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <Type size={20} className="text-slate-600 mb-1" />
              <span className="text-xs text-slate-600">Text</span>
            </button>
            <button
              onClick={() => handleAddElement('container')}
              className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <Container size={20} className="text-slate-600 mb-1" />
              <span className="text-xs text-slate-600">Container</span>
            </button>
            <button
              onClick={() => handleAddElement('button')}
              className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <MousePointerClick size={20} className="text-slate-600 mb-1" />
              <span className="text-xs text-slate-600">Button</span>
            </button>
          </div>
        </div>
      </div>

      {/* C. メインエリア (flex-1) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ツールバー */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* パンくずリスト */}
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <span className="font-medium">サンプルアプリ</span>
              <ChevronRight size={14} />
              <span>{screens.find((s) => s.id === activeScreenId)?.name || ''}</span>
            </div>

            {/* デバイス切替 */}
            <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  previewMode === 'desktop'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  previewMode === 'mobile'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="btn-secondary flex items-center space-x-2 text-xs">
              <Eye size={14} />
              <span>Preview</span>
            </button>
            <button className="btn-primary flex items-center space-x-2 text-xs">
              <Rocket size={14} />
              <span>Publish</span>
            </button>
          </div>
        </div>

        {/* プレビューキャンバス */}
        <div className="flex-1 overflow-auto bg-slate-100 p-8">
          <div
            className={`bg-white rounded-lg shadow-lg mx-auto transition-all ${
              previewMode === 'mobile' ? 'max-w-sm' : 'max-w-5xl'
            }`}
          >
            {/* ヘッダー */}
            <div
              className={`bg-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg cursor-pointer transition ${
                selectedComponentId === 'header-1' ? 'ring-2 ring-blue-400 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-2'
              }`}
              onClick={() => handleComponentClick('header-1')}
            >
              <h2 className="font-bold">営業活動報告</h2>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">U</div>
            </div>

            {/* ヒントバナー */}
            <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <span>変更したい箇所をクリックしてください</span>
              </div>
            </div>

            {/* 検索バー */}
            <div
              className={`px-6 py-4 border-b border-slate-200 flex items-center space-x-2 cursor-pointer transition ${
                selectedComponentId === 'search-1' ? 'ring-2 ring-blue-400 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-2'
              }`}
              onClick={() => handleComponentClick('search-1')}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="案件名や担当者で検索..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="btn-secondary text-xs px-4 py-2">
                <Filter size={14} className="mr-1" />
                フィルター
              </button>
            </div>

            {/* テーブル */}
            <div
              className={`p-6 cursor-pointer transition ${
                selectedComponentId === 'table-1' ? 'ring-2 ring-blue-400 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-2'
              }`}
              onClick={() => handleComponentClick('table-1')}
            >
              {selectedComponentId === 'table-1' && (
                <div className="text-xs text-blue-600 font-medium mb-2">Table Component</div>
              )}
              <table className="w-full border-collapse">
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
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm text-slate-600">{row.日時}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{row.担当者}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{row.顧客名}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{row.案件名}</td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`font-medium ${
                            row.ステータス === '完了'
                              ? 'text-green-600'
                              : row.ステータス === '進行中'
                              ? 'text-blue-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {row.ステータス}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span>1-4 of 12 items</span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Prev</button>
                  <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* D. 右サイドバー (320px固定) */}
      <div className="w-[320px] bg-white border-l border-slate-200 flex flex-col h-full">
        {/* ヘッダー */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedComponent && (
              <>
                {selectedComponent.type === 'table' && <Table size={18} className="text-slate-600" />}
                {selectedComponent.type === 'text' && <Type size={18} className="text-slate-600" />}
                {selectedComponent.type === 'container' && <Container size={18} className="text-slate-600" />}
                {selectedComponent.type === 'button' && <MousePointerClick size={18} className="text-slate-600" />}
                {selectedComponent.type === 'header' && <Layout size={18} className="text-slate-600" />}
                {selectedComponent.type === 'search' && <Search size={18} className="text-slate-600" />}
                <h3 className="text-sm font-bold text-slate-800">{selectedComponent.name}</h3>
              </>
            )}
          </div>
          <button className="btn-primary text-xs px-3 py-1">Publish</button>
        </div>

        {/* タブ */}
        <div className="flex border-b border-slate-200">
          {(['general', 'style', 'data', 'actions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setInspectorTab(tab)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition ${
                inspectorTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab === 'general' ? 'General' : tab === 'style' ? 'Style' : tab === 'data' ? 'Data' : 'Actions'}
            </button>
          ))}
        </div>

        {/* プロパティフォーム */}
        <div className="flex-1 overflow-auto p-4">
          {selectedComponent ? (
            inspectorTab === 'general' ? (
              <div className="space-y-6">
                {/* 基本設定 */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-3">基本設定</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={selectedComponent.name}
                        onChange={(e) => {
                          setComponents(
                            components.map((c) => (c.id === selectedComponent.id ? { ...c, name: e.target.value } : c))
                          )
                        }}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {selectedComponent.type === 'table' && (
                      <>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Data Source</label>
                          <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Sales_Reports (Table)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Row Limit</label>
                          <input
                            type="number"
                            defaultValue={10}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">Sort By</label>
                          <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Date (Desc)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 text-xs text-slate-600">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span>Allow Search</span>
                          </label>
                          <label className="flex items-center space-x-2 text-xs text-slate-600">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span>Show Pagination</span>
                          </label>
                          <label className="flex items-center space-x-2 text-xs text-slate-600">
                            <input type="checkbox" className="rounded" />
                            <span>Allow Download CSV</span>
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* LAYOUT & SPACING */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 mb-3">LAYOUT & SPACING</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Width</label>
                      <div className="flex items-center space-x-2">
                        <select className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Full Width</option>
                        </select>
                        <input
                          type="text"
                          defaultValue="100%"
                          className="w-20 px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Padding (px)</label>
                      <input
                        type="number"
                        defaultValue={16}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Margin (px)</label>
                      <input
                        type="number"
                        defaultValue={0}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 text-center py-8">
                {inspectorTab === 'style' && 'Style settings coming soon...'}
                {inspectorTab === 'data' && 'Data settings coming soon...'}
                {inspectorTab === 'actions' && 'Actions settings coming soon...'}
              </div>
            )
          ) : (
            <div className="text-sm text-slate-500 text-center py-8">コンポーネントを選択してください</div>
          )}

          {selectedComponent && (
            <div className="mt-8 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  if (confirm('このコンポーネントを削除してもよろしいですか？')) {
                    setComponents(components.filter((c) => c.id !== selectedComponent.id))
                    setSelectedComponentId(null)
                  }
                }}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
              >
                Delete Component
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 新規スクリーン作成モーダル */}
      {showNewScreenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewScreenModal(false)}>
          <div
            className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">新しいページを作成</h3>
              <button
                onClick={() => setShowNewScreenModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'list', icon: List, label: 'リスト一覧' },
                { id: 'card', icon: LayoutGrid, label: 'カード型' },
                { id: 'calendar', icon: Calendar, label: 'カレンダー' },
                { id: 'template', icon: FileText, label: 'テンプレート' },
                { id: 'ai', icon: Sparkles, label: 'AI生成' },
              ].map((layout) => {
                const Icon = layout.icon
                return (
                  <button
                    key={layout.id}
                    onClick={() => handleCreateScreen(layout.id)}
                    className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition"
                  >
                    <Icon size={32} className="text-slate-600 mb-3" />
                    <span className="text-sm font-medium text-slate-700">{layout.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UITab
