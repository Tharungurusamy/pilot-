import { useState } from 'react'

const alerts = [
  { id: 'ALT-0341', incident: 'INC-4821', severity: 'critical', title: 'Pharmacy DB Connection Pool Exhausted', dept: 'Pharmacy', time: '14:32:07', ticket: 'SN-9834', status: 'active', notified: ['Sarah K.', 'On-call', 'Director'] },
  { id: 'ALT-0340', incident: 'INC-4820', severity: 'high', title: 'LIS External API Unreachable — Retry Storm Active', dept: 'LIS Lab', time: '14:20:45', ticket: 'SN-9832', status: 'assigned', notified: ['Mike T.', 'Lab Manager'] },
  { id: 'ALT-0339', incident: 'INC-4818', severity: 'high', title: 'Network Switch Packet Loss >15% on Core Switch', dept: 'Network', time: '13:58:22', ticket: 'SN-9831', status: 'in-progress', notified: ['James R.', 'NetOps'] },
  { id: 'ALT-0338', incident: 'INC-4816', severity: 'medium', title: 'ICU IoT Monitoring Device Offline After Firmware Update', dept: 'IoT Devices', time: '13:40:11', ticket: 'SN-9829', status: 'assigned', notified: ['Priya N.'] },
  { id: 'ALT-0337', incident: 'INC-4817', severity: 'low', title: 'EMR Slow Query — Patient Lookup >5s Response Time', dept: 'EMR', time: '13:15:30', ticket: 'SN-9828', status: 'resolved', notified: ['Chris M.'] },
]

const sevColor: Record<string, string> = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' }
const statColor: Record<string, string> = { active: '#ef4444', assigned: '#3b82f6', 'in-progress': '#f59e0b', resolved: '#10b981' }

export default function Alerts() {
  const [filter, setFilter] = useState('all')
  const filters = ['all', 'critical', 'high', 'medium', 'low', 'resolved']

  const filtered = filter === 'all' ? alerts : filter === 'resolved'
    ? alerts.filter((a) => a.status === 'resolved')
    : alerts.filter((a) => a.severity === filter)

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Critical Active', val: '1', color: '#ef4444' },
          { label: 'High Active', val: '2', color: '#f59e0b' },
          { label: 'Tickets Created', val: '5', color: '#3b82f6' },
          { label: 'Resolved Today', val: '18', color: '#10b981' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 20,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: filter === f ? '#0f172a' : '#fff',
            color: filter === f ? '#fff' : '#64748b',
            border: filter === f ? '1px solid transparent' : '1px solid #e2e8f0',
            textTransform: 'capitalize',
          }}>{f}</button>
        ))}
      </div>

      {/* Alert cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((a) => (
          <div key={a.id} style={{
            background: '#fff', borderRadius: 12,
            border: `1px solid ${a.status === 'resolved' ? '#e2e8f0' : `${sevColor[a.severity]}30`}`,
            padding: '16px 20px',
            borderLeft: `4px solid ${sevColor[a.severity]}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#94a3b8' }}>{a.id}</span>
                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#3b82f6' }}>{a.incident}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  color: sevColor[a.severity], background: `${sevColor[a.severity]}15`,
                  padding: '1px 7px', borderRadius: 5,
                }}>{a.severity}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: statColor[a.status],
                  background: `${statColor[a.status]}12`, padding: '1px 7px', borderRadius: 5,
                }}>{a.status}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.dept} · {a.time}</div>
            </div>

            <div style={{ textAlign: 'right', minWidth: 140 }}>
              <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Ticket</div>
              <div style={{ fontSize: 13, fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#7c3aed' }}>{a.ticket}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>Notified</div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 3, flexWrap: 'wrap' }}>
                {a.notified.map((n) => (
                  <span key={n} style={{ fontSize: 10, background: '#f0f4f8', color: '#475569', padding: '1px 6px', borderRadius: 8 }}>{n}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button style={{ fontSize: 11, fontWeight: 600, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px', cursor: 'pointer' }}>Assign</button>
              <button style={{ fontSize: 11, fontWeight: 600, background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 7, padding: '6px 12px', cursor: 'pointer' }}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
