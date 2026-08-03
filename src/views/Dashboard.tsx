import { useState, useEffect } from 'react'
import {
 AreaChart, Area, Tooltip, ResponsiveContainer,
 BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend,
} from 'recharts'

// ── KPI data ──────────────────────────────────────────────────────────────────
const kpiCards = [
 {
 id: 'incidents', label: 'Total Incidents', value: '1,284', change: '+12%', up: true,
 color: '#2563eb', bg: 'rgba(37,99,235,0.07)',
 icon: <AlertIcon />,
 sparkData: [4,7,5,9,6,11,8,14,10,16,12,18],
 },
 {
 id: 'alerts', label: 'Active Alerts', value: '23', change: '-8%', up: false,
 color: '#ef4444', bg: 'rgba(239,68,68,0.07)',
 icon: <BellIcon />,
 sparkData: [18,22,19,25,21,20,17,23,19,21,24,23],
 },
 {
 id: 'patterns', label: 'Pattern Matches', value: '47', change: '+31%', up: true,
 color: '#7c3aed', bg: 'rgba(124,58,237,0.07)',
 icon: <PatternIcon />,
 sparkData: [12,15,18,14,20,22,19,25,28,32,40,47],
 },
 {
 id: 'accuracy', label: 'AI Accuracy', value: '94.7%', change: '+2.1%', up: true,
 color: '#10b981', bg: 'rgba(16,185,129,0.07)',
 icon: <TargetIcon />,
 sparkData: [88,90,89,91,92,90,93,92,94,93,95,94.7],
 },
 {
 id: 'resolution', label: 'Avg Resolution', value: '18m', change: '-22%', up: false,
 color: '#f59e0b', bg: 'rgba(245,158,11,0.07)',
 icon: <ClockIcon />,
 sparkData: [35,30,28,32,25,27,24,22,20,21,19,18],
 },
 {
 id: 'kb', label: 'Knowledge Base', value: '6,891', change: '+156', up: true,
 color: '#0ea5e9', bg: 'rgba(14,165,233,0.07)',
 icon: <DatabaseIcon />,
 sparkData: [6200,6300,6400,6480,6550,6610,6680,6720,6780,6820,6860,6891],
 },
]

// ── Hospital Systems data ──────────────────────────────────────────────────────
const hospitalSystems = [
 { name: 'HIS', full: 'Hospital Information System', status: 'healthy', incidents: 2, updated: '2m ago', color: '#2563eb', icon: '' },
 { name: 'EMR', full: 'Electronic Medical Records', status: 'healthy', incidents: 0, updated: '1m ago', color: '#10b981', icon: '' },
 { name: 'LIS', full: 'Laboratory Information System', status: 'warning', incidents: 5, updated: '4m ago', color: '#f59e0b', icon: '' },
 { name: 'RIS', full: 'Radiology Information System', status: 'healthy', incidents: 1, updated: '6m ago', color: '#10b981', icon: '🩻' },
 { name: 'Pharmacy', full: 'Pharmacy Management', status: 'critical', incidents: 8, updated: '1m ago', color: '#ef4444', icon: '' },
 { name: 'IoT Devices', full: 'Patient Monitoring IoT', status: 'healthy', incidents: 3, updated: '30s ago', color: '#10b981', icon: '' },
 { name: 'Network', full: 'Network Devices', status: 'warning', incidents: 4, updated: '3m ago', color: '#f59e0b', icon: '' },
 { name: 'App Logs', full: 'Application Logs', status: 'healthy', incidents: 6, updated: '45s ago', color: '#10b981', icon: '' },
]

// ── Incident table data ────────────────────────────────────────────────────────
const incidents = [
 { id: 'INC-4821', dept: 'Pharmacy', severity: 'critical', pattern: 'DB Timeout Loop', cause: 'Connection pool exhausted', status: 'in-progress', engineer: 'Sarah K.' },
 { id: 'INC-4820', dept: 'LIS Lab', severity: 'high', pattern: 'API Retry Storm', cause: 'External service down', status: 'assigned', engineer: 'Mike T.' },
 { id: 'INC-4819', dept: 'HIS Billing', severity: 'medium', pattern: 'Memory Leak', cause: 'Unclosed DB cursors', status: 'resolved', engineer: 'Ana L.' },
 { id: 'INC-4818', dept: 'Network', severity: 'high', pattern: 'Packet Loss Spike', cause: 'Switch misconfiguration', status: 'in-progress', engineer: 'James R.' },
 { id: 'INC-4817', dept: 'EMR Records', severity: 'low', pattern: 'Slow Query', cause: 'Missing index on patient_id', status: 'resolved', engineer: 'Chris M.' },
 { id: 'INC-4816', dept: 'IoT Monitor', severity: 'medium', pattern: 'Device Offline', cause: 'Firmware update failure', status: 'assigned', engineer: 'Priya N.' },
]

// ── Activity feed data ────────────────────────────────────────────────────────
const activities = [
 { time: '14:32:07', type: 'alert', text: 'Critical alert triggered for Pharmacy DB — INC-4821', color: '#ef4444' },
 { time: '14:31:55', type: 'ai', text: 'Managing Agent dispatched Root Cause agent for INC-4821', color: '#7c3aed' },
 { time: '14:31:48', type: 'pattern', text: 'Pattern match: "DB Timeout Loop" — 94% confidence (12 historical matches)', color: '#2563eb' },
 { time: '14:31:40', type: 'log', text: 'New log stream received from Pharmacy service (2,340 events)', color: '#64748b' },
 { time: '14:30:12', type: 'kb', text: 'Knowledge Base updated — runbook #RB-291 added by Sarah K.', color: '#10b981' },
 { time: '14:29:55', type: 'resolved', text: 'INC-4819 resolved — HIS Billing memory leak patched', color: '#10b981' },
 { time: '14:28:30', type: 'ai', text: 'Resolution Recommendation Agent generated 3 solutions for INC-4820', color: '#7c3aed' },
 { time: '14:27:11', type: 'ticket', text: 'ServiceNow ticket SN-9834 created for INC-4820 — assigned to Mike T.', color: '#f59e0b' },
]

// ── Server metrics ────────────────────────────────────────────────────────────
const serverMetrics = [
 { label: 'CPU', value: 68, color: '#2563eb' },
 { label: 'Memory', value: 74, color: '#7c3aed' },
 { label: 'Storage', value: 52, color: '#10b981' },
 { label: 'Network', value: 41, color: '#f59e0b' },
 { label: 'Database', value: 83, color: '#ef4444' },
]

const statusColor = { healthy: '#10b981', warning: '#f59e0b', critical: '#ef4444' }
const statusBg = { healthy: 'rgba(16,185,129,0.08)', warning: 'rgba(245,158,11,0.08)', critical: 'rgba(239,68,68,0.08)' }
const severityColor = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' }
const statusLabel = { 'in-progress': '#f59e0b', assigned: '#3b82f6', resolved: '#10b981' }

export default function Dashboard() {
 const [tick, setTick] = useState(0)

 useEffect(() => {
 const id = setInterval(() => setTick((t) => t + 1), 3000)
 return () => clearInterval(id)
 }, [])

 return (
 <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

 {/* KPI Cards */}
 <section>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
 {kpiCards.map((card) => (
 <div key={card.id} style={{
 background: '#fff', borderRadius: 14, padding: '16px',
 border: '1px solid #e2e8f0',
 boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
 transition: 'transform 0.15s, box-shadow 0.15s',
 }}
 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)' }}
 onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}
 >
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
 <div style={{ width: 32, height: 32, borderRadius: 8, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
 {card.icon}
 </div>
 <span style={{
 fontSize: 10, fontWeight: 600, color: card.up ? '#10b981' : '#ef4444',
 background: card.up ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
 padding: '2px 6px', borderRadius: 6,
 }}>{card.change}</span>
 </div>
 <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{card.value}</div>
 <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, marginBottom: 8 }}>{card.label}</div>
 <ResponsiveContainer width="100%" height={28}>
 <AreaChart data={card.sparkData.map((v, i) => ({ i, v }))} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
 <defs>
 <linearGradient id={`sg-${card.id}`} x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor={card.color} stopOpacity={0.2} />
 <stop offset="100%" stopColor={card.color} stopOpacity={0} />
 </linearGradient>
 </defs>
 <Area type="monotone" dataKey="v" stroke={card.color} strokeWidth={1.5} fill={`url(#sg-${card.id})`} dot={false} />
 </AreaChart>
 </ResponsiveContainer>
 </div>
 ))}
 </div>
 </section>

 {/* Hospital Systems + Central Server */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
 {/* Hospital systems */}
 <section>
 <SectionHeader title="Hospital Systems" sub="Real-time monitoring across all clinical platforms" />
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 12 }}>
 {hospitalSystems.map((sys) => (
 <div key={sys.name} style={{
 background: '#fff', borderRadius: 12, padding: '14px',
 border: `1px solid ${sys.status === 'critical' ? 'rgba(239,68,68,0.3)' : sys.status === 'warning' ? 'rgba(245,158,11,0.2)' : '#e2e8f0'}`,
 boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
 <span style={{ fontSize: 20 }}>{sys.icon}</span>
 <StatusBadge status={sys.status} />
 </div>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{sys.name}</div>
 <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 6 }}>{sys.full}</div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <span style={{ fontSize: 11, color: '#64748b' }}>
 <span style={{ fontWeight: 700, color: sys.incidents > 5 ? '#ef4444' : sys.incidents > 2 ? '#f59e0b' : '#10b981', fontFamily: 'JetBrains Mono' }}>{sys.incidents}</span> incidents
 </span>
 <span style={{ fontSize: 10, color: '#94a3b8' }}>{sys.updated}</span>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* Central server */}
 <section>
 <SectionHeader title="Central Server" sub="Core infrastructure metrics" />
 <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #e2e8f0', marginTop: 12 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
 <div style={{
 width: 10, height: 10, borderRadius: '50%', background: '#10b981',
 animation: 'pulse-dot 2s ease infinite',
 }} />
 <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>Online — All systems nominal</span>
 </div>
 {serverMetrics.map((m) => (
 <div key={m.label} style={{ marginBottom: 10 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ fontSize: 11, color: '#64748b' }}>{m.label}</span>
 <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600, color: m.value > 75 ? '#ef4444' : m.value > 60 ? '#f59e0b' : '#0f172a' }}>{m.value}%</span>
 </div>
 <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${m.value}%`, background: m.value > 75 ? '#ef4444' : m.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
 </div>
 </div>
 ))}
 <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
 <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Ingesting</div>
 <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
 {['Logs', 'Metrics', 'Events', 'Alerts'].map((t) => (
 <span key={t} style={{ fontSize: 10, background: '#f0f4f8', color: '#475569', padding: '2px 7px', borderRadius: 10, fontWeight: 500 }}>{t}</span>
 ))}
 </div>
 </div>
 </div>
 </section>
 </div>

 {/* AI Agent Network — THE CENTERPIECE */}
 <AIAgentNetwork />

 {/* Bottom: Recommendation Panel + Recent Incidents + Activity Feed */}
 <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 280px', gap: 16 }}>
 {/* Recommendation Panel */}
 <RecommendationPanel />

 {/* Incident Table */}
 <section>
 <SectionHeader title="Recent Incidents" sub="Last 24 hours" />
 <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', marginTop: 12, overflow: 'hidden' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
 <thead>
 <tr style={{ background: '#f8fafc' }}>
 {['Incident ID', 'Department', 'Severity', 'Pattern', 'Root Cause', 'Status', 'Engineer', ''].map((h) => (
 <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {incidents.map((inc, i) => (
 <tr key={inc.id} style={{ borderBottom: i < incidents.length - 1 ? '1px solid #f1f5f9' : 'none' }}
 onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
 >
 <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono', color: '#2563eb', fontWeight: 600, fontSize: 11 }}>{inc.id}</td>
 <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: 500 }}>{inc.dept}</td>
 <td style={{ padding: '10px 12px' }}>
 <span style={{ fontSize: 10, fontWeight: 700, color: severityColor[inc.severity as keyof typeof severityColor], background: `${severityColor[inc.severity as keyof typeof severityColor]}15`, padding: '2px 7px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
 {inc.severity}
 </span>
 </td>
 <td style={{ padding: '10px 12px', color: '#64748b', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.pattern}</td>
 <td style={{ padding: '10px 12px', color: '#64748b', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.cause}</td>
 <td style={{ padding: '10px 12px' }}>
 <span style={{ fontSize: 10, fontWeight: 600, color: statusLabel[inc.status as keyof typeof statusLabel], background: `${statusLabel[inc.status as keyof typeof statusLabel]}12`, padding: '2px 8px', borderRadius: 6 }}>
 {inc.status}
 </span>
 </td>
 <td style={{ padding: '10px 12px', color: '#64748b' }}>{inc.engineer}</td>
 <td style={{ padding: '10px 12px' }}>
 <button style={{ fontSize: 11, color: '#2563eb', background: 'none', border: '1px solid #bfdbfe', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 500 }}>View</button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </section>

 {/* Activity Feed */}
 <section>
 <SectionHeader title="Live Activity" sub="Real-time system events" />
 <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', marginTop: 12, padding: '12px', maxHeight: 380, overflowY: 'auto' }}>
 {activities.map((a, i) => (
 <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < activities.length - 1 ? '1px solid #f8fafc' : 'none' }}>
 <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, marginTop: 5, flexShrink: 0 }} />
 <div>
 <div style={{ fontSize: 11, color: '#0f172a', lineHeight: 1.4 }}>{a.text}</div>
 <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'JetBrains Mono', marginTop: 2 }}>{a.time}</div>
 </div>
 </div>
 ))}
 </div>
 </section>
 </div>
 </div>
 )
}

// ── AI Agent Network Component ────────────────────────────────────────────────
function AIAgentNetwork() {
 const [activeAgent, setActiveAgent] = useState<string | null>('managing')

 const subAgents = [
 { id: 'pattern', label: 'Pattern Analysis', sub: 'Finds recurring behaviors', color: '#2563eb', icon: '', task: 'Analyzing DB timeout patterns', confidence: 94, active: true },
 { id: 'rootcause', label: 'Root Cause', sub: 'Identifies failure origins', color: '#7c3aed', icon: '', task: 'Tracing connection pool failure', confidence: 88, active: true },
 { id: 'resolution', label: 'Resolution', sub: 'Generates fix recommendations', color: '#0ea5e9', icon: '', task: 'Generating 3 solution options', confidence: 91, active: false },
 { id: 'alert', label: 'Alert & Notify', sub: 'Escalates critical issues', color: '#f59e0b', icon: '', task: 'Ticket SN-9834 created', confidence: 100, active: false },
 ]

 return (
 <section>
 <SectionHeader
 title="AI Agent Network"
 sub="Multi-agent orchestration — Managing Agent coordinates all specialist agents in real time"
 badge="4 agents active"
 />
 <div style={{
 marginTop: 12,
 background: 'linear-gradient(135deg, #f8faff 0%, #f3f0ff 50%, #f0f7ff 100%)',
 borderRadius: 16,
 border: '1px solid rgba(124,58,237,0.12)',
 padding: '32px 24px 24px',
 position: 'relative',
 overflow: 'hidden',
 }}>
 {/* Background grid pattern */}
 <div style={{
 position: 'absolute', inset: 0, opacity: 0.3,
 backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.12) 1px, transparent 1px)',
 backgroundSize: '28px 28px',
 pointerEvents: 'none',
 }} />

 <div style={{ position: 'relative' }}>
 {/* Managing Agent — top center */}
 <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0 }}>
 <div
 onClick={() => setActiveAgent(activeAgent === 'managing' ? null : 'managing')}
 style={{
 background: 'linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%)',
 borderRadius: 16,
 padding: '20px 28px',
 width: 340,
 cursor: 'pointer',
 boxShadow: activeAgent === 'managing'
 ? '0 0 0 3px rgba(139,92,246,0.4), 0 20px 60px rgba(124,58,237,0.35)'
 : '0 8px 32px rgba(124,58,237,0.25)',
 transition: 'box-shadow 0.2s',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
 <div style={{
 width: 44, height: 44, borderRadius: 12,
 background: 'rgba(255,255,255,0.15)',
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 22,
 boxShadow: '0 0 20px rgba(139,92,246,0.4)',
 }}></div>
 <div>
 <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Managing Agent</div>
 <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Central AI Orchestrator</div>
 </div>
 <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
 <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', animation: 'pulse-dot 1.5s ease infinite' }} />
 <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>ACTIVE</span>
 </div>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
 {[
 { label: 'Processing', val: 'INC-4821' },
 { label: 'Active Agents', val: '4 / 4' },
 { label: 'Confidence', val: '91.2%' },
 { label: 'Status', val: 'Analyzing' },
 ].map((m) => (
 <div key={m.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 10px' }}>
 <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
 <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono', marginTop: 2 }}>{m.val}</div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Connector lines SVG */}
 <div style={{ position: 'relative', height: 60 }}>
 <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }} viewBox="0 0 900 60" preserveAspectRatio="xMidYMid meet">
 {/* Lines from Managing Agent to each sub-agent */}
 {[112, 337, 562, 787].map((x, i) => (
 <line key={i} x1="450" y1="0" x2={x} y2="60"
 stroke="url(#lineGrad)" strokeWidth="1.5"
 strokeDasharray="5 3"
 style={{ animation: `flow-line ${1 + i * 0.2}s linear infinite` }}
 />
 ))}
 {/* Line from sub-agents to KB */}
 {[112, 337, 562, 787].map((x, i) => (
 <line key={`kb-${i}`} x1={x} y1="60" x2="450" y2="130"
 stroke="url(#lineGrad2)" strokeWidth="1"
 strokeDasharray="4 4" opacity="0.6"
 />
 ))}
 <defs>
 <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
 <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
 <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
 </linearGradient>
 <linearGradient id="lineGrad2" x1="0" y1="0" x2="1" y2="1">
 <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
 <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
 </linearGradient>
 </defs>
 </svg>
 </div>

 {/* Sub-agents row */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 0 }}>
 {subAgents.map((agent) => (
 <div
 key={agent.id}
 onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
 style={{
 background: '#fff',
 borderRadius: 12,
 padding: '14px',
 cursor: 'pointer',
 border: activeAgent === agent.id ? `2px solid ${agent.color}` : '1.5px solid #e2e8f0',
 boxShadow: activeAgent === agent.id ? `0 4px 20px ${agent.color}22` : '0 2px 8px rgba(0,0,0,0.05)',
 transition: 'all 0.2s ease',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ fontSize: 18 }}>{agent.icon}</span>
 <div>
 <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a' }}>{agent.label}</div>
 <div style={{ fontSize: 10, color: '#94a3b8' }}>Agent</div>
 </div>
 </div>
 <div style={{
 width: 7, height: 7, borderRadius: '50%',
 background: agent.active ? '#10b981' : '#e2e8f0',
 animation: agent.active ? 'pulse-dot 2s ease infinite' : 'none',
 }} />
 </div>
 <div style={{ fontSize: 10, color: '#64748b', marginBottom: 8, fontStyle: 'italic', lineHeight: 1.4 }}>{agent.task}</div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${agent.confidence}%`, background: `linear-gradient(90deg, ${agent.color}, ${agent.color}cc)`, borderRadius: 2 }} />
 </div>
 <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 600, color: agent.color }}>{agent.confidence}%</span>
 </div>
 <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 3 }}>Confidence</div>
 </div>
 ))}
 </div>

 {/* Connector to KB */}
 <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
 <div style={{ width: 1.5, height: 32, background: 'linear-gradient(#7c3aed44, #10b98166)' }} />
 </div>

 {/* Knowledge Base */}
 <div style={{ display: 'flex', justifyContent: 'center' }}>
 <div style={{
 background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
 border: '1.5px solid rgba(16,185,129,0.3)',
 borderRadius: 12,
 padding: '14px 24px',
 width: 500,
 boxShadow: '0 4px 16px rgba(16,185,129,0.1)',
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
 <span style={{ fontSize: 18 }}>️</span>
 <div>
 <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Incident Knowledge Base</div>
 <div style={{ fontSize: 10, color: '#64748b' }}>Shared memory — read/write by all agents</div>
 </div>
 <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
 {[['6,891', 'Records'], ['2,340', 'Patterns'], ['1,204', 'Runbooks']].map(([v, l]) => (
 <div key={l} style={{ textAlign: 'center' }}>
 <div style={{ fontSize: 14, fontWeight: 800, color: '#059669', fontFamily: 'JetBrains Mono' }}>{v}</div>
 <div style={{ fontSize: 9, color: '#94a3b8' }}>{l}</div>
 </div>
 ))}
 </div>
 </div>
 <div style={{ display: 'flex', gap: 6 }}>
 {['Incidents', 'Patterns', 'Root Causes', 'Solutions', 'Runbooks', 'Feedback'].map((tag) => (
 <span key={tag} style={{ fontSize: 10, background: 'rgba(16,185,129,0.12)', color: '#059669', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>{tag}</span>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 </section>
 )
}

// ── Recommendation Panel ──────────────────────────────────────────────────────
function RecommendationPanel() {
 return (
 <section>
 <SectionHeader title="AI Recommendation" sub="INC-4821 — Active" />
 <div style={{
 background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
 marginTop: 12, padding: '16px', overflow: 'hidden',
 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
 <span style={{ fontSize: 13 }}></span>
 <span style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed' }}>Managing Agent Recommendation</span>
 </div>

 {[
 { label: 'Pattern Match', val: 'DB Timeout Loop', conf: 94, color: '#2563eb' },
 { label: 'Root Cause', val: 'Connection pool exhausted', conf: 88, color: '#7c3aed' },
 { label: 'Affected Dept', val: 'Pharmacy — 8 incidents', conf: null, color: '#ef4444' },
 { label: 'Est. Resolution', val: '12 – 18 minutes', conf: null, color: '#f59e0b' },
 ].map((row) => (
 <div key={row.label} style={{ marginBottom: 10 }}>
 <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{row.label}</div>
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{row.val}</span>
 {row.conf && <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: row.color, fontWeight: 700 }}>{row.conf}%</span>}
 </div>
 </div>
 ))}

 <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 8 }}>
 <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Suggested Fix</div>
 <div style={{ fontSize: 11, color: '#0f172a', background: '#f8fafc', borderRadius: 8, padding: '10px', fontFamily: 'JetBrains Mono', lineHeight: 1.6 }}>
 Increase <span style={{ color: '#7c3aed', fontWeight: 600 }}>max_connections</span> from 50→120, enable <span style={{ color: '#2563eb', fontWeight: 600 }}>pgBouncer</span> pooling, restart Pharmacy service pod.
 </div>
 <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>Success rate: <strong style={{ color: '#10b981' }}>87%</strong> — 11 previous similar fixes</div>
 </div>

 <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
 <button style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Assign</button>
 <button style={{ flex: 1, background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Ticket</button>
 <button style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Ignore</button>
 </div>
 </div>
 </section>
 )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionHeader({ title, sub, badge }: { title: string; sub?: string; badge?: string }) {
 return (
 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
 <div>
 <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{title}</h2>
 {sub && <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</p>}
 </div>
 {badge && (
 <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#059669', padding: '3px 10px', borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)' }}>
 ● {badge}
 </span>
 )}
 </div>
 )
}

function StatusBadge({ status }: { status: string }) {
 const s = status as keyof typeof statusColor
 return (
 <span style={{
 fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
 color: statusColor[s], background: statusBg[s],
 padding: '2px 7px', borderRadius: 6,
 }}>{status}</span>
 )
}

// ── Icon stubs ────────────────────────────────────────────────────────────────
function AlertIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
function BellIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> }
function PatternIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg> }
function TargetIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> }
function ClockIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function DatabaseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> }
