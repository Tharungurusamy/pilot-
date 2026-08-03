import { useState } from 'react'

const records = [
  { id: 'KB-2341', type: 'incident', title: 'Pharmacy DB Connection Pool Exhaustion', tags: ['Database', 'PostgreSQL', 'Pharmacy'], solution: 'Increase max_connections to 120, enable pgBouncer pooling', success: 87, date: '2026-07-30' },
  { id: 'KB-2340', type: 'runbook', title: 'Runbook: API Retry Storm Resolution', tags: ['API', 'Network', 'Timeout'], solution: 'Implement exponential backoff, circuit breaker pattern', success: 93, date: '2026-07-29' },
  { id: 'KB-2339', type: 'pattern', title: 'Pattern: Memory Leak — Unclosed DB Cursors', tags: ['Memory', 'Database', 'Python'], solution: 'Use context managers for cursor lifecycle management', success: 96, date: '2026-07-28' },
  { id: 'KB-2338', type: 'rootcause', title: 'Root Cause: Network Switch VLAN Misconfiguration', tags: ['Network', 'VLAN', 'Switch'], solution: 'Audit switchport access vlan assignments, apply corrections', success: 100, date: '2026-07-27' },
  { id: 'KB-2337', type: 'incident', title: 'IoT Gateway Firmware Rollback Procedure', tags: ['IoT', 'Firmware', 'ICU'], solution: 'Rollback firmware via OTA gateway console to previous stable', success: 91, date: '2026-07-26' },
  { id: 'KB-2336', type: 'runbook', title: 'Runbook: LIS External API Failover', tags: ['LIS', 'API', 'Failover'], solution: 'Switch to backup lab endpoint, notify lab manager', success: 88, date: '2026-07-25' },
]

const typeColor: Record<string, [string, string]> = {
  incident: ['#ef4444', 'rgba(239,68,68,0.1)'],
  runbook: ['#2563eb', 'rgba(37,99,235,0.1)'],
  pattern: ['#7c3aed', 'rgba(124,58,237,0.1)'],
  rootcause: ['#f59e0b', 'rgba(245,158,11,0.1)'],
}

export default function KnowledgeBase() {
  const [search, setSearch] = useState('')
  const filtered = records.filter((r) => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Records', val: '6,891', color: '#2563eb' },
          { label: 'Patterns Stored', val: '2,340', color: '#7c3aed' },
          { label: 'Runbooks', val: '1,204', color: '#0ea5e9' },
          { label: 'Avg Success Rate', val: '92.4%', color: '#10b981' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
          </div>
        ))}
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search knowledge base by title, tag, or keyword..."
        style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'Inter', width: '100%', maxWidth: 480 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {filtered.map((r) => {
          const [c, bg] = typeColor[r.type]
          return (
            <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#94a3b8' }}>{r.id}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: c, background: bg, padding: '1px 8px', borderRadius: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{r.type}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: '#94a3b8' }}>{r.date}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 6 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10, lineHeight: 1.5 }}>
                <strong style={{ color: '#0f172a' }}>Solution: </strong>{r.solution}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {r.tags.map((t) => (
                    <span key={t} style={{ fontSize: 10, background: '#f0f4f8', color: '#475569', padding: '2px 7px', borderRadius: 8 }}>{t}</span>
                  ))}
                </div>
                <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#10b981' }}>{r.success}% success</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
