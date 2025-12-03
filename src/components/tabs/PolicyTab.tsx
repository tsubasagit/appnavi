import { useState } from 'react'
import { Save, Lightbulb, Target, BarChart3, Sparkles, Compass } from 'lucide-react'

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
    <div className="flex-1 bg-slate-50 p-6 md:p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <Compass className="mr-3 text-primary-600" size={28} /> アプリの方針・コンセプト
            </h2>
            <p className="text-slate-500 mt-2">
              ここに入力された内容は、AIがデータの分析やグラフ作成、デザイン提案を行う際の<br/>
              <span className="font-bold text-slate-700 underline decoration-primary-300 decoration-2">
                最も重要な判断基準（プロンプト）
              </span>
              として使用されます。
            </p>
          </div>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center space-x-2"
          >
            <Save size={18} />
            <span>保存してAIに学習させる</span>
          </button>
        </div>

        {/* Card 1: Identity */}
        <div className="card mb-6">
          <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center">
            <Target size={20} className="mr-2 text-primary-500" /> アプリの基本情報
          </h3>
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

        {/* Card 2: Problem & Solution */}
        <div className="card mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
          <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center">
            <Lightbulb size={20} className="mr-2 text-orange-500" /> 課題と解決策
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">現状の課題（Before）</label>
              <textarea
                value={formData.currentIssue}
                onChange={(e) => handleChange('currentIssue', e.target.value)}
                rows={6}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none h-32 bg-orange-50/30"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">どうやって解決するのか？（After）</label>
              <textarea
                value={formData.solution}
                onChange={(e) => handleChange('solution', e.target.value)}
                rows={6}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none h-32 bg-primary-50/30"
              />
            </div>
          </div>
      </div>

        {/* Card 3: Success Metrics */}
        <div className="card mb-6">
          <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2 text-green-500" /> 成果指標
          </h3>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">その成果はどうやって図るのか？（KPI・目標）</label>
            <div className="flex items-start">
              <textarea
                value={formData.kpi}
                onChange={(e) => handleChange('kpi', e.target.value)}
                rows={4}
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none h-20 mr-4"
              />
              <div className="w-1/3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-500">
                <div className="flex items-center mb-2 font-bold text-slate-600">
                  <Sparkles size={12} className="mr-1 text-purple-500" /> AIのアドバイス
                </div>
                「入力率」や「アクション設定率」は数値化しやすいため、グラフダッシュボードで自動的に追跡ウィジェットを作成することをお勧めします。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PolicyTab


