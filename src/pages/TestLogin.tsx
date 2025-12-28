import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, TestTube } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const TestLogin = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user, loading: authLoading, signInAsTestUser, isTestMode } = useAuth()

  // ログイン成功時にアプリ一覧にリダイレクト
  useEffect(() => {
    if (!authLoading && user && !loading) {
      navigate('/apps', { replace: true })
    }
  }, [user, authLoading, loading, navigate])

  // テストモードが無効な場合は通常のログインページにリダイレクト
  useEffect(() => {
    if (!isTestMode) {
      navigate('/login')
    }
  }, [isTestMode, navigate])

  const handleTestLogin = () => {
    setLoading(true)
    try {
      signInAsTestUser()
      // useEffectでuserの変更を監視して自動的にダッシュボードに遷移する
    } catch (error) {
      console.error('テストログインエラー:', error)
      setLoading(false)
    }
  }

  // テストモードが無効な場合は何も表示しない
  if (!isTestMode) {
    return null
  }

  // 認証状態の読み込み中はローディング表示
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 既にログインしている場合は何も表示しない（リダイレクト中）
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AppNavi</h1>
          <p className="text-slate-600">テスト環境 - サンプルログイン</p>
        </div>

        {/* Test Login Card */}
        <div className="card shadow-lg border-2 border-yellow-300">
          <div className="flex items-center justify-center mb-4">
            <TestTube className="w-6 h-6 text-yellow-600 mr-2" />
            <h2 className="text-2xl font-bold text-slate-900">テストログイン</h2>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>注意:</strong> これは開発環境専用のテストログイン機能です。
            </p>
            <p className="text-sm text-yellow-700">
              以下のテストユーザーとしてログインします：
            </p>
          </div>

          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Tsubasa Test</p>
                <p className="text-sm text-slate-600">tsubasa.test@apptalenthub.co.jp</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed py-3"
          >
            <TestTube className="w-5 h-5" />
            <span>{loading ? 'ログイン中...' : 'テストユーザーでログイン'}</span>
          </button>

          {/* Back to Normal Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              <a href="/appnavi/login" className="text-primary-600 hover:text-primary-700 font-medium">
                通常のログインページに戻る
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestLogin

