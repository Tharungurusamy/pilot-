const recommendations = [
  {
    incident: 'INC-4821', dept: 'Pharmacy', severity: 'critical',
    best: 'Increase max_connections from 50→120 in postgresql.conf, enable pgBouncer connection pooler, restart pharmacy-api pod',
    alternatives: ['Scale Pharmacy service horizontally (2→4 pods)', 'Implement connection retry with exponential backoff'],
    time: '12–18 min', successRate: 87, prevDev: 'Sarah K.',
    confidence: 91, color: '#ef4444',
  },
  {
    incident: 'INC-4820', dept: 'LIS Lab', severity: 'high',
    best: 'Switch to backup lab endpoint (https://backup.labprovider.com/api/v2), update DNS CNAME, notify lab manager',
    alternatives: ['Enable circuit breaker on LIS API gateway', 'Cache last known results for 30 min'],
    time: '8–12 min', successRate: 93, prevDev: 'Mike T.',
    confidence: 89, color: '#f59e0b',
  },
  {
    incident: 'INC-4818', dept: 'Network', severity: 'high',
    best: 'SSH into core-sw-01, set port 24 from access mode to trunk: "switchport mode trunk" — no downtime needed',
    alternatives: ['Replace physical port with spare on switch-02', 'Reroute VLAN 10 traffic via redundant path'],
    time: '5–10 min', successRate: 100, prevDev: 'James R.',
    confidence: 91, color: '#3b82f6',
  },
]

const sevColor: Record<string, string> = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#10b981' }

export default function ResolutionCenter() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Recommendations Generated', val: '23', color: '#2563eb' },
          { label: 'Avg Success Rate', val: '91.3%', color: '#10b981' },
          { label: 'Runbooks Linked', val: '18', color: '#7c3aed' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
          </div>
        ))}
      </div>

      {recommendations.map((r) => (
        <div key={r.incident} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#2563eb' }}>{r.incident}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: sevColor[r.severity], background: `${sevColor[r.severity]}15`, padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase' }}>{r.severity}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{r.dept}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success Rate</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', fontFamily: 'JetBrains Mono' }}>{r.successRate}%</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Est. Time</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b', fontFamily: 'JetBrains Mono' }}>{r.time}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Best Solution</div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px', fontSize: 12, color: '#0f172a', lineHeight: 1.6, fontFamily: 'JetBrains Mono', borderLeft: `3px solid ${r.color}` }}>
              {r.best}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Alternative Solutions</div>
            {r.alternatives.map((alt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
                <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, marginTop: 1 }}>{i + 1}.</span>
                <span style={{ fontSize: 12, color: '#64748b' }}>{alt}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Previously resolved by <strong style={{ color: '#0f172a' }}>{r.prevDev}</strong> · AI confidence: <strong style={{ color: '#7c3aed' }}>{r.confidence}%</strong></span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Assign Engineer</button>
              <button style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Generate Ticket</button>
              <button style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Ignore</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
