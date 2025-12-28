import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { User } from '../types'

interface AuthContextType {
  currentUser: FirebaseUser | null
  user: User | null
  loading: boolean
  signInAsTestUser: () => void
  logout: () => Promise<void>
  isTestMode: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// テストモードの判定（開発環境のみ）
const isTestMode = import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEST_MODE === 'true'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [testUser, setTestUser] = useState<User | null>(null)

  // テストユーザーとしてログイン
  const signInAsTestUser = () => {
    const testUserData: User = {
      id: 'test-user-tsubasa',
      name: 'Tsubasa Test',
      email: 'tsubasa.test@apptalenthub.co.jp',
      avatar: undefined,
    }
    setTestUser(testUserData)
    setUser(testUserData)
    setCurrentUser(null) // Firebase認証は使用しない
    setLoading(false)
  }

  // テストユーザーをクリア（ログアウト）
  const clearTestUser = () => {
    setTestUser(null)
    setUser(null)
    setCurrentUser(null)
  }

  // ログアウト処理（テストユーザーとFirebase認証の両方に対応）
  const handleLogout = async () => {
    if (testUser) {
      // テストユーザーの場合
      clearTestUser()
    } else {
      // Firebase認証の場合
      try {
        await signOut(auth)
      } catch (error) {
        console.error('ログアウトエラー:', error)
        throw error
      }
    }
  }

  useEffect(() => {
    // テストユーザーが設定されている場合はFirebase認証をスキップ
    if (testUser) {
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser)
      
      if (firebaseUser) {
        // Firebase UserをアプリのUser型に変換
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'ユーザー',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined,
        })
      } else {
        setUser(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [testUser])

  // ログアウト時にテストユーザーもクリア
  useEffect(() => {
    if (!currentUser && !testUser && user) {
      clearTestUser()
    }
  }, [currentUser, testUser, user])

  return (
    <AuthContext.Provider value={{ 
      currentUser: testUser ? null : currentUser, 
      user: testUser || user, 
      loading,
      signInAsTestUser,
      logout: handleLogout,
      isTestMode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}








