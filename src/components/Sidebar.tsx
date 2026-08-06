import { useState } from 'react'

interface SidebarProps {
  active: string
  onChange: (id: string) => void
  collapsed: boolean
}

export default function Sidebar({ active, onChange, collapsed }: SidebarProps) {
  // Navigation groupings maintaining original items but styling them as sections
  const firstSection = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutIcon },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: ActivityIcon },
    { id: 'alerts', label: 'Alerts', icon: BellIcon, badgeCount: 3 },
  ]

  const secondSection = [
    { id: 'incidents', label: 'Incident Analysis', icon: AlertTriangleIcon },
    { id: 'ai-agents', label: 'AI Agents', icon: CpuIcon },
    { id: 'patterns', label: 'Pattern Analysis', icon: GitBranchIcon },
    { id: 'root-cause', label: 'Root Cause Analysis', icon: SearchIcon },
  ]

  const thirdSection = [
    { id: 'resolution', label: 'Resolution Center', icon: CheckCircleIcon },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: DatabaseIcon },
    { id: 'reports', label: 'Reports', icon: BarChart2Icon },
  ]

  const fourthSection = [
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  // Collapsed rail items (subset of most important ones)
  const compactItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutIcon },
    { id: 'live-monitoring', label: 'Live', icon: ActivityIcon },
    { id: 'alerts', label: 'Alerts', icon: BellIcon, badgeCount: 3 },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangleIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  // Common item button rendering helper
  const renderItemButton = (item: { id: string; label: string; icon: React.ComponentType<{ size: number }> ; badgeCount?: number }) => {
    const Icon = item.icon
    const isActive = active === item.id

    return (
      <button
        key={item.id}
        onClick={() => onChange(item.id)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '8px 12px',
          background: isActive ? '#f2f2f2' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#0f0f0f',
          fontSize: 14,
          fontWeight: isActive ? 600 : 400,
          transition: 'background 0.15s ease',
          borderRadius: 10,
          marginBottom: 2,
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = '#f9f9f9'
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = 'transparent'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', color: isActive ? '#0f0f0f' : '#606060' }}>
          <Icon size={20} />
        </span>
        <span style={{ 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          flex: 1
        }}>
          {item.label}
        </span>
        {item.badgeCount && (
          <span style={{
            background: '#0f0f0f',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            borderRadius: '50%',
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>{item.badgeCount}</span>
        )}
      </button>
    )
  }

  // Collapsed Sidebar (72px wide side-rail)
  if (collapsed) {
    return (
      <aside
        style={{
          width: 72,
          minWidth: 72,
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4px 0',
          borderRight: '1px solid #e5e5e5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: 90,
          flexShrink: 0,
        }}
      >
        {compactItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              style={{
                width: 64,
                height: 70,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 10,
                color: isActive ? '#0f0f0f' : '#0f0f0f',
                gap: 4,
                padding: '4px 0',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f2f2f2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', color: isActive ? '#0f0f0f' : '#606060' }}>
                <Icon size={22} />
                {item.badgeCount && (
                  <span style={{
                    position: 'absolute',
                    top: -4,
                    right: -10,
                    background: '#0f0f0f',
                    color: '#fff',
                    fontSize: 8,
                    fontWeight: 700,
                    borderRadius: '50%',
                    width: 13,
                    height: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>{item.badgeCount}</span>
                )}
              </div>
              <span style={{ 
                fontSize: 10, 
                fontWeight: isActive ? 500 : 400,
                whiteSpace: 'nowrap',
                color: isActive ? '#0f0f0f' : '#606060' 
              }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </aside>
    )
  }

  // Expanded Sidebar (240px wide side navigation scrollbar)
  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #e5e5e5',
        overflowY: 'auto',
        zIndex: 90,
        padding: '12px 12px 0 12px',
        flexShrink: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Group 1: Core pages */}
      <div style={{ marginBottom: 12 }}>
        {firstSection.map(renderItemButton)}
      </div>

      <div style={{ borderTop: '1px solid #e5e5e5', margin: '4px 0 12px 0' }} />

      {/* Group 2: Analysis section */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ padding: '0 12px 6px 12px', fontSize: 14, fontWeight: 700, color: '#0f0f0f' }}>Analysis</div>
        {secondSection.map(renderItemButton)}
      </div>

      <div style={{ borderTop: '1px solid #e5e5e5', margin: '4px 0 12px 0' }} />

      {/* Group 3: Resolution & Knowledge */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ padding: '0 12px 6px 12px', fontSize: 14, fontWeight: 700, color: '#0f0f0f' }}>Resolution</div>
        {thirdSection.map(renderItemButton)}
      </div>

      <div style={{ borderTop: '1px solid #e5e5e5', margin: '4px 0 12px 0' }} />

      {/* Group 4: Settings */}
      <div style={{ marginBottom: 12 }}>
        {fourthSection.map(renderItemButton)}
      </div>

      <div style={{ borderTop: '1px solid #e5e5e5', margin: '4px 0 12px 0' }} />

      {/* Sidebar Footer mimicking Youtube */}
      <div style={{ padding: '12px 12px 24px 12px', fontSize: 11, color: '#909090', lineHeight: 1.6 }}>
        <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
          <span style={{ marginRight: 8, cursor: 'pointer' }}>About</span>
          <span style={{ marginRight: 8, cursor: 'pointer' }}>Press</span>
          <br />
          <span style={{ marginRight: 8, cursor: 'pointer' }}>Terms</span>
          <span style={{ marginRight: 8, cursor: 'pointer' }}>Privacy</span>
        </div>
        <div>v2.4.1 — Hospital Intel</div>
        <div style={{ marginTop: 6, fontWeight: 500, color: '#606060' }}>© 2026 MediWatch AI, LLC</div>
      </div>
    </aside>
  )
}

// Inline original SVG components
function LayoutIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
}
function ActivityIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
}
function AlertTriangleIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
function CpuIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
}
function GitBranchIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>
}
function SearchIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
function CheckCircleIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
}
function DatabaseIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
}
function BarChart2Icon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
}
function BellIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
}
function SettingsIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
}
