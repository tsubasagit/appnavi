import { useState, useEffect } from 'react'
import { X, User, Mail, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../utils/firestore'
import { FIRESTORE_COLLECTIONS } from '../types/firestore'

interface AccountSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const AccountSettingsModal = ({ isOpen, onClose }: AccountSettingsModalProps) => {
  const { user, currentUser } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [isChangingEmail, setIsChangingEmail] = useState(false)

  // ユーザー情報を初期化
  useEffect(() => {
    if (user) {
      setDisplayName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  if (!isOpen) return null

  const handleSaveDisplayName = async () => {
    if (!currentUser || !user) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Firebase Authのプロフィールを更新
      await updateProfile(currentUser, {
        displayName: displayName
      })

      // Firestoreのユーザー情報を更新
      const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, user.id)
      await updateDoc(userRef, {
        displayName: displayName,
        updatedAt: new Date()
      })

      setSuccess('表示名を更新しました')
      setTimeout(() => {
        setSuccess(null)
        onClose()
        // ページをリロードして最新のユーザー情報を反映
        window.location.reload()
      }, 1500)
    } catch (err: any) {
      setError(err.message || '表示名の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeEmail = async () => {
    if (!currentUser || !user || !password) {
      setError('パスワードを入力してください')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // 再認証が必要（メールアドレス変更のため）
      const credential = EmailAuthProvider.credential(
        currentUser.email || '',
        password
      )
      await reauthenticateWithCredential(currentUser, credential)

      // メールアドレスを更新
      await updateEmail(currentUser, email)

      // Firestoreのユーザー情報を更新
      const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, user.id)
      await updateDoc(userRef, {
        email: email,
        updatedAt: new Date()
      })

      setSuccess('メールアドレスを更新しました')
      setTimeout(() => {
        setSuccess(null)
        setIsChangingEmail(false)
        setPassword('')
        onClose()
        // ページをリロードして最新のユーザー情報を反映
        window.location.reload()
      }, 1500)
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') {
        setError('パスワードが正しくありません')
      } else if (err.code === 'auth/email-already-in-use') {
        setError('このメールアドレスは既に使用されています')
      } else if (err.code === 'auth/invalid-email') {
        setError('無効なメールアドレスです')
      } else {
        setError(err.message || 'メールアドレスの変更に失敗しました')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">アカウント設定</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Display Name Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              表示名
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="表示名を入力"
            />
            <button
              onClick={handleSaveDisplayName}
              disabled={isLoading || displayName === user?.name}
              className="mt-3 btn-primary flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>保存中...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>表示名を保存</span>
                </>
              )}
            </button>
          </div>

          {/* Email Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              メールアドレス
            </label>
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isChangingEmail}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
                placeholder="メールアドレスを入力"
              />
              {isChangingEmail && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      現在のパスワード（確認用）
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="パスワードを入力"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      メールアドレスを変更するには、セキュリティのため現在のパスワードが必要です
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleChangeEmail}
                      disabled={isLoading || !password || email === user?.email}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>変更中...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>メールアドレスを変更</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingEmail(false)
                        setPassword('')
                        setEmail(user?.email || '')
                        setError(null)
                      }}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
              {!isChangingEmail && (
                <button
                  onClick={() => setIsChangingEmail(true)}
                  className="btn-secondary"
                >
                  メールアドレスを変更
                </button>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">アカウント情報</h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>ユーザーID: {user?.id}</p>
              <p>現在のメールアドレス: {user?.email}</p>
              {currentUser?.emailVerified && (
                <p className="text-green-600 dark:text-green-400">✓ メールアドレスが確認済みです</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettingsModal


