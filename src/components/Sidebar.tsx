interface SidebarProps {
  active: string
  onChange: (id: string) => void
  collapsed: boolean
}

type NavItem = {
  id: string
  label: string
  icon: any
  badgeCount?: number
}

export default function Sidebar({ active, onChange, collapsed }: SidebarProps) {
  // Navigation groupings maintaining original items but styling them as sections
  const firstSection: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutIcon },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: ActivityIcon },
    { id: 'alerts', label: 'Alerts', icon: BellIcon, badgeCount: 3 },
  ]

  const secondSection: NavItem[] = [
    { id: 'predict', label: 'ML Log Analyzer', icon: ActivityIcon },
    { id: 'incidents', label: 'Incident Analysis', icon: AlertTriangleIcon },
    { id: 'ai-agents', label: 'AI Agents', icon: CpuIcon },
    { id: 'patterns', label: 'Pattern Analysis', icon: GitBranchIcon },
    { id: 'root-cause', label: 'Root Cause Analysis', icon: SearchIcon },
  ]

  const thirdSection: NavItem[] = [
    { id: 'resolution', label: 'Resolution Center', icon: CheckCircleIcon },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: DatabaseIcon },
    { id: 'reports', label: 'Reports', icon: BarChart2Icon },
  ]

  const fourthSection: NavItem[] = [
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  // Collapsed rail items (subset of most important ones)
  const compactItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutIcon },
    { id: 'live-monitoring', label: 'Live', icon: ActivityIcon },
    { id: 'predict', label: 'Analyzer', icon: ActivityIcon },
    { id: 'alerts', label: 'Alerts', icon: BellIcon, badgeCount: 3 },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangleIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  // Common item button rendering helper
  const renderItemButton = (item: NavItem) => {
    const Icon = item.icon
    const isActive = active === item.id

    return (
      <button
        key={item.id}
        onClick={() => onChange(item.id)}
        className={`w-full flex items-center gap-[22px] py-2 px-3 border-none cursor-pointer text-sm transition-colors duration-150 rounded-[10px] mb-0.5 text-left ${
          isActive 
            ? 'bg-[#f2f2f2] dark:bg-[#272727] font-semibold text-[#0f0f0f] dark:text-white' 
            : 'bg-transparent font-normal text-[#0f0f0f] dark:text-white hover:bg-[#f9f9f9] dark:hover:bg-[#202020]'
        }`}
      >
        <span className={`flex items-center ${isActive ? 'text-[#0f0f0f] dark:text-white' : 'text-[#606060] dark:text-[#a0a0a0]'}`}>
          <Icon size={20} />
        </span>
        <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">
          {item.label}
        </span>
        {item.badgeCount && (
          <span className="bg-[#0f0f0f] dark:bg-white text-white dark:text-[#0f0f0f] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center transition-colors">
            {item.badgeCount}
          </span>
        )}
      </button>
    )
  }

  // Collapsed Sidebar (72px wide side-rail)
  if (collapsed) {
    return (
      <aside className="w-[72px] min-w-[72px] bg-white dark:bg-[#0f0f0f] flex flex-col items-center py-1 border-r border-[#e5e5e5] dark:border-[#272727] font-sans z-[90] shrink-0 transition-colors duration-200">
        {compactItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-16 h-[70px] flex flex-col items-center justify-center bg-transparent border-none cursor-pointer rounded-[10px] gap-1 py-1 transition-colors duration-200 ${
                isActive ? 'bg-[#f2f2f2] dark:bg-[#272727]' : 'hover:bg-[#f2f2f2] dark:hover:bg-[#202020]'
              }`}
            >
              <div className={`relative flex items-center ${isActive ? 'text-[#0f0f0f] dark:text-white' : 'text-[#606060] dark:text-[#a0a0a0]'}`}>
                <Icon size={22} />
                {item.badgeCount && (
                  <span className="absolute -top-1 -right-2.5 bg-[#0f0f0f] dark:bg-white text-white dark:text-[#0f0f0f] text-[8px] font-bold rounded-full w-[13px] h-[13px] flex items-center justify-center transition-colors">
                    {item.badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] whitespace-nowrap ${isActive ? 'font-medium text-[#0f0f0f] dark:text-white' : 'font-normal text-[#606060] dark:text-[#a0a0a0]'}`}>
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
    <aside className="w-[240px] min-w-[240px] bg-white dark:bg-[#0f0f0f] flex flex-col border-r border-[#e5e5e5] dark:border-[#272727] overflow-y-auto z-[90] pt-3 px-3 shrink-0 font-sans transition-colors duration-200">
      {/* Group 1: Core pages */}
      <div className="mb-3">
        {firstSection.map(renderItemButton)}
      </div>

      <div className="border-t border-[#e5e5e5] dark:border-[#272727] my-1 mb-3 transition-colors" />

      {/* Group 2: Analysis section */}
      <div className="mb-3">
        <div className="px-3 pb-1.5 text-sm font-bold text-[#0f0f0f] dark:text-[#e0e0e0]">Analysis</div>
        {secondSection.map(renderItemButton)}
      </div>

      <div className="border-t border-[#e5e5e5] dark:border-[#272727] my-1 mb-3 transition-colors" />

      {/* Group 3: Resolution & Knowledge */}
      <div className="mb-3">
        <div className="px-3 pb-1.5 text-sm font-bold text-[#0f0f0f] dark:text-[#e0e0e0]">Resolution</div>
        {thirdSection.map(renderItemButton)}
      </div>

      <div className="border-t border-[#e5e5e5] dark:border-[#272727] my-1 mb-3 transition-colors" />

      {/* Group 4: Settings */}
      <div className="mb-3">
        {fourthSection.map(renderItemButton)}
      </div>

      <div className="border-t border-[#e5e5e5] dark:border-[#272727] my-1 mb-3 transition-colors" />

      {/* Sidebar Footer mimicking Youtube */}
      <div className="pt-3 px-3 pb-6 text-[11px] text-[#909090] dark:text-[#707070] leading-relaxed">
        <div className="mb-2 flex flex-wrap gap-x-1.5 gap-y-1">
          <span className="mr-2 cursor-pointer hover:underline">About</span>
          <span className="mr-2 cursor-pointer hover:underline">Press</span>
          <br className="w-full" />
          <span className="mr-2 cursor-pointer hover:underline">Terms</span>
          <span className="mr-2 cursor-pointer hover:underline">Privacy</span>
        </div>
        <div>v2.4.1 — Hospital Intel</div>
        <div className="mt-1.5 font-medium text-[#606060] dark:text-[#888888]">© 2026 MediWatch AI, LLC</div>
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
