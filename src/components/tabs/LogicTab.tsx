import { useState } from 'react'
import { Terminal, Code, FileCode, Save, Play } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { CodeOverride } from '../../types'

const LogicTab = () => {
  const { apps, activeAppId, environment } = useApp()
  const app = apps.find(a => a.id === activeAppId)
  const [codeOverrides, setCodeOverrides] = useState<CodeOverride[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [code, setCode] = useState('')

  // サンプルコード
  const sampleCode = `// コンポーネントのロジックをカスタマイズ
export const customLogic = (props: any) => {
  // データ変換の例
  const transformedData = props.data.map((item: any) => ({
    ...item,
    formattedValue: \`¥\${item.value.toLocaleString()}\`
  }))
  
  return transformedData
}

// イベントハンドラの例
export const handleClick = (event: React.MouseEvent) => {
  console.log('Custom click handler', event)
  // カスタムロジックを実装
}
`

  return (
    <div className="flex-1 bg-slate-900 p-6 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Terminal className="mr-3 text-purple-400" size={28} />
                Logic (The Workshop)
              </h2>
              <p className="text-slate-400 mt-2">
                コンポーネントのロジックをコードでカスタマイズし、高度な機能を実装します。
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span>実行</span>
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>保存</span>
              </button>
            </div>
          </div>

          {/* Environment Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <Code className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">
              環境: <span className="font-bold text-purple-400">{environment === 'dev' ? 'Development' : 'Production'}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Component Selector */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center">
                <FileCode className="w-4 h-4 mr-2" />
                コンポーネント選択
              </h3>
              <div className="space-y-2">
                {codeOverrides.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    オーバーライドがありません
                  </p>
                ) : (
                  codeOverrides.map((override) => (
                    <button
                      key={override.componentId}
                      onClick={() => {
                        setSelectedComponent(override.componentId)
                        setCode(override.code)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        selectedComponent === override.componentId
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <div className="font-medium">{override.componentId}</div>
                      <div className="text-xs opacity-75">{override.overrideType}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-300 flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  コードエディタ
                </h3>
                <select className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-600">
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
              <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 min-h-[500px]">
                {selectedComponent ? (
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full bg-slate-900 text-slate-100 font-mono text-sm resize-none focus:outline-none"
                    placeholder="コードを入力してください..."
                    style={{ minHeight: '500px' }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Code className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">コンポーネントを選択してください</p>
                    <p className="text-sm text-center max-w-md">
                      左側のパネルからコンポーネントを選択するか、新しいオーバーライドを作成してください。
                    </p>
                    <button
                      onClick={() => {
                        setCode(sampleCode)
                        setSelectedComponent('new-component')
                      }}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      サンプルコードを表示
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 text-xs text-slate-500">
                <p>💡 ヒント: Monaco Editorの統合は次のフェーズで実装されます。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogicTab



