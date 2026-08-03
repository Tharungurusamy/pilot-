import { useState } from 'react'
import { actionButtons } from './incidentDetailData'

interface ActionsBarProps {
 incidentId: string
 onBack: () => void
}

export default function ActionsBar({ incidentId, onBack }: ActionsBarProps) {
 const [showAll, setShowAll] = useState(false)
 const [activeAction, setActiveAction] = useState<string | null>(null)

 const visibleActions = showAll ? actionButtons : actionButtons.slice(0, 6)

 const handleAction = (actionId: string) => {
 setActiveAction(actionId)
 setTimeout(() => setActiveAction(null), 1500)
 }

 return (
 <div style={{
 background: '#ffffff',
 borderBottom: '1px solid #e2e8f0',
 padding: '12px 24px',
 display: 'flex',
 alignItems: 'center',
 gap: 8,
 position: 'sticky',
 top: 0,
 zIndex: 20,
 }}>
 {/* Back button */}
 <button
 onClick={onBack}
 style={{
 display: 'flex', alignItems: 'center', gap: 6,
 padding: '6px 14px', borderRadius: 8,
 background: '#f8fafc', border: '1px solid #e2e8f0',
 color: '#0f172a', fontSize: 12, fontWeight: 600,
 cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
 marginRight: 8,
 }}
 onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
 onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
 >
 <span style={{ fontSize: 14 }}>←</span> Back to List
 </button>

 {/* Incident ID */}
 <span style={{
 fontFamily: "'JetBrains Mono', monospace",
 fontSize: 12, fontWeight: 700, color: '#2563eb',
 background: 'rgba(37,99,235,0.08)', padding: '4px 10px',
 borderRadius: 6, marginRight: 4,
 }}>{incidentId}</span>

 {/* Divider */}
 <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />

 {/* Action buttons */}
 {visibleActions.map(action => (
 <button
 key={action.id}
 onClick={() => handleAction(action.id)}
 style={{
 display: 'flex', alignItems: 'center', gap: 4,
 padding: '5px 10px', borderRadius: 6,
 background: activeAction === action.id ? `${action.color}15` : '#fff',
 border: `1px solid ${activeAction === action.id ? action.color : '#e2e8f0'}`,
 color: activeAction === action.id ? action.color : '#64748b',
 fontSize: 10, fontWeight: 600,
 cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
 transition: 'all 0.2s ease',
 whiteSpace: 'nowrap',
 }}
 onMouseEnter={e => {
 e.currentTarget.style.borderColor = action.color
 e.currentTarget.style.color = action.color
 e.currentTarget.style.background = `${action.color}08`
 }}
 onMouseLeave={e => {
 if (activeAction !== action.id) {
 e.currentTarget.style.borderColor = '#e2e8f0'
 e.currentTarget.style.color = '#64748b'
 e.currentTarget.style.background = '#fff'
 }
 }}
 >
 <span style={{ fontSize: 12 }}>{action.icon}</span>
 {action.label}
 {activeAction === action.id && <span style={{ fontSize: 10 }}></span>}
 </button>
 ))}

 {/* Show more / less */}
 {actionButtons.length > 6 && (
 <button
 onClick={() => setShowAll(!showAll)}
 style={{
 padding: '5px 10px', borderRadius: 6,
 background: 'none', border: '1px solid #e2e8f0',
 color: '#2563eb', fontSize: 10, fontWeight: 600,
 cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
 }}
 >
 {showAll ? '← Less' : `+${actionButtons.length - 6} More`}
 </button>
 )}
 </div>
 )
}
