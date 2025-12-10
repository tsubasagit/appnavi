import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
  return (
    <Routes>
      {/* パブリックページ（サイドバーなし） */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* 保護されたページ（サイドバーあり） */}
      <Route 
        path="/dashboard" 
        element={
          <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </main>
          </div>
        } 
      />
      <Route 
        path="/apps" 
        element={
          <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <ProtectedRoute>
                <MyApps />
              </ProtectedRoute>
            </main>
          </div>
        } 
      />
      <Route 
        path="/apps/:appId" 
        element={
          <div className="flex h-screen overflow-hidden bg-slate-50">
            <main className="flex-1 overflow-auto">
              <ProtectedRoute>
                <AppDetail />
              </ProtectedRoute>
            </main>
          </div>
        } 
      />
      <Route 
        path="/about" 
        element={
          <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            </main>
          </div>
        } 
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter basename="/appnavi">
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}

export default App


