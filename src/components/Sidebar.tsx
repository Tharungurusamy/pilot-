import { useState } from 'react'

interface SidebarProps {
  active: string
  onChange: (id: string) => void
  collapsed: boolean
}

export default function Sidebar({ active, onChange, collapsed }: SidebarProps) {
  // Navigation groupings matching Youtube sections
  const firstSection = [
    { id: 'dashboard', label: 'Home', icon: HomeIcon },
    { id: 'live-monitoring', label: 'Live Monitor', icon: LiveIcon },
    { id: 'alerts', label: 'Alerts', icon: SubscriptionsIcon, badgeCount: 3 },
  ]

  const secondSection = [
    { id: 'incidents', label: 'History', icon: HistoryIcon },
    { id: 'ai-agents', label: 'Your Agents', icon: CpuIcon },
  ]

  const thirdSection = [
    { id: 'patterns', label: 'Watch Later', icon: ClockIcon },
    { id: 'root-cause', label: 'Liked Audits', icon: ThumbsUpIcon },
  ]

  const fourthSection = [
    { id: 'resolution', label: 'Resolution Co', icon: PlaylistIcon },
    { id: 'knowledge-base', label: 'Library', icon: DatabaseIcon },
    { id: 'reports', label: 'Reports', icon: BarChartIcon },
  ]

  const fifthSection = [
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  // Collapsed rail items
  const compactItems = [
    { id: 'dashboard', label: 'Home', icon: HomeIcon },
    { id: 'live-monitoring', label: 'Live', icon: LiveIcon },
    { id: 'alerts', label: 'Alerts', icon: SubscriptionsIcon, badgeCount: 3 },
    { id: 'resolution', label: 'Library', icon: PlaylistIcon },
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

      {/* Group 3: Diagnostics section */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ padding: '0 12px 6px 12px', fontSize: 14, fontWeight: 700, color: '#0f0f0f' }}>Diagnostics</div>
        {thirdSection.map(renderItemButton)}
      </div>

      <div style={{ borderTop: '1px solid #e5e5e5', margin: '4px 0 12px 0' }} />

      {/* Group 4: Management */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ padding: '0 12px 6px 12px', fontSize: 14, fontWeight: 700, color: '#0f0f0f' }}>Management</div>
        {fourthSection.map(renderItemButton)}
      </div>

      <div style={{ borderTop: '1px solid #e5e5e5', margin: '4px 0 12px 0' }} />

      {/* Group 5: Settings / Config */}
      <div style={{ marginBottom: 12 }}>
        {fifthSection.map(renderItemButton)}
      </div>

      <div style={{ borderTop: '1px solid #e5e5e5', margin: '4px 0 12px 0' }} />

      {/* Sidebar Footer mimicking Youtube */}
      <div style={{ padding: '12px 12px 24px 12px', fontSize: 11, color: '#909090', lineHeight: 1.6 }}>
        <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 'x 6px' }}>
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

// YouTube-like UI Icons using vector SVGs
function HomeIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function LiveIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2"/>
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
    </svg>
  )
}

function SubscriptionsIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  )
}

function HistoryIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8v4l3 3"/>
      <circle cx="12" cy="12" r="10"/>
    </svg>
  )
}

function CpuIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/>
      <line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/>
      <line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/>
      <line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/>
      <line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  )
}

function ClockIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  )
}

function ThumbsUpIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  )
}

function PlaylistIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  )
}

function DatabaseIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  )
}

function BarChartIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}

function SettingsIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}
