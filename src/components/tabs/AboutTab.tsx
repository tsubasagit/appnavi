import { Github, Mail, FileText } from 'lucide-react'

const AboutTab = () => {
  return (
    <div className="flex-1 bg-slate-50 dark:bg-black p-6 md:p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">AppNaviについて</h1>
          <p className="text-lg text-slate-600 dark:text-white">
            「データは個人のもの、プラットフォームはみんなのもの」
          </p>
        </div>

        {/* Mission */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">ミッション</h2>
          <p className="text-slate-700 dark:text-white leading-relaxed mb-4">
            AppNaviは、ITの専門知識を持たないすべての人々が、自身のデータを自由に活用し、
            自らの手で業務課題を解決できる社会を実現することを目指しています。
          </p>
          <p className="text-slate-700 dark:text-white leading-relaxed">
            中小企業の経営者、自治体職員、NPO・非営利団体など、予算やITリソースが限られた組織でも、
            高額なシステム導入なしに、使い慣れたExcelデータを活用して業務をデジタル化できるプラットフォームです。
          </p>
        </div>

        {/* Core Philosophy */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">コアコンセプト</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Data Sovereignty（データの主権）</h3>
              <p className="text-slate-700 dark:text-white leading-relaxed">
                データはユーザー自身（個人や企業）の資産であり、プラットフォームが囲い込むものではありません。
                ExcelやGoogleスプレッドシートという「ユーザーの手元」にあるデータを正とし、
                アプリはその「窓」としての役割に徹します。
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Platform Commons（プラットフォームの共有地化）
              </h3>
              <p className="text-slate-700 dark:text-white leading-relaxed">
                アプリを動かす基盤やテンプレート、ノウハウはオープンソース（OSS）として共有され、
                誰でも低コストで利用・改良できる公共財とします。
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3つのNO</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Code</h3>
              <p className="text-slate-600 dark:text-white text-sm leading-relaxed">
                コード不要・設計不要。AIが自動で最適な画面を生成します。
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Cost</h3>
              <p className="text-slate-600 dark:text-white text-sm leading-relaxed">
                運用コストゼロ・サーバーレス。データはユーザー自身のストレージに保存されます。
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Fear</h3>
              <p className="text-slate-600 dark:text-white text-sm leading-relaxed">
                データは手元に残ります。いつでもExcelに戻れます。
              </p>
            </div>
          </div>
        </div>

        {/* Target Users */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">ターゲットユーザー</h2>
          <ul className="space-y-3 text-slate-700 dark:text-white">
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
              <span>
                <strong>中小企業の経営者</strong>:
                IT投資予算がなく、Excelでの手作業に限界を感じているが、高額なSaaS導入には踏み切れない
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
              <span>
                <strong>自治体職員</strong>:
                DX推進を求められているが、セキュリティ要件や予算制約が厳しく、ベンダーロックインを避けたい
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
              <span>
                <strong>NPO・非営利団体</strong>:
                活動資金を現場に回したいため、管理ツールにはコストをかけられない
              </span>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div className="card">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">リンク</h2>
          <div className="space-y-3">
            <a
              href="https://github.com/tsubasagit/appnavi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHubリポジトリ
            </a>
            <a
              href="mailto:your-email@example.com"
              className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition"
            >
              <Mail className="w-5 h-5 mr-2" />
              お問い合わせ
            </a>
            <a
              href="/docs/specs/BASIC_CONCEPT.md"
              className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition"
            >
              <FileText className="w-5 h-5 mr-2" />
              基本構想書
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutTab
