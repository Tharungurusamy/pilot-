import { useState } from 'react'

interface TopNavProps {
  pageTitle: string
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
}

export default function TopNav({ pageTitle, collapsed, setCollapsed, isDarkMode, setIsDarkMode }: TopNavProps) {
  const [hospital, setHospital] = useState('St. Mary Medical Center')

  const hospitals = [
    'St. Mary Medical Center',
    'Central City Hospital',
    'Northside Clinic',
  ]

  return (
    <header className="h-[56px] bg-white dark:bg-[#0f0f0f] border-b border-[#e5e5e5] dark:border-[#272727] flex items-center justify-between px-4 sticky top-0 z-[100] shrink-0 font-sans transition-colors duration-200">
      {/* Left: Hamburger menu + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-transparent border-none cursor-pointer p-2 rounded-full flex items-center justify-center text-[#0f0f0f] dark:text-white transition-colors duration-200 hover:bg-[#f2f2f2] dark:hover:bg-[#272727]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="bg-[#0f0f0f] dark:bg-white rounded-[7px] w-8 h-6 flex items-center justify-center transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#0f0f0f' : 'white'} strokeWidth="4" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#0f0f0f] dark:text-white flex items-center">
            MediWatch
            <span className="text-[10px] text-[#606060] dark:text-[#a0a0a0] self-start mt-0.5 ml-0.5 font-semibold">AI</span>
          </span>
        </div>

        {/* Separator and Current Page indicator */}
        <div className="h-4 w-px bg-[#e5e5e5] dark:bg-[#272727] mx-1" />
        <span className="text-[13px] font-medium text-[#606060] dark:text-[#a0a0a0]">
          {pageTitle}
        </span>
      </div>

      {/* Center: Search container */}
      <div className="flex-1 max-w-[600px] flex items-center gap-0 mx-8 flex-nowrap">
        {/* Search input field and button */}
        <div className="flex flex-1 items-center bg-white dark:bg-[#121212] border border-[#ccc] dark:border-[#303030] focus-within:border-[#1c62b9] focus-within:dark:border-[#1c62b9] focus-within:shadow-inner rounded-l-full py-0 pl-4 pr-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-none h-[38px] transition-colors relative z-10">
          <input
            placeholder="Search incidents, servers, departments..."
            className="border-none bg-transparent outline-none text-sm w-full text-[#0f0f0f] dark:text-white py-2 placeholder:text-[#909090]"
          />
          <kbd className="bg-[#f2f2f2] dark:bg-[#272727] text-[#606060] dark:text-[#a0a0a0] text-[11px] font-mono py-[2px] px-1.5 rounded whitespace-nowrap border border-[#e5e5e5] dark:border-[#333333]">
            ⌘ K
          </kbd>
        </div>
        <button 
           onClick={() => window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Searching active logs...', type: 'info' }}))}
           className="border border-[#ccc] dark:border-[#303030] border-l-0 bg-[#f8f8f8] dark:bg-[#222222] rounded-r-full w-[60px] h-[38px] flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#f0f0f0] dark:hover:bg-[#2a2a2a] relative z-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? 'white' : '#0f0f0f'} strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>

      {/* Right: Hospital Selector, Theme, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Hospital selector */}
        <select
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          className="border border-[#ccc] dark:border-[#303030] rounded-2xl py-1 px-3 text-xs text-[#0f0f0f] dark:text-white bg-white dark:bg-[#0f0f0f] cursor-pointer outline-none h-8 transition-colors duration-200 hover:bg-[#f8f8f8] dark:hover:bg-[#1f1f1f]"
        >
          {hospitals.map((h) => <option key={h}>{h}</option>)}
        </select>

        {/* System status node */}
        <div className="flex items-center gap-1.5 bg-[#f2f2f2] dark:bg-[#222222] rounded-2xl py-1 px-2.5 h-8 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span className="text-[11px] font-semibold text-[#0f0f0f] dark:text-white">Online</span>
        </div>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-transparent border-none cursor-pointer p-2 rounded-full w-[38px] h-[38px] flex items-center justify-center text-[#0f0f0f] dark:text-white transition-colors duration-200 hover:bg-[#f2f2f2] dark:hover:bg-[#272727]"
        >
          {isDarkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Notifications Icon Button */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'You have 3 unread system alerts.', type: 'warning' }}))}
          className="bg-transparent border-none cursor-pointer p-2 rounded-full w-[38px] h-[38px] flex items-center justify-center text-[#0f0f0f] dark:text-white relative transition-colors duration-200 hover:bg-[#f2f2f2] dark:hover:bg-[#272727]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="absolute top-0.5 right-0.5 bg-[#cc0000] text-white text-[9px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile Avatar */}
        <div 
          onClick={() => window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Opening Lead Engineer profile preferences...', type: 'info' }}))}
          className="flex items-center gap-2 cursor-pointer ml-1 hover:opacity-85 transition-opacity duration-200">
          <div className="w-8 h-8 rounded-full bg-[#0f0f0f] dark:bg-white text-white dark:text-[#0f0f0f] flex items-center justify-center text-xs font-bold transition-colors">
            JR
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#0f0f0f] dark:text-white leading-tight">James Rivera</span>
            <span className="text-[10px] text-[#606060] dark:text-[#a0a0a0]">Lead Engineer</span>
          </div>
        </div>
      </div>
    </header>
  )
}
