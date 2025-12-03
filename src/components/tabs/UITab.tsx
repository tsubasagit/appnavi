import { useState } from 'react'
import { List, LayoutGrid, Calendar, FileText, Sparkles, Monitor, Smartphone, Eye, Rocket } from 'lucide-react'

const UITab = () => {
  const [selectedLayout, setSelectedLayout] = useState('list')
  const [previewMode, setPreviewMode] = useState<'pc' | 'mobile'>('pc')
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const layouts = [
    { id: 'list', icon: List, label: 'リスト一覧', description: '品リスト一覧' },
    { id: 'card', icon: LayoutGrid, label: 'カード型' },
    { id: 'calendar', icon: Calendar, label: 'カレンダー' },
    { id: 'template', icon: FileText, label: 'テンプレートから選ぶ' },
    { id: 'ai', icon: Sparkles, label: 'AIに作らせる' },
  ]

  const sampleData = [
    { 日時: '2023/10/24', 担当者: '山田 太郎', 顧客名: '株式会社A', 案件名: '商談', ステータス: '完了' },
    { 日時: '2023/10/24', 担当者: '鈴木 花子', 顧客名: 'B商事', 案件名: '定期訪問', ステータス: '進行中' },
    { 日時: '2023/10/23', 担当者: '佐藤 次郎', 顧客名: 'Cテック', 案件名: 'トラブル対応', ステータス: '完了' },
  ]

  return (
    <div className="flex h-full">
      {/* Left Panel - Layout Selection */}
      <aside className="w-80 bg-slate-50 border-r border-slate-200 p-6 overflow-auto">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-2">ページ一覧</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-primary-50 border-2 border-primary-300 rounded-lg text-sm font-medium text-primary-700">
              <span className="w-2 h-2 bg-primary-600 rounded-full inline-block mr-2"></span>
              一覧ページ
            </button>
            <button className="w-full text-left px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              詳細ページ
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">画面のレイアウト</h3>
          <div className="grid grid-cols-2 gap-3">
            {layouts.map((layout) => {
              const Icon = layout.icon
              const isSelected = selectedLayout === layout.id
              return (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`p-4 border-2 rounded-xl transition ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  <p className="text-xs font-medium text-slate-700 text-center">
                    {layout.label}
                  </p>
                </button>
              )
            })}
          </div>
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


