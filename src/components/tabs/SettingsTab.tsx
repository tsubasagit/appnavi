import { useState, useEffect } from 'react'
import { 
  Settings, Users, Save, Mail, X, Moon, Sun, 
  Bell, Palette, Workflow, Code, Key, Webhook,
  Lock, FolderTree, Globe, FileText, Sliders, Zap,
  Play, Download, FolderOpen, Link2, Wrench,
  Image, Eye, Shield, Cloud, Database
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const SettingsTab = () => {
  const { apps, activeAppId, setApps, isDarkMode, toggleDarkMode } = useApp()
  const app = apps.find(a => a.id === activeAppId)
  
  const [appName, setAppName] = useState(app?.name || '新しいアプリ')
  const [description, setDescription] = useState(app?.description || '')
  const [internalOnly, setInternalOnly] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('email@example.com')

  // アプリ情報が変更されたときに状態を更新
  useEffect(() => {
    if (app) {
      setAppName(app.name || '新しいアプリ')
      setDescription(app.description || '')
    }
  }, [app])

  const members = [
    { id: '1', name: '田中 部長', role: '管理者', avatar: '田' },
    { id: '2', name: '鈴木 花子', role: '編集者', avatar: '鈴' },
  ]

  // 設定を保存
  const handleSave = () => {
    if (!app || !activeAppId) return

    const updatedApps = apps.map(a => 
      a.id === activeAppId 
        ? { 
            ...a, 
            name: appName,
            description: description,
            lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
          }
        : a
    )
    setApps(updatedApps)
    
    // 保存成功のフィードバック
    alert('設定を保存しました')
  }

  // 実装済みの設定項目
  const implementedItems = [
    'icon-description',
    'design-theme',
    'app-access',
  ]

  // 設定カテゴリの定義
  const settingCategories = [
    {
      id: 'general',
      title: '一般設定',
      icon: Settings,
      color: 'blue',
      items: [
        { id: 'icon-description', label: 'アイコンと説明', icon: Image },
        { id: 'design-theme', label: 'デザインテーマ', icon: Palette },
        { id: 'process-management', label: 'プロセス管理', icon: Workflow },
      ]
    },
    {
      id: 'notifications',
      title: '通知',
      icon: Bell,
      color: 'orange',
      items: [
        { id: 'app-notifications', label: 'アプリの条件通知', icon: Bell },
        { id: 'record-notifications', label: 'レコードの条件通知', icon: FileText },
        { id: 'reminder-notifications', label: 'リマインダーの条件通知', icon: Bell },
      ]
    },
    {
      id: 'customization',
      title: 'カスタマイズ/サービス連携',
      icon: Wrench,
      color: 'slate',
      items: [
        { id: 'plugins', label: 'プラグイン', icon: Code },
        { id: 'js-css-customize', label: 'JavaScript / CSS でカスタマイズ', icon: Code },
        { id: 'api-tokens', label: 'API トークン', icon: Key },
        { id: 'webhooks', label: 'Webhook', icon: Webhook },
      ]
    },
    {
      id: 'access-rights',
      title: 'アクセス権',
      icon: Lock,
      color: 'amber',
      items: [
        { id: 'app-access', label: 'アプリ', icon: Shield },
        { id: 'record-access', label: 'レコード', icon: FileText },
        { id: 'field-access', label: 'フィールド', icon: Eye },
      ]
    },
    {
      id: 'other-settings',
      title: 'その他の設定',
      icon: Settings,
      color: 'slate',
      items: [
        { id: 'categories', label: 'カテゴリー', icon: FolderTree },
        { id: 'names-by-language', label: '言語ごとの名称', icon: Globe },
        { id: 'record-titles', label: 'レコードのタイトル', icon: FileText },
        { id: 'advanced-settings', label: '高度な設定', icon: Sliders },
        { id: 'actions', label: 'アクション', icon: Zap },
      ]
    },
    {
      id: 'operation',
      title: '運用管理',
      icon: Cloud,
      color: 'purple',
      items: [
        { id: 'app-test', label: 'アプリの動作テスト', icon: Play },
        { id: 'download-template', label: 'アプリをテンプレートとしてダウンロード', icon: Download },
        { id: 'change-space', label: 'アプリの所属するスペースを変更', icon: FolderOpen },
        { id: 'referencing-apps', label: 'このアプリを参照しているアプリ', icon: Link2 },
        { id: 'maintenance-mode', label: 'アプリのメンテナンスモード', icon: Wrench },
      ]
    },
  ]

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const handleItemClick = (categoryId: string, itemId: string) => {
    setSelectedItem(`${categoryId}-${itemId}`)
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">設定</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">アプリの各種設定を管理します</p>
      </div>

      {/* 設定カテゴリのグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingCategories.map((category) => {
          const Icon = category.icon
          const colorClasses = {
            blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
            orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
            purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
            red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
            green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
            slate: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
            amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
          }

          return (
            <div
              key={category.id}
              className={`card border-2 ${colorClasses[category.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  category.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  category.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                  category.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  category.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                  category.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                  category.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-slate-100 dark:bg-slate-700'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    category.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    category.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                    category.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    category.color === 'red' ? 'text-red-600 dark:text-red-400' :
                    category.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    category.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                    'text-slate-600 dark:text-slate-400'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{category.title}</h3>
              </div>
              
              <div className="space-y-2">
                {category.items.map((item) => {
                  const ItemIcon = item.icon
                  const itemKey = `${category.id}-${item.id}`
                  const isImplemented = implementedItems.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(category.id, item.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white dark:hover:bg-slate-700/50 transition text-left group"
                    >
                      <div className="flex items-center space-x-3">
                        <ItemIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                          {item.label}
                        </span>
                      </div>
                      {!isImplemented && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                          実装予定
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* 選択された項目の詳細表示（モーダルまたはサイドパネル） */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {settingCategories
                  .flatMap(cat => cat.items.map(item => ({ ...item, categoryId: cat.id })))
                  .find(item => `${item.categoryId}-${item.id}` === selectedItem)?.label || '設定'}
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* 各設定項目の詳細フォームをここに実装 */}
              {selectedItem.includes('icon-description') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">アプリ名</label>
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">説明文</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="textarea-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">アイコン</label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center">
                      <Image className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">アイコンをアップロード</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.includes('design-theme') && (
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isDarkMode ? (
                          <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        ) : (
                          <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">ダークモード</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {isDarkMode ? 'ダークモードが有効です' : 'ライトモードが有効です'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          isDarkMode
                            ? 'bg-primary-600 text-white'
                            : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isDarkMode ? '無効にする' : '有効にする'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.includes('app-access') && (
                <div className="space-y-4">
                  <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">社内限定公開 (推奨)</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          指定したドメイン(@company.co.jp)のGoogleアカウントのみアクセス可能
                        </p>
                      </div>
                      <button
                        onClick={() => setInternalOnly(!internalOnly)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          internalOnly
                            ? 'bg-primary-600 text-white'
                            : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {internalOnly ? '有効' : '無効'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">招待メンバー</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="input-field flex-1"
                      />
                      <button className="btn-primary flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>招待</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">現在のメンバー</h4>
                    <div className="space-y-3">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {member.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{member.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                            </div>
                          </div>
                          <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center space-x-1">
                            <X className="w-4 h-4" />
                            <span>削除</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* その他の設定項目はプレースホルダー */}
              {!selectedItem.includes('icon-description') && 
               !selectedItem.includes('design-theme') && 
               !selectedItem.includes('app-access') && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <span className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">実装予定</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                    この設定項目の実装は今後追加予定です。
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    handleSave()
                    setSelectedItem(null)
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>保存</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsTab


