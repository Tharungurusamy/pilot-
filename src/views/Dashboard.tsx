import { useState, useEffect } from 'react'
import {
 AreaChart, Area, Tooltip, ResponsiveContainer,
 BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend,
} from 'recharts'

// ── KPI data ──────────────────────────────────────────────────────────────────
const kpiCards = [
 { id: 'incidents', label: 'Total Incidents', value: '1,284', change: '+12%', up: true, color: '#2563eb', icon: <AlertIcon />, sparkData: [4,7,5,9,6,11,8,14,10,16,12,18] },
 { id: 'alerts', label: 'Active Alerts', value: '23', change: '-8%', up: false, color: '#ef4444', icon: <BellIcon />, sparkData: [18,22,19,25,21,20,17,23,19,21,24,23] },
 { id: 'patterns', label: 'Pattern Matches', value: '47', change: '+31%', up: true, color: '#7c3aed', icon: <PatternIcon />, sparkData: [12,15,18,14,20,22,19,25,28,32,40,47] },
 { id: 'accuracy', label: 'AI Accuracy', value: '94.7%', change: '+2.1%', up: true, color: '#10b981', icon: <TargetIcon />, sparkData: [88,90,89,91,92,90,93,92,94,93,95,94.7] },
 { id: 'resolution', label: 'Avg Resolution', value: '18m', change: '-22%', up: false, color: '#f59e0b', icon: <ClockIcon />, sparkData: [35,30,28,32,25,27,24,22,20,21,19,18] },
 { id: 'kb', label: 'Knowledge Base', value: '6,891', change: '+156', up: true, color: '#0ea5e9', icon: <DatabaseIcon />, sparkData: [6200,6300,6400,6480,6550,6610,6680,6720,6780,6820,6860,6891] },
]

// ── Hospital Systems data ──────────────────────────────────────────────────────
const hospitalSystems = [
 { name: 'HIS', full: 'Hospital Information System', status: 'healthy', incidents: 2, updated: '2m ago', color: '#2563eb', icon: '💻' },
 { name: 'EMR', full: 'Electronic Medical Records', status: 'healthy', incidents: 0, updated: '1m ago', color: '#10b981', icon: '📂' },
 { name: 'LIS', full: 'Laboratory Information System', status: 'warning', incidents: 5, updated: '4m ago', color: '#f59e0b', icon: '🔬' },
 { name: 'RIS', full: 'Radiology Information System', status: 'healthy', incidents: 1, updated: '6m ago', color: '#10b981', icon: '🩻' },
 { name: 'Pharmacy', full: 'Pharmacy Management', status: 'critical', incidents: 8, updated: '1m ago', color: '#ef4444', icon: '💊' },
 { name: 'IoT Devices', full: 'Patient Monitoring IoT', status: 'healthy', incidents: 3, updated: '30s ago', color: '#10b981', icon: '📡' },
 { name: 'Network', full: 'Network Devices', status: 'warning', incidents: 4, updated: '3m ago', color: '#f59e0b', icon: '🌐' },
 { name: 'App Logs', full: 'Application Logs', status: 'healthy', incidents: 6, updated: '45s ago', color: '#10b981', icon: '📝' },
]

// ── Incident table data ────────────────────────────────────────────────────────
const incidents = [
 { id: 'INC-4821', dept: 'Pharmacy', severity: 'critical', pattern: 'DB Timeout Loop', cause: 'Connection pool exhausted, failing inserts', status: 'in-progress', engineer: 'Sarah K.' },
 { id: 'INC-4820', dept: 'LIS Lab', severity: 'high', pattern: 'API Retry Storm', cause: 'External lab service unresponsive 504', status: 'assigned', engineer: 'Mike T.' },
 { id: 'INC-4819', dept: 'HIS Billing', severity: 'medium', pattern: 'Memory Leak', cause: 'Unclosed DB cursors consuming 99% RAM', status: 'resolved', engineer: 'Ana L.' },
 { id: 'INC-4818', dept: 'Network', severity: 'high', pattern: 'Packet Loss Spike', cause: 'Switch misconfiguration on Floor 3', status: 'in-progress', engineer: 'James R.' },
 { id: 'INC-4817', dept: 'EMR Records', severity: 'low', pattern: 'Slow Query', cause: 'Missing index on patient_id lookup', status: 'resolved', engineer: 'Chris M.' },
 { id: 'INC-4816', dept: 'IoT Monitor', severity: 'medium', pattern: 'Device Offline', cause: 'Patient telemetry WiFi timeout', status: 'assigned', engineer: 'Priya N.' },
]

// ── Activity feed data ────────────────────────────────────────────────────────
const activities = [
 { time: '14:32:07', type: 'alert', text: 'Critical alert triggered for Pharmacy DB — INC-4821', color: '#ef4444' },
 { time: '14:31:55', type: 'ai', text: 'Managing Agent dispatched Root Cause agent for INC-4821', color: '#7c3aed' },
 { time: '14:31:48', type: 'pattern', text: 'Pattern match: "DB Timeout Loop" — 94% confidence', color: '#2563eb' },
 { time: '14:31:40', type: 'log', text: 'New log stream received from Pharmacy service', color: '#64748b' },
 { time: '14:30:12', type: 'kb', text: 'Knowledge Base updated — runbook #RB-291 added', color: '#10b981' },
 { time: '14:29:55', type: 'resolved', text: 'INC-4819 resolved — HIS Billing memory leak patched', color: '#10b981' },
]

const statusBgCls: Record<string, string> = { healthy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400', critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' }
const severityBg: Record<string, string> = { critical: 'bg-red-600', high: 'bg-amber-500', medium: 'bg-blue-500', low: 'bg-green-500' }
const statusLabelCls: Record<string, string> = { 'in-progress': 'border-amber-500 text-amber-600 dark:text-amber-400', assigned: 'border-blue-500 text-blue-600 dark:text-blue-400', resolved: 'border-green-500 text-green-600 dark:text-green-400' }

export default function Dashboard() {
 const [tick, setTick] = useState(0)

 useEffect(() => {
  const id = setInterval(() => setTick((t) => t + 1), 3000)
  return () => clearInterval(id)
 }, [])

 return (
  <div className="p-4 md:p-6 flex flex-col gap-8 w-full max-w-[1600px] mx-auto bg-transparent">

   {/* Normal KPI Cards */}
   <section>
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
     {kpiCards.map((card) => (
      <div key={card.id} className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-[#e2e8f0] dark:border-[#272727] shadow-sm hover:shadow-md dark:shadow-none hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
       <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: `${card.color}15`, color: card.color }}>
         {card.icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${card.up ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
         {card.change}
        </span>
       </div>
       <div className="text-[22px] font-black text-[#0f172a] dark:text-white font-mono leading-none tracking-tight">{card.value}</div>
       <div className="text-[11px] font-medium text-[#64748b] dark:text-[#a0a0a0] mt-1 mb-2">{card.label}</div>
       
       <div className="h-[28px] w-full mt-auto -mx-1">
        <ResponsiveContainer width="100%" height="100%">
         <AreaChart data={card.sparkData.map((v, i) => ({ i, v }))} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
          <defs>
           <linearGradient id={`sg-${card.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={card.color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={card.color} stopOpacity={0} />
           </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={card.color} strokeWidth={1.5} fill={`url(#sg-${card.id})`} dot={false} />
         </AreaChart>
        </ResponsiveContainer>
       </div>
      </div>
     ))}
    </div>
   </section>

   {/* Incident Table */}
   <section className="mb-4">
    <SectionHeader title="Recent Incidents" sub="Last 24 hours" />
    <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#e2e8f0] dark:border-[#272727] shadow-sm dark:shadow-none mt-3 flex flex-col overflow-hidden">
     <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[13px] whitespace-nowrap">
       <thead>
        <tr className="bg-[#f8fafc] dark:bg-[#181818] border-b border-[#e2e8f0] dark:border-[#272727]">
         {['Incident ID', 'Department', 'Severity', 'Pattern', 'Root Cause', 'Status', 'Engineer', ''].map((h) => (
          <th key={h} className="py-3 px-4 font-semibold text-[#64748b] dark:text-[#a0a0a0]">{h}</th>
         ))}
        </tr>
       </thead>
       <tbody>
        {incidents.map((inc, i) => (
         <tr key={inc.id} className={`group hover:bg-[#fafbfc] dark:hover:bg-[#1a1a1a] transition-colors ${i < incidents.length - 1 ? 'border-b border-[#f1f5f9] dark:border-[#202020]' : ''}`}>
          <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">{inc.id}</td>
          <td className="py-3 px-4 font-medium text-[#0f172a] dark:text-[#e0e0e0]">{inc.dept}</td>
          <td className="py-3 px-4">
           <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${severityBg[inc.severity]} text-white shadow-sm`}>{inc.severity}</span>
          </td>
          <td className="py-3 px-4 text-[#64748b] dark:text-[#a0a0a0] max-w-[140px] truncate">{inc.pattern}</td>
          <td className="py-3 px-4 text-[#64748b] dark:text-[#a0a0a0] max-w-[180px] truncate">{inc.cause}</td>
          <td className="py-3 px-4">
           <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${statusLabelCls[inc.status]}`}>{inc.status}</span>
          </td>
          <td className="py-3 px-4 text-[#0f172a] dark:text-[#cccccc] font-medium">{inc.engineer}</td>
          <td className="py-3 px-4 text-right">
           <button 
            onClick={() => window.dispatchEvent(new CustomEvent('toast', { detail: { message: `Viewing full trace logs for ${inc.id}.`, type: 'info' }}))}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-transparent rounded-md px-3 py-1.5 transition-colors cursor-pointer">View</button>
          </td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>
    </div>
   </section>


   <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    {/* Left Column: AI Recommendation Panel */}
    <div className="xl:col-span-2 flex flex-col gap-6">
      <SectionHeader title="Live Analysis Engine" sub="Real-time multi-agent diagnostics" />
      <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#e2e8f0] dark:border-[#272727] p-5 shadow-sm dark:shadow-none overflow-hidden">
        <AIAgentNetwork />
      </div>

      <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#e2e8f0] dark:border-[#272727] p-5 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">Managing Agent Recommendation</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
           {[
            { label: 'Pattern Match', val: 'DB Timeout', conf: 94, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Root Cause', val: 'Connection pool', conf: 88, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Affected Dept', val: 'Pharmacy', color: 'text-red-600 dark:text-red-400' },
            { label: 'Resolution', val: '12 – 18 mins', color: 'text-amber-500' },
           ].map((row) => (
            <div key={row.label} className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 border border-gray-100 dark:border-[#272727]">
             <div className="text-[9px] text-[#94a3b8] dark:text-[#888888] uppercase tracking-wider mb-1">{row.label}</div>
             <div className="text-xs font-semibold text-[#0f172a] dark:text-white truncate">{row.val}</div>
             {row.conf && <div className={`text-[10px] font-mono mt-0.5 font-bold ${row.color}`}>{row.conf}%</div>}
            </div>
           ))}
        </div>
        <div className="border-t border-gray-100 dark:border-[#272727] pt-4 mt-2">
           <div className="text-[10px] text-[#94a3b8] dark:text-[#888888] uppercase tracking-widest mb-2 font-semibold">Suggested Fix Pipeline</div>
           <div className="text-sm text-[#0f172a] dark:text-[#e0e0e0] bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 font-mono leading-relaxed border border-gray-100 dark:border-[#272727]">
           Increase <span className="text-purple-600 dark:text-purple-400 font-bold">max_connections</span> from 50→120, enable <span className="text-blue-600 dark:text-blue-400 font-bold">pgBouncer</span> pooling.
           </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button 
           onClick={() => window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Executing automated max_connections hotfix...', type: 'success' }}))}
           className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg py-2 text-xs font-bold transition-colors cursor-pointer">Apply Fix</button>
          <button 
           onClick={() => window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'ServiceNow ticket SN-8930 created and assigned to Devops.', type: 'info' }}))}
           className="flex-1 bg-gray-100 dark:bg-[#202020] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] text-[#0f172a] dark:text-white border border-gray-200 dark:border-[#303030] rounded-lg py-2 text-xs font-bold transition-colors cursor-pointer">Create Ticket</button>
        </div>
      </div>
    </div>


    {/* Right Column: Hospital Systems & Live Activity */}
    <div className="flex flex-col gap-6">
      <SectionHeader title="Service Health" sub="Current system statuses" />
      <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#e2e8f0] dark:border-[#272727] p-2 flex flex-col gap-1 mx-0 overflow-y-auto max-h-[300px] custom-scrollbar shadow-sm dark:shadow-none">
       {hospitalSystems.map((sys) => (
        <div key={sys.name} 
             onClick={() => window.dispatchEvent(new CustomEvent('toast', { detail: { message: `Opening advanced telemetry for ${sys.full}.`, type: 'info' }}))}
             className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
         <div className="flex items-center gap-3">
          <div className="text-xl w-8 text-center">{sys.icon || '🖥️'}</div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#0f172a] dark:text-[#e0e0e0] group-hover:text-blue-600 dark:group-hover:text-blue-400">{sys.name}</span>
            <span className="text-[10px] text-[#64748b] dark:text-[#888888]">{sys.full}</span>
          </div>
         </div>
         <div className="flex flex-col items-end gap-1">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusBgCls[sys.status]}`}>
            {sys.status}
          </span>
          <span className="text-[10px] text-[#64748b] dark:text-[#777777] font-mono">{sys.incidents > 0 ? `${sys.incidents} active` : '0 issues'}</span>
         </div>
        </div>
       ))}
      </div>

      <SectionHeader title="Live Activity" sub="Real-time event stream" />
      <div className="bg-white dark:bg-[#121212] rounded-xl border border-[#e2e8f0] dark:border-[#272727] p-4 max-h-[350px] overflow-y-auto custom-scrollbar shadow-sm dark:shadow-none">
       <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-500">LIVE</span>
       </div>
       <div className="flex flex-col">
         {activities.map((a, i) => (
          <div key={i} className={`flex gap-3 py-3 px-1 ${i < activities.length - 1 ? 'border-b border-gray-100 dark:border-[#202020]' : ''}`}>
           <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: a.color }} />
           <div className="flex flex-col">
            <span className="text-xs text-[#0f172a] dark:text-[#cccccc] leading-relaxed">{a.text}</span>
            <span className="text-[10px] text-[#94a3b8] dark:text-[#777777] font-mono mt-1">{a.time}</span>
           </div>
          </div>
         ))}
       </div>
      </div>
    </div>
   </div>

  </div>
 )
}


// ── AI Agent Network Component ────────────────────────────────────────────────
function AIAgentNetwork() {
 return (
  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-[#13111c] dark:to-[#0d121c] -m-5 p-5 md:p-8">
   {/* Background grid overlay */}
   <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

   <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
     {/* Main orchestrator */}
     <div className="flex-1 w-full max-w-[280px]">
       <div className="bg-gradient-to-br from-blue-800 to-purple-900 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-purple-500/20 text-white">
         <div className="flex items-center gap-3 mb-4">
           <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg backdrop-blur-sm">🤖</div>
           <div className="flex flex-col">
             <span className="font-bold text-sm tracking-wide">Managing Agent</span>
             <span className="text-[10px] text-white/60">Orchestrator</span>
           </div>
           <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
         </div>
         <div className="bg-black/20 rounded-lg p-3 font-mono text-[11px] text-white/80">
            [SYS_STATE]: Processing INC-4821<br/>
            [ORCHESTRATE]: 4 agents deployed<br/>
            [MEM_STATUS]: Connected to KB
         </div>
       </div>
     </div>
     
     {/* Active Sub-agents Grid */}
     <div className="flex-[2] grid grid-cols-2 gap-3 sm:gap-4 w-full cursor-pointer">
        {[
         { k: 'Pattern Search', sub: 'Historical Matches', s: 'Active', c: '#3b82f6' },
         { k: 'Root Cause AI', sub: 'Diagnostic Trace', s: 'Active', c: '#a855f7' },
         { k: 'Resolution LLM', sub: 'Fix Recommendation', s: 'Pending', c: '#0ea5e9' },
         { k: 'Alert Notify', sub: 'Ticket Integration', s: 'Success', c: '#22c55e' }
        ].map((ag) => (
         <div key={ag.k} className="group bg-white/80 hover:bg-white dark:bg-[#1a1a1a]/80 dark:hover:bg-[#1a1a1a] backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/40 dark:border-[#333333] shadow-sm flex flex-col gap-2 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-bold text-[#0f172a] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ag.k}</span>
              <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: ag.c }}>{ag.s}</span>
            </div>
            <div className="text-[10px] text-[#64748b] dark:text-[#888888]">{ag.sub}</div>
            <div className="h-1 w-full bg-gray-100 dark:bg-[#202020] rounded-full mt-1 overflow-hidden">
               <div className="h-full rounded-full transition-all duration-1000" style={{ width: ag.s==='Pending'?'30%':'100%', background: ag.c, opacity: ag.s==='Pending'?0.4:1 }} />
            </div>
         </div>
        ))}
     </div>
   </div>
  </div>
 )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
 return (
  <div className="flex flex-col mb-1 mt-2">
   <h2 className="m-0 text-[18px] md:text-xl font-bold tracking-tight text-[#0f172a] dark:text-white leading-tight">{title}</h2>
   {sub && <p className="m-0 text-xs text-[#64748b] dark:text-[#888888] mt-1">{sub}</p>}
  </div>
 )
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function AlertIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> }
function BellIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> }
function PatternIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg> }
function TargetIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> }
function ClockIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function DatabaseIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> }
