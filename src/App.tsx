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
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: '#f0f4f8',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <Sidebar active={page} onChange={setPage} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopNav pageTitle={pageTitles[page] ?? 'MediWatch AI'} />

        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div key={page} className="animate-fade-in" style={{ minHeight: '100%' }}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}
