import { useState, useEffect } from 'react'
import { RefreshCw, Download, CheckCircle2, ExternalLink, ShieldCheck, FileSpreadsheet, Table as TableIcon, Users, LayoutTemplate, Plus, ChevronRight, Filter, Search, X, Database, Wrench } from 'lucide-react'
import { signInWithGoogle, auth } from '../../utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const DataTab = () => {
  const [selectedSheet, setSelectedSheet] = useState('営業活動報告')
  const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // 認証状態の監視（認証状態を監視するだけで、user変数は使用しない）
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      // 認証状態の変更を監視
    })
    return () => unsubscribe()
  }, [])

  const sampleData = [
    {
      日時: '2023/10/24',
      担当者: '山田 太郎',
      '顧客/案件名': '株式会社A',
      訪問目的: '商談',
      活動内容: '契約内定',
      メモ: '',
    },
    {
      日時: '2023/10/24',
      担当者: '鈴木 花子',
      '顧客/案件名': 'B商事',
      訪問目的: '定期訪問',
      活動内容: '次回見積もり提出',
      メモ: '',
    },
    {
      日時: '2023/10/23',
      担当者: '佐藤 次郎',
      '顧客/案件名': 'Cテック',
      訪問目的: 'トラブル対応',
      活動内容: '解決済み',
      メモ: '',
    },
    {
      日時: '2023/10/22',
      担当者: '山田 太郎',
      '顧客/案件名': 'D産業',
      訪問目的: '挨拶',
      活動内容: '担当者不在',
      メモ: '',
    },
  ]

  const columns = Object.keys(sampleData[0])

  // Google認証処理
  const handleGoogleAuth = async () => {
    try {
      setIsAuthenticating(true)
      const authenticatedUser = await signInWithGoogle()
      console.log('認証成功:', authenticatedUser)
      // 認証成功後の処理（スプレッドシート選択など）
      alert(`Google認証が完了しました。\nユーザー: ${authenticatedUser.displayName || authenticatedUser.email}\nスプレッドシートを選択してください。`)
      setIsAddDataModalOpen(false)
    } catch (error: any) {
      console.error('認証エラー:', error)
      alert(`認証に失敗しました: ${error.message}`)
    } finally {
      setIsAuthenticating(false)
    }
  }

  // データソース選択
  const handleDataSourceSelect = (source: 'spreadsheet' | 'firebase' | 'supabase') => {
    if (source === 'spreadsheet') {
      handleGoogleAuth()
    } else {
      alert(`${source === 'firebase' ? 'Firebase' : 'Supabase'}からの追加は工事中です`)
    }
  }

  return (
    <div className="flex h-full">
      {/* Sub Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-700 text-sm">データリスト</h3>
          <p className="text-xs text-slate-400 mt-1">連携中のシート一覧</p>
        </div>
        <div className="p-2 space-y-1 flex-1 overflow-y-auto">
          <div
            onClick={() => setSelectedSheet('営業活動報告')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
              selectedSheet === '営業活動報告'
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <TableIcon size={16} />
            <span>営業活動報告</span>
          </div>
          <div
            onClick={() => setSelectedSheet('顧客台帳')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
              selectedSheet === '顧客台帳'
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users size={16} />
            <span>顧客台帳</span>
          </div>
          <div
            onClick={() => setSelectedSheet('商品リスト')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
              selectedSheet === '商品リスト'
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutTemplate size={16} />
            <span>商品リスト</span>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100">
          <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:border-primary-400 hover:text-primary-600 transition flex items-center justify-center space-x-2">
            <Plus size={16} />
            <span>新しい連携を追加</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Breadcrumb & Tools */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center text-sm text-slate-500">
            <span>データ管理</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="font-bold text-slate-800">{selectedSheet}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="リスト内を検索..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
            />
          </div>
        </div>

        {/* Info Banner with Security Assurance */}
        <div className="bg-white border border-green-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 border border-green-100 shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-slate-800 text-sm">Googleスプレッドシートと連携中</h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold border border-green-200 flex items-center">
                  <CheckCircle2 size={12} className="mr-1" />
                  安全に連携済み
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-500 mb-1">
                <ShieldCheck size={12} className="mr-1 text-green-600" />
                <span>元のスプレッドシートは保護されます（アプリからの編集は反映されません）</span>
              </div>
              <div className="flex items-center text-xs text-slate-400">
                <span className="mr-2">連携先:</span>
                <div className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-200 font-mono text-slate-600">
                  <span className="truncate max-w-[200px] md:max-w-xs">https://docs.google.com/spreadsheets/d/1BxiMvs0...</span>
                  <button className="ml-2 text-primary-600 hover:text-primary-800">
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-800 transition shadow-sm whitespace-nowrap">
            連携設定を確認
          </button>
        </div>

        {/* Data Table Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 justify-between items-center bg-white">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition shadow-sm">
                <RefreshCw size={16} />
                <span>最新データ取得</span>
              </button>
              <span className="text-slate-500 text-sm">全 {sampleData.length} 件</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsAddDataModalOpen(true)}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition shadow-sm"
              >
                <Plus size={16} />
                <span>新規データ追加</span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200" title="絞り込み">
                <Filter size={16} />
              </button>
              <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                <Download size={16} />
                <span>CSV保存</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx} className="px-6 py-4">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    {columns.map((col) => (
                      <td key={col} className="px-6 py-4 whitespace-nowrap">
                        {row[col as keyof typeof row] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 新規データ追加モーダル */}
      {isAddDataModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddDataModalOpen(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">新規データを追加</h2>
              <button
                onClick={() => setIsAddDataModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-3">
              {/* スプレッドシートから追加 */}
              <button
                onClick={() => handleDataSourceSelect('spreadsheet')}
                disabled={isAuthenticating}
                className="w-full flex items-center space-x-4 p-4 border-2 border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-slate-900">スプレッドシートから追加</h3>
                  <p className="text-sm text-slate-600">Googleスプレッドシートと連携してデータを追加</p>
                </div>
                {isAuthenticating && (
                  <RefreshCw className="w-5 h-5 text-primary-600 animate-spin" />
                )}
              </button>

              {/* Firebaseから追加（工事中） */}
              <button
                onClick={() => handleDataSourceSelect('firebase')}
                className="w-full flex items-center space-x-4 p-4 border-2 border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer opacity-60"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900">Firebaseから追加</h3>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      工事中
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Firebaseと連携してデータを追加</p>
                </div>
                <Wrench className="w-5 h-5 text-slate-400" />
              </button>

              {/* Supabaseから追加（工事中） */}
              <button
                onClick={() => handleDataSourceSelect('supabase')}
                className="w-full flex items-center space-x-4 p-4 border-2 border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer opacity-60"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900">Supabaseから追加</h3>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      工事中
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Supabaseと連携してデータを追加</p>
                </div>
                <Wrench className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTab


