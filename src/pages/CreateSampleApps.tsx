/**
 * サンプルアプリ作成ページ（開発用）
 * /create-sample-apps でアクセス可能
 */

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { db } from '../utils/firestore'
import { FIRESTORE_COLLECTIONS } from '../types/firestore'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const sampleApps = [
  {
    name: '顧客管理アプリ',
    template: 'crm' as const,
    description: '顧客情報を管理するアプリ',
    mission: '顧客情報を一元管理し、営業活動を効率化する',
  },
  {
    name: '在庫管理アプリ',
    template: 'inventory' as const,
    description: '商品の在庫を管理するアプリ',
    mission: '在庫状況をリアルタイムで把握し、適切な発注を行う',
  },
  {
    name: '日報アプリ',
    template: 'daily-report' as const,
    description: '日次レポートを記録するアプリ',
    mission: '日々の業務内容を記録し、進捗を可視化する',
  },
]

export const CreateSampleApps = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const [createdApps, setCreatedApps] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleCreateSampleApps = async () => {
    if (!user) {
      setError('ログインが必要です')
      return
    }

    if (user.email !== 'tsubasa.test@apptalenthub.co.jp') {
      setError(`現在のユーザーは ${user.email} です。tsubasa.test@apptalenthub.co.jpでログインしてください。`)
      return
    }

    setIsCreating(true)
    setError(null)
    setCreatedApps([])

    try {
      const userId = user.id

      for (let i = 0; i < sampleApps.length; i++) {
        const appData = sampleApps[i]
        // 各アプリに一意のIDを生成（ループ内でDate.now()を使うと重複する可能性があるため、インデックスも使用）
        const appId = `app-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`
        
        const appDoc = {
          title: appData.name,
          ownerId: userId,
          // App型（src/types/index.ts）のデータも含める
          id: appId,
          name: appData.name,
          description: appData.description,
          template: appData.template,
          mission: appData.mission,
          dataSource: {
            type: 'google-sheets' as const,
          },
          status: 'building' as const,
          buildProgress: {
            strategy: false,
            design: false,
            data: false,
          },
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
          views: 0,
          createdAt: new Date().toISOString().slice(0, 10),
          deployment: {
            dockerGenerated: false,
          },
          // Firestore型（src/types/firestore.ts）のデータ
          theme: {
            primaryColor: '#3b82f6',
            darkMode: false,
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        const appRef = doc(db, FIRESTORE_COLLECTIONS.APPS, appId)
        await setDoc(appRef, appDoc)
        
        setCreatedApps(prev => [...prev, appData.name])
      }

      // 少し待ってからアプリ一覧にリダイレクト
      setTimeout(() => {
        navigate('/apps')
      }, 2000)
    } catch (err) {
      console.error('サンプルアプリの作成エラー:', err)
      setError(err instanceof Error ? err.message : 'サンプルアプリの作成に失敗しました')
    } finally {
      setIsCreating(false)
    }
  }

  if (!user || user.email !== 'tsubasa.test@apptalenthub.co.jp') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-6">
        <div className="card dark:bg-slate-900 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            サンプルアプリ作成
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {!user 
              ? 'ログインが必要です'
              : `現在のユーザーは ${user.email} です。tsubasa.test@apptalenthub.co.jpでログインしてください。`
            }
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            ログインページへ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-6">
      <div className="card dark:bg-slate-900 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          サンプルアプリ作成
        </h1>

        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            以下の3つのサンプルアプリを作成します：
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
            {sampleApps.map((app, index) => (
              <li key={index}>
                <span className="font-medium">{app.name}</span> - {app.description}
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {createdApps.length > 0 && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-600 dark:text-green-400 font-medium mb-2">
              作成完了:
            </p>
            <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
              {createdApps.map((appName, index) => (
                <li key={index}>{appName}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={handleCreateSampleApps}
            disabled={isCreating}
            className="btn-primary flex-1"
          >
            {isCreating ? '作成中...' : 'サンプルアプリを作成'}
          </button>
          <button
            onClick={() => navigate('/apps')}
            className="btn-secondary"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  )
}

