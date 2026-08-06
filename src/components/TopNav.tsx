import { useState } from 'react'

interface TopNavProps {
  pageTitle: string
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export default function TopNav({ pageTitle, collapsed, setCollapsed }: TopNavProps) {
  const [hospital, setHospital] = useState('St. Mary Medical Center')

  const hospitals = [
    'St. Mary Medical Center',
    'Central City Hospital',
    'Northside Clinic',
  ]

  return (
    <header
      style={{
        height: 56,
        background: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      {/* Left: Hamburger menu + Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f0f0f',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f2f2f2'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand Logo (YouTube block style but black) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <div style={{
            background: '#0f0f0f',
            borderRadius: '7px',
            width: '32px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* White medical cross inside the play-button box */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span style={{
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: '-0.5px',
            color: '#0f0f0f',
            display: 'flex',
            alignItems: 'center',
          }}>
            MediWatch
            <span style={{ fontSize: '10px', color: '#606060', alignSelf: 'flex-start', marginTop: 2, marginLeft: 2, fontWeight: 600 }}>AI</span>
          </span>
        </div>

        {/* Separator and Current Page indicator */}
        <div style={{ height: 16, width: 1, background: '#e5e5e5', margin: '0 4px' }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#606060' }}>
          {pageTitle}
        </span>
      </div>

      {/* Center: Search container */}
      <div style={{
        flex: 1,
        maxWidth: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: '0 32px',
      }}>
        {/* Search input field and button */}
        <div style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #ccc',
          borderRadius: '40px 0 0 40px',
          padding: '0 4px 0 16px',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
          height: 38,
        }}>
          <input
            placeholder="Search incidents, systems, runbooks..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 14,
              width: '100%',
              color: '#0f0f0f',
              padding: '8px 0',
            }}
          />
        </div>
        <button
          style={{
            border: '1px solid #ccc',
            borderLeft: 'none',
            background: '#f8f8f8',
            borderRadius: '0 40px 40px 0',
            width: 60,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: -13,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f8f8f8'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        {/* Mic icon button */}
        <button
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: '#f2f2f2',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#f2f2f2'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" />
          </svg>
        </button>
      </div>

      {/* Right: Hospital Selector, Notifications, Create, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hospital selector */}
        <select
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          style={{
            border: '1px solid #ccc',
            borderRadius: 16,
            padding: '4px 12px',
            fontSize: 12,
            color: '#0f0f0f',
            background: '#fff',
            cursor: 'pointer',
            outline: 'none',
            height: 32,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8f8'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
        >
          {hospitals.map((h) => <option key={h}>{h}</option>)}
        </select>

        {/* System status node */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#f2f2f2',
          borderRadius: 16,
          padding: '4px 10px',
          height: 32,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#0f0f0f' }}>Online</span>
        </div>

        {/* Create Icon Button */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f0f0f',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f2f2f2'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            <line x1="8" y1="9" x2="8" y2="15"/>
            <line x1="5" y1="12" x2="11" y2="12"/>
          </svg>
        </button>

        {/* Notifications Icon Button */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f0f0f',
            position: 'relative',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f2f2f2'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span style={{
            position: 'absolute',
            top: 2,
            right: 2,
            background: '#0f0f0f',
            color: '#ffffff',
            fontSize: '9px',
            fontWeight: 700,
            borderRadius: '50%',
            width: 15,
            height: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>3</span>
        </button>

        {/* User Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: 4 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#0f0f0f',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
          >
            JR
          </div>
        </div>
      </div>
    </header>
  )
}
