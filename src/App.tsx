import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import MyApps from './pages/MyApps'
import AppDetail from './pages/AppDetail'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'

function AppContent() {
  const location = useLocation()
  const isAppDetail = location.pathname.startsWith('/apps/') && location.pathname !== '/apps'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isLandingPage = location.pathname === '/'
  const showSidebar = !isAppDetail && !isAuthPage && !isLandingPage

  // パブリックページ（サイドバーなし）
  if (isAuthPage || isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    )
  }

  // 保護されたページ（サイドバーあり）
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {showSidebar && <Sidebar />}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/apps" 
            element={
              <ProtectedRoute>
                <MyApps />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/apps/:appId" 
            element={
              <ProtectedRoute>
                <AppDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}

export default App


