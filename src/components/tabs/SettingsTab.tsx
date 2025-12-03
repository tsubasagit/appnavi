import { useState } from 'react'
import { Settings, Users, Link2, Save, Mail, X, Check } from 'lucide-react'

const SettingsTab = () => {
  const [appName, setAppName] = useState('サンプルアプリ')
  const [description, setDescription] = useState('営業活動の報告用アプリです。')
  const [internalOnly, setInternalOnly] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('email@example.com')

  const members = [
    { id: '1', name: '田中 部長', role: '管理者', avatar: '田' },
    { id: '2', name: '鈴木 花子', role: '編集者', avatar: '鈴' },
  ]

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24">
      {/* 基本情報 */}
      <div className="card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">基本情報</h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">アプリ名やアイコンを設定します。</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">アプリ名</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">説明文</label>
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
          <Users className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">共有メンバー・権限</h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">アプリを利用できるユーザーを管理します。</p>

        {/* 社内限定公開 */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 mb-1">社内限定公開 (推奨)</p>
              <p className="text-sm text-slate-600">
                指定したドメイン(@company.co.jp)のGoogleアカウントのみアクセス可能
              </p>
            </div>
            <button
              onClick={() => setInternalOnly(!internalOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                internalOnly
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {internalOnly ? '有効' : '無効'}
            </button>
          </div>
        </div>

        {/* 招待メンバー */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">招待メンバー</label>
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
          <h4 className="text-sm font-medium text-slate-700 mb-3">現在のメンバー</h4>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {member.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
                <button className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1">
                  <X className="w-4 h-4" />
                  <span>削除</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* データ連携設定 */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Link2 className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900">データ連携設定</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          連携しているデータソースの設定を管理します。
        </p>
        <div className="space-y-3">
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Googleスプレッドシート</p>
                <p className="text-sm text-slate-500">営業活動報告</p>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                設定を確認
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-64 right-0 bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <p className="text-sm">変更内容を保存しますか?</p>
        <button className="btn-primary bg-white text-primary-600 hover:bg-slate-100 flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>設定を保存</span>
        </button>
      </div>
    </div>
  )
}

export default SettingsTab

