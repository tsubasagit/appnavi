import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Chrome } from 'lucide-react'
import { signInWithGoogle, signInWithGoogleRedirect, getGoogleRedirectResult, auth } from '../utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import { displayErrors, getLoginErrors } from '../utils/errorLogger'

const Login = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { currentUser, user, loading: authLoading } = useAuth()

  // 既にログインしている場合はリダイレクト
  useEffect(() => {
    if (!authLoading && (currentUser || user)) {
      console.log('既にログイン済み、ダッシュボードにリダイレクト:', { currentUser: currentUser?.email, user: user?.email })
      navigate('/apps', { replace: true })
    }
  }, [currentUser, user, authLoading, navigate])
  
  // 認証成功後のナビゲーション処理（userが設定されるまで待つ）
  useEffect(() => {
    // loadingがfalseで、認証は成功しているがuserがまだ設定されていない場合
    // これは最初のログイン時など、Firestoreにユーザーデータを作成している最中の場合
    if (!authLoading && currentUser && !user && !loading) {
      console.log('Login.tsx - 認証成功、Firestoreへのユーザーデータ作成を待機中...')
      // userが設定されるまで待つ（最大5秒）
      const timeout = setTimeout(() => {
        console.warn('Login.tsx - userの設定がタイムアウトしましたが、ナビゲーションを続行します')
        if (currentUser) {
          navigate('/apps', { replace: true })
        }
      }, 5000)
      
      return () => clearTimeout(timeout)
    }
    
    // userが設定されたら、ダッシュボードに遷移
    if (!authLoading && currentUser && user && !loading) {
      console.log('Login.tsx - userが設定されました、ダッシュボードに遷移:', user.email)
      navigate('/apps', { replace: true })
    }
  }, [currentUser, user, authLoading, loading, navigate])

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
        console.log('Login.tsx - リダイレクト結果を確認中...')
        const user = await getGoogleRedirectResult()
        if (user) {
          console.log('Login.tsx - リダイレクト認証成功:', user.email)
          // リダイレクト認証が成功した場合、少し待ってからアプリ一覧に移動
          // AuthContextの状態更新を待つ
          await new Promise(resolve => setTimeout(resolve, 1000))
          navigate('/apps', { replace: true })
        } else {
          console.log('Login.tsx - リダイレクト結果なし')
        }
      } catch (err: any) {
        console.error('Login.tsx - リダイレクト結果のエラー:', err)
        // エラーがある場合は表示
        if (err.code) {
          setError(getErrorMessage(err.code, err.requestId))
        }
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
  if (currentUser || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">リダイレクト中...</p>
        </div>
      </div>
    )
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    // エラーをキャプチャするためのグローバルエラーハンドラーを一時的に設定
    const errorLog: any[] = []
    const originalError = console.error
    const originalWarn = console.warn
    
    const errorHandler = (message: any, ...args: any[]) => {
      errorLog.push({ type: 'error', message, args, timestamp: new Date().toISOString() })
      originalError(message, ...args)
    }
    
    const warnHandler = (message: any, ...args: any[]) => {
      errorLog.push({ type: 'warn', message, args, timestamp: new Date().toISOString() })
      originalWarn(message, ...args)
    }
    
    console.error = errorHandler
    console.warn = warnHandler
    
    // 未処理のエラーをキャプチャ
    const unhandledErrorHandler = (event: ErrorEvent) => {
      errorLog.push({ 
        type: 'unhandled', 
        message: event.message, 
        filename: event.filename, 
        lineno: event.lineno, 
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString() 
      })
    }
    
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      errorLog.push({ 
        type: 'unhandledRejection', 
        reason: event.reason, 
        timestamp: new Date().toISOString() 
      })
    }
    
    window.addEventListener('error', unhandledErrorHandler)
    window.addEventListener('unhandledrejection', unhandledRejectionHandler)

    try {
      // まずポップアップ方式を試す
      const user = await signInWithGoogle()
      console.log('signInWithGoogle成功:', user.email)
      
      // 認証成功後、AuthContextの状態更新を待つ
      // useEffectでuserが設定されるまで待つため、ここではナビゲーションしない
      console.log('Login.tsx - 認証成功、AuthContextの状態更新を待機中...')
      // useEffectがuserの設定を監視してナビゲーションを実行する
      
      // エラーが記録されていた場合、localStorageに保存
      if (errorLog.length > 0) {
        const existingErrors = JSON.parse(localStorage.getItem('loginErrors') || '[]')
        existingErrors.push({
          timestamp: new Date().toISOString(),
          errors: errorLog,
          userEmail: user?.email
        })
        localStorage.setItem('loginErrors', JSON.stringify(existingErrors))
        console.warn('ログイン中にエラーが記録されました。localStorageのloginErrorsを確認してください。', errorLog)
      }
    } catch (err: any) {
      console.error('Googleログインエラー:', err)
      
      // エラーも記録
      errorLog.push({ 
        type: 'catch', 
        error: err, 
        message: err?.message, 
        code: err?.code,
        stack: err?.stack,
        timestamp: new Date().toISOString() 
      })
      
      const existingErrors = JSON.parse(localStorage.getItem('loginErrors') || '[]')
      existingErrors.push({
        timestamp: new Date().toISOString(),
        errors: errorLog,
        error: err
      })
      localStorage.setItem('loginErrors', JSON.stringify(existingErrors))
      console.error('エラーが記録されました。localStorageのloginErrorsを確認してください。', errorLog)
      // ポップアップがブロックされた場合、ユーザーに選択肢を提示
      if (err.code === 'auth/popup-blocked') {
        console.log('ポップアップがブロックされました。')
        setError('ポップアップがブロックされました。\n\nCursorの内蔵ブラウザでは、ポップアップの許可ができない場合があります。\n下の「リダイレクト方式でログイン」ボタンをクリックしてログインしてください。\n\n通常のブラウザ（Chrome、Firefox、Edgeなど）を使用する場合は、アドレスバーのポップアップブロックアイコンをクリックして許可することもできます。')
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('ログインがキャンセルされました。もう一度お試しください。')
      } else {
        const errorMessage = err?.message || err?.code || '認証に失敗しました'
        setError(getErrorMessage(err.code, err.requestId) || errorMessage)
      }
    } finally {
      // エラーハンドラーを元に戻す
      console.error = originalError
      console.warn = originalWarn
      window.removeEventListener('error', unhandledErrorHandler)
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler)
      setLoading(false)
    }
  }

  const getErrorMessage = (code?: string, requestId?: string | null): string => {
    if (!code) {
      return 'ログインに失敗しました。もう一度お試しください'
    }
    
    let baseMessage = ''
    switch (code) {
      case 'auth/popup-closed-by-user':
        baseMessage = 'ログインがキャンセルされました'
        break
      case 'auth/popup-blocked':
        baseMessage = 'ポップアップがブロックされました。\n\n解決方法:\n1. ブラウザのアドレスバーにあるポップアップブロックアイコンをクリックして、このサイトのポップアップを許可してください\n2. または、下の「リダイレクト方式でログイン」ボタンをクリックしてください'
        break
      case 'auth/network-request-failed':
        baseMessage = 'ネットワークエラーが発生しました。接続を確認してください'
        break
      case 'auth/cancelled-popup-request':
        baseMessage = '別のログイン処理が進行中です。しばらくお待ちください'
        break
      case 'auth/account-exists-with-different-credential':
        baseMessage = 'このメールアドレスは別の認証方法で既に登録されています'
        break
      case 'auth/unauthorized-domain':
        baseMessage = 'このドメインは認証に使用できません。Firebase Consoleでlocalhostが承認済みドメインに追加されているか確認してください。詳細は docs/LOCAL_DEVELOPMENT_SETUP.md を参照してください。'
        break
      case 'auth/operation-not-allowed':
        baseMessage = 'この認証方法は有効になっていません。Firebase ConsoleでGoogle認証が有効になっているか確認してください。'
        break
      case 'auth/invalid-api-key':
        baseMessage = 'Firebase APIキーが無効です。環境変数またはFirebase設定を確認してください。'
        break
      default:
        baseMessage = `ログインに失敗しました: ${code}。詳細はブラウザのコンソールを確認してください。`
    }
    
    // Request IDがある場合は追加
    if (requestId) {
      return `${baseMessage}\n\nRequest ID: ${requestId}\nこのRequest IDをFirebaseサポートに報告してください。`
    }
    
    return baseMessage
  }

  // Firebase設定の診断（開発環境のみ）
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('=== Firebase設定診断 ===')
      console.log('auth:', auth)
      console.log('auth.app:', auth?.app)
      console.log('auth.currentUser:', auth?.currentUser)
      console.log('環境変数:', {
        VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '設定済み' : '未設定',
        VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'デフォルト値使用',
        VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'デフォルト値使用',
      })
      console.log('====================')
    }
  }, [])

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
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm whitespace-pre-line">
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
            
            {/* リダイレクト方式でログイン（ポップアップがブロックされている場合用） */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-2 text-center">
                ポップアップがブロックされている場合
              </p>
              <button
                onClick={async () => {
                  setError('')
                  setLoading(true)
                  try {
                    console.log('リダイレクト方式で認証を開始します...')
                    await signInWithGoogleRedirect()
                    // リダイレクトが開始された場合、ページ遷移が発生する
                    // この時点でreturnすると、finallyブロックが実行されないため、setLoading(false)は不要
                  } catch (err: any) {
                    console.error('リダイレクト方式の認証エラー:', err)
                    setError(getErrorMessage(err.code, err.requestId) || 'リダイレクト方式での認証に失敗しました。')
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="w-full text-sm text-slate-600 hover:text-slate-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                リダイレクト方式でログイン
              </button>
            </div>
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
          
          {/* 開発環境: エラー確認ボタン */}
          {import.meta.env.DEV && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  const errors = getLoginErrors()
                  if (errors.length > 0) {
                    displayErrors()
                    alert(`エラーが ${errors.length} 件記録されています。コンソールを確認してください。`)
                  } else {
                    alert('エラーは記録されていません。')
                  }
                }}
                className="w-full text-xs text-slate-500 hover:text-slate-700 underline"
              >
                記録されたエラーを確認 (開発環境)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login

