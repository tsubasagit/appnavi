import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Megaphone, CheckCircle2, ArrowLeft } from 'lucide-react'
import { getAnnouncements } from '../utils/firestore'
import type { Announcement } from '../types/firestore'
import { Timestamp } from 'firebase/firestore'

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true)
        const fetchedAnnouncements = await getAnnouncements()
        setAnnouncements(fetchedAnnouncements)
        console.log('Announcements - お知らせ取得成功:', fetchedAnnouncements.length, '件')
      } catch (error) {
        console.error('Announcements - お知らせ取得エラー:', error)
        setAnnouncements([])
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

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

  const getAnnouncementIcon = (type: 'info' | 'warning' | 'error' | 'success') => {
    switch (type) {
      case 'info':
        return <Bell className="w-5 h-5 text-blue-600" />
      case 'warning':
        return <Megaphone className="w-5 h-5 text-orange-600" />
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'error':
        return <Megaphone className="w-5 h-5 text-red-600" />
      default:
        return <Bell className="w-5 h-5 text-slate-600" />
    }
  }

  const getAnnouncementBgColor = (type: 'info' | 'warning' | 'error' | 'success') => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      case 'warning':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      default:
        return 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
    }
  }

  return (
    <div className="p-6 md:p-8 bg-white dark:bg-black min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/apps"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ダッシュボードに戻る</span>
        </Link>
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">お知らせ一覧</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mt-2">すべてのお知らせを確認できます</p>
      </div>

      {/* お知らせ一覧 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            お知らせを読み込み中...
          </div>
        ) : announcements.length === 0 ? (
          <div className="card dark:bg-slate-900 text-center py-12">
            <Bell className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">お知らせはありません</h3>
            <p className="text-slate-600 dark:text-slate-400">現在、表示するお知らせはありません</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`card dark:bg-slate-900 p-6 rounded-lg border-2 ${getAnnouncementBgColor(announcement.type)} transition hover:shadow-md`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  {getAnnouncementIcon(announcement.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{announcement.title}</h3>
                    {announcement.isNew && (
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        新着
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>公開日: {formatAnnouncementDate(announcement.date)}</span>
                    {announcement.endDate && (
                      <span>終了日: {formatAnnouncementDate(announcement.endDate)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Announcements
