import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser, user, loading } = useAuth()

  // デバッグ用ログ（開発環境のみ）
  if (import.meta.env.DEV) {
    console.log('ProtectedRoute - 認証状態:', {
      loading,
      hasCurrentUser: !!currentUser,
      currentUserEmail: currentUser?.email,
      hasUser: !!user,
      userEmail: user?.email,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">読み込み中...</p>
        </div>
      </div>
    )
  }

  // テストユーザーまたはFirebase認証ユーザーがいる場合のみアクセス許可
  if (!user && !currentUser) {
    if (import.meta.env.DEV) {
      console.warn('ProtectedRoute - 認証されていないため、ログインページにリダイレクト')
    }
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

