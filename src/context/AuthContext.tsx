import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { User } from '../types'
import { createUser, getUser } from '../utils/firestore'

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
      role: 'vendor', // テスト用にベンダーロールを設定
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
      setLoading(false)
      return
    }

    // 初期状態を確認（即座に実行）
    // 注意: onAuthStateChangedが呼ばれるので、ここではFirestoreへの保存は行わない
    const currentAuthUser = auth.currentUser
    if (currentAuthUser) {
      setCurrentUser(currentAuthUser)
      // 一時的なユーザー情報を設定（onAuthStateChangedでFirestoreから取得して更新される）
      setUser({
        id: currentAuthUser.uid,
        name: currentAuthUser.displayName || currentAuthUser.email?.split('@')[0] || 'ユーザー',
        email: currentAuthUser.email || '',
        avatar: currentAuthUser.photoURL || undefined,
      })
    }

    // onAuthStateChangedが必ず呼ばれるまで待つ（Firebaseの仕様により、初期状態でも1回は呼ばれる）
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext - onAuthStateChanged called:', firebaseUser?.email || 'null')
      
      // firebaseUserがnullの場合でも、auth.currentUserを再確認
      const actualUser = firebaseUser || auth.currentUser
      
      if (actualUser) {
        console.log('AuthContext - 認証ユーザーを設定:', actualUser.email)
        setCurrentUser(actualUser)
        
        try {
          // Firestoreから既存のユーザーデータを取得
          console.log('AuthContext - Firestoreからユーザーデータを取得中...', actualUser.uid)
          const firestoreUser = await getUser(actualUser.uid)
          console.log('AuthContext - Firestoreユーザーデータ取得結果:', firestoreUser ? '存在' : '不存在')
          
          if (firestoreUser) {
            // Firestoreにデータが存在する場合、そのデータを使用
            console.log('AuthContext - 既存のFirestoreユーザーデータを使用')
            setUser({
              id: actualUser.uid,
              name: firestoreUser.displayName || actualUser.displayName || actualUser.email?.split('@')[0] || 'ユーザー',
              email: actualUser.email || '',
              avatar: firestoreUser.avatar || actualUser.photoURL || undefined,
              role: firestoreUser.role || 'user',
            })
          } else {
            // Firestoreにデータが存在しない場合、新規作成
            console.log('AuthContext - Firestoreにユーザーデータが存在しないため、新規作成します')
            try {
              await createUser(actualUser.uid, {
                email: actualUser.email || '',
                role: 'user',
                displayName: actualUser.displayName || actualUser.email?.split('@')[0] || 'ユーザー',
                avatar: actualUser.photoURL || undefined,
              })
              console.log('AuthContext - Firestoreユーザーデータの作成に成功しました')
            } catch (createError: any) {
              console.error('AuthContext - Firestoreユーザーデータの作成エラー:', createError)
              console.error('AuthContext - エラー詳細:', {
                code: createError?.code,
                message: createError?.message,
                stack: createError?.stack,
              })
              // ユーザー作成に失敗しても、Firebase認証の情報を使用して続行
            }
            
            // アプリのUser型に変換
            setUser({
              id: actualUser.uid,
              name: actualUser.displayName || actualUser.email?.split('@')[0] || 'ユーザー',
              email: actualUser.email || '',
              avatar: actualUser.photoURL || undefined,
              role: 'user',
            })
          }
        } catch (error: any) {
          console.error('AuthContext - Firestoreユーザーデータの取得/作成エラー:', error)
          console.error('AuthContext - エラー詳細:', {
            code: error?.code,
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
          })
          // エラーが発生しても、Firebase認証の情報を使用
          setUser({
            id: actualUser.uid,
            name: actualUser.displayName || actualUser.email?.split('@')[0] || 'ユーザー',
            email: actualUser.email || '',
            avatar: actualUser.photoURL || undefined,
          })
        }
      } else {
        console.log('AuthContext - 認証ユーザーがnull')
        setCurrentUser(null)
        setUser(null)
      }
      
      // 認証状態の確認が完了したらloadingをfalseにする
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








