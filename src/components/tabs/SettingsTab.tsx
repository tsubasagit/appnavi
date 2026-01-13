import { useState, useEffect } from 'react'
import { Settings, Users, Save, Mail, X, Moon, Sun } from 'lucide-react'
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

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* 基本情報 */}
      <div className="card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">基本情報</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">アプリ名やアイコンを設定します。</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">アプリ名</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">説明文</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="textarea-field"
            />
          </div>
        </div>
      </div>

      {/* 共有メンバー・権限 */}
      <div className="card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">共有メンバー・権限</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">アプリを利用できるユーザーを管理します。</p>

        {/* 社内限定公開 */}
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

        {/* 招待メンバー */}
        <div className="mb-6">
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

        {/* 現在のメンバー */}
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

      {/* 表示設定 */}
      <div className="card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">表示設定</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">アプリの表示モードを設定します。</p>
        
        {/* ダークモード切り替え */}
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

      {/* Save Section */}
      <div className="card mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-700 dark:text-slate-300">変更内容を保存しますか?</p>
          <button 
            onClick={handleSave}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>設定を保存</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab


