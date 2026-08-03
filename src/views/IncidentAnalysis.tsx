import React, { useState } from 'react'
import IncidentDetailView from './incident-analysis/IncidentDetailView'

const incidents = [
 { id: 'INC-4821', dept: 'Pharmacy', severity: 'critical', pattern: 'DB Timeout Loop', cause: 'Connection pool exhausted (max=50)', status: 'in-progress', engineer: 'Sarah K.', time: '14:32:07', confidence: 94 },
 { id: 'INC-4820', dept: 'LIS Lab', severity: 'high', pattern: 'API Retry Storm', cause: 'External lab endpoint returning 504', status: 'assigned', engineer: 'Mike T.', time: '14:20:45', confidence: 89 },
 { id: 'INC-4819', dept: 'HIS Billing', severity: 'medium', pattern: 'Memory Leak', cause: 'Unclosed DB cursors in billing service', status: 'resolved', engineer: 'Ana L.', time: '13:50:12', confidence: 96 },
 { id: 'INC-4818', dept: 'Network', severity: 'high', pattern: 'Packet Loss Spike', cause: 'Switch misconfiguration — VLAN 10 port 24', status: 'in-progress', engineer: 'James R.', time: '13:58:22', confidence: 91 },
 { id: 'INC-4817', dept: 'EMR Records', severity: 'low', pattern: 'Slow Query', cause: 'Missing index on patient_id column', status: 'resolved', engineer: 'Chris M.', time: '13:15:30', confidence: 98 },
 { id: 'INC-4816', dept: 'IoT Monitor', severity: 'medium', pattern: 'Device Offline', cause: 'Firmware update failure on ICU device group', status: 'assigned', engineer: 'Priya N.', time: '13:40:11', confidence: 85 },
 { id: 'INC-4815', dept: 'RIS Radiology', severity: 'low', pattern: 'Auth Token Expiry', cause: 'DICOM viewer token refresh not implemented', status: 'resolved', engineer: 'Ana L.', time: '12:55:00', confidence: 99 },
 { id: 'INC-4814', dept: 'Pharmacy', severity: 'high', pattern: 'DB Timeout Loop', cause: 'Connection pool exhausted — same as INC-4821', status: 'resolved', engineer: 'Sarah K.', time: '11:20:44', confidence: 94 },
]

const sevColor: Record<string, string> = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' }
const statColor: Record<string, string> = { 'in-progress': '#f59e0b', assigned: '#3b82f6', resolved: '#10b981' }

export default function IncidentAnalysis() {
 const [search, setSearch] = useState('')
 const [sevFilter, setSevFilter] = useState('all')
 const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
 const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({})

 const filtered = incidents
 .filter((i) => sevFilter === 'all' || i.severity === sevFilter)
 .filter((i) => !search || i.id.includes(search) || i.dept.toLowerCase().includes(search.toLowerCase()) || i.pattern.toLowerCase().includes(search.toLowerCase()))
 .sort((a, b) => a.dept.localeCompare(b.dept))

 const groupedIncidents = filtered.reduce((acc, inc) => {
 if (!acc[inc.dept]) acc[inc.dept] = []
 acc[inc.dept].push(inc)
 return acc
 }, {} as Record<string, typeof incidents>)

 // ── Detail View (drill-down) ──────────────────────────────────────────────
 if (selectedIncident) {
 return (
 <IncidentDetailView
 incidentId={selectedIncident}
 onBack={() => setSelectedIncident(null)}
 />
 )
 }

 // ── List View (original table — unchanged) ────────────────────────────────
 return (
 <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
 {/* Filters */}
 <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
 <input
 value={search} onChange={(e) => setSearch(e.target.value)}
 placeholder="Search incident ID, department, pattern..."
 style={{ flex: 1, maxWidth: 360, padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, outline: 'none', fontFamily: 'Inter' }}
 />
 <div style={{ display: 'flex', gap: 6 }}>
 {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
 <button key={f} onClick={() => setSevFilter(f)} style={{
 padding: '6px 14px', borderRadius: 20,
 fontSize: 11, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
 background: sevFilter === f ? '#0f172a' : '#fff',
 color: sevFilter === f ? '#fff' : '#64748b',
 border: sevFilter === f ? '1px solid transparent' : '1px solid #e2e8f0',
 }}>{f}</button>
 ))}
 </div>
 </div>

 {/* Table */}
 <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
 <thead>
 <tr style={{ background: '#f8fafc' }}>
 {['Incident ID', 'Time', 'Department', 'Severity', 'AI Pattern Match', 'Root Cause', 'AI Confidence', 'Status', 'Engineer', 'Actions'].map((h) => (
 <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {Object.entries(groupedIncidents).map(([dept, deptIncidents]) => {
 const isExpanded = expandedDepts[dept] !== false; // default true
 return (
 <React.Fragment key={dept}>
 {/* Folder Header Row */}
 <tr onClick={() => setExpandedDepts(prev => ({ ...prev, [dept]: !isExpanded }))}
 style={{ background: '#f8fafc', cursor: 'pointer', borderBottom: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }}
 onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
 onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
 >
 <td colSpan={10} style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a', fontSize: 12 }}>
 <span style={{ display: 'inline-block', width: 20, color: '#64748b' }}>{isExpanded ? '▼' : '►'}</span>
 {dept} <span style={{ color: '#64748b', fontWeight: 500, marginLeft: 8, fontSize: 11, background: '#e2e8f0', padding: '2px 8px', borderRadius: 12 }}>
 {deptIncidents.length} incidents
 </span>
 </td>
 </tr>
 {/* Incident Rows */}
 {isExpanded && deptIncidents.map((inc, i) => (
 <tr key={inc.id}
 style={{ borderBottom: i < deptIncidents.length - 1 ? '1px solid #f1f5f9' : 'none' }}
 onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
 onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
 >
 <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', color: '#2563eb', fontWeight: 700, fontSize: 11, paddingLeft: 34 }}>{inc.id}</td>
 <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8' }}>{inc.time}</td>
 <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>{inc.dept}</td>
 <td style={{ padding: '12px 14px' }}>
 <span style={{ fontSize: 10, fontWeight: 700, color: sevColor[inc.severity], background: `${sevColor[inc.severity]}15`, padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{inc.severity}</span>
 </td>
 <td style={{ padding: '12px 14px', color: '#7c3aed', fontWeight: 500 }}>{inc.pattern}</td>
 <td style={{ padding: '12px 14px', color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.cause}</td>
 <td style={{ padding: '12px 14px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <div style={{ width: 50, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${inc.confidence}%`, background: inc.confidence > 90 ? '#10b981' : '#f59e0b', borderRadius: 2 }} />
 </div>
 <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600, color: '#0f172a' }}>{inc.confidence}%</span>
 </div>
 </td>
 <td style={{ padding: '12px 14px' }}>
 <span style={{ fontSize: 10, fontWeight: 600, color: statColor[inc.status], background: `${statColor[inc.status]}12`, padding: '2px 8px', borderRadius: 6 }}>{inc.status}</span>
 </td>
 <td style={{ padding: '12px 14px', color: '#64748b' }}>{inc.engineer}</td>
 <td style={{ padding: '12px 14px' }}>
 <div style={{ display: 'flex', gap: 4 }}>
 <button
 onClick={() => setSelectedIncident(inc.id)}
 style={{ fontSize: 10, color: '#2563eb', background: 'none', border: '1px solid #bfdbfe', borderRadius: 5, padding: '3px 8px', cursor: 'pointer' }}
 >View</button>
 <button style={{ fontSize: 10, color: '#64748b', background: 'none', border: '1px solid #e2e8f0', borderRadius: 5, padding: '3px 8px', cursor: 'pointer' }}>RCA</button>
 </div>
 </td>
 </tr>
 ))}
 </React.Fragment>
 )
 })}
 </tbody>
 </table>
 </div>
 </div>
 )
}
