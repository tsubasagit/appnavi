import { useState } from 'react'
import { Terminal, Server, Shield, Database, Code, ArrowRight, CheckCircle, Cpu, Users, Layers, DollarSign } from 'lucide-react'

const DeveloperLP = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Layers className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Appnavi</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition font-medium">機能</a>
              <a href="#merit" className="text-slate-600 hover:text-blue-600 transition font-medium">メリット</a>
              <a href="#docs" className="text-slate-600 hover:text-blue-600 transition font-medium">ドキュメント</a>
              <a href="https://github.com" className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub Star
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50 overflow-hidden z-0">
          <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-50"></div>
          <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              v1.0.0 Open Source Release
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              日本のDXに、自由な土台を。<br />
              あらゆる業務に対応する<br className="md:hidden"/> <span className="text-blue-600">オープンソース基盤</span>。
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Appnaviは、ITベンダー・開発者のためのインフラ構築エンジンです。<br />
              面倒な認証・管理機能はすべて標準装備。あなたは「顧客の課題解決」だけに集中できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                <Terminal className="w-5 h-5" />
                開発者ドキュメントを読む
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold text-lg hover:bg-slate-50 transition flex items-center justify-center gap-2">
                デモ環境を試す
              </button>
            </div>
          </div>

          {/* Terminal / Code Preview */}
          <div className="max-w-3xl mx-auto bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs text-slate-400 font-mono">bash — 80x24</span>
            </div>
            <div className="p-6 font-mono text-sm md:text-base text-slate-300">
              <div className="flex gap-2">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                <span>docker pull appnavi/core:latest</span>
              </div>
              <div className="text-slate-500 mt-2">Downloading... 100%</div>
              <div className="flex gap-2 mt-4">
                <span className="text-green-400">➜</span>
                <span className="text-blue-400">~</span>
                <span>docker-compose up -d</span>
              </div>
              <div className="text-slate-200 mt-2">
                Creating network "appnavi_default" with the default driver<br/>
                Creating appnavi_db ... done<br/>
                Creating appnavi_api ... done<br/>
                Creating appnavi_admin ... done
              </div>
              <div className="mt-4 text-green-400 font-bold">
                ✔ Appnavi is running at http://localhost:3000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience / Problem Section */}
      <div className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">なぜ、今 Appnavi なのか？</h2>
            <p className="mt-4 text-lg text-slate-600">受託開発・SaaS代理販売における「構造的な課題」を解決します。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">スクラッチ開発の疲弊</h3>
              <p className="text-slate-600 leading-relaxed">
                ログイン、権限管理、ログ監視...。
                顧客の本質的な価値ではない「車輪の再発明」に、貴重な開発工数を浪費していませんか？
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">SaaS代理店の薄利</h3>
              <p className="text-slate-600 leading-relaxed">
                便利なSaaSは多いですが、代理店マージンは10〜20%程度。
                どれだけ売っても、あなたの会社の利益構造は改善しません。
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">データの所有権問題</h3>
              <p className="text-slate-600 leading-relaxed">
                「顧客データは社内サーバーに置きたい」
                そんな要望に対し、クラウドSaaSでは対応できず、失注していませんか？
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition (For Vendors) */}
      <div id="merit" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-bold tracking-wider text-sm uppercase">For Developers & Vendors</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-6">
              技術力のあるベンダーが、<br />
              正当に評価される世界へ。
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">原価0円のオープンソース</h4>
                  <p className="text-slate-600 mt-1">
                    ソフトウェア利用料は無料。保守費用、カスタマイズ費用はすべてあなたの会社の利益になります。
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">ホワイトラベル対応</h4>
                  <p className="text-slate-600 mt-1">
                    Appnaviのロゴを消し、あなたの会社のブランド（自社ソリューション）として顧客に提供可能です。
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">オンプレミス / 自社クラウド対応</h4>
                  <p className="text-slate-600 mt-1">
                    AWS、Azure、社内サーバー。Dockerが動けばどこでも稼働。顧客のセキュリティ要件に柔軟に対応できます。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-1 shadow-2xl rotate-1 hover:rotate-0 transition duration-500">
            <div className="bg-slate-900 rounded-xl p-6 h-full text-white">
              <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center">
                <span className="font-mono text-slate-400">vendor_config.json</span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                </div>
              </div>
              <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
{`{
  "system": {
    "name": "My Custom DX Platform",
    "logo_url": "/assets/my-logo.png",
    "theme": "dark"
  },
  "modules": [
    "user_auth",
    "audit_log",
    "file_storage",
    "api_gateway"
  ],
  "license": "MIT"
}`}
              </pre>
              <div className="mt-6 bg-blue-500/20 border border-blue-500/50 rounded p-4 text-sm text-blue-200">
                👆 設定ファイル一つで、あなたのブランドへ。
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Modern Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
              <Cpu className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg">Docker Native</h3>
              <p className="text-slate-400 text-sm mt-2">環境依存ゼロ。<br/>1コマンドで立ち上げ。</p>
            </div>
            <div className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
              <Database className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg">PostgreSQL</h3>
              <p className="text-slate-400 text-sm mt-2">堅牢なデータ管理。<br/>標準SQL対応。</p>
            </div>
            <div className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
              <Server className="w-10 h-10 text-purple-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg">REST & GraphQL</h3>
              <p className="text-slate-400 text-sm mt-2">柔軟なAPI。<br/>外部連携も容易。</p>
            </div>
            <div className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
              <Code className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg">React / Vue</h3>
              <p className="text-slate-400 text-sm mt-2">フロントエンドは<br/>好みのFWで拡張可能。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">開発者の活用事例</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Aさん（フリーランスエンジニア）</h4>
                <p className="text-sm text-slate-500">地方製造業のDX案件</p>
              </div>
            </div>
            <p className="text-slate-700 italic">
              「予算100万円の案件で、フルスクラッチは無理でした。Appnaviを基盤にすることで、管理画面の実装工数を9割削減。浮いた工数で現場向けのスマホアプリを作り込み、大変感謝されました」
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg">B社（地域密着型SIer）</h4>
                <p className="text-sm text-slate-500">自治体向け情報共有システム</p>
              </div>
            </div>
            <p className="text-slate-700 italic">
              「データセンタを自社で持っているため、SaaSではなくオンプレミスで動くモダンな基盤を探していました。Appnaviはコードが開示されているので、セキュリティ監査もスムーズに通りました」
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            さあ、あなたの武器を手に入れよう。
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Appnaviは、今日から無料で使えます。<br />
            まずはローカル環境で、そのスピードを体感してください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2">
              <Terminal className="w-5 h-5" />
              npm install appnavi
            </a>
            <a href="https://github.com" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition flex items-center justify-center gap-2">
              <ArrowRight className="w-5 h-5" />
              GitHubでコードを見る
            </a>
          </div>
          <p className="mt-6 text-sm text-blue-200">License: MIT / Apache 2.0 compatible</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Layers className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-white text-lg">Appnavi</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              中小企業のITインフラを民主化する、<br/>オープンソースの基盤システム。<br/>
              Created by Engineers, for Engineers.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition">Examples</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Project</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition">Contribution Guide</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          © 2024 Appnavi Project. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default DeveloperLP

