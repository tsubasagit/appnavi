import { useState } from 'react'
import { Search, Plus, Edit, ExternalLink, FileText } from 'lucide-react'
import { App } from '../types'

const MyApps = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // サンプルデータ（実際の実装ではContextから取得）
  const apps: App[] = [
    {
      id: '1',
      name: '営業活動報告',
      description: '日々の営業活動を記録し、チーム内で共有するアプリ',
      dataSource: { type: 'google-sheets' },
      status: 'published',
      lastUpdated: '2023-10-24 14:30',
      views: 1240,
      createdAt: '2023-10-20',
    },
    {
      id: '2',
      name: '在庫管理台帳',
      description: '在庫の一元管理とリアルタイム更新',
      dataSource: { type: 'excel', fileName: '在庫管理.xlsx' },
      status: 'draft',
      lastUpdated: '2023-10-23 09:15',
      views: 0,
      createdAt: '2023-10-22',
    },
    {
      id: '3',
      name: '顧客アンケート集計',
      description: '顧客満足度調査の集計と可視化',
      dataSource: { type: 'csv', fileName: 'survey.csv' },
      status: 'published',
      lastUpdated: '2023-10-20 18:00',
      views: 856,
      createdAt: '2023-10-18',
    },
  ]

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDataSourceLabel = (app: App) => {
    switch (app.dataSource.type) {
      case 'google-sheets':
        return 'Google Sheets'
      case 'excel':
        return 'Excel取込'
      case 'csv':
        return 'CSV取込'
      default:
        return ''
    }
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">マイアプリ</h1>
        <p className="text-slate-600">作成したアプリケーションの管理・編集</p>
      </div>

      {/* Search and Create */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="アプリを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button className="btn-primary flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>新規作成</span>
        </button>
      </div>

      {/* App Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div key={app.id} className="card hover:shadow-md transition">
            {/* Icon and Status */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  app.status === 'published'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {app.status === 'published' ? '公開中' : '下書き'}
              </span>
            </div>

            {/* App Info */}
            <h3 className="text-lg font-bold text-slate-900 mb-2">{app.name}</h3>
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{app.description}</p>

            {/* Data Source */}
            <div className="flex items-center text-sm text-slate-500 mb-4">
              <FileText className="w-4 h-4 mr-2" />
              <span>{getDataSourceLabel(app)}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-slate-500 mb-4 pb-4 border-b border-slate-100">
              <span>最終更新: {app.lastUpdated}</span>
              <span>{app.views} Views</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                <Edit className="w-4 h-4 mr-1" />
                編集
              </button>
              <button className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center">
                <ExternalLink className="w-4 h-4 mr-1" />
                開く
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

