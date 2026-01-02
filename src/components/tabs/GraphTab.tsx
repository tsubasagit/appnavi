import { Code, Copy, Check, Save, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { useApp } from '../../context/AppContext'

const GraphTab = () => {
  const { apps, activeAppId } = useApp()
  const app = apps.find(a => a.id === activeAppId)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [code, setCode] = useState('')

  // テンプレートコードの生成（完全なコード）
  const getTemplateCode = () => {
    if (!app?.template) return '// テンプレートが選択されていません'
    
    const templateCodes: Record<string, string> = {
      'crm': `// CRM テンプレート - 顧客管理アプリ
import React, { useState, useEffect } from 'react'
import { CustomerList, DealPipeline, ActivityTimeline } from './components'

interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'prospect'
  createdAt: string
}

interface Deal {
  id: string
  customerId: string
  title: string
  amount: number
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed'
  probability: number
  expectedCloseDate: string
}

interface Activity {
  id: string
  customerId: string
  type: 'call' | 'meeting' | 'email' | 'note'
  title: string
  description: string
  date: string
}

export const CRMDashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // データ取得ロジック
    const fetchData = async () => {
      try {
        setLoading(true)
        // 実際の実装では、データソースから取得
        // const customersData = await fetchCustomers()
        // const dealsData = await fetchDeals()
        // const activitiesData = await fetchActivities()
        // setCustomers(customersData)
        // setDeals(dealsData)
        // setActivities(activitiesData)
      } catch (error) {
        console.error('データ取得エラー:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-slate-500">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">顧客管理ダッシュボード</h1>
        <p className="text-slate-600 mt-2">顧客情報、商談管理、活動履歴を一元管理</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CustomerList customers={customers} />
          <DealPipeline deals={deals} />
        </div>
        <div>
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  )
}`,
      'inventory': `// 在庫管理テンプレート
import React, { useState, useEffect } from 'react'
import { InventoryList, StockChart, LocationManager } from './components'

export const InventoryDashboard = () => {
  const [items, setItems] = useState([])
  const [transactions, setTransactions] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    // データ取得ロジック
    // fetch('/api/inventory').then(res => res.json()).then(setItems)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">在庫管理ダッシュボード</h1>
        <p className="text-slate-600 mt-2">在庫の入出荷、在庫数管理、ロケーション管理</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryList items={items} />
        <StockChart data={items} />
      </div>
      
      <LocationManager locations={locations} />
    </div>
  )
}`,
      'daily-report': `// 日報テンプレート
import React, { useState } from 'react'
import { ReportForm, ActivityList, CalendarView } from './components'

export const DailyReportDashboard = () => {
  const [reports, setReports] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleSubmit = (reportData: any) => {
    // 日報送信ロジック
    setReports([...reports, reportData])
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">日報ダッシュボード</h1>
        <p className="text-slate-600 mt-2">日々の業務活動の記録と共有</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportForm onSubmit={handleSubmit} />
          <ActivityList reports={reports} />
        </div>
        <div>
          <CalendarView 
            reports={reports} 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>
    </div>
  )
}`,
      'reservation': `// 予約管理テンプレート
import React, { useState, useEffect } from 'react'
import { ReservationCalendar, AvailabilityView, BookingForm } from './components'

export const ReservationDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [resources, setResources] = useState([])

  useEffect(() => {
    // データ取得ロジック
    // fetch('/api/bookings').then(res => res.json()).then(setBookings)
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">予約管理ダッシュボード</h1>
        <p className="text-slate-600 mt-2">会議室、設備、サービスの予約管理</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReservationCalendar bookings={bookings} />
        </div>
        <div>
          <AvailabilityView resources={resources} />
          <BookingForm onBookingCreate={(booking) => setBookings([...bookings, booking])} />
        </div>
      </div>
    </div>
  )
}`,
    }
    
    return templateCodes[app.template] || `// ${app.template} テンプレート\n// コードを生成中...`
  }

  // 初期コードの読み込み
  useEffect(() => {
    if (app?.template) {
      const initialCode = getTemplateCode()
      setCode(initialCode)
    }
  }, [app?.template])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    // コードを保存（実際の実装ではFirestoreに保存）
    console.log('Code saved:', code)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (confirm('変更を破棄して、元のテンプレートコードに戻しますか？')) {
      setCode(getTemplateCode())
    }
  }

  if (!app?.template) {
    return (
      <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="card text-center py-12">
            <Code className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">テンプレートが選択されていません</h3>
            <p className="text-slate-500">
              まず「方針」タブでテンプレートを選択してください。
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <Code className="mr-3 text-primary-600" size={28} /> カスタマイズ
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                選択中のテンプレート: <span className="font-bold text-slate-900">{app.template}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                <RefreshCw size={18} />
                <span>リセット</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {saved ? (
                  <>
                    <Check size={18} />
                    <span>保存しました</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>保存</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    <span>コピーしました</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>コピー</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>ヒント:</strong> このコードは選択されたテンプレートに基づいて生成されています。
              コードを編集してカスタマイズできます。変更は保存ボタンで保存されます。
            </p>
          </div>

          {/* Monaco Editor */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <Editor
              height="600px"
              defaultLanguage="typescript"
              language="typescript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          <div className="mt-4 text-xs text-slate-500">
            <p>📝 コードを編集すると、自動的に保存されます。リセットボタンで元のテンプレートコードに戻せます。</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GraphTab

