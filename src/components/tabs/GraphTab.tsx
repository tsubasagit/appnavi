import { Plus, MoreVertical, BarChart3, RefreshCw } from 'lucide-react'

const GraphTab = () => {
  const kpiCards = [
    { label: '今月の売上', value: '¥2,450,000', change: '+12%', changeType: 'positive' },
    { label: '新規顧客数', value: '18社', change: '+4', changeType: 'positive' },
    { label: '商談件数', value: '45件', change: '-2', changeType: 'negative' },
    { label: '成約率', value: '28%', change: '+1.5%', changeType: 'positive' },
  ]

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900">集計グラフ</h2>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>グラフを追加</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="card">
            <p className="text-sm text-slate-600 mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900 mb-2">{kpi.value}</p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                kpi.changeType === 'positive'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-orange-50 text-orange-700'
              }`}
            >
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-slate-600" />
              月別売上推移
            </h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
            <p className="text-slate-400 text-sm">グラフエリア</p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>4月</span>
            <span>5月</span>
            <span>6月</span>
            <span>7月</span>
            <span>8月</span>
            <span>9月</span>
            <span>10月</span>
          </div>
        </div>

        {/* Customer Region Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 text-slate-600" />
              顧客地域分布
            </h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-primary-600 border-t-green-600 border-r-orange-600 border-b-purple-600 flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">5</p>
                <p className="text-xs text-slate-500">地域</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-slate-600">関東 (35%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-slate-600">関西 (25%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-slate-600">中部 (25%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                <span className="text-slate-600">その他 (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

