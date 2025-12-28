import { BarChart3, Wrench } from 'lucide-react'

const GraphTab = () => {
  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Wrench className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
              <BarChart3 className="mr-3 text-primary-600" size={28} /> グラフ
            </h2>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg px-6 py-4 mb-6">
              <p className="text-lg font-bold text-yellow-800">工事中</p>
            </div>
            <p className="text-slate-600 text-center max-w-md">
              グラフ機能は現在開発中です。データの可視化機能は今後追加予定です。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GraphTab

