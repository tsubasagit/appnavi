import { useState } from 'react'
import { Puzzle, Plus, Package, Trash2, Edit2, Search, Github, Upload, Download, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Plugin } from '../../types/plugin'
import { fetchPlugins, installAsset, AssetMetadata } from '../../utils/githubAsset'

const PluginsTab = () => {
  const { apps, activeAppId } = useApp()
  const app = apps.find(a => a.id === activeAppId)
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [githubPlugins, setGithubPlugins] = useState<AssetMetadata[]>([])
  const [isLoadingPlugins, setIsLoadingPlugins] = useState(false)

  // 検索フィルタリング
  const filteredPlugins = plugins.filter(plugin => {
    const query = searchQuery.toLowerCase()
    return (
      plugin.name.toLowerCase().includes(query) ||
      plugin.description.toLowerCase().includes(query) ||
      plugin.category.toLowerCase().includes(query)
    )
  })

  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                <Puzzle className="mr-3 text-purple-600" size={28} />
                Plugins (The Armory)
              </h2>
              <p className="text-slate-600 mt-2">
                カスタムコンポーネントを登録・管理し、再利用可能な資産として活用します。
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={async () => {
                  setIsLoadingPlugins(true)
                  try {
                    const plugins = await fetchPlugins()
                    setGithubPlugins(plugins)
                    setIsInstallModalOpen(true)
                  } catch (error) {
                    alert('GitHubからプラグインを取得できませんでした。')
                    console.error(error)
                  } finally {
                    setIsLoadingPlugins(false)
                  }
                }}
                className="btn-secondary flex items-center space-x-2 relative"
                disabled={isLoadingPlugins}
                title="OSS版のみ"
              >
                <Download size={16} />
                <span>新規インストール</span>
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] px-1 rounded">OSS</span>
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-secondary flex items-center space-x-2 relative"
                title="OSS版のみ"
              >
                <Upload size={16} />
                <span>アップロード</span>
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] px-1 rounded">OSS</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>プラグインを追加</span>
              </button>
            </div>
          </div>

          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="プラグインを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Plugins Grid */}
        {filteredPlugins.length === 0 ? (
          <div className="card text-center py-12">
            <Puzzle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-2">プラグインがありません</h3>
            <p className="text-slate-500 mb-4">
              {searchQuery ? '検索条件に一致するプラグインが見つかりませんでした。' : 'プラグインを追加して、再利用可能なコンポーネントを作成しましょう。'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>最初のプラグインを追加</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlugins.map((plugin) => (
              <div
                key={plugin.id}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{plugin.name}</h3>
                      <p className="text-xs text-slate-500">v{plugin.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <Edit2 className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{plugin.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="px-2 py-1 bg-slate-100 rounded">{plugin.category}</span>
                  <span>作成者: {plugin.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Plugin Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">プラグインを追加</h3>
                <p className="text-slate-600 mb-6">
                  プラグインの追加機能は開発中です。GitHub連携やコードエディタからの登録が可能になります。
                </p>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* インストールモーダル */}
        {isInstallModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setIsInstallModalOpen(false)
              setGithubPlugins([])
            }}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Github className="w-6 h-6 text-slate-700" />
                    <h2 className="text-2xl font-bold text-slate-900">GitHubからプラグインをインストール</h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsInstallModalOpen(false)
                      setGithubPlugins([])
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  GitHubリポジトリ（tsubasagit/AppNavi-asset）から利用可能なプラグインをインストールできます。
                </p>
              </div>
              <div className="p-6">
                {githubPlugins.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600">利用可能なプラグインが見つかりませんでした。</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {githubPlugins.map((plugin) => (
                      <div
                        key={plugin.id}
                        className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-slate-900">{plugin.name}</h3>
                            <p className="text-xs text-slate-500">v{plugin.version}</p>
                          </div>
                          <span className="px-2 py-1 bg-purple-100 rounded text-xs text-purple-600">
                            {plugin.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{plugin.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">作成者: {plugin.author}</p>
                          <button
                            onClick={async () => {
                              try {
                                await installAsset(plugin)
                                setIsInstallModalOpen(false)
                                setGithubPlugins([])
                              } catch (error) {
                                alert('インストールに失敗しました。')
                                console.error(error)
                              }
                            }}
                            className="btn-primary text-xs px-3 py-1"
                          >
                            インストール
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* アップロードモーダル */}
        {isUploadModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsUploadModalOpen(false)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Upload className="w-6 h-6 text-slate-700" />
                    <h2 className="text-2xl font-bold text-slate-900">プラグインをアップロード</h2>
                  </div>
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  プラグインをGitHubリポジトリ（tsubasagit/AppNavi-asset）にアップロードします。
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-slate-700 mb-2">
                    <strong>アップロード方法:</strong>
                  </p>
                  <ol className="text-sm text-slate-600 list-decimal list-inside space-y-1">
                    <li>GitHubリポジトリ（<a href="https://github.com/tsubasagit/AppNavi-asset" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">tsubasagit/AppNavi-asset</a>）にアクセス</li>
                    <li>pluginsディレクトリに新しいプラグインフォルダを作成</li>
                    <li>metadata.jsonとプラグインファイルを追加</li>
                    <li>Pull Requestを作成してレビューを依頼</li>
                  </ol>
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                  >
                    閉じる
                  </button>
                  <a
                    href="https://github.com/tsubasagit/AppNavi-asset"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Github size={16} />
                    <span>GitHubで開く</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PluginsTab

