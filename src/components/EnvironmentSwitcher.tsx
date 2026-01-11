import { Code, Server } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Environment } from '../types'

const EnvironmentSwitcher = () => {
  const { environment, setEnvironment, isVendorMode } = useApp()

  // ベンダーモードでない場合は表示しない
  if (!isVendorMode) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg border border-slate-200">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setEnvironment('dev')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
            environment === 'dev'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Dev</span>
        </button>
        <button
          onClick={() => setEnvironment('prod')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
            environment === 'prod'
              ? 'bg-green-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Prod</span>
        </button>
      </div>
      <div className="h-6 w-px bg-slate-300"></div>
      <div className="text-xs text-slate-500">
        {environment === 'dev' ? '開発環境' : '本番環境'}
      </div>
    </div>
  )
}

export default EnvironmentSwitcher



