import { useState } from 'react'

const agents = [
 {
 id: 'managing',
 name: 'Managing Agent',
 role: 'Central AI Orchestrator',
 icon: '',
 gradient: 'linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%)',
 status: 'active',
 currentTask: 'Orchestrating INC-4821 resolution',
 activeAgents: 4,
 incident: 'INC-4821',
 confidence: 91.2,
 processingStatus: 'Analyzing',
 details: [
 { label: 'Incidents Processed Today', val: '47' },
 { label: 'Avg Dispatch Time', val: '1.2s' },
 { label: 'Agent Coordination Score', val: '98.4%' },
 { label: 'Knowledge Base Writes', val: '23' },
 ],
 responsibilities: ['Receives every incident', 'Understands the problem', 'Decides agent dispatch', 'Combines agent responses', 'Makes final recommendation', 'Learns from feedback'],
 },
 {
 id: 'pattern',
 name: 'Pattern Analysis Agent',
 role: 'Behavioral Pattern Detector',
 icon: '',
 gradient: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
 status: 'active',
 currentTask: 'Detecting DB Timeout Loop pattern',
 confidence: 94,
 pattern: 'DB Timeout Loop',
 matchedIncidents: 12,
 affectedSystems: ['Pharmacy', 'HIS'],
 details: [
 { label: 'Current Pattern', val: 'DB Timeout Loop' },
 { label: 'Matched Incidents', val: '12 historical' },
 { label: 'Pattern Confidence', val: '94%' },
 { label: 'Patterns Detected Today', val: '8' },
 ],
 responsibilities: ['Read logs & events', 'Find repeated sequences', 'Compare with history', 'Detect abnormal behavior', 'Rank pattern candidates'],
 },
 {
 id: 'rootcause',
 name: 'Root Cause Analysis Agent',
 role: 'Failure Origin Identifier',
 icon: '',
 gradient: 'linear-gradient(135deg, #5b21b6, #7c3aed)',
 status: 'active',
 currentTask: 'Tracing Pharmacy connection pool failure',
 confidence: 88,
 rootCause: 'Connection pool exhausted (max_connections=50)',
 dependencies: ['Pharmacy Service', 'PostgreSQL DB', 'pgBouncer'],
 details: [
 { label: 'Root Cause', val: 'Connection pool exhaustion' },
 { label: 'Confidence', val: '88%' },
 { label: 'Dependencies Analyzed', val: '7' },
 { label: 'Affected Services', val: '3' },
 ],
 responsibilities: ['Analyze dependencies', 'Identify failed services', 'Check database state', 'Check network health', 'Rank probable causes'],
 },
 {
 id: 'resolution',
 name: 'Resolution Agent',
 role: 'Fix Recommendation Engine',
 icon: '',
 gradient: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
 status: 'idle',
 currentTask: 'Generating 3 solution options',
 confidence: 91,
 bestSolution: 'Increase max_connections to 120 + enable pgBouncer',
 successRate: 87,
 estimatedTime: '12–18 min',
 details: [
 { label: 'Best Solution Score', val: '91%' },
 { label: 'Alternative Solutions', val: '3' },
 { label: 'Est. Resolution Time', val: '12–18 min' },
 { label: 'Success Rate', val: '87%' },
 ],
 responsibilities: ['Search historical incidents', 'Find successful fixes', 'Rank solutions by score', 'Generate runbooks', 'Predict success rate'],
 },
 {
 id: 'alert',
 name: 'Alert & Notify Agent',
 role: 'Escalation & Notification',
 icon: '',
 gradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
 status: 'completed',
 currentTask: 'Ticket SN-9834 created, team notified',
 confidence: 100,
 alertStatus: 'Sent',
 recipients: ['Sarah K.', 'On-call team', 'Hospital Director'],
 ticketNumber: 'SN-9834',
 details: [
 { label: 'Alert Status', val: 'Sent ' },
 { label: 'Ticket', val: 'SN-9834' },
 { label: 'Recipients Notified', val: '3' },
 { label: 'Escalation Level', val: 'Critical' },
 ],
 responsibilities: ['Calculate severity', 'Generate alert', 'Email notification', 'Dashboard alert', 'Create ServiceNow ticket', 'Escalate critical issues'],
 },
]

export default function AIAgents() {
 const [selected, setSelected] = useState('managing')
 const agent = agents.find((a) => a.id === selected)!

 return (
 <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
 {/* Agent grid */}
 <div>
 <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Multi-Agent System Overview</h2>

 {/* Managing agent */}
 <div
 onClick={() => setSelected('managing')}
 style={{
 background: agents[0].gradient,
 borderRadius: 16, padding: '20px 24px', marginBottom: 16,
 cursor: 'pointer',
 border: selected === 'managing' ? '2px solid rgba(139,92,246,0.8)' : '2px solid transparent',
 boxShadow: selected === 'managing' ? '0 0 0 4px rgba(139,92,246,0.15), 0 16px 48px rgba(124,58,237,0.3)' : '0 8px 24px rgba(0,0,0,0.15)',
 transition: 'all 0.2s',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
 <div style={{ fontSize: 32 }}></div>
 <div style={{ flex: 1 }}>
 <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>Managing Agent</div>
 <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Central AI Orchestrator — coordinates all specialist agents</div>
 </div>
 <div style={{ textAlign: 'right' }}>
 <div style={{ color: '#fff', fontWeight: 800, fontSize: 22, fontFamily: 'JetBrains Mono' }}>91.2%</div>
 <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>Overall Confidence</div>
 </div>
 </div>
 </div>

 {/* Sub-agents */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
 {agents.slice(1).map((a) => (
 <div
 key={a.id}
 onClick={() => setSelected(a.id)}
 style={{
 background: '#fff', borderRadius: 12, padding: '16px',
 cursor: 'pointer',
 border: selected === a.id ? `2px solid ${a.gradient.split('#')[1].split(',')[0].trim()}` : '1.5px solid #e2e8f0',
 boxShadow: selected === a.id ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
 transition: 'all 0.2s',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 10, background: a.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
 {a.icon}
 </div>
 <div style={{ flex: 1 }}>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{a.name}</div>
 <div style={{ fontSize: 10, color: '#94a3b8' }}>{a.role}</div>
 </div>
 <StatusPill status={a.status} />
 </div>
 <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic', marginBottom: 10 }}>{a.currentTask}</div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${a.confidence}%`, background: a.gradient, borderRadius: 2 }} />
 </div>
 <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#0f172a' }}>{a.confidence}%</span>
 </div>
 </div>
 ))}
 </div>

 {/* Knowledge Base */}
 <div style={{
 marginTop: 16, background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
 border: '1.5px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '16px 20px',
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <span style={{ fontSize: 20 }}>️</span>
 <div style={{ flex: 1 }}>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Incident Knowledge Base</div>
 <div style={{ fontSize: 11, color: '#64748b' }}>All 5 agents read & write — shared intelligence layer</div>
 </div>
 <div style={{ display: 'flex', gap: 20 }}>
 {[['6,891', 'Records'], ['2,340', 'Patterns'], ['1,204', 'Runbooks'], ['834', 'Solutions']].map(([v, l]) => (
 <div key={l} style={{ textAlign: 'center' }}>
 <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', fontFamily: 'JetBrains Mono' }}>{v}</div>
 <div style={{ fontSize: 9, color: '#94a3b8' }}>{l}</div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Agent detail panel */}
 <div>
 <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Agent Details</h2>
 <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
 <div style={{ background: agent.gradient, padding: '20px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <span style={{ fontSize: 28 }}>{agent.icon}</span>
 <div>
 <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{agent.name}</div>
 <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{agent.role}</div>
 </div>
 </div>
 </div>

 <div style={{ padding: '16px' }}>
 <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Current Task</div>
 <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>{agent.currentTask}</div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
 {agent.details.map((d) => (
 <div key={d.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px' }}>
 <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{d.label}</div>
 <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', fontFamily: 'JetBrains Mono' }}>{d.val}</div>
 </div>
 ))}
 </div>

 <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Responsibilities</div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
 {agent.responsibilities.map((r) => (
 <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
 <span style={{ fontSize: 12, color: '#374151' }}>{r}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 )
}

function StatusPill({ status }: { status: string }) {
 const colors: Record<string, [string, string]> = {
 active: ['#10b981', 'rgba(16,185,129,0.1)'],
 idle: ['#94a3b8', 'rgba(148,163,184,0.1)'],
 completed: ['#3b82f6', 'rgba(59,130,246,0.1)'],
 }
 const [c, bg] = colors[status] || colors.idle
 return (
 <span style={{ fontSize: 9, fontWeight: 700, color: c, background: bg, padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
 {status}
 </span>
 )
}
