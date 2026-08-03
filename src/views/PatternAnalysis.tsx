const patterns = [
  { id: 'PAT-441', name: 'DB Timeout Loop', systems: ['Pharmacy', 'HIS'], confidence: 94, matches: 12, frequency: 'Daily', lastSeen: '14:32:07', color: '#ef4444' },
  { id: 'PAT-440', name: 'API Retry Storm', systems: ['LIS', 'EMR'], confidence: 89, matches: 8, frequency: 'Weekly', lastSeen: '14:20:45', color: '#f59e0b' },
  { id: 'PAT-439', name: 'Memory Leak Cycle', systems: ['HIS Billing', 'RIS'], confidence: 96, matches: 5, frequency: 'Monthly', lastSeen: '2026-07-28', color: '#7c3aed' },
  { id: 'PAT-438', name: 'Packet Loss Spike', systems: ['Network'], confidence: 91, matches: 7, frequency: 'Weekly', lastSeen: '13:58:22', color: '#3b82f6' },
  { id: 'PAT-437', name: 'IoT Heartbeat Failure', systems: ['IoT Devices'], confidence: 85, matches: 3, frequency: 'Bi-weekly', lastSeen: '13:40:11', color: '#0ea5e9' },
  { id: 'PAT-436', name: 'Slow Query Cascade', systems: ['EMR', 'HIS'], confidence: 98, matches: 18, frequency: 'Daily', lastSeen: '13:15:30', color: '#10b981' },
]

export default function PatternAnalysis() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Patterns Detected Today', val: '8', color: '#7c3aed' },
          { label: 'Total Active Patterns', val: '47', color: '#2563eb' },
          { label: 'Avg Pattern Confidence', val: '92.2%', color: '#10b981' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {patterns.map((p) => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', borderLeft: `4px solid ${p.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#94a3b8' }}>{p.id}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.color, marginLeft: 'auto' }}>↻ {p.frequency}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>Last seen: {p.lastSeen}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Confidence', val: `${p.confidence}%`, color: p.color },
                { label: 'Matched', val: `${p.matches} incidents` },
                { label: 'Affected', val: p.systems.join(', ') },
              ].map((m) => (
                <div key={m.label} style={{ background: '#f8fafc', borderRadius: 7, padding: '7px 9px' }}>
                  <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: m.color || '#0f172a', fontFamily: 'JetBrains Mono' }}>{m.val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.confidence}%`, background: p.color, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>confidence</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
