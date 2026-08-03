import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

const incidentTrend = [
  { month: 'Jan', critical: 18, high: 32, medium: 45, low: 28 },
  { month: 'Feb', critical: 22, high: 28, medium: 41, low: 31 },
  { month: 'Mar', critical: 15, high: 35, medium: 52, low: 24 },
  { month: 'Apr', critical: 27, high: 40, medium: 38, low: 29 },
  { month: 'May', critical: 20, high: 30, medium: 44, low: 35 },
  { month: 'Jun', critical: 12, high: 25, medium: 48, low: 38 },
  { month: 'Jul', critical: 23, high: 38, medium: 55, low: 41 },
]

const resolutionTime = [
  { week: 'W1', time: 38 }, { week: 'W2', time: 33 }, { week: 'W3', time: 29 },
  { week: 'W4', time: 31 }, { week: 'W5', time: 26 }, { week: 'W6', time: 22 },
  { week: 'W7', time: 24 }, { week: 'W8', time: 18 },
]

const topRootCauses = [
  { cause: 'DB Connection Exhaustion', count: 84 },
  { cause: 'API Timeout / Retry Storm', count: 67 },
  { cause: 'Memory Leak (Unclosed Cursors)', count: 52 },
  { cause: 'Network Packet Loss', count: 43 },
  { cause: 'Firmware Update Failure', count: 38 },
  { cause: 'Disk I/O Bottleneck', count: 29 },
]

const systemAffected = [
  { name: 'Pharmacy', value: 28, color: '#ef4444' },
  { name: 'LIS Lab', value: 22, color: '#f59e0b' },
  { name: 'Network', value: 18, color: '#3b82f6' },
  { name: 'HIS', value: 14, color: '#7c3aed' },
  { name: 'IoT', value: 11, color: '#10b981' },
  { name: 'Other', value: 7, color: '#94a3b8' },
]

const aiAccuracy = [
  { month: 'Jan', accuracy: 88.1, patterns: 72 },
  { month: 'Feb', accuracy: 89.4, patterns: 81 },
  { month: 'Mar', accuracy: 90.2, patterns: 95 },
  { month: 'Apr', accuracy: 91.7, patterns: 103 },
  { month: 'May', accuracy: 92.5, patterns: 118 },
  { month: 'Jun', accuracy: 93.8, patterns: 134 },
  { month: 'Jul', accuracy: 94.7, patterns: 156 },
]

export default function Reports() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Incidents (YTD)', val: '1,284', color: '#2563eb' },
          { label: 'Avg Resolution Time', val: '18 min', color: '#f59e0b' },
          { label: 'AI Accuracy', val: '94.7%', color: '#10b981' },
          { label: 'Success Rate', val: '91.3%', color: '#7c3aed' },
        ].map((s) => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: 12, padding: '16px 20px',
            border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Incident trend */}
      <ChartCard title="Incident Trend by Severity" sub="Monthly breakdown across all severity levels">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={incidentTrend}>
            <defs>
              {[['critical', '#ef4444'], ['high', '#f59e0b'], ['medium', '#3b82f6'], ['low', '#10b981']].map(([k, c]) => (
                <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={c} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#g-critical)" strokeWidth={2} />
            <Area type="monotone" dataKey="high" stroke="#f59e0b" fill="url(#g-high)" strokeWidth={2} />
            <Area type="monotone" dataKey="medium" stroke="#3b82f6" fill="url(#g-medium)" strokeWidth={2} />
            <Area type="monotone" dataKey="low" stroke="#10b981" fill="url(#g-low)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: 16 }}>
        {/* AI Accuracy */}
        <ChartCard title="AI Accuracy & Pattern Detection" sub="Improving over time as Knowledge Base grows">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aiAccuracy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis yAxisId="acc" domain={[85, 98]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis yAxisId="pat" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line yAxisId="acc" type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} name="Accuracy %" />
              <Line yAxisId="pat" type="monotone" dataKey="patterns" stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" dot={false} name="Patterns Detected" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Resolution time */}
        <ChartCard title="Avg Resolution Time (minutes)" sub="Trending down with AI recommendations">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={resolutionTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="time" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Most affected systems pie */}
        <ChartCard title="Most Affected Systems" sub="% of all incidents">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={systemAffected} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                {systemAffected.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 6 }}>
            {systemAffected.map((s) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                <span style={{ fontSize: 10, color: '#64748b' }}>{s.name} <strong style={{ color: '#0f172a' }}>{s.value}%</strong></span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Top root causes */}
      <ChartCard title="Top Root Causes" sub="Most frequent failure origins detected by AI">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topRootCauses} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis dataKey="cause" type="category" width={220} tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} name="Incidents" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{title}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>
      </div>
      {children}
    </div>
  )
}
