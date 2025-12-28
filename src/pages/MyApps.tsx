import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Edit, ExternalLink, FileText } from 'lucide-react'
import { useApp } from '../context/AppContext'

const MyApps = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { apps, createNewApp } = useApp()

  const handleCreateNewApp = () => {
    const newAppId = createNewApp()
    navigate(`/apps/${newAppId}`)
  }

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
        <button 
          onClick={handleCreateNewApp}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>新規作成</span>
        </button>
      </div>

      {/* App Cards Grid */}
      {filteredApps.length > 0 ? (
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
              <Link
                to={`/apps/${app.id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                編集
              </Link>
              <button className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center">
                <ExternalLink className="w-4 h-4 mr-1" />
                開く
              </button>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">アプリがまだありません</h3>
          <p className="text-slate-600 mb-6">新しいアプリを作成して始めましょう</p>
          <button 
            onClick={handleCreateNewApp}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>新規アプリを作成</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default MyApps

