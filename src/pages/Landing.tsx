import { Link } from 'react-router-dom'
import { 
  Database, 
  ArrowRight, 
  Github, 
  Menu, 
  ShieldCheck, 
  Users, 
  Wand2, 
  Coins, 
  HeartHandshake,
  Briefcase,
  Building2,
  Heart,
  Check,
  Table2,
  Smartphone,
  Twitter
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Landing = () => {
  const { currentUser } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-slate-800 scroll-smooth">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md fixed w-full z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <Database className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-slate-900">AppNavi</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#mission" className="text-slate-600 hover:text-blue-600 transition">ミッション</a>
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition">特徴</a>
              <a href="#target" className="text-slate-600 hover:text-blue-600 transition">活用事例</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition">お問い合わせ</a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 transition">
                  ダッシュボード
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 transition">
                    ログイン
                  </Link>
                  <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold shadow-md transition transform hover:-translate-y-0.5">
                    新規登録
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#mission" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">ミッション</a>
              <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">特徴</a>
              <a href="#target" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50">活用事例</a>
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                {currentUser ? (
                  <Link to="/dashboard" className="w-full text-center text-slate-600 hover:text-slate-900 font-medium px-4 py-2 border border-slate-300 rounded-md">
                    ダッシュボード
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="w-full text-center text-slate-600 hover:text-slate-900 font-medium px-4 py-2 border border-slate-300 rounded-md">
                      ログイン
                    </Link>
                    <Link to="/register" className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-bold shadow-sm">
                      新規登録
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-50 to-blue-100 pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <span className="bg-blue-600 w-2 h-2 rounded-full mr-2"></span>
              Excelデータをそのままアプリへ
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              データは個人のもの、<br className="hidden md:block" />
              <span className="text-blue-600">プラットフォームはみんなのもの</span>
            </h1>
            <p className="mt-4 text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              ITの専門知識はもう必要ありません。<br />
              使い慣れたExcelやスプレッドシートを活用し、<br />
              誰でも自由に業務課題を解決できる社会へ。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  ダッシュボードへ
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  無料で始める
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <a
                href="https://github.com/tsubasagit/appnavi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-full font-bold text-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                GitHubを見る
              </a>
            </div>
          </div>

          {/* Abstract Graphic Representation */}
          <div className="mt-16 relative mx-auto max-w-4xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-10 border border-slate-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left: Excel */}
                <div className="flex flex-col items-center gap-4 w-full md:w-1/3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <Table2 className="w-16 h-16 text-green-600" />
                  <div className="text-center">
                    <p className="font-bold text-slate-700">あなたのデータ</p>
                    <p className="text-xs text-slate-500">Excel / Spreadsheets</p>
                  </div>
                </div>

                {/* Center: AppNavi AI */}
                <div className="flex flex-col items-center gap-2">
                  <ArrowRight className="w-8 h-8 text-blue-400 hidden md:block" />
                  <ArrowRight className="w-8 h-8 text-blue-400 md:hidden rotate-90" />
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">AI自動生成</div>
                </div>

                {/* Right: App */}
                <div className="flex flex-col items-center gap-4 w-full md:w-1/3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <Smartphone className="w-16 h-16 text-blue-600" />
                  <div className="text-center">
                    <p className="font-bold text-slate-700">業務アプリ</p>
                    <p className="text-xs text-slate-500">PC / Mobile / Tablet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Our Mission</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">コアコンセプト</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              私たちは、技術的な制約を取り払い、全ての人がDXの恩恵を受けられる仕組みを作ります。
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 text-indigo-600">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Data Sovereignty（データの主権）</h3>
                <p className="text-slate-600 leading-relaxed">
                  データはユーザー自身（個人や企業）の資産であり、プラットフォームが囲い込むものではありません。<br />
                  AppNaviは、ExcelやGoogleスプレッドシートという「ユーザーの手元」にあるデータを正（マスター）とし、アプリはその「窓」としての役割に徹します。
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-teal-100 text-teal-600">
                  <Users className="w-8 h-8" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Platform Commons（共有地化）</h3>
                <p className="text-slate-600 leading-relaxed">
                  アプリを動かす基盤やテンプレート、ノウハウはオープンソース（OSS）として共有されます。<br />
                  特定の企業が独占するのではなく、誰もが低コストで利用・改良できる「公共財」としてプラットフォームを提供します。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 NOs Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">AppNaviが約束する<br className="md:hidden" />「3つのNO」</h2>
            <p className="mt-4 text-slate-600">
              従来のシステム開発における障壁を、徹底的に排除しました。
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Wand2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Code</h3>
              <p className="text-slate-600">
                コード不要・設計不要。<br />
                AIがあなたのExcelデータを解析し、自動で最適な入力画面や管理画面を生成します。専門知識は一切不要です。
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Coins className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Cost</h3>
              <p className="text-slate-600">
                運用コストゼロ・サーバーレス。<br />
                データはユーザー自身のストレージ（Google DriveやOneDriveなど）に直接保存されるため、高額なサーバー費用はかかりません。
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition duration-300">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Fear</h3>
              <p className="text-slate-600">
                ベンダーロックインの心配はありません。<br />
                データは常に手元のExcelファイルに残ります。AppNaviの使用をやめても、データはあなたのものです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section id="target" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-white mb-6">
                  予算やITリソースが限られた<br />すべての組織のために
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-800 p-2 rounded-lg text-blue-200">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">中小企業の経営者様</h4>
                      <p className="text-blue-100 text-sm mt-1">IT投資予算がなくExcel手作業に限界を感じているが、高額なSaaS導入には踏み切れない方に。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-800 p-2 rounded-lg text-blue-200">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">自治体職員様</h4>
                      <p className="text-blue-100 text-sm mt-1">DX推進を求められているが、予算制約が厳しく、ベンダーロックインを避けたい現場に。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-800 p-2 rounded-lg text-blue-200">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">NPO・非営利団体様</h4>
                      <p className="text-blue-100 text-sm mt-1">活動資金を現場に回すため、管理ツールにはコストをかけられない組織に。</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-800 relative hidden lg:block">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 w-full max-w-sm">
                    <div className="h-4 w-1/3 bg-white/40 rounded mb-4"></div>
                    <div className="h-2 w-full bg-white/20 rounded mb-2"></div>
                    <div className="h-2 w-full bg-white/20 rounded mb-2"></div>
                    <div className="h-2 w-2/3 bg-white/20 rounded mb-6"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-8 w-8 bg-green-400/80 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 h-8 bg-white/90 rounded flex items-center px-3 text-xs text-slate-700">自動生成されました</div>
                    </div>
                    <button className="w-full py-2 bg-white text-blue-900 font-bold rounded shadow-lg text-sm">デモを試す</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <section id="contact" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            さあ、あなたのデータを解き放ちましょう
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            高額なシステムは必要ありません。<br />
            手元のExcelファイルひとつで、DXは始められます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <Link
                to="/dashboard"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-xl transition transform hover:-translate-y-1"
              >
                ダッシュボードへ
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-xl transition transform hover:-translate-y-1"
              >
                無料で新規登録
              </Link>
            )}
            <a
              href="#contact"
              className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-bold text-lg transition"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-lg text-slate-900">AppNavi</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                AppNaviは、IT専門知識不要でExcelデータを活用し、業務課題を解決できるオープンプラットフォームです。
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="/" className="hover:text-blue-600">ホーム</a></li>
                <li><a href="#mission" className="hover:text-blue-600">ミッション</a></li>
                <li><a href="#features" className="hover:text-blue-600">機能一覧</a></li>
                <li><a href="https://github.com/tsubasagit/appnavi" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">GitHubリポジトリ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">ドキュメント</a></li>
                <li><a href="#" className="hover:text-blue-600">基本構想書</a></li>
                <li><a href="#contact" className="hover:text-blue-600">お問い合わせ</a></li>
                <li><a href="#" className="hover:text-blue-600">プライバシーポリシー</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2024 AppNavi. All rights reserved.</p>
            <div className="flex space-x-6 text-slate-400">
              <a href="https://github.com/tsubasagit/appnavi" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-slate-600">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
