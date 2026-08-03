import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function genMetrics() {
  return {
    cpu: Math.round(60 + Math.random() * 25),
    memory: Math.round(68 + Math.random() * 18),
    network: Math.round(30 + Math.random() * 40),
    db: Math.round(75 + Math.random() * 20),
  }
}

const logEntries = [
  { level: 'ERROR', service: 'pharmacy-api', msg: 'Connection pool timeout after 30000ms — max_connections=50 reached', time: '14:32:07.841' },
  { level: 'WARN', service: 'pharmacy-api', msg: 'Retrying DB connection attempt 4/5 (backoff: 2048ms)', time: '14:32:05.312' },
  { level: 'ERROR', service: 'pharmacy-api', msg: 'Unhandled exception: PoolTimeoutError in prescriptionController.ts:142', time: '14:32:03.009' },
  { level: 'INFO', service: 'ai-managing-agent', msg: 'Incident INC-4821 created — dispatching Pattern & RCA agents', time: '14:32:01.450' },
  { level: 'WARN', service: 'lis-api', msg: 'External lab endpoint /api/v2/results returning 504 — retry 3/5', time: '14:31:58.204' },
  { level: 'INFO', service: 'ai-pattern-agent', msg: 'Pattern match found: "DB Timeout Loop" — confidence 94%', time: '14:31:55.889' },
  { level: 'ERROR', service: 'network-switch-01', msg: 'Packet loss detected: 17.3% on port 24 (VLAN 10)', time: '14:31:50.321' },
  { level: 'INFO', service: 'ai-rca-agent', msg: 'Root cause identified: connection_pool exhausted — pgBouncer absent', time: '14:31:48.102' },
  { level: 'INFO', service: 'emr-service', msg: 'Patient record sync completed — 1,240 records processed', time: '14:31:44.711' },
  { level: 'DEBUG', service: 'iot-gateway', msg: 'Heartbeat received from 87/90 ICU devices', time: '14:31:40.500' },
  { level: 'WARN', service: 'his-billing', msg: 'Slow query detected: GET /api/billing/patient took 4820ms', time: '14:31:35.288' },
  { level: 'INFO', service: 'ai-alert-agent', msg: 'ServiceNow ticket SN-9834 created — Sarah K. notified via email', time: '14:31:30.990' },
]

const levelColor: Record<string, string> = {
  ERROR: '#ef4444', WARN: '#f59e0b', INFO: '#3b82f6', DEBUG: '#94a3b8',
}

export default function LiveMonitoring() {
  const [metrics, setMetrics] = useState(() => Array.from({ length: 20 }, (_, i) => ({ t: i, ...genMetrics() })))
  const tick = useRef(20)

  useEffect(() => {
    const id = setInterval(() => {
      tick.current++
      setMetrics((prev) => [...prev.slice(-29), { t: tick.current, ...genMetrics() }])
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Live metrics charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {[
          { key: 'cpu', label: 'CPU Usage', color: '#2563eb' },
          { key: 'memory', label: 'Memory Usage', color: '#7c3aed' },
          { key: 'network', label: 'Network I/O', color: '#0ea5e9' },
          { key: 'db', label: 'Database Load', color: '#ef4444' },
        ].map((m) => {
          const latest = metrics[metrics.length - 1][m.key as keyof typeof metrics[0]] as number
          return (
            <div key={m.key} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{m.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: latest > 80 ? '#ef4444' : m.color, fontFamily: 'JetBrains Mono' }}>{latest}%</span>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 1.5s ease infinite' }} />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={metrics}>
                  <Line type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={2} dot={false} isAnimationActive={false} />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(v) => [`${v}%`, m.label]} labelFormatter={() => ''} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )
        })}
      </div>

      {/* Server status row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { name: 'API Gateway', status: 'online', rps: '2,340', latency: '12ms' },
          { name: 'Auth Service', status: 'online', rps: '890', latency: '8ms' },
          { name: 'Pharmacy DB', status: 'degraded', rps: '145', latency: '4820ms' },
          { name: 'AI Core', status: 'online', rps: '47', latency: '220ms' },
          { name: 'Log Aggregator', status: 'online', rps: '18.4k', latency: '5ms' },
        ].map((s) => (
          <div key={s.name} style={{
            background: '#fff', borderRadius: 10, padding: '12px',
            border: `1px solid ${s.status === 'degraded' ? 'rgba(245,158,11,0.3)' : '#e2e8f0'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{s.name}</span>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.status === 'degraded' ? '#f59e0b' : '#10b981' }} />
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>RPS: <strong style={{ color: '#0f172a', fontFamily: 'JetBrains Mono' }}>{s.rps}</strong></div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>Latency: <strong style={{ color: s.status === 'degraded' ? '#ef4444' : '#0f172a', fontFamily: 'JetBrains Mono' }}>{s.latency}</strong></div>
          </div>
        ))}
      </div>

      {/* Live log stream */}
      <div style={{ background: '#0d1b2e', borderRadius: 14, padding: '16px', border: '1px solid #1e3a5f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 1.2s ease infinite' }} />
          <span style={{ color: '#93c5fd', fontSize: 12, fontWeight: 600 }}>Live Log Stream</span>
          <span style={{ color: '#475569', fontSize: 11, fontFamily: 'JetBrains Mono' }}>2,340 events/min</span>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {logEntries.map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ color: '#475569', flexShrink: 0 }}>{log.time}</span>
              <span style={{ color: levelColor[log.level], fontWeight: 700, width: 48, flexShrink: 0 }}>{log.level}</span>
              <span style={{ color: '#93c5fd', flexShrink: 0 }}>[{log.service}]</span>
              <span style={{ color: '#cbd5e1' }}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
