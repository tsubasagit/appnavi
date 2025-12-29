import { Code, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'

const GraphTab = () => {
  const { apps, activeAppId } = useApp()
  const app = apps.find(a => a.id === activeAppId)
  const [copied, setCopied] = useState(false)

  // テンプレートコードのサンプル（実際には選択されたテンプレートに応じて変更）
  const getTemplateCode = () => {
    if (!app?.template) return '// テンプレートが選択されていません'
    
    const templateCodes: Record<string, string> = {
      'crm': `// CRM テンプレート
import React from 'react'
import { CustomerList, DealPipeline, ActivityTimeline } from './components'

export const CRMDashboard = () => {
  return (
    <div className="p-6">
      <h1>顧客管理ダッシュボード</h1>
      <CustomerList />
      <DealPipeline />
      <ActivityTimeline />
    </div>
  )
}`,
      'inventory': `// 在庫管理テンプレート
import React from 'react'
import { InventoryList, StockChart, LocationManager } from './components'

export const InventoryDashboard = () => {
  return (
    <div className="p-6">
      <h1>在庫管理ダッシュボード</h1>
      <InventoryList />
      <StockChart />
      <LocationManager />
    </div>
  )
}`,
      'daily-report': `// 日報テンプレート
import React from 'react'
import { ReportForm, ActivityList, CalendarView } from './components'

export const DailyReportDashboard = () => {
  return (
    <div className="p-6">
      <h1>日報ダッシュボード</h1>
      <ReportForm />
      <ActivityList />
      <CalendarView />
    </div>
  )
}`,
      'reservation': `// 予約管理テンプレート
import React from 'react'
import { ReservationCalendar, AvailabilityView, BookingForm } from './components'

export const ReservationDashboard = () => {
  return (
    <div className="p-6">
      <h1>予約管理ダッシュボード</h1>
      <ReservationCalendar />
      <AvailabilityView />
      <BookingForm />
    </div>
  )
}`,
    }
    
    return templateCodes[app.template] || `// ${app.template} テンプレート\n// コードを生成中...`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getTemplateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const code = getTemplateCode()

  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <Code className="mr-3 text-primary-600" size={28} /> カスタマイズ
            </h2>
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
                  <span>コードをコピー</span>
                </>
              )}
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-slate-600">
              選択中のテンプレート: <span className="font-bold text-slate-900">{app?.template || '未選択'}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              このコードは選択されたテンプレートに基づいて生成されています。カスタマイズして使用してください。
            </p>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-slate-100 font-mono">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GraphTab

