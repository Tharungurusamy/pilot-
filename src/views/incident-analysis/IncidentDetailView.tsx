import { useState } from 'react'
import ActionsBar from './ActionsBar'
import IncidentSummarySection from './IncidentSummarySection'
import TimelineSection from './TimelineSection'
import RootCauseSection from './RootCauseSection'
import PatternSection from './PatternSection'
import LogAnalysisSection from './LogAnalysisSection'
import MetricsSection from './MetricsSection'
import DeploymentSection from './DeploymentSection'
import DependencyMapSection from './DependencyMapSection'
import ImpactSection from './ImpactSection'
import AIRecommendationsSection from './AIRecommendationsSection'
import CollaborationSection from './CollaborationSection'
import AICopilotSection from './AICopilotSection'
import PerformanceSection from './PerformanceSection'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'logs-metrics', label: 'Logs & Metrics' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'ai-knowledge', label: 'AI & Knowledge' },
  { id: 'collaboration', label: 'Collaboration' },
]

interface IncidentDetailViewProps {
  incidentId: string
  onBack: () => void
}

export default function IncidentDetailView({ incidentId, onBack }: IncidentDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <IncidentSummarySection incidentId={incidentId} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <PerformanceSection incidentId={incidentId} />
              <ImpactSection incidentId={incidentId} />
            </div>
          </div>
        )
      case 'timeline':
        return <TimelineSection incidentId={incidentId} />
      case 'analysis':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <RootCauseSection incidentId={incidentId} />
            <PatternSection incidentId={incidentId} />
          </div>
        )
      case 'logs-metrics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <LogAnalysisSection incidentId={incidentId} />
            <MetricsSection incidentId={incidentId} />
          </div>
        )
      case 'infrastructure':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <DeploymentSection incidentId={incidentId} />
            <DependencyMapSection incidentId={incidentId} />
          </div>
        )
      case 'ai-knowledge':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <AIRecommendationsSection incidentId={incidentId} />
            <AICopilotSection incidentId={incidentId} />
          </div>
        )
      case 'collaboration':
        return <CollaborationSection incidentId={incidentId} />
      default:
        return null
    }
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sticky Actions Bar */}
      <ActionsBar incidentId={incidentId} onBack={onBack} />

      {/* Tab Navigation */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 24px',
        display: 'flex',
        gap: 0,
        position: 'sticky',
        top: 52,
        zIndex: 19,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`incident-tab ${activeTab === tab.id ? 'incident-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <div key={activeTab} className="animate-fade-in">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
