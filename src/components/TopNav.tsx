import { useState } from 'react'

interface TopNavProps {
  pageTitle: string
}

export default function TopNav({ pageTitle }: TopNavProps) {
  const [hospital, setHospital] = useState('St. Mary Medical Center')

  const hospitals = [
    'St. Mary Medical Center',
    'Central City Hospital',
    'Northside Clinic',
  ]

  return (
    <header
      style={{
        height: 60,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* Page title */}
      <h1 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, marginRight: 8 }}>
        {pageTitle}
      </h1>

      {/* Search */}
      <div style={{
        flex: 1, maxWidth: 400,
        display: 'flex', alignItems: 'center',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '0 12px',
        gap: 8,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          placeholder="Search incidents, servers, departments..."
          style={{
            border: 'none', background: 'none', outline: 'none',
            fontSize: 13, color: '#0f172a', width: '100%', padding: '8px 0',
          }}
        />
        <kbd style={{
          background: '#e2e8f0', color: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono',
          padding: '2px 5px', borderRadius: 4, whiteSpace: 'nowrap',
        }}>⌘ K</kbd>
      </div>

      <div style={{ flex: 1 }} />

      {/* Hospital selector */}
      <select
        value={hospital}
        onChange={(e) => setHospital(e.target.value)}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '6px 10px',
          fontSize: 12,
          color: '#0f172a',
          background: '#fff',
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'Inter',
        }}
      >
        {hospitals.map((h) => <option key={h}>{h}</option>)}
      </select>

      {/* System status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(16,185,129,0.08)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 20,
        padding: '4px 12px',
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#059669' }}>Healthy</span>
      </div>

      {/* Notifications */}
      <button style={{
        position: 'relative', background: 'none', border: '1px solid #e2e8f0',
        borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', color: '#64748b',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span style={{
          position: 'absolute', top: -4, right: -4,
          background: '#ef4444', color: '#fff',
          fontSize: 9, fontWeight: 700, borderRadius: 10,
          padding: '1px 4px', lineHeight: 1.4,
        }}>3</span>
      </button>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12, fontWeight: 700,
        }}>JR</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>James Rivera</span>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>Lead Engineer</span>
        </div>
      </div>
    </header>
  )
}
