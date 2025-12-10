import { Link } from 'react-router-dom'
import { ArrowRight, Check, Shield, Database, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  // 既にログインしている場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard')
    }
  }, [currentUser, navigate])

  if (currentUser) {
    return null // リダイレクト中
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-3xl mb-6 shadow-lg">
              <span className="text-4xl font-bold text-white">A</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              データは個人のもの、
              <br />
              プラットフォームはみんなのもの
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              AppNaviは、あなたのデータを自由に管理できるプラットフォームです。
              <br />
              Googleスプレッドシートと連携し、簡単にアプリケーションを作成できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary inline-flex items-center justify-center space-x-2 py-4 px-8 text-lg"
              >
                <span>無料で始める</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn-secondary inline-flex items-center justify-center space-x-2 py-4 px-8 text-lg"
              >
                <span>ログイン</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">主な機能</h2>
          <p className="text-xl text-slate-600">AppNaviでできること</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Database className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">データ連携</h3>
            <p className="text-slate-600">
              Googleスプレッドシートと簡単に連携。
              既存のデータをそのまま活用できます。
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">簡単作成</h3>
            <p className="text-slate-600">
              テンプレートから選ぶだけで、すぐにアプリケーションを作成できます。
              コーディング不要です。
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">安全な管理</h3>
            <p className="text-slate-600">
              あなたのデータはあなたのもの。
              元のスプレッドシートは保護され、安全に管理されます。
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">なぜAppNaviなのか</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">データの所有権</h3>
                <p className="text-slate-600">
                  あなたのデータは常にあなたのものです。AppNaviはデータを保持しません。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">コストパフォーマンス</h3>
                <p className="text-slate-600">
                  無料で始められます。シンプルな料金プランで、必要な機能を利用できます。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">カスタマイズ性</h3>
                <p className="text-slate-600">
                  あなたのビジネスに合わせて、自由にアプリケーションをカスタマイズできます。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">チーム共有</h3>
                <p className="text-slate-600">
                  メンバーとデータを共有し、協力して作業できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">今すぐ始めましょう</h2>
          <p className="text-xl text-primary-100 mb-8">
            AppNaviで、あなたのデータを自由に管理し、アプリケーションを作成しましょう。
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-primary-50 transition shadow-lg"
          >
            <span>無料で始める</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold text-white">AppNavi</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="hover:text-white transition">
                About
              </Link>
              <Link to="/login" className="hover:text-white transition">
                ログイン
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
            <p>&copy; 2024 AppNavi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

