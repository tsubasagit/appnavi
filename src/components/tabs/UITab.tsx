import { useState, useEffect, useRef } from 'react'
import { Monitor, Smartphone, Eye, Rocket, Plus, X, PenTool, ChevronDown, ChevronRight, BarChart3, Grid3x3, FileText, Type, Trash2, Maximize2, Search, Users, Briefcase, AlertCircle, TrendingUp, Calendar, Clock, Filter, MoreVertical, Edit, Phone, Mail, MapPin, User, Upload, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ComponentConfig, Page, PageConfig, UIState, ComponentType } from '../../types'
import { useSheetData } from '../../hooks/useSheetData'
import { extractSpreadsheetId } from '../../features/sheets/api'

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
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [templateInfo, setTemplateInfo] = useState<{ name: string; description: string; previewImageUrl?: string; pages?: Array<{ name: string; path: string }> } | null>(null)
  const [showTemplateInfo, setShowTemplateInfo] = useState(true) // 初回表示時にテンプレート情報を表示
  const [isJsonImportModalOpen, setIsJsonImportModalOpen] = useState(false)
  const [jsonImportText, setJsonImportText] = useState('')
  const [jsonImportError, setJsonImportError] = useState<string | null>(null)

  // テンプレート変更時にUI構成を適用
  useEffect(() => {
    const applyTemplateUI = async () => {
      if (!app?.templateId && !app?.template) {
        console.log('UITab: テンプレートIDが設定されていません')
        return
      }

      if (!activeAppId) {
        console.log('UITab: アクティブなアプリIDがありません')
        return
      }

      try {
        const { getTemplate, getPages } = await import('../../utils/firestore')
        const templateId = app.templateId || app.template
        console.log(`UITab: テンプレート "${templateId}" を読み込み中...`)
        
        // まずFirestoreから既存のページを取得（エラーは無視して続行）
        try {
          const existingPages = await getPages(activeAppId)
          console.log('UITab: Firestoreから取得した既存ページ数:', existingPages.length)
          
          // Firestoreにページが存在する場合は、それを使用
          if (existingPages.length > 0) {
            const firestorePages: Page[] = existingPages.map(p => ({
              id: p.id,
              name: p.title,
              path: `/${p.id}`,
              template: p.id,
            }))
            
            const firestorePageComponents: PageConfig = {}
            existingPages.forEach(p => {
              firestorePageComponents[p.id] = (p.components || []).map(comp => ({
                id: comp.id,
                type: comp.type as ComponentType,
                props: comp.props || {},
                dataSource: comp.dataSourceId,
              }))
            })
            
            setPages(firestorePages)
            setPageComponents(firestorePageComponents)
            
            if (firestorePages.length > 0) {
              setUIState(prev => ({ ...prev, activePageId: firestorePages[0].id }))
            }
            
            // テンプレート情報も取得（プレビュー表示用）
            if (templateId) {
              try {
                const templateData = await getTemplate(templateId)
                if (templateData) {
                  setTemplateInfo({
                    name: templateData.name,
                    description: templateData.description,
                    previewImageUrl: templateData.previewImageUrl,
                    pages: templateData.uiStructure?.pages?.map(p => ({ name: p.name, path: p.path })) || [],
                  })
                }
              } catch (templateError) {
                console.log('UITab: テンプレート情報の取得に失敗しました（続行）:', templateError)
              }
            }
            
            console.log('UITab: Firestoreからページを読み込みました:', firestorePages.length, 'ページ')
            return
          }
        } catch (pagesError: any) {
          console.log('UITab: Firestoreからページを取得できませんでした（テンプレートから読み込みます）:', pagesError?.message)
          // エラーが発生しても、テンプレートから読み込む処理を続行
        }
        
        // Firestoreにページがない場合は、テンプレートから読み込む
        if (!templateId) {
          console.warn('UITab: テンプレートIDが設定されていません')
          return
        }
        
        const templateData = await getTemplate(templateId)
        
        if (templateData && templateData.uiStructure) {
          const uiStructure = templateData.uiStructure
          
          // ページ構成を適用
          if (uiStructure.pages && uiStructure.pages.length > 0) {
            const newPages: Page[] = uiStructure.pages.map((page, index) => ({
              id: page.id || `page_${index + 1}`,
              name: page.name,
              path: page.path,
              template: page.id,
            }))
            
            const newPageComponents: PageConfig = {}
            uiStructure.pages.forEach((page, pageIndex) => {
              const pageId = page.id || `page_${pageIndex + 1}`
              if (page.components && page.components.length > 0) {
                newPageComponents[pageId] = page.components.map((comp) => ({
                  id: comp.id,
                  type: comp.type as ComponentType,
                  props: comp.props || {},
                  dataSource: comp.dataSourceId,
                }))
              } else {
                // コンポーネントがない場合でも空配列を設定
                newPageComponents[pageId] = []
              }
            })
            
            setPages(newPages)
            setPageComponents(newPageComponents)
            
            // 最初のページをアクティブに
            if (newPages.length > 0) {
              setUIState(prev => ({ ...prev, activePageId: newPages[0].id }))
            }
            
            console.log('UITab: テンプレートのUI構成を適用しました:', templateData.name)
            console.log('UITab: 作成されたページ数:', newPages.length)
            console.log('UITab: ページ一覧:', newPages.map(p => ({ id: p.id, name: p.name })))
          } else {
            console.warn(`UITab: テンプレート "${templateId}" にページ構成がありません`)
          }
        } else {
          console.warn(`UITab: テンプレート "${templateId}" が見つかりませんでした。`)
          console.warn('UITab: テンプレートを作成するには、scripts/create-templates.js を実行してください。')
          console.warn('UITab: または、Firebase Consoleで手動でテンプレートを作成してください。')
        }
      } catch (error: any) {
        console.error('UITab: テンプレートUI構成の適用エラー:', error)
        if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
          console.error('UITab: Firestoreのセキュリティルールを確認してください。テンプレートの読み込み権限がありません。')
        } else {
          console.error('UITab: エラー詳細:', {
            code: error?.code,
            message: error?.message,
            stack: error?.stack
          })
        }
      }
    }

    applyTemplateUI()
  }, [app?.templateId, app?.template, activeAppId])

  // データソースからスプレッドシートIDを取得
  const getSpreadsheetIdFromDataSource = (dataSourceId: string | undefined): string | null => {
    if (!dataSourceId) return null
    const source = dataSources.find(ds => ds.id === dataSourceId)
    if (!source || source.type !== 'google-sheets' || !source.url) return null
    return extractSpreadsheetId(source.url)
  }

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

  // データ付きコンポーネントレンダリング用のコンポーネント
  const DataTableComponent = ({ component, isSelected, onSelect }: { component: ComponentConfig; isSelected: boolean; onSelect: () => void }) => {
    const spreadsheetId = getSpreadsheetIdFromDataSource(component.props?.dataSource)
    const { headers, rows, isLoading, error } = useSheetData(spreadsheetId, 'Sheet1')

    return (
      <div
        className={`p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <h3 className="font-bold mb-2 text-slate-900 dark:text-white">{component.props?.title || 'Table'}</h3>
        {isLoading ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">読み込み中...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : !spreadsheetId ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>データソースが設定されていません</p>
            <p className="text-sm mt-2">右側のプロパティパネルでデータソースを選択してください</p>
          </div>
        ) : headers.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">データがありません</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 dark:border-slate-700">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  {headers.map((header, index) => (
                    <th key={index} className="text-left p-2 text-slate-700 dark:text-slate-300 font-semibold">
                      {header || `列${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 10).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                    {row.data.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-2 text-slate-700 dark:text-slate-300">
                        {cell || '-'}
                      </td>
                    ))}
                    {/* 不足している列を埋める */}
                    {row.data.length < headers.length && (
                      Array.from({ length: headers.length - row.data.length }).map((_, index) => (
                        <td key={`empty-${index}`} className="p-2 text-slate-400 dark:text-slate-500">
                          -
                        </td>
                      ))
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 10 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
                他 {rows.length - 10} 件のデータがあります
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  const KPIGridComponent = ({ component, isSelected, onSelect }: { component: ComponentConfig; isSelected: boolean; onSelect: () => void }) => {
    const spreadsheetId = getSpreadsheetIdFromDataSource(component.props?.dataSource)
    const { headers, rows, isLoading, error } = useSheetData(spreadsheetId, 'Sheet1')

    // データからKPIを計算（最初の数値列を使用）
    const kpiValues = rows.length > 0 && headers.length > 0
      ? headers.map((header, index) => {
          const values = rows.map(row => parseFloat(row.data[index] || '0')).filter(v => !isNaN(v))
          return {
            label: header || `列${index + 1}`,
            value: values.length > 0 ? values.reduce((a, b) => a + b, 0).toLocaleString() : '0',
            count: rows.length
          }
        }).slice(0, 3)
      : []

    return (
      <div
        className={`p-4 bg-slate-50 dark:bg-slate-800 rounded-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <h3 className="font-bold mb-2 text-slate-900 dark:text-white">{component.props?.title || 'KPI Grid'}</h3>
        {isLoading ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">読み込み中...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : !spreadsheetId ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>データソースが設定されていません</p>
            <p className="text-sm mt-2">右側のプロパティパネルでデータソースを選択してください</p>
          </div>
        ) : kpiValues.length === 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">0</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Metric {i}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {kpiValues.map((kpi, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{kpi.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">{kpi.count}件</div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // KPIカードコンポーネント（CRM用）
  const KPICardComponent = ({ component, isSelected, onSelect }: { component: ComponentConfig; isSelected: boolean; onSelect: () => void }) => {
    const iconMap: Record<string, any> = {
      'Users': Users,
      'TrendingUp': TrendingUp,
      'Briefcase': Briefcase,
      'AlertCircle': AlertCircle,
    }
    const Icon = iconMap[component.props?.icon || 'Users'] || Users
    const label = component.props?.label || 'KPI'
    const value = component.props?.value || '0'

    return (
      <div
        className={`p-4 bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">{value}</div>
        <div className="text-sm text-purple-700 dark:text-purple-300">{label}</div>
      </div>
    )
  }

  // 検索コンポーネント（CRM用）
  const SearchComponent = ({ component, isSelected, onSelect }: { component: ComponentConfig; isSelected: boolean; onSelect: () => void }) => {
    const [searchValue, setSearchValue] = useState('')
    const placeholder = component.props?.placeholder || '検索...'

    return (
      <div
        className={`p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    )
  }

  // フォームコンポーネント（CRM用）
  const FormComponent = ({ component, isSelected, onSelect }: { component: ComponentConfig; isSelected: boolean; onSelect: () => void }) => {
    const fields = component.props?.fields || []

    return (
      <div
        className={`p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <h3 className="font-bold mb-4 text-slate-900 dark:text-white">{component.props?.title || 'フォーム'}</h3>
        <div className="space-y-4">
          {fields.map((field: any, index: number) => (
            <div key={index}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === 'select' ? (
                <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  <option value="">選択してください</option>
                  {field.options?.map((opt: string, optIndex: number) => (
                    <option key={optIndex} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder={field.placeholder || ''}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // カレンダーコンポーネント（Googleカレンダー用 - 週単位表示）
  const CalendarComponent = ({ component, isSelected, onSelect, app }: { component: ComponentConfig; isSelected: boolean; onSelect: () => void; app?: any }) => {
    const [currentWeek, setCurrentWeek] = useState(new Date())
    const [selectedTeams, setSelectedTeams] = useState<string[]>(['営業', '開発', 'マーケティング'])
    const spreadsheetId = getSpreadsheetIdFromDataSource(component.dataSource)
    const { headers, rows, isLoading, error } = useSheetData(spreadsheetId, 'Sheet1')
    
    const view = component.props?.view || 'week'
    const weekStart = new Date(currentWeek)
    weekStart.setDate(currentWeek.getDate() - currentWeek.getDay())
    
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      return date
    })

    const dayNames = ['日', '月', '火', '水', '木', '金', '土']
    const isGoogleCalendar = app?.templateId === 'google-calendar-group' || app?.template === 'google-calendar-group'
    
    // イベントデータのインデックスを取得
    const eventNameIndex = headers.findIndex(h => h === 'イベント名' || h === 'タイトル' || h === '名前')
    const startDateIndex = headers.findIndex(h => h === '開始日時' || h === '開始日' || h === '日時')
    const groupIndex = headers.findIndex(h => h === 'グループ' || h === 'チーム')
    const participantIndex = headers.findIndex(h => h === '参加者' || h === 'メンバー')
    const locationIndex = headers.findIndex(h => h === '場所' || h === 'ロケーション')
    
    // 日付に基づいてイベントを分類
    const eventsByDate: Record<string, any[]> = {}
    days.forEach(day => {
      const dateKey = day.toISOString().split('T')[0]
      eventsByDate[dateKey] = []
    })
    
    rows.forEach((row) => {
      if (startDateIndex >= 0 && row.data[startDateIndex]) {
        const dateStr = row.data[startDateIndex]
        // 日付文字列を解析（YYYY-MM-DD形式を想定）
        try {
          const eventDate = new Date(dateStr)
          if (!isNaN(eventDate.getTime())) {
            const dateKey = eventDate.toISOString().split('T')[0]
            
            // 選択されたチームのみ表示
            if (groupIndex >= 0 && row.data[groupIndex]) {
              const group = row.data[groupIndex]
              if (selectedTeams.includes(group) && eventsByDate[dateKey]) {
                eventsByDate[dateKey].push(row)
              }
            } else if (eventsByDate[dateKey]) {
              eventsByDate[dateKey].push(row)
            }
          }
        } catch (e) {
          // 日付解析エラーは無視
        }
      }
    })

    return (
      <div
        className={`p-4 bg-white dark:bg-slate-900 rounded-lg border-2 ${isGoogleCalendar ? 'border-orange-200 dark:border-orange-800' : 'border-slate-200 dark:border-slate-700'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
            {component.props?.title || '週間カレンダー'}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                const prevWeek = new Date(currentWeek)
                prevWeek.setDate(currentWeek.getDate() - 7)
                setCurrentWeek(prevWeek)
              }}
              className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              ←
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {weekStart.toLocaleDateString('ja-JP', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                const nextWeek = new Date(currentWeek)
                nextWeek.setDate(currentWeek.getDate() + 7)
                setCurrentWeek(nextWeek)
              }}
              className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              →
            </button>
          </div>
        </div>
        
        {/* 週間カレンダーグリッド */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={index} className={`text-center ${index === 0 ? 'border-l border-slate-200 dark:border-slate-700' : ''}`}>
              <div className={`text-xs font-medium mb-1 ${day.getDay() === 0 ? 'text-red-500' : day.getDay() === 6 ? 'text-blue-500' : 'text-slate-600 dark:text-slate-400'}`}>
                {dayNames[day.getDay()]}
              </div>
              <div className={`text-sm font-bold mb-2 ${day.toDateString() === new Date().toDateString() ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>
                {day.getDate()}
              </div>
              <div className="min-h-[80px] bg-orange-50 dark:bg-orange-900/20 rounded p-1 space-y-1">
                {/* イベント表示エリア */}
                {isLoading ? (
                  <div className="text-xs text-slate-400 dark:text-slate-500 text-center pt-2">読み込み中...</div>
                ) : error ? (
                  <div className="text-xs text-red-500 text-center pt-2">エラー</div>
                ) : !spreadsheetId ? (
                  <div className="text-xs text-slate-400 dark:text-slate-500 text-center pt-2">データソース未設定</div>
                ) : eventsByDate[day.toISOString().split('T')[0]]?.length > 0 ? (
                  eventsByDate[day.toISOString().split('T')[0]].slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="text-xs bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 px-1 py-0.5 rounded truncate"
                      title={eventNameIndex >= 0 ? event.data[eventNameIndex] : 'イベント'}
                    >
                      {eventNameIndex >= 0 ? event.data[eventNameIndex] : `イベント ${eventIndex + 1}`}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 dark:text-slate-500 text-center pt-2">予定なし</div>
                )}
                {eventsByDate[day.toISOString().split('T')[0]]?.length > 3 && (
                  <div className="text-xs text-orange-600 dark:text-orange-400 text-center">
                    +{eventsByDate[day.toISOString().split('T')[0]].length - 3}件
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* チーム別フィルター（Googleカレンダー用） */}
        {isGoogleCalendar && (
          <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-100">チームフィルター</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['営業', '開発', 'マーケティング'].map((team) => {
                const isSelected = selectedTeams.includes(team)
                return (
                  <button
                    key={team}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTeams(prev => 
                        isSelected 
                          ? prev.filter(t => t !== team)
                          : [...prev, team]
                      )
                    }}
                    className={`px-3 py-1 text-xs rounded-full transition ${
                      isSelected
                        ? 'bg-orange-600 text-white dark:bg-orange-500'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                    }`}
                  >
                    {team}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // カンバンコンポーネント（CRM用 - 商談管理）
  const KanbanComponent = ({ component, isSelected, onSelect }: { component: ComponentConfig; isSelected: boolean; onSelect: () => void }) => {
    const columns = component.props?.columns || [
      { id: 'prospecting', name: '見込み', color: '#94a3b8' },
      { id: 'qualification', name: '選定', color: '#3b82f6' },
      { id: 'proposal', name: '提案', color: '#8b5cf6' },
      { id: 'negotiation', name: '交渉', color: '#f59e0b' },
      { id: 'closed', name: '成約', color: '#10b981' },
    ]

    return (
      <div
        className={`p-4 bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-200 dark:border-purple-800 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
          {component.props?.title || '商談パイプライン'}
        </h3>
        <div className="flex gap-4 overflow-x-auto">
          {columns.map((column: any) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-64 bg-slate-50 dark:bg-slate-800 rounded-lg p-3"
              style={{ borderTop: `4px solid ${column.color}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900 dark:text-white">{column.name}</h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                  0
                </span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
                  カードがありません
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // タイムラインコンポーネント（CRM用 - 活動履歴）
  const TimelineComponent = ({ component, isSelected, onSelect }: { component: ComponentConfig; isSelected: boolean; onSelect: () => void }) => {
    return (
      <div
        className={`p-4 bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-200 dark:border-purple-800 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
          {component.props?.title || '活動履歴タイムライン'}
        </h3>
        <div className="space-y-4">
          <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
            活動履歴がありません
          </div>
        </div>
      </div>
    )
  }

  // リストコンポーネント（CRM用 - 活動履歴）
  const ListComponent = ({ component, isSelected, onSelect }: { component: ComponentConfig; isSelected: boolean; onSelect: () => void }) => {
    return (
      <div
        className={`p-4 bg-white dark:bg-slate-900 rounded-lg border-2 border-purple-200 dark:border-purple-800 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
          {component.props?.title || 'リスト'}
        </h3>
        <div className="space-y-2">
          <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
            アイテムがありません
          </div>
        </div>
      </div>
    )
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
            <h2 style={{ textAlign: component.props?.align || 'left' }} className="text-slate-900 dark:text-white">
              {component.props?.text || 'Heading'}
            </h2>
          </div>
        )
      case 'kpi_grid':
        return (
          <KPIGridComponent
            component={component}
            isSelected={isSelected}
            onSelect={() => handleComponentSelect(component.id)}
          />
        )
      case 'table':
        return (
          <DataTableComponent
            component={component}
            isSelected={isSelected}
            onSelect={() => handleComponentSelect(component.id)}
          />
        )
      case 'chart':
        return (
          <div
            className={`p-4 bg-slate-50 dark:bg-slate-800 rounded-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              handleComponentSelect(component.id)
            }}
          >
            <h3 className="font-bold mb-2 text-slate-900 dark:text-white">{component.props?.title || 'Chart'}</h3>
            <div className="h-64 flex items-center justify-center bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              <BarChart3 className="w-16 h-16 text-slate-400 dark:text-slate-500" />
              <p className="ml-3 text-slate-500 dark:text-slate-400">グラフプレビュー（実装予定）</p>
            </div>
          </div>
        )
      case 'kpi_card':
        return (
          <KPICardComponent
            component={component}
            isSelected={isSelected}
            onSelect={() => handleComponentSelect(component.id)}
          />
        )
      case 'search':
        return (
          <SearchComponent
            component={component}
            isSelected={isSelected}
            onSelect={() => handleComponentSelect(component.id)}
          />
        )
      case 'form':
        return (
          <FormComponent
            component={component}
            isSelected={isSelected}
            onSelect={() => handleComponentSelect(component.id)}
          />
        )
      case 'calendar':
        return (
          <CalendarComponent
            component={component}
            isSelected={isSelected}
            onSelect={() => handleComponentSelect(component.id)}
            app={app}
          />
        )
      case 'kanban':
        return (
          <KanbanComponent
            component={component}
            isSelected={isSelected}
            onSelect={() => handleComponentSelect(component.id)}
          />
        )
      case 'timeline':
        return (
          <TimelineComponent
            component={component}
            isSelected={isSelected}
            onSelect={() => handleComponentSelect(component.id)}
          />
        )
      case 'list':
        return (
          <ListComponent
            component={component}
            isSelected={isSelected}
            onSelect={() => handleComponentSelect(component.id)}
          />
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
            <p className="text-slate-500 dark:text-slate-400">Unknown Component: {component.type}</p>
          </div>
        )
    }
  }

  // コンポーネントタイプ一覧
  const componentTypes: { type: ComponentType; label: string; icon: any }[] = [
    { type: 'heading', label: 'Heading', icon: Type },
    { type: 'kpi_grid', label: 'KPI Grid', icon: Grid3x3 },
    { type: 'kpi_card', label: 'KPI Card', icon: Grid3x3 },
    { type: 'table', label: 'Table', icon: FileText },
    { type: 'chart', label: 'Chart', icon: BarChart3 },
    { type: 'search', label: 'Search', icon: Search },
    { type: 'form', label: 'Form', icon: FileText },
    { type: 'calendar', label: 'Calendar', icon: Calendar },
    { type: 'kanban', label: 'Kanban', icon: Grid3x3 },
    { type: 'timeline', label: 'Timeline', icon: Clock },
    { type: 'list', label: 'List', icon: FileText },
  ]

  // 選択中のコンポーネント
  const selectedComponent = currentPageComponents.find(c => c.id === uiState.selectedComponentId)

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <PenTool className="mr-2 text-primary-600 dark:text-primary-400" size={24} /> Step 2: Design - テーマエンジン
              </h2>
              <p className="text-sm text-slate-600 dark:text-white mt-1">
                デザインをカスタマイズして、アプリの見た目を調整します。AIで生成したJSONテンプレートもインポートできます。
              </p>
            </div>
            <button
              onClick={() => setIsJsonImportModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-sm"
              title="AIで生成したJSONテンプレートをインポート"
            >
              <Sparkles size={18} />
              <span>AI JSONをインポート</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* テンプレート情報バナー（初回表示時のみ） */}
      {showTemplateInfo && templateInfo && pages.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-purple-200 dark:border-purple-800 p-4 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {templateInfo.previewImageUrl && (
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-lg border-2 border-purple-200 dark:border-purple-700 overflow-hidden shadow-sm flex-shrink-0">
                    <img 
                      src={templateInfo.previewImageUrl} 
                      alt={templateInfo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {templateInfo.name}
                    </h3>
                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                      テンプレート
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {templateInfo.description}
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                    <p className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
                      💡 自由編集モード
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      このテンプレートは初期設定です。AIで生成したJSONをインポートしたり、コンポーネントを自由に追加・編集して、思い通りのUIを作成できます。
                    </p>
                  </div>
                  {templateInfo.pages && templateInfo.pages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">作成されるページ:</span>
                      {templateInfo.pages.map((page, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 rounded text-xs text-slate-700 dark:text-slate-300"
                        >
                          {page.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowTemplateInfo(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition flex-shrink-0"
                title="閉じる"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Structure & Navigation */}
        <aside className="w-80 bg-slate-50 dark:bg-black border-r border-slate-200 dark:border-slate-800 p-6 overflow-auto">
          {/* Page Selector */}
          <div className="mb-6" ref={dropdownRef}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pages</h3>
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
                className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span>
                  {pages.find(p => p.id === uiState.activePageId)?.name || 'ページを選択'}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform ${isPageDropdownOpen ? 'transform rotate-180' : ''}`} 
                />
              </button>
              
              {isPageDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => handlePageChange(page.id)}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        uiState.activePageId === page.id
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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
            <h4 className="text-sm font-medium text-slate-700 dark:text-white mb-2">Components</h4>
            <div className="space-y-1">
              {currentPageComponents.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 px-4 py-2">コンポーネントがありません</p>
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
                          ? 'bg-blue-900 dark:bg-blue-800 text-white'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
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
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-100 dark:bg-black">
          {/* Preview Controls */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('pc')}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    previewMode === 'pc'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Monitor className="w-4 h-4 inline mr-1" />
                  PC
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    previewMode === 'mobile'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Smartphone className="w-4 h-4 inline mr-1" />
                  Mobile
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFullScreenPreview(true)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition text-sm flex items-center space-x-1"
              >
                <Maximize2 className="w-4 h-4" />
                <span>全画面プレビュー</span>
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm flex items-center space-x-1">
                <Rocket className="w-4 h-4" />
                <span>公開する</span>
              </button>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 overflow-auto p-8">
            <div
              className={`bg-white dark:bg-slate-900 rounded-xl shadow-lg mx-auto ${
                previewMode === 'mobile' ? 'max-w-sm' : 'max-w-5xl'
              }`}
              onClick={() => setUIState(prev => ({ ...prev, selectedComponentId: null }))}
            >
              {/* App Header */}
              <div className={`px-6 py-4 rounded-t-xl ${
                (app?.templateId === 'crm' || app?.template === 'crm') ? 'bg-purple-600' :
                (app?.templateId === 'google-calendar-group' || app?.template === 'google-calendar-group') ? 'bg-orange-600' :
                'bg-primary-600'
              } text-white`}>
                <h2 className="font-bold">
                  {(app?.templateId === 'crm' || app?.template === 'crm') ? '顧客管理（CRM）' :
                   (app?.templateId === 'google-calendar-group' || app?.template === 'google-calendar-group') ? 'Googleカレンダー管理' :
                   app?.template === 'inventory' ? '在庫管理' :
                   app?.template === 'daily-report' ? '日報・活動報告' :
                   app?.template === 'reservation' ? '予約管理' :
                   app?.name || 'App'}
                </h2>
              </div>

              {/* Components with Slots */}
              <div className="p-6">
                {currentPageComponents.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
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
        <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 overflow-auto">
          {selectedComponent ? (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Properties</h3>
              
              {/* Dynamic Props Form */}
              {selectedComponent.type === 'heading' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">Text</label>
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
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">Align</label>
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
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">Title</label>
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
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">Data Source</label>
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
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">Title</label>
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
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-white mb-2">Data Source</label>
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
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <p>コンポーネントを選択してください</p>
            </div>
          )}
        </aside>
      </div>

      {/* Full Screen Preview Modal */}
      {isFullScreenPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full h-full max-w-7xl max-h-[95vh] mx-4 my-4 flex flex-col">
            {/* Preview Header */}
            <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {app?.name || 'App'} - プレビュー
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewMode('pc')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition ${
                      previewMode === 'pc'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Monitor className="w-4 h-4 inline mr-1" />
                    PC
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition ${
                      previewMode === 'mobile'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 inline mr-1" />
                    モバイル
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsFullScreenPreview(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto p-8 bg-slate-50 dark:bg-black">
              <div
                className={`bg-white dark:bg-slate-900 rounded-xl shadow-lg mx-auto ${
                  previewMode === 'mobile' ? 'max-w-sm' : 'max-w-5xl'
                }`}
              >
                {/* App Header */}
                <div className={`px-6 py-4 rounded-t-xl ${
                  (app?.templateId === 'crm' || app?.template === 'crm') ? 'bg-purple-600' :
                  (app?.templateId === 'google-calendar-group' || app?.template === 'google-calendar-group') ? 'bg-orange-600' :
                  'bg-primary-600'
                } text-white`}>
                  <h2 className="font-bold">
                    {(app?.templateId === 'crm' || app?.template === 'crm') ? '顧客管理（CRM）' :
                     (app?.templateId === 'google-calendar-group' || app?.template === 'google-calendar-group') ? 'Googleカレンダー管理' :
                     app?.template === 'inventory' ? '在庫管理' :
                     app?.template === 'daily-report' ? '日報・活動報告' :
                     app?.template === 'reservation' ? '予約管理' :
                     app?.name || 'App'}
                  </h2>
                </div>

                {/* Components */}
                <div className="p-6">
                  {currentPageComponents.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      <p>コンポーネントを追加してください</p>
                    </div>
                  ) : (
                    currentPageComponents.map((component) => (
                      <div key={component.id} className="mb-4">
                        {renderComponent(component)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* JSONインポートモーダル */}
      {isJsonImportModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsJsonImportModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* モーダルヘッダー */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI JSONテンプレートをインポート</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      AIで生成したJSONテンプレートを貼り付けて、自由にUIを作成できます
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsJsonImportModalOpen(false)
                    setJsonImportText('')
                    setJsonImportError(null)
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* モーダルコンテンツ */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  JSONテンプレート（貼り付けまたはファイル選択）
                </label>
                <textarea
                  value={jsonImportText}
                  onChange={(e) => {
                    setJsonImportText(e.target.value)
                    setJsonImportError(null)
                  }}
                  placeholder='{"uiStructure": {"pages": [{"id": "page1", "name": "ページ1", "path": "/page1", "components": [...]}]}}'
                  className="w-full h-64 p-4 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="mt-2">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (event) => {
                            const content = event.target?.result as string
                            setJsonImportText(content)
                            setJsonImportError(null)
                          }
                          reader.readAsText(file)
                        }
                      }}
                    />
                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                      <Upload size={16} className="inline mr-1" />
                      ファイルから選択
                    </span>
                  </label>
                </div>
              </div>

              {jsonImportError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">エラー</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{jsonImportError}</p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">📋 JSON形式の例</p>
                <pre className="text-xs text-blue-700 dark:text-blue-300 overflow-x-auto">
{`{
  "uiStructure": {
    "pages": [
      {
        "id": "dashboard",
        "name": "ダッシュボード",
        "path": "/",
        "layout": {"type": "grid", "columns": 12},
        "components": [
          {
            "id": "heading1",
            "type": "heading",
            "position": {"x": 0, "y": 0, "width": 12},
            "props": {"text": "ようこそ"}
          }
        ]
      }
    ]
  }
}`}
                </pre>
              </div>
            </div>

            {/* モーダルフッター */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setIsJsonImportModalOpen(false)
                  setJsonImportText('')
                  setJsonImportError(null)
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                キャンセル
              </button>
              <button
                onClick={async () => {
                  if (!jsonImportText.trim()) {
                    setJsonImportError('JSONテンプレートを入力してください')
                    return
                  }

                  try {
                    const jsonData = JSON.parse(jsonImportText)
                    
                    // JSON構造を検証
                    if (!jsonData.uiStructure || !jsonData.uiStructure.pages) {
                      setJsonImportError('JSONにuiStructure.pagesが含まれていません')
                      return
                    }

                    // ページとコンポーネントを適用
                    const newPages: Page[] = jsonData.uiStructure.pages.map((page: any, index: number) => ({
                      id: page.id || `page_${index + 1}`,
                      name: page.name || `ページ${index + 1}`,
                      path: page.path || `/${page.id || `page_${index + 1}`}`,
                      template: page.id || `page_${index + 1}`,
                    }))

                    const newPageComponents: PageConfig = {}
                    jsonData.uiStructure.pages.forEach((page: any, pageIndex: number) => {
                      const pageId = page.id || `page_${pageIndex + 1}`
                      newPageComponents[pageId] = (page.components || []).map((comp: any) => ({
                        id: comp.id || `c_${Date.now()}_${Math.random()}`,
                        type: comp.type as ComponentType,
                        props: comp.props || {},
                        dataSource: comp.dataSourceId,
                      }))
                    })

                    setPages(newPages)
                    setPageComponents(newPageComponents)
                    
                    if (newPages.length > 0) {
                      setUIState(prev => ({ ...prev, activePageId: newPages[0].id }))
                    }

                    // テンプレート情報を更新
                    setTemplateInfo({
                      name: jsonData.name || 'AI生成テンプレート',
                      description: jsonData.description || 'AIで生成されたカスタムテンプレート',
                      pages: newPages.map(p => ({ name: p.name, path: p.path })),
                    })

                    setIsJsonImportModalOpen(false)
                    setJsonImportText('')
                    setJsonImportError(null)
                    
                    alert(`AI JSONテンプレートをインポートしました！\n${newPages.length}個のページを作成しました。`)
                  } catch (error: any) {
                    setJsonImportError(`JSONの解析エラー: ${error.message}`)
                  }
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-medium"
              >
                インポート
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UITab
