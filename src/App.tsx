import { useState } from 'react'
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
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

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
      default: return <Dashboard />
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white/5 font-sans">
      <TopNav pageTitle={pageTitles[page] ?? 'MediWatch AI'} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={page} onChange={setPage} collapsed={collapsed} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div key={page} className="animate-fade-in min-h-full">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}
