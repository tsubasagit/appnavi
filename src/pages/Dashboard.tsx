import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Users, FileText } from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="p-6 md:p-8">
      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">ダッシュボード</h1>
        <p className="text-slate-600">作成したアプリケーションの概要を確認できます</p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">作成済みアプリ</p>
              <p className="text-2xl font-bold text-slate-900">3</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">総閲覧数</p>
              <p className="text-2xl font-bold text-slate-900">2,096</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">共有メンバー</p>
              <p className="text-2xl font-bold text-slate-900">12</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Template Recommendations */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">クイックスタート</h2>
          <Link to="/apps" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            すべて見る →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition text-center">
            <Plus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">新規アプリを作成</p>
          </button>
          <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
            <p className="text-sm font-medium text-slate-700 mb-1">営業日報テンプレート</p>
            <p className="text-xs text-slate-500">営業活動の記録と共有</p>
          </div>
          <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
            <p className="text-sm font-medium text-slate-700 mb-1">在庫管理テンプレート</p>
            <p className="text-xs text-slate-500">在庫の一元管理</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard







