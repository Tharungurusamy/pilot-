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
    <header className="h-[56px] bg-white border-b border-[#e5e5e5] flex items-center justify-between px-4 sticky top-0 z-[100] shrink-0 font-sans">
      {/* Left: Hamburger menu + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-transparent border-none cursor-pointer p-2 rounded-full flex items-center justify-center text-[#0f0f0f] transition-colors duration-200 hover:bg-[#f2f2f2]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="bg-[#0f0f0f] rounded-[7px] w-8 h-6 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#0f0f0f] flex items-center">
            MediWatch
            <span className="text-[10px] text-[#606060] self-start mt-0.5 ml-0.5 font-semibold">AI</span>
          </span>
        </div>

        {/* Separator and Current Page indicator */}
        <div className="h-4 w-px bg-[#e5e5e5] mx-1" />
        <span className="text-[13px] font-medium text-[#606060]">
          {pageTitle}
        </span>
      </div>

      {/* Center: Search container */}
      <div className="flex-1 max-w-[600px] flex items-center gap-3 mx-8">
        {/* Search input field and button */}
        <div className="flex flex-1 items-center bg-white border border-[#ccc] rounded-l-full py-0 pl-4 pr-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] h-[38px]">
          <input
            placeholder="Search incidents, servers, departments..."
            className="border-none bg-transparent outline-none text-sm w-full text-[#0f0f0f] py-2"
          />
          <kbd className="bg-[#f2f2f2] text-[#606060] text-[11px] font-mono py-[2px] px-1.5 rounded whitespace-nowrap border border-[#e5e5e5]">
            ⌘ K
          </kbd>
        </div>
        <button className="border border-[#ccc] border-l-0 bg-[#f8f8f8] rounded-r-full w-[60px] h-[38px] flex items-center justify-center cursor-pointer -ml-[13px] transition-colors duration-200 hover:bg-[#f0f0f0]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>


      </div>

      {/* Right: Hospital Selector, Notifications, Create, Profile */}
      <div className="flex items-center gap-3">
        {/* Hospital selector */}
        <select
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          className="border border-[#ccc] rounded-2xl py-1 px-3 text-xs text-[#0f0f0f] bg-white cursor-pointer outline-none h-8 transition-colors duration-200 hover:bg-[#f8f8f8]"
        >
          {hospitals.map((h) => <option key={h}>{h}</option>)}
        </select>

        {/* System status node */}
        <div className="flex items-center gap-1.5 bg-[#f2f2f2] rounded-2xl py-1 px-2.5 h-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span className="text-[11px] font-semibold text-[#0f0f0f]">Online</span>
        </div>

        {/* Notifications Icon Button */}
        <button className="bg-transparent border-none cursor-pointer p-2 rounded-full w-[38px] h-[38px] flex items-center justify-center text-[#0f0f0f] relative transition-colors duration-200 hover:bg-[#f2f2f2]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="absolute top-0.5 right-0.5 bg-[#0f0f0f] text-white text-[9px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 cursor-pointer ml-1 hover:opacity-85 transition-opacity duration-200">
          <div className="w-8 h-8 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center text-xs font-bold">
            JR
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#0f0f0f] leading-tight">James Rivera</span>
            <span className="text-[10px] text-[#606060]">Lead Engineer</span>
          </div>
        </div>
      </div>
    </header>
  )
}
