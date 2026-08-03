const causes = [
  {
    id: 'RCA-4821', incident: 'INC-4821', cause: 'Connection pool exhausted — max_connections=50, no pgBouncer',
    confidence: 88, deps: ['Pharmacy Service', 'PostgreSQL DB', 'pgBouncer (absent)'],
    affected: ['prescriptionController', 'inventoryService', 'billingAPI'],
    previous: ['INC-4814 (2026-07-25)', 'INC-4791 (2026-07-12)'],
    color: '#ef4444',
  },
  {
    id: 'RCA-4820', incident: 'INC-4820', cause: 'External laboratory endpoint /api/v2/results returning 504 — upstream SLA breach',
    confidence: 83, deps: ['LIS API', 'External Lab Service', 'HTTP Timeout Config'],
    affected: ['resultsController', 'labReportService'],
    previous: ['INC-4801 (2026-07-18)'],
    color: '#f59e0b',
  },
  {
    id: 'RCA-4818', incident: 'INC-4818', cause: 'Switch port 24 on core-sw-01 misconfigured — VLAN 10 trunk mode set as access',
    confidence: 91, deps: ['core-sw-01', 'VLAN 10', 'Connected Hosts'],
    affected: ['Pharmacy Network Segment', 'IoT Gateway VLAN'],
    previous: [],
    color: '#3b82f6',
  },
]

export default function RootCauseAnalysis() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Root Causes Identified Today', val: '12', color: '#ef4444' },
          { label: 'Avg Confidence', val: '87.3%', color: '#7c3aed' },
          { label: 'Dependencies Analyzed', val: '84', color: '#2563eb' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
          </div>
        ))}
      </div>

      {causes.map((c) => (
        <div key={c.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: '20px', borderLeft: `4px solid ${c.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#94a3b8' }}>{c.id}</span>
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#2563eb', fontWeight: 700 }}>{c.incident}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: c.color, background: `${c.color}12`, padding: '2px 10px', borderRadius: 8 }}>Confidence: {c.confidence}%</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 14 }}>{c.cause}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[
              { label: 'Dependencies', items: c.deps, color: '#7c3aed' },
              { label: 'Affected Services', items: c.affected, color: '#ef4444' },
              { label: 'Previous Similar', items: c.previous.length > 0 ? c.previous : ['No previous occurrences'], color: '#64748b' },
            ].map((section) => (
              <div key={section.label}>
                <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{section.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {section.items.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: section.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: '#374151' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
