import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const AppRedirect = () => {
  const navigate = useNavigate()
  const { apps, createNewApp } = useApp()

  useEffect(() => {
    if (apps.length > 0) {
      // アプリがある場合は最初のアプリにリダイレクト
      navigate(`/apps/${apps[0].id}`, { replace: true })
    } else {
      // アプリがない場合は新規作成してリダイレクト
      const newAppId = createNewApp()
      navigate(`/apps/${newAppId}`, { replace: true })
    }
  }, [apps, navigate, createNewApp])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-slate-600">アプリを読み込み中...</p>
      </div>
    </div>
  )
}

export default AppRedirect
