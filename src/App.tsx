import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import DeveloperLP from './pages/DeveloperLP'
import AppDetail from './pages/AppDetail'
import MyApps from './pages/MyApps'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import TestLogin from './pages/TestLogin'
import { CreateSampleApps } from './pages/CreateSampleApps'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { getGoogleRedirectResult } from './utils/firebase'
import './utils/errorLogger' // エラーロガーを初期化

// リダイレクト後の認証結果を処理するコンポーネント
function RedirectHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const user = await getGoogleRedirectResult()
        if (user) {
          // リダイレクト認証が成功した場合、最初のアプリに移動（なければ新規作成を促す）
          // AppContextから最初のアプリを取得してリダイレクト
          // ここでは一時的にログインページにリダイレクト（AppContextが利用可能になるまで待つ）
          navigate('/apps', { replace: true })
        }
      } catch (err: any) {
        console.error('リダイレクト認証エラー:', err)
        // エラーが発生した場合、ログインページにリダイレクト
        navigate('/login', { replace: true, state: { error: err.code } })
      }
    }
    handleRedirectResult()
  }, [navigate])

  // リダイレクト処理中はローディング表示
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-slate-600">認証を処理しています...</p>
      </div>
    </div>
  )
}

function AppContent() {
  return (
    <Routes>
      {/* リダイレクトハンドラー（Firebase認証後の処理） */}
      <Route path="/__/auth/handler" element={<RedirectHandler />} />
      
      {/* パブリックページ（サイドバーなし） */}
      <Route path="/" element={<Landing />} />
      <Route path="/developer" element={<DeveloperLP />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route path="/register" element={<Register />} />
      
      {/* 保護されたページ */}
      <Route 
        path="/apps" 
        element={
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-black">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <MyApps />
              </main>
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/apps/:appId" 
        element={
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden bg-slate-50">
              <main className="flex-1 overflow-auto">
                <AppDetail />
              </main>
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/about" 
        element={
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden bg-slate-50">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <About />
              </main>
            </div>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-sample-apps" 
        element={
          <ProtectedRoute>
            <CreateSampleApps />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

function App() {
  // 開発環境ではbasenameなし、本番環境（GitHub Pages）では/appnavi
  const basename = import.meta.env.PROD ? '/appnavi' : undefined

  // グローバルエラーハンドラー（開発環境のみ）
  useEffect(() => {
    if (import.meta.env.DEV) {
      const errorHandler = (event: ErrorEvent) => {
        const errorInfo = {
          type: 'error',
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.toString(),
          stack: event.error?.stack,
          timestamp: new Date().toISOString()
        }
        
        const existingErrors = JSON.parse(localStorage.getItem('globalErrors') || '[]')
        existingErrors.push(errorInfo)
        localStorage.setItem('globalErrors', JSON.stringify(existingErrors))
        
        console.error('グローバルエラーが記録されました:', errorInfo)
      }
      
      const rejectionHandler = (event: PromiseRejectionEvent) => {
        const errorInfo = {
          type: 'unhandledRejection',
          reason: event.reason?.toString(),
          stack: event.reason?.stack,
          timestamp: new Date().toISOString()
        }
        
        const existingErrors = JSON.parse(localStorage.getItem('globalErrors') || '[]')
        existingErrors.push(errorInfo)
        localStorage.setItem('globalErrors', JSON.stringify(existingErrors))
        
        console.error('未処理のPromise拒否が記録されました:', errorInfo)
      }
      
      window.addEventListener('error', errorHandler)
      window.addEventListener('unhandledrejection', rejectionHandler)
      
      return () => {
        window.removeEventListener('error', errorHandler)
        window.removeEventListener('unhandledrejection', rejectionHandler)
      }
    }
  }, [])

  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter 
          basename={basename}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthRedirectHandler>
            <AppContent />
          </AuthRedirectHandler>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}

// リダイレクト後の認証結果を処理するコンポーネント
function AuthRedirectHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        console.log('AuthRedirectHandler - リダイレクト結果を確認中...')
        const user = await getGoogleRedirectResult()
        if (user) {
          console.log('AuthRedirectHandler - リダイレクト認証成功:', user.email)
          // リダイレクト認証が成功した場合、AuthContextのonAuthStateChangedが自動的に処理する
          // 現在のURLがログインページまたは登録ページの場合、最初のアプリにリダイレクト
          const currentPath = window.location.pathname
          if (currentPath.includes('/login') || currentPath.includes('/register')) {
            // 少し待ってからリダイレクト（AuthContextの更新を待つ）
            setTimeout(() => {
              const basePath = import.meta.env.PROD ? '/appnavi' : ''
              console.log('AuthRedirectHandler - ダッシュボードにリダイレクト:', `${basePath}/apps`)
              window.location.href = `${basePath}/apps`
            }, 1500)
          }
        } else {
          console.log('AuthRedirectHandler - リダイレクト結果なし')
        }
      } catch (err: any) {
        console.error('AuthRedirectHandler - リダイレクト認証エラー:', err)
        // エラーは各ページで処理される
      }
    }
    handleRedirectResult()
  }, [])

  return <>{children}</>
}

export default App


