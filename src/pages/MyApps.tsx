import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Edit, FileText, Trash2, Bell, Megaphone, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { App } from '../types'
import { getAnnouncements } from '../utils/firestore'
import type { Announcement } from '../types/firestore'
import { Timestamp } from 'firebase/firestore'

const MyApps = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingAppId, setDeletingAppId] = useState<string | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
  const navigate = useNavigate()
  const { apps, createNewApp, deleteApp } = useApp()
  
  // デバッグ: アプリの状態を確認
  console.log('MyApps - アプリ一覧:', apps)
  console.log('MyApps - アプリ数:', apps.length)

  // Firestoreからお知らせを取得
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoadingAnnouncements(true)
        const fetchedAnnouncements = await getAnnouncements()
        setAnnouncements(fetchedAnnouncements)
        console.log('MyApps - お知らせ取得成功:', fetchedAnnouncements.length, '件')
      } catch (error) {
        console.error('MyApps - お知らせ取得エラー:', error)
        // エラーが発生した場合は空配列を設定（フォールバック）
        setAnnouncements([])
      } finally {
        setLoadingAnnouncements(false)
      }
    }

    fetchAnnouncements()
  }, [])

  const handleCreateNewApp = async () => {
    try {
      console.log('MyApps - アプリ作成を開始')
      const newAppId = await createNewApp()
      console.log('MyApps - アプリ作成成功:', newAppId)
      navigate(`/apps/${newAppId}`)
    } catch (error: any) {
      console.error('MyApps - アプリ作成エラー:', error)
      console.error('MyApps - エラー詳細:', {
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
        name: error?.name,
        errorObject: error
      })
      
      // エラーメッセージを改善
      let errorMessage = 'アプリの作成に失敗しました'
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.code === 'permission-denied') {
        errorMessage = 'Firestore権限エラー: アプリの作成に必要な権限がありません。ログイン状態を確認してください。'
      }
      
      alert(errorMessage)
    }
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

  const handleDeleteApp = async (appId: string, appName: string) => {
    // 確認ダイアログを表示
    const confirmed = window.confirm(
      `本当に「${appName}」を削除しますか？\n\nこの操作は取り消せません。`
    )
    
    if (!confirmed) {
      return
    }

    try {
      setDeletingAppId(appId)
      await deleteApp(appId)
      // 削除成功のメッセージ（オプション）
      console.log('アプリを削除しました:', appName)
    } catch (error) {
      console.error('アプリの削除エラー:', error)
      alert('アプリの削除に失敗しました')
    } finally {
      setDeletingAppId(null)
    }
  }

  // お知らせの日付を文字列形式に変換するヘルパー関数
  const formatAnnouncementDate = (timestamp: Timestamp | undefined): string => {
    if (!timestamp) {
      return '日付不明'
    }
    const date = timestamp.toDate()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getAnnouncementIcon = (type: 'info' | 'warning' | 'success') => {
    switch (type) {
      case 'info':
        return <Bell className="w-5 h-5 text-blue-600" />
      case 'warning':
        return <Megaphone className="w-5 h-5 text-orange-600" />
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      default:
        return <Bell className="w-5 h-5 text-slate-600" />
    }
  }

  const getAnnouncementBgColor = (type: 'info' | 'warning' | 'success') => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      case 'warning':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      default:
        return 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
    }
  }

  return (
    <div className="p-6 md:p-8 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">ダッシュボード</h1>
        <p className="text-slate-600 dark:text-slate-400">作成したアプリケーションの管理・編集</p>
      </div>

      {/* お知らせ一覧 */}
      <div className="card mb-8 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">お知らせ</h3>
          </div>
          {announcements.length > 3 && (
            <Link
              to="/announcements"
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              すべて見る →
            </Link>
          )}
        </div>
        <div className="space-y-3">
          {loadingAnnouncements ? (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400">
              お知らせを読み込み中...
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400">
              お知らせはありません
            </div>
          ) : (
            <>
              {announcements.slice(0, 3).map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-4 rounded-lg border-2 ${getAnnouncementBgColor(announcement.type)} transition hover:shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getAnnouncementIcon(announcement.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{announcement.title}</h4>
                        {announcement.isNew && (
                          <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            新着
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{announcement.content}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatAnnouncementDate(announcement.date)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {announcements.length > 3 && (
                <div className="text-center pt-2">
                  <Link
                    to="/announcements"
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium inline-flex items-center gap-1"
                  >
                    残り{announcements.length - 3}件のお知らせを見る →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
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
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
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
          <div key={app.id} className="card dark:bg-slate-900 hover:shadow-md transition">
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{app.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{app.description}</p>

            {/* Data Source */}
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
              <FileText className="w-4 h-4 mr-2" />
              <span>{getDataSourceLabel(app)}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span>最終更新: {app.lastUpdated}</span>
              <span>{app.views} Views</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link
                to={`/apps/${app.id}`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                編集
              </Link>
              <button
                onClick={() => handleDeleteApp(app.id, app.name)}
                disabled={deletingAppId === app.id}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {deletingAppId === app.id ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="card dark:bg-slate-900 text-center py-12">
          <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">アプリがまだありません</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">新しいアプリを作成して始めましょう</p>
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

