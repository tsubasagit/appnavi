import { useState } from 'react'
import { RefreshCw, Download, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react'

const DataTab = () => {
  const [selectedSheet, setSelectedSheet] = useState('営業活動報告')

  const sheets = [
    { id: '1', name: '営業活動報告' },
    { id: '2', name: '顧客台帳' },
    { id: '3', name: '商品リスト' },
  ]

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

  return (
    <div className="flex h-full">
      {/* Sub Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">データリスト</h3>
          <p className="text-xs text-slate-500">連携中のシート一覧</p>
        </div>
        <nav className="space-y-1">
          {sheets.map((sheet) => (
            <button
              key={sheet.id}
              onClick={() => setSelectedSheet(sheet.name)}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition ${
                selectedSheet === sheet.name
                  ? 'bg-primary-600 text-white font-medium'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{sheet.name}</span>
            </button>
          ))}
        </nav>
        <button className="mt-4 w-full flex items-center space-x-2 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition">
          <span className="text-lg">+</span>
          <span>新しい連携を追加</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="text-sm text-slate-500">
            <span>データ管理</span>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium">{selectedSheet}</span>
          </nav>
        </div>

        {/* Integration Status */}
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-bold text-green-800">Googleスプレッドシートと連携中</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    安全に連携済み
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span>元のスプレッドシートは保護されます(アプリからの編集は反映されません)</span>
                </div>
                <div className="text-xs text-slate-500">
                  連携先:{' '}
                  <a
                    href="#"
                    className="text-primary-600 hover:underline flex items-center space-x-1"
                  >
                    <span>https://docs.google.com/spreadsheets/d/1BxiMvs0...</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              連携設定を確認
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button className="btn-primary flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>最新データ取得</span>
            </button>
            <span className="text-sm text-slate-600">全 {sampleData.length} 件</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>CSV保存</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="text-left py-3 px-4 text-sm font-medium text-slate-700 bg-slate-50"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                  {columns.map((col) => (
                    <td key={col} className="py-3 px-4 text-sm text-slate-600">
                      {row[col as keyof typeof row] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default DataTab


