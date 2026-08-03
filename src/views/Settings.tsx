import { useState } from 'react'

export default function Settings() {
  const [tab, setTab] = useState('hospital')
  const tabs = ['hospital', 'ai-config', 'users', 'notifications', 'knowledge-base', 'roles', 'audit']
  const tabLabels: Record<string, string> = {
    'hospital': 'Hospital Info', 'ai-config': 'AI Configuration', 'users': 'User Management',
    'notifications': 'Notifications', 'knowledge-base': 'Knowledge Base', 'roles': 'Role Management', 'audit': 'Audit Logs',
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Tab nav */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '8px 0', height: 'fit-content' }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              width: '100%', textAlign: 'left', padding: '10px 16px',
              background: tab === t ? 'rgba(37,99,235,0.07)' : 'none',
              border: 'none', borderLeft: tab === t ? '3px solid #2563eb' : '3px solid transparent',
              color: tab === t ? '#2563eb' : '#64748b', fontSize: 12, fontWeight: tab === t ? 600 : 400,
              cursor: 'pointer',
            }}>{tabLabels[t]}</button>
          ))}
        </div>

        {/* Panel */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '24px' }}>
          {tab === 'hospital' && <HospitalSettings />}
          {tab === 'ai-config' && <AIConfig />}
          {tab === 'users' && <UserManagement />}
          {tab === 'notifications' && <NotificationSettings />}
          {tab !== 'hospital' && tab !== 'ai-config' && tab !== 'users' && tab !== 'notifications' && (
            <div style={{ color: '#94a3b8', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>
              {tabLabels[tab]} configuration coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HospitalSettings() {
  return (
    <div>
      <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Hospital Information</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { label: 'Hospital Name', val: 'St. Mary Medical Center' },
          { label: 'Hospital ID', val: 'SMMC-001' },
          { label: 'Location', val: 'Chicago, IL 60601' },
          { label: 'Contact Email', val: 'it@stmary.health' },
          { label: 'Total Departments', val: '24' },
          { label: 'Active Systems', val: '8' },
        ].map((f) => (
          <div key={f.label}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</label>
            <input defaultValue={f.val} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter' }} />
          </div>
        ))}
      </div>
      <button style={{ marginTop: 20, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
    </div>
  )
}

function AIConfig() {
  const [conf, setConf] = useState({ threshold: 75, autoEscalate: true, learnFromFeedback: true, maxAgents: 4 })
  return (
    <div>
      <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>AI Configuration</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { label: 'Pattern Confidence Threshold', key: 'threshold', type: 'range', min: 50, max: 99 },
          { label: 'Max Concurrent Agents', key: 'maxAgents', type: 'range', min: 1, max: 8 },
        ].map((f) => (
          <div key={f.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{f.label}</label>
              <span style={{ fontSize: 13, fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#2563eb' }}>{conf[f.key as keyof typeof conf]}{f.key === 'threshold' ? '%' : ''}</span>
            </div>
            <input type="range" min={f.min} max={f.max} value={conf[f.key as keyof typeof conf] as number}
              onChange={(e) => setConf((c) => ({ ...c, [f.key]: +e.target.value }))}
              style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>
        ))}
        {[
          { label: 'Auto-escalate Critical Incidents', key: 'autoEscalate' },
          { label: 'Learn from Developer Feedback', key: 'learnFromFeedback' },
        ].map((f) => (
          <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{f.label}</label>
            <div
              onClick={() => setConf((c) => ({ ...c, [f.key]: !c[f.key as keyof typeof conf] }))}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                background: conf[f.key as keyof typeof conf] ? '#2563eb' : '#e2e8f0',
                position: 'relative', transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff',
                top: 3, left: conf[f.key as keyof typeof conf] ? 23 : 3,
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </div>
          </div>
        ))}
      </div>
      <button style={{ marginTop: 20, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Apply Configuration</button>
    </div>
  )
}

function UserManagement() {
  const users = [
    { name: 'James Rivera', email: 'j.rivera@stmary.health', role: 'Lead Engineer', status: 'active' },
    { name: 'Sarah Kim', email: 's.kim@stmary.health', role: 'Senior Engineer', status: 'active' },
    { name: 'Mike Torres', email: 'm.torres@stmary.health', role: 'Engineer', status: 'active' },
    { name: 'Ana Lopez', email: 'a.lopez@stmary.health', role: 'Engineer', status: 'active' },
    { name: 'Chris Morgan', email: 'c.morgan@stmary.health', role: 'Junior Engineer', status: 'inactive' },
  ]
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>User Management</h3>
        <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Invite User</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {users.map((u) => (
          <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
              {u.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{u.name}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.email}</div>
            </div>
            <span style={{ fontSize: 11, color: '#64748b', background: '#e2e8f0', padding: '2px 8px', borderRadius: 8 }}>{u.role}</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: u.status === 'active' ? '#10b981' : '#94a3b8', background: u.status === 'active' ? 'rgba(16,185,129,0.1)' : '#f1f5f9', padding: '2px 8px', borderRadius: 8 }}>{u.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [settings, setSettings] = useState({ email: true, dashboard: true, sn: true, slack: false, sms: false })
  return (
    <div>
      <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Notification Settings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { key: 'email', label: 'Email Notifications', desc: 'Send alerts to team email addresses' },
          { key: 'dashboard', label: 'Dashboard Alerts', desc: 'Show alerts in the MediWatch AI dashboard' },
          { key: 'sn', label: 'ServiceNow Tickets', desc: 'Auto-create tickets for critical incidents' },
          { key: 'slack', label: 'Slack Integration', desc: 'Post alerts to configured Slack channels' },
          { key: 'sms', label: 'SMS Alerts', desc: 'Send SMS for critical severity only' },
        ].map((n) => (
          <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{n.label}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{n.desc}</div>
            </div>
            <div onClick={() => setSettings((s) => ({ ...s, [n.key]: !s[n.key as keyof typeof settings] }))}
              style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: settings[n.key as keyof typeof settings] ? '#2563eb' : '#e2e8f0', position: 'relative', transition: 'background 0.2s' }}>
              <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: '#fff', top: 3, left: settings[n.key as keyof typeof settings] ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
