import { useState } from 'react'
import { Save, Lightbulb } from 'lucide-react'

const PolicyTab = () => {
  const [formData, setFormData] = useState({
    appName: '営業活動報告アプリ',
    description: '日々の営業活動を記録し、チーム内で共有するアプリ',
    currentIssue: '情報が個人のメモ帳やバラバラのExcelに散らばっており、ナレッジが共有されていない。',
    solution: '訪問記録を一元管理し、外出先からでもスマホで入力・閲覧できるようにする。',
    kpi: '入力率100%達成と、商談の次回アクション設定率の向上。',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // 保存処理（実際の実装ではAPI呼び出し）
    console.log('Policy data saved:', formData)
    alert('保存しました。AIに学習させました。')
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">アプリの方針・コンセプト</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          ここに入力した内容は、AIがデータ分析・グラフ作成・デザイン提案を行う際の最重要な判断基準（プロンプト）として使用されます。
        </p>
      </div>

      {/* 基本情報 */}
      <div className="card mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">アプリの基本情報</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">アプリ名</label>
            <input
              type="text"
              value={formData.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              どんなアプリなのか? (概要)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="textarea-field"
            />
          </div>
        </div>
      </div>

      {/* 課題と解決策 */}
      <div className="card mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">課題と解決策</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              現状の課題 (Before)
            </label>
            <textarea
              value={formData.currentIssue}
              onChange={(e) => handleChange('currentIssue', e.target.value)}
              rows={4}
              className="textarea-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              どうやって解決するのか? (After)
            </label>
            <textarea
              value={formData.solution}
              onChange={(e) => handleChange('solution', e.target.value)}
              rows={4}
              className="textarea-field"
            />
          </div>
        </div>
      </div>

      {/* 成果指標 */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">成果指標</h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-xs">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-700 leading-relaxed">
                「入力率」や「アクション設定率」は数値化しやすいため、グラフダッシュボードで自動的に追跡ウィジェットを作成することをお勧めします。
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            その成果はどうやって図るのか? (KPI・目標)
          </label>
          <textarea
            value={formData.kpi}
            onChange={(e) => handleChange('kpi', e.target.value)}
            rows={4}
            className="textarea-field"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
          <Save className="w-5 h-5" />
          <span>保存してAIに学習させる</span>
        </button>
      </div>
    </div>
  )
}

export default PolicyTab

