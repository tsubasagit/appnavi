import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import MyApps from './pages/MyApps'
import AppDetail from './pages/AppDetail'
import About from './pages/About'
import { AppProvider } from './context/AppContext'

function AppContent() {
  const location = useLocation()
  const isAppDetail = location.pathname.startsWith('/apps/') && location.pathname !== '/apps'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {!isAppDetail && <Sidebar />}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/apps" element={<MyApps />} />
          <Route path="/apps/:appId" element={<AppDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  )
}

export default App


