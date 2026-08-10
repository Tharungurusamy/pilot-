import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import Dashboard from './views/Dashboard'
import LiveMonitoring from './views/LiveMonitoring'
import IncidentAnalysis from './views/IncidentAnalysis'
import AIAgents from './views/AIAgents'
import PatternAnalysis from './views/PatternAnalysis'
import RootCauseAnalysis from './views/RootCauseAnalysis'
import ResolutionCenter from './views/ResolutionCenter'
import KnowledgeBase from './views/KnowledgeBase'
import Reports from './views/Reports'
import Alerts from './views/Alerts'
import Settings from './views/Settings'
import MLPredictView from './views/MLPredictView'

const pageTitles: Record<string, string> = {
  'dashboard': 'Dashboard',
  'live-monitoring': 'Live Monitoring',
  'incidents': 'Incident Analysis',
  'ai-agents': 'AI Agents',
  'patterns': 'Pattern Analysis',
  'root-cause': 'Root Cause Analysis',
  'resolution': 'Resolution Center',
  'knowledge-base': 'Knowledge Base',
  'reports': 'Reports',
  'alerts': 'Alerts',
  'settings': 'Settings',
  'predict': 'ML Log Analyzer',
}

export type ToastType = {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'error' | 'warning';
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [toasts, setToasts] = useState<ToastType[]>([])

  useEffect(() => {
    const handleToast = (e: any) => {
      const newToast = { id: Date.now(), message: e.detail.message, type: e.detail.type || 'success' };
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 4000);
    };
    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard />
      case 'live-monitoring': return <LiveMonitoring />
      case 'incidents': return <IncidentAnalysis />
      case 'ai-agents': return <AIAgents />
      case 'patterns': return <PatternAnalysis />
      case 'root-cause': return <RootCauseAnalysis />
      case 'resolution': return <ResolutionCenter />
      case 'knowledge-base': return <KnowledgeBase />
      case 'reports': return <Reports />
      case 'alerts': return <Alerts />
      case 'settings': return <Settings />
      case 'predict': return <MLPredictView />
      default: return <Dashboard />
    }
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen overflow-hidden bg-white/5 dark:bg-[#0f0f0f] font-sans text-black dark:text-white transition-colors duration-200">
        <TopNav
          pageTitle={pageTitles[page] ?? 'MediWatch AI'}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar active={page} onChange={setPage} collapsed={collapsed} />

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div key={page} className="animate-fade-in min-h-full">
              {renderPage()}
            </div>
          </main>
        </div>

        {/* Global Toast Notification Container */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="animate-fade-in-up bg-[#0f0f0f] dark:bg-white text-white dark:text-[#0f0f0f] px-4 py-3 rounded-xl shadow-lg border border-[#272727] dark:border-gray-200 flex items-center gap-3 min-w-[280px] pointer-events-auto transition-all transform whitespace-nowrap">
               {toast.type === 'success' && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />}
               {toast.type === 'info' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
               {toast.type === 'error' && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
               <span className="font-semibold text-sm">{toast.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
