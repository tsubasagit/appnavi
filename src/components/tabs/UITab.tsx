import { useState, useEffect, useRef } from 'react'
import { Monitor, Smartphone, Eye, Rocket, Plus, X, PenTool, ChevronDown, ChevronRight, BarChart3, Grid3x3, FileText, Type, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ComponentConfig, Page, PageConfig, UIState, ComponentType } from '../../types'

const UITab = () => {
  const { dataSources, apps, activeAppId } = useApp()
  const app = apps.find(a => a.id === activeAppId)

  // State管理（仕様書に基づく）
  const [pages, setPages] = useState<Page[]>([
    { id: 1, name: 'Dashboard', path: '/', template: 'dashboard' },
  ])
  
  const [pageComponents, setPageComponents] = useState<PageConfig>({
    '1': [
      {
        id: 'c_123456789',
        type: 'heading',
        props: {
          text: 'Dashboard Overview',
          align: 'left'
        }
      },
      {
        id: 'c_987654321',
        type: 'kpi_grid',
        props: {
          title: 'Monthly Stats',
          dataSource: 'kpi_summary_sheet'
        }
      }
    ]
  })

  const [uiState, setUIState] = useState<UIState>({
    activePageId: 1,
    selectedComponentId: null
  })

  const [previewMode, setPreviewMode] = useState<'pc' | 'mobile'>('pc')
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false)
  const [isComponentPickerOpen, setIsComponentPickerOpen] = useState(false)
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null)
  const [componentPickerSlotIndex, setComponentPickerSlotIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPageDropdownOpen(false)
      }
    }

    if (isPageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPageDropdownOpen])

  // 現在のページのコンポーネントを取得
  const currentPageComponents = pageComponents[String(uiState.activePageId)] || []

  // ページ切り替え
  const handlePageChange = (pageId: number | string) => {
    setUIState({
      activePageId: pageId,
      selectedComponentId: null // ページ切り替え時は選択をリセット
    })
    setIsPageDropdownOpen(false)
  }

  // コンポーネント選択
  const handleComponentSelect = (componentId: string) => {
    setUIState(prev => ({
      ...prev,
      selectedComponentId: componentId
    }))
  }

  // コンポーネント追加（Slot位置に挿入）
  const handleAddComponent = (type: ComponentType, slotIndex: number) => {
    const newComponent: ComponentConfig = {
      id: `c_${Date.now()}`,
      type,
      props: getDefaultProps(type)
    }

    const currentComponents = [...currentPageComponents]
    currentComponents.splice(slotIndex, 0, newComponent)

    setPageComponents(prev => ({
      ...prev,
      [String(uiState.activePageId)]: currentComponents
    }))

    setIsComponentPickerOpen(false)
    setComponentPickerSlotIndex(null)
    setHoveredSlotIndex(null)
  }

  // コンポーネント削除
  const handleDeleteComponent = (componentId: string) => {
    const currentComponents = currentPageComponents.filter(c => c.id !== componentId)
    setPageComponents(prev => ({
      ...prev,
      [String(uiState.activePageId)]: currentComponents
    }))
    setUIState(prev => ({
      ...prev,
      selectedComponentId: null
    }))
  }

  // 新規ページ作成
  const handleCreatePage = () => {
    const newPageId = pages.length + 1
    const newPage: Page = {
      id: newPageId,
      name: `Page ${newPageId}`,
      path: `/page-${newPageId}`,
      template: 'blank'
    }
    setPages([...pages, newPage])
    setPageComponents(prev => ({
      ...prev,
      [String(newPageId)]: []
    }))
    handlePageChange(newPageId)
  }

  // デフォルトプロパティ
  const getDefaultProps = (type: ComponentType): Record<string, any> => {
    switch (type) {
      case 'heading':
        return { text: 'New Heading', align: 'left' }
      case 'kpi_grid':
        return { title: 'KPI Grid', dataSource: '' }
      case 'table':
        return { title: 'Table', dataSource: '' }
      default:
        return {}
    }
  }

  // コンポーネントアイコン取得
  const getComponentIcon = (type: ComponentType) => {
    switch (type) {
      case 'heading':
        return <Type className="w-4 h-4" />
      case 'kpi_grid':
        return <Grid3x3 className="w-4 h-4" />
      case 'table':
        return <FileText className="w-4 h-4" />
      case 'chart':
        return <BarChart3 className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  // コンポーネントレンダリング（Safe Rendering）
  const renderComponent = (component: ComponentConfig) => {
    const isSelected = component.id === uiState.selectedComponentId

    switch (component.type) {
      case 'heading':
        return (
          <div
            className={`p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleComponentSelect(component.id)
            }}
          >
            <h2 style={{ textAlign: component.props?.align || 'left' }}>
              {component.props?.text || 'Heading'}
            </h2>
          </div>
        )
      case 'kpi_grid':
        return (
          <div
            className={`p-4 bg-slate-50 rounded-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleComponentSelect(component.id)
            }}
          >
            <h3 className="font-bold mb-2">{component.props?.title || 'KPI Grid'}</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded border">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-slate-600">Metric {i}</div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'table':
        return (
          <div
            className={`p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleComponentSelect(component.id)
            }}
          >
            <h3 className="font-bold mb-2">{component.props?.title || 'Table'}</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Column 1</th>
                  <th className="text-left p-2">Column 2</th>
                  <th className="text-left p-2">Column 3</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Row 1</td>
                  <td className="p-2">Data</td>
                  <td className="p-2">Data</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      default:
        return (
          <div
            className={`p-4 border-2 border-dashed border-slate-300 rounded ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleComponentSelect(component.id)
            }}
          >
            <p className="text-slate-500">Unknown Component: {component.type}</p>
          </div>
        )
    }
  }

  // コンポーネントタイプ一覧
  const componentTypes: { type: ComponentType; label: string; icon: any }[] = [
    { type: 'heading', label: 'Heading', icon: Type },
    { type: 'kpi_grid', label: 'KPI Grid', icon: Grid3x3 },
    { type: 'table', label: 'Table', icon: FileText },
    { type: 'chart', label: 'Chart', icon: BarChart3 },
  ]

  // 選択中のコンポーネント
  const selectedComponent = currentPageComponents.find(c => c.id === uiState.selectedComponentId)

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <PenTool className="mr-2 text-primary-600" size={24} /> Step 2: Design - テーマエンジン
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              デザインをカスタマイズして、アプリの見た目を調整します。
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Structure & Navigation */}
        <aside className="w-80 bg-slate-50 border-r border-slate-200 p-6 overflow-auto">
          {/* Page Selector */}
          <div className="mb-6" ref={dropdownRef}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">Pages</h3>
              <button
                onClick={handleCreatePage}
                className="flex items-center space-x-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
              >
                <Plus size={16} />
                <span>新規</span>
              </button>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsPageDropdownOpen(!isPageDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 hover:bg-slate-50 transition"
              >
                <span>
                  {pages.find(p => p.id === uiState.activePageId)?.name || 'ページを選択'}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-slate-500 transition-transform ${isPageDropdownOpen ? 'transform rotate-180' : ''}`} 
                />
              </button>
              
              {isPageDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => handlePageChange(page.id)}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        uiState.activePageId === page.id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Component Tree */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">Components</h4>
            <div className="space-y-1">
              {currentPageComponents.length === 0 ? (
                <p className="text-sm text-slate-500 px-4 py-2">コンポーネントがありません</p>
              ) : (
                currentPageComponents.map((component) => {
                  const isSelected = component.id === uiState.selectedComponentId
                  const Icon = getComponentIcon(component.type)
                  
                  return (
                    <div
                      key={component.id}
                      onClick={() => handleComponentSelect(component.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {Icon}
                        <span>{component.type}</span>
                      </div>
                      {isSelected && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </aside>

        {/* Center Panel - Canvas / Preview */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-100">
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
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition text-sm">
                <Eye className="w-4 h-4 inline mr-1" />
                プレビュー
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm">
                <Rocket className="w-4 h-4 inline mr-1" />
                公開する
              </button>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 overflow-auto p-8">
            <div
              className={`bg-white rounded-xl shadow-lg mx-auto ${
                previewMode === 'mobile' ? 'max-w-sm' : 'max-w-5xl'
              }`}
              onClick={() => setUIState(prev => ({ ...prev, selectedComponentId: null }))}
            >
              {/* App Header */}
              <div className="bg-primary-600 text-white px-6 py-4 rounded-t-xl">
                <h2 className="font-bold">
                  {app?.template === 'crm' ? '顧客管理（CRM）' :
                   app?.template === 'inventory' ? '在庫管理' :
                   app?.template === 'daily-report' ? '日報・活動報告' :
                   app?.template === 'reservation' ? '予約管理' :
                   app?.name || 'App'}
                </h2>
              </div>

              {/* Components with Slots */}
              <div className="p-6">
                {currentPageComponents.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p>コンポーネントを追加してください</p>
                  </div>
                ) : (
                  currentPageComponents.map((component, index) => (
                    <div key={component.id} className="relative">
                      {/* Slot (Before Component) */}
                      <div
                        className="relative h-2 -mt-1 group"
                        onMouseEnter={() => setHoveredSlotIndex(index)}
                        onMouseLeave={() => {
                          if (componentPickerSlotIndex !== index) {
                            setHoveredSlotIndex(null)
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setComponentPickerSlotIndex(index)
                          setIsComponentPickerOpen(true)
                        }}
                      >
                        {hoveredSlotIndex === index && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-100 border-2 border-blue-500 border-dashed rounded cursor-pointer">
                            <Plus className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                      </div>

                      {/* Component with Delete Button */}
                      <div className="relative">
                        {uiState.selectedComponentId === component.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteComponent(component.id)
                            }}
                            className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        {renderComponent(component)}
                      </div>
                    </div>
                  ))
                )}

                {/* Slot (After Last Component) */}
                <div
                  className="relative h-12 mt-4 group border-2 border-dashed border-slate-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                  onMouseEnter={() => setHoveredSlotIndex(currentPageComponents.length)}
                  onMouseLeave={() => {
                    if (componentPickerSlotIndex !== currentPageComponents.length) {
                      setHoveredSlotIndex(null)
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setComponentPickerSlotIndex(currentPageComponents.length)
                    setIsComponentPickerOpen(true)
                  }}
                >
                  <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  <span className="ml-2 text-sm text-slate-500 group-hover:text-blue-600">コンポーネントを追加</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - Property Inspector */}
        <aside className="w-80 bg-white border-l border-slate-200 p-6 overflow-auto">
          {selectedComponent ? (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Properties</h3>
              
              {/* Dynamic Props Form */}
              {selectedComponent.type === 'heading' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Text</label>
                    <input
                      type="text"
                      value={selectedComponent.props?.text || ''}
                      onChange={(e) => {
                        const updated = currentPageComponents.map(c =>
                          c.id === selectedComponent.id
                            ? { ...c, props: { ...c.props, text: e.target.value } }
                            : c
                        )
                        setPageComponents(prev => ({
                          ...prev,
                          [String(uiState.activePageId)]: updated
                        }))
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Align</label>
                    <select
                      value={selectedComponent.props?.align || 'left'}
                      onChange={(e) => {
                        const updated = currentPageComponents.map(c =>
                          c.id === selectedComponent.id
                            ? { ...c, props: { ...c.props, align: e.target.value } }
                            : c
                        )
                        setPageComponents(prev => ({
                          ...prev,
                          [String(uiState.activePageId)]: updated
                        }))
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedComponent.type === 'kpi_grid' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={selectedComponent.props?.title || ''}
                      onChange={(e) => {
                        const updated = currentPageComponents.map(c =>
                          c.id === selectedComponent.id
                            ? { ...c, props: { ...c.props, title: e.target.value } }
                            : c
                        )
                        setPageComponents(prev => ({
                          ...prev,
                          [String(uiState.activePageId)]: updated
                        }))
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Data Source</label>
                    <select
                      value={selectedComponent.props?.dataSource || ''}
                      onChange={(e) => {
                        const updated = currentPageComponents.map(c =>
                          c.id === selectedComponent.id
                            ? { ...c, props: { ...c.props, dataSource: e.target.value } }
                            : c
                        )
                        setPageComponents(prev => ({
                          ...prev,
                          [String(uiState.activePageId)]: updated
                        }))
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">データソースを選択</option>
                      {dataSources.map(ds => (
                        <option key={ds.id} value={ds.id}>{ds.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {selectedComponent.type === 'table' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={selectedComponent.props?.title || ''}
                      onChange={(e) => {
                        const updated = currentPageComponents.map(c =>
                          c.id === selectedComponent.id
                            ? { ...c, props: { ...c.props, title: e.target.value } }
                            : c
                        )
                        setPageComponents(prev => ({
                          ...prev,
                          [String(uiState.activePageId)]: updated
                        }))
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Data Source</label>
                    <select
                      value={selectedComponent.props?.dataSource || ''}
                      onChange={(e) => {
                        const updated = currentPageComponents.map(c =>
                          c.id === selectedComponent.id
                            ? { ...c, props: { ...c.props, dataSource: e.target.value } }
                            : c
                        )
                        setPageComponents(prev => ({
                          ...prev,
                          [String(uiState.activePageId)]: updated
                        }))
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">データソースを選択</option>
                      {dataSources.map(ds => (
                        <option key={ds.id} value={ds.id}>{ds.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>コンポーネントを選択してください</p>
            </div>
          )}
        </aside>
      </div>

      {/* Component Picker Modal */}
      {isComponentPickerOpen && componentPickerSlotIndex !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setIsComponentPickerOpen(false)
            setComponentPickerSlotIndex(null)
            setHoveredSlotIndex(null)
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">コンポーネントを選択</h3>
              <button
                onClick={() => {
                  setIsComponentPickerOpen(false)
                  setComponentPickerSlotIndex(null)
                  setHoveredSlotIndex(null)
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {componentTypes.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => handleAddComponent(type, componentPickerSlotIndex)}
                  className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
                >
                  <Icon className="w-6 h-6 text-slate-600 mb-2" />
                  <div className="font-medium text-slate-900">{label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UITab
