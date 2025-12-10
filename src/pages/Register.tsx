import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chrome } from 'lucide-react'
import { signInWithGoogle } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  // 既にログインしている場合はリダイレクト
  if (currentUser) {
    navigate('/dashboard')
    return null
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (err: any) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const getErrorMessage = (code: string): string => {
    switch (code) {
      case 'auth/popup-closed-by-user':
        return '登録がキャンセルされました'
      case 'auth/popup-blocked':
        return 'ポップアップがブロックされました。ブラウザの設定を確認してください'
      case 'auth/network-request-failed':
        return 'ネットワークエラーが発生しました。接続を確認してください'
      default:
        return '登録に失敗しました。もう一度お試しください'
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
          <p className="text-slate-600">新規アカウントを作成</p>
        </div>

        {/* Register Card */}
        <div className="card shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">新規登録</h2>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="text-sm text-slate-600 text-center mb-6">
              Googleアカウントで新規登録してください
            </p>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed py-3"
            >
              <Chrome className="w-5 h-5" />
              <span>{loading ? '登録中...' : 'Googleで登録'}</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              既にアカウントをお持ちの方は{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

