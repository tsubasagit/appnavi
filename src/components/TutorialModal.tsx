import { useState, useEffect } from 'react'
import { X, ArrowRight, Compass, PenTool, Database, Code, CheckCircle2, Play } from 'lucide-react'

interface TutorialModalProps {
  onClose: () => void
  onSkip: () => void
}

const TutorialModal = ({ onClose, onSkip }: TutorialModalProps) => {
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps = [
    {
      title: 'AppNaviへようこそ！',
      description: 'AppNaviは、コードを書かずに業務アプリを作成できるNo-Codeプラットフォームです。',
      icon: Play,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            「One App, One Mission」— 目的特化型アプリを3ステップで構築できます。
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">3つのNO</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• No Code - コード不要・設計不要</li>
              <li>• No Cost - 運用コストゼロ</li>
              <li>• No Fear - データは手元に残る</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Step 1: 方針設定',
      description: 'アプリの目的と目標を設定します。',
      icon: Compass,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            「方針」タブで、以下の情報を入力します：
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
            <li>テンプレート選択（目的特化型テンプレートから選択）</li>
            <li>アプリの基本情報（名前、概要）</li>
            <li>現状の課題（Before）</li>
            <li>解決策（After）</li>
            <li>成果指標（KPI・目標）</li>
          </ul>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            AIがこれらの情報を学習し、アプリの最適化に活用します。
          </p>
        </div>
      ),
    },
    {
      title: 'Step 2: デザイン',
      description: 'アプリの見た目をカスタマイズします。',
      icon: PenTool,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            「デザイン」タブで、以下の設定ができます：
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
            <li>テーマカラーの変更</li>
            <li>レイアウトの調整</li>
            <li>コンポーネントの配置</li>
            <li>ダークモードの切り替え</li>
          </ul>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            ドラッグ＆ドロップで簡単にカスタマイズできます。
          </p>
        </div>
      ),
    },
    {
      title: 'Step 3: データ接続',
      description: 'データソースを接続します。',
      icon: Database,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            「データ」タブで、以下のデータソースを接続できます：
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
            <li>Googleスプレッドシート（推奨）</li>
            <li>Excelファイル</li>
            <li>CSVファイル</li>
          </ul>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>重要：</strong> データはあなたの手元（Google Drive/ローカル）に残ります。
              AppNaviはデータの「窓」として機能します。
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Step 4: カスタマイズ',
      description: '必要に応じてコードでカスタマイズできます。',
      icon: Code,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            「カスタマイズ」タブで、高度なカスタマイズが可能です：
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
            <li>Monaco Editorでコードを編集</li>
            <li>コンポーネントの動作をカスタマイズ</li>
            <li>ロジックの追加</li>
          </ul>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            上級者向けの機能ですが、基本的な使い方では不要です。
          </p>
        </div>
      ),
    },
    {
      title: '完了！',
      description: 'これで準備完了です。',
      icon: CheckCircle2,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            アプリの作成は以上です。各タブを順番に進めて、アプリを完成させましょう。
          </p>
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <h4 className="font-semibold text-primary-900 dark:text-primary-200 mb-2">次のステップ</h4>
            <ol className="text-sm text-primary-800 dark:text-primary-300 space-y-1 list-decimal list-inside">
              <li>「方針」タブでテンプレートを選択</li>
              <li>「データ」タブでデータソースを接続</li>
              <li>「デザイン」タブで見た目を調整</li>
              <li>「ダッシュボード」タブで完成したアプリを確認</li>
            </ol>
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('appnavi_tutorial_completed', 'true')
    onClose()
  }

  const handleSkip = () => {
    localStorage.setItem('appnavi_tutorial_completed', 'true')
    onSkip()
  }

  const currentTutorial = tutorialSteps[currentStep]
  const Icon = currentTutorial.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentTutorial.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {currentStep + 1} / {tutorialSteps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {currentTutorial.description}
          </p>
          <div className="text-slate-700 dark:text-slate-300">
            {currentTutorial.content}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            スキップ
          </button>
          <div className="flex items-center space-x-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                戻る
              </button>
            )}
            <button
              onClick={handleNext}
              className="btn-primary flex items-center space-x-2"
            >
              <span>{currentStep === tutorialSteps.length - 1 ? '完了' : '次へ'}</span>
              {currentStep < tutorialSteps.length - 1 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialModal



