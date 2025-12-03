import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Settings } from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'ダッシュボード' },
    { path: '/apps', icon: FolderKanban, label: 'マイアプリ' },
    { path: '/about', icon: Info, label: 'About' },
    { path: '/settings', icon: Settings, label: '設定' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">AppNavi</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || 
            (item.path === '/apps' && location.pathname.startsWith('/apps'))
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar


