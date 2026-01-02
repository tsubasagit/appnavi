import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User 
} from 'firebase/auth'

// Firebase設定（環境変数から取得、またはデフォルト値）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAO03XP5TKpt5E8zgnzW2p3VdsQ1eLU1-Y',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'appnavi-add7e.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'appnavi-add7e',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'appnavi-add7e.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '917670325982',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:917670325982:web:8aa33731e865529c6a5c4f',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-BFP5JSG5RD',
}

// Firebase初期化
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// 注意: 開発環境では `__/firebase/init.json` の404エラーが表示されることがありますが、
// これは正常な動作です。Firebase SDKは自動的にフォールバックして、直接設定を使用します。
// 認証機能には影響しません。このエラーは無視して問題ありません。

// Google認証プロバイダーの設定
export const googleProvider = new GoogleAuthProvider()
// 重要: スプレッドシートへのアクセス権限を追加
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets')
// アカウント選択を毎回表示
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

// Analytics初期化（ブラウザ環境でのみ）
if (typeof window !== 'undefined') {
  try {
    getAnalytics(app)
  } catch (error) {
    console.warn('Analytics初期化エラー:', error)
  }
}

// Google認証（ポップアップ方式）
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    
    // アクセストークンを取得して保存
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential?.accessToken
    
    if (token) {
      // MVP暫定対応: SessionStorageに保存
      // 注意: 本番運用（Phase 2）ではHttpOnly Cookieやメモリ内管理への移行を検討すること
      sessionStorage.setItem('googleAccessToken', token)
    }
    
    return result.user
  } catch (error: any) {
    console.error('Google認証エラー:', error)
    // エラーコード、メッセージ、Request IDを保持して再スロー
    if (error.code) {
      throw { 
        code: error.code, 
        message: error.message,
        requestId: error.customData?.requestId || error.requestId || null
      }
    }
    throw error
  }
}

// Google認証（リダイレクト方式 - ポップアップがブロックされた場合に使用）
export const signInWithGoogleRedirect = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider)
  } catch (error: any) {
    console.error('Google認証リダイレクトエラー:', error)
    throw error
  }
}

// リダイレクト後の結果を取得
export const getGoogleRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth)
    if (result) {
      // アクセストークンを取得して保存
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      
      if (token) {
        // MVP暫定対応: SessionStorageに保存
        // 注意: 本番運用（Phase 2）ではHttpOnly Cookieやメモリ内管理への移行を検討すること
        sessionStorage.setItem('googleAccessToken', token)
      }
      
      return result.user
    }
    return null
  } catch (error: any) {
    console.error('リダイレクト結果の取得エラー:', error)
    throw error
  }
}

// メール/パスワードで新規登録
export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error('メール/パスワード登録エラー:', error)
    throw error
  }
}

// メール/パスワードでログイン
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error('メール/パスワードログインエラー:', error)
    throw error
  }
}

// ログアウト
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('ログアウトエラー:', error)
    throw error
  }
}

// テストモードの判定
export const isTestMode = import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEST_MODE === 'true'

export default app


