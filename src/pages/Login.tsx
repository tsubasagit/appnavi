import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chrome } from 'lucide-react'
import { signInWithGoogle, signInWithGoogleRedirect, getGoogleRedirectResult } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { currentUser, loading: authLoading } = useAuth()

  // 既にログインしている場合はリダイレクト
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate('/apps')
    }
  }, [currentUser, authLoading, navigate])

  // リダイレクト後の認証結果を処理（URLパラメータからエラーがある場合）
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorCode = urlParams.get('error')
    if (errorCode) {
      setError(getErrorMessage(errorCode))
    }
    
    // リダイレクト結果をチェック（App.tsxで処理されるが、念のため）
    const handleRedirectResult = async () => {
      try {
        const user = await getGoogleRedirectResult()
        if (user) {
          // リダイレクト認証が成功した場合、アプリ一覧に移動
          navigate('/apps', { replace: true })
        }
      } catch (err: any) {
        // エラーは既にApp.tsxで処理されているため、ここでは無視
        console.log('リダイレクト結果:', err)
      }
    }
    handleRedirectResult()
  }, [navigate])

  // 認証状態の読み込み中は何も表示しない
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
  if (currentUser) {
    return null
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      // まずポップアップ方式を試す
      await signInWithGoogle()
      navigate('/apps')
    } catch (err: any) {
      // ポップアップがブロックされた場合、リダイレクト方式にフォールバック
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        try {
          await signInWithGoogleRedirect()
          // リダイレクトが開始された場合、この関数は完了するがページ遷移は発生しない
          // リダイレクト後の処理はuseEffectで処理される
          setLoading(false)
          return
        } catch (redirectErr: any) {
          setError(getErrorMessage(redirectErr.code))
        }
      } else {
        setError(getErrorMessage(err.code))
      }
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (code?: string): string => {
    if (!code) {
      return 'ログインに失敗しました。もう一度お試しください'
    }
    
    switch (code) {
      case 'auth/popup-closed-by-user':
        return 'ログインがキャンセルされました'
      case 'auth/popup-blocked':
        return 'ポップアップがブロックされました。リダイレクト方式で認証を試みます...'
      case 'auth/network-request-failed':
        return 'ネットワークエラーが発生しました。接続を確認してください'
      case 'auth/cancelled-popup-request':
        return '別のログイン処理が進行中です。しばらくお待ちください'
      case 'auth/account-exists-with-different-credential':
        return 'このメールアドレスは別の認証方法で既に登録されています'
      case 'auth/unauthorized-domain':
        return 'このドメインは認証に使用できません。Firebase Consoleでlocalhostが承認済みドメインに追加されているか確認してください。詳細は docs/LOCAL_DEVELOPMENT_SETUP.md を参照してください。'
      case 'auth/operation-not-allowed':
        return 'この認証方法は有効になっていません。Firebase ConsoleでGoogle認証が有効になっているか確認してください。'
      case 'auth/invalid-api-key':
        return 'Firebase APIキーが無効です。環境変数またはFirebase設定を確認してください。'
      default:
        return `ログインに失敗しました: ${code}。詳細はブラウザのコンソールを確認してください。`
    }
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
          <p className="text-slate-600">ログインしてアプリを管理</p>
        </div>

        {/* Login Card */}
        <div className="card shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">ログイン</h2>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-slate-600 text-center mb-6">
              Googleアカウントでログインしてください
            </p>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed py-3"
            >
              <Chrome className="w-5 h-5" />
              <span>{loading ? 'ログイン中...' : 'Googleでログイン'}</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-600">
              アカウントをお持ちでない方は{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                新規登録
              </Link>
            </p>
            {/* テスト環境のみ表示 */}
            {(import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEST_MODE === 'true') && (
              <p className="text-xs text-slate-500">
                開発環境: {' '}
                <Link to="/test-login" className="text-yellow-600 hover:text-yellow-700 font-medium">
                  テストログイン
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

