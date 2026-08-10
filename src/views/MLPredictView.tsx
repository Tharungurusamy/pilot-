import React, { useState } from 'react';

interface PredictionLine {
  timestamp: string;
  level: string;
  department: string;
  content: string;
  traceId: string;
  category: string;
  priority: string;
  root_cause: string;
  fix: string;
  similar_incidents?: Array<{
    id: number;
    timestamp: string;
    level: string;
    department: string;
    content: string;
    category: string;
    priority: string;
    root_cause: string;
    fix: string;
    similarity: string;
  }>;
}

export default function MLPredictView() {
  const [activeTab, setActiveTab] = useState<'batch' | 'single'>('batch');
  
  // Single predictor states
  const [singleContent, setSingleContent] = useState("");
  const [singleLevel, setSingleLevel] = useState("ERROR");
  const [singleDepartment, setSingleDepartment] = useState("Pharmacy");
  const [singleResult, setSingleResult] = useState<PredictionLine | null>(null);
  
  // Batch log states
  const [batchRawText, setBatchRawText] = useState("");
  const [batchResults, setBatchResults] = useState<PredictionLine[]>([]);
  const [selectedLog, setSelectedLog] = useState<PredictionLine | null>(null);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [ticketCreated, setTicketCreated] = useState<string | null>(null);

  // Mock sample presets matching user criteria
  const samples = {
    database: `handle_incident =( [
    ("EMR database fetch failed, patient record query timed out after 8 seconds", "ERROR", "EMR Login", "db_timeout"),
    ("Nurse login rejected, session token expired mid-shift", "WARN", "ICU", "auth_failure"),
    ("Unable to pull lab results, connection to LIS database refused", "ERROR", "Lab", "network_error"),
    ("Pharmacy dispensing system lost connection to inventory database", "ERROR", "Pharmacy", "network_error"),
    ("Vitals monitoring feed dropped, ICU dashboard not updating -- patient vitals monitoring interrupted", "ERROR", "ICU", "network_error"),
    ("Doctor unable to authenticate into EMR, MFA code rejected repeatedly", "ERROR", "EMR Login", "auth_failure"),
    ("Insurance claim submission failed, database write timeout", "ERROR", "Insurance", "db_timeout"),
    ("Emergency Ward triage system unresponsive, requests queueing with no response", "ERROR", "Emergency Ward", "db_timeout"),
    ("Billing report export completed successfully, no issues", "INFO", "Billing", "normal"),
    ("Patient admission record failed to save, database connection pool at capacity", "ERROR", "Emergency Ward", "db_timeout"),
    ("New deployment to lab-service broke result formatting for all users", "ERROR", "Lab", "deploy_regression"),
    ("Out of memory on the EMR application server during shift change peak load", "WARN", "EMR Login", "resource_exhaustion"),
])`,
    network: `handle_incident(
    "Radiology PACS server became unreachable after the core network switch stopped forwarding traffic.",
    "ERROR"
)
handle_incident(
    "Laboratory LIS information gateway router dropped packets during large image upload.",
    "WARN"
)`,
    resources: `handle_incident(
    "EMR application server experienced memory exhaustion issues during shift change peak loading.",
    "WARN",
    "EMR Login"
)`
  };

  const loadSample = (type: 'database' | 'network' | 'resources') => {
    setBatchRawText(samples[type]);
  };

  const handlePredictSingle = async () => {
    if (!singleContent.trim()) return;
    setLoading(true);
    setSingleResult(null);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: singleContent,
          level: singleLevel,
          department: singleDepartment
        })
      });
      if (!response.ok) throw new Error("Backend response error");
      const data = await response.json();
      setSingleResult({
        timestamp: new Date().toLocaleTimeString(),
        level: singleLevel,
        department: singleDepartment,
        content: singleContent,
        category: data.category,
        priority: data.priority,
        root_cause: data.root_cause,
        fix: data.fix,
        traceId: `TRC-SNG-${Math.floor(Math.random() * 8999) + 1000}`,
        similar_incidents: data.similar_incidents || []
      });
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Incident evaluated successfully!', type: 'success' }}));
    } catch (e: any) {
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: `Single prediction failed: ${e.message}`, type: 'error' }}));
    } finally {
      setLoading(false);
    }
  };

  const handlePredictBatch = async () => {
    if (!batchRawText.trim()) return;
    setLoading(true);
    setSelectedLog(null);
    try {
      const response = await fetch('/api/predict-raw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: batchRawText })
      });
      if (!response.ok) throw new Error("Backend batch error");
      const data = await response.json();
      setBatchResults(data);
      window.dispatchEvent(new CustomEvent('toast', { 
        detail: { message: `Batch evaluation complete! Classified ${data.length} telemetry logs.`, type: 'success' }
      }));
    } catch (e: any) {
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: `Batch prediction failed: ${e.message}`, type: 'error' }}));
    } finally {
      setLoading(false);
    }
  };

  // KPI Calculations
  const totalLogs = batchResults.length;
  const anomalousLogs = batchResults.filter(l => l.priority === 'P1' || l.priority === 'P2').length;
  const p1Spikes = batchResults.filter(l => l.priority === 'P1').length;
  
  const categoryCounts = batchResults.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonCategory = Object.entries(categoryCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None';

  // Filter batch log list
  const filteredLogs = batchResults.filter(log => {
    const matchesSearch = log.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.traceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesPriority = filterPriority === 'ALL' || log.priority === filterPriority;
    return matchesSearch && matchesLevel && matchesPriority;
  });

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-50 text-red-700 border border-red-200';
      case 'P2': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'P3': return 'bg-blue-50 text-blue-700 border border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'FATAL': return 'bg-purple-50 text-purple-750 border border-purple-200';
      case 'ERROR': return 'bg-red-50 text-red-700 border border-red-200';
      case 'WARN': return 'bg-yellow-50 text-amber-700 border border-amber-250/70';
      case 'INFO': return 'bg-blue-50 text-blue-700 border border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const triggerSimulatedTicket = (log: PredictionLine) => {
    setTicketCreated(log.traceId);
    setTimeout(() => {
      setTicketCreated(null);
    }, 4000);
  };

  return (
    <div className="p-6 min-h-[calc(100vh-60px)] font-sans antialiased text-slate-800 flex flex-col gap-6" style={{ background: '#f9f9f9' }}>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
            HospitalLM Log Analyzer
          </h1>
          <p className="text-slate-600 text-sm max-w-xl">
            Power triage processes using deep ML telemetry. Mine structured raw text log streams to predict alert categories, priorities, and execute root cause diagnostics.
          </p>
        </div>
        
        {/* Tab Controls */}
        <div className="flex bg-[#e2e8f0]/80 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('batch')}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'batch' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Batch Analyzers
          </button>
          <button 
            onClick={() => setActiveTab('single')}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Single Diagnostic
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Action Panel Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {activeTab === 'batch' ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  Log Stream Intake
                </h2>
                {/* Samples */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Load Samples:</span>
                  <button onClick={() => loadSample('database')} className="text-xs font-medium cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg border border-slate-200 transition-colors">
                    Database
                  </button>
                  <button onClick={() => loadSample('network')} className="text-xs font-medium cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg border border-slate-200 transition-colors">
                    Network
                  </button>
                  <button onClick={() => loadSample('resources')} className="text-xs font-medium cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 px-3 rounded-lg border border-slate-200 transition-colors">
                    Resources
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea 
                  className="w-full bg-slate-50 border border-slate-350 text-slate-800 rounded-xl p-4 min-h-[190px] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 leading-relaxed scrollbar-thin"
                  placeholder="Paste raw log lines here or click a sample dataset above..."
                  value={batchRawText}
                  onChange={(e) => setBatchRawText(e.target.value)}
                />
              </div>

              <div className="flex flex-row justify-between items-center mt-2">
                <button 
                  onClick={handlePredictBatch}
                  disabled={loading || !batchRawText.trim()}
                  className="relative cursor-pointer bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white rounded-lg py-2.5 px-6 text-sm font-bold shadow transition-all flex items-center gap-2 group duration-200"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Evaluating Log Batch...
                    </>
                  ) : (
                    <>
                      Execute ML Classification
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </>
                  )}
                </button>
                {totalLogs > 0 && (
                  <span className="text-xs font-medium text-slate-500">
                    Latest Batch: {totalLogs} events processed
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Structured Log Diagnostic
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-650 uppercase tracking-widest">Source Department</label>
                  <select 
                    value={singleDepartment}
                    onChange={(e) => setSingleDepartment(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Lab">Lab (LIS)</option>
                    <option value="Billing">Billing (HIS)</option>
                    <option value="ICU">ICU Devices</option>
                    <option value="EMR Login">EMR Records / Login</option>
                    <option value="Emergency Ward">Emergency Ward</option>
                    <option value="Insurance">Insurance Portal</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-650 uppercase tracking-widest">Telemetry Level</label>
                  <select 
                    value={singleLevel}
                    onChange={(e) => setSingleLevel(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="FATAL">FATAL</option>
                    <option value="ERROR">ERROR</option>
                    <option value="WARN">WARN</option>
                    <option value="INFO">INFO</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-widest">Telemetry Log Message</label>
                <input 
                  type="text" 
                  className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                  placeholder="e.g. Connection pool exhausted mid-shift during updates"
                  value={singleContent}
                  onChange={(e) => setSingleContent(e.target.value)}
                />
              </div>

              <button 
                onClick={handlePredictSingle}
                disabled={loading || !singleContent.trim()}
                className="cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg py-2.5 text-sm font-bold shadow transition-colors flex items-center justify-center gap-2"
              >
                {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                Analyze Diagnostic Signal
              </button>
            </div>
          )}

          {/* Database Output log list (only visible when batch has items) */}
          {activeTab === 'batch' && batchResults.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-250 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-sm font-bold text-slate-800">Evaluated Incident Stream</h3>
              </div>
              
              {/* Table search & filter controls */}
              <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <input 
                  type="text" 
                  placeholder="Filter by trace ID, category, or notes..." 
                  className="bg-white border border-slate-200 rounded-lg py-2 px-4 text-xs max-w-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Level:</span>
                    <select 
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-[11px] text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">ALL</option>
                      <option value="FATAL">FATAL</option>
                      <option value="ERROR">ERROR</option>
                      <option value="WARN">WARN</option>
                      <option value="INFO">INFO</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Priority:</span>
                    <select 
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="bg-white border border-slate-250 rounded-lg py-1.5 px-3 text-[11px] text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="ALL">ALL</option>
                      <option value="P1">P1</option>
                      <option value="P2">P2</option>
                      <option value="P3">P3</option>
                      <option value="P4">P4</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto min-h-[300px] scrollbar-thin">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 bg-slate-50 select-none">
                      <th className="p-3 font-semibold text-center select-none" style={{ width: '40px' }}>ID</th>
                      <th className="p-3 font-semibold">Level</th>
                      <th className="p-3 font-semibold">Department</th>
                      <th className="p-3 font-semibold">Predicted Category</th>
                      <th className="p-3 font-semibold">ML Priority</th>
                      <th className="p-3 font-semibold">Content Message</th>
                      <th className="p-3 font-semibold text-right" style={{ width: '70px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-slate-500 font-medium">
                          No log lines match current search queries or logs haven't been evaluated.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr 
                          key={log.traceId} 
                          onClick={() => setSelectedLog(selectedLog?.traceId === log.traceId ? null : log)}
                          className={`cursor-pointer hover:bg-slate-50 transition-colors ${selectedLog?.traceId === log.traceId ? 'bg-slate-50/80 border-l-[3px] border-blue-500' : 'border-l-[3px] border-transparent'}`}
                        >
                          <td className="p-3 font-mono text-[10px] text-slate-500 text-center">{log.traceId.replace("TRC-", "")}</td>
                          <td className="p-3">
                            <span className={`inline-block py-0.5 px-1.5 rounded text-[10px] font-extrabold uppercase ${getLevelBadgeStyle(log.level)}`}>
                              {log.level}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-705">{log.department}</td>
                          <td className="p-3">
                            <span className="font-mono text-indigo-700 py-0.5 px-2 bg-indigo-50 border border-indigo-100 rounded">
                              {log.category}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block py-0.5 px-2 rounded-full text-[10px] font-extrabold ${getPriorityBadgeStyle(log.priority)}`}>
                              {log.priority}
                            </span>
                          </td>
                          <td className="p-3 max-w-[240px] truncate text-slate-750 font-medium">{log.content}</td>
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => setSelectedLog(selectedLog?.traceId === log.traceId ? null : log)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 py-1.5 px-2.5 rounded border border-blue-200 transition-colors cursor-pointer"
                            >
                              Expand
                            </button>
                          </td>
                         </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

        {/* Diagnostic Panel Column (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* KPI Dashboard (only active for batch logs) */}
          {activeTab === 'batch' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
                Log Batch Analytics
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Logs</span>
                  <span className="text-2xl font-black text-slate-800 font-mono mt-1">{totalLogs}</span>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-amber-700">Anomalies</span>
                  <span className="text-2xl font-black text-amber-700 font-mono mt-1">{anomalousLogs}</span>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block text-red-600">P1 Alerts</span>
                  <span className="text-2xl font-black text-red-600 font-mono mt-1">{p1Spikes}</span>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col shadow-sm">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Top Bug Mode</span>
                  <span className="text-[11px] font-bold text-slate-700 font-mono mt-2.5 truncate capitalize">{mostCommonCategory}</span>
                </div>
              </div>

              {totalLogs > 0 && (
                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Incident Severity Ratio</span>
                    <span className="text-slate-700">{Math.round(((totalLogs - anomalousLogs) / totalLogs) * 100)}% Normal</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((totalLogs - anomalousLogs) / totalLogs) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Diagnostic Details Summary Drawer */}
          {activeTab === 'batch' && selectedLog ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xl flex flex-col gap-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-mono font-bold text-blue-600">{selectedLog.traceId}</span>
                <span className={`py-0.5 px-2 rounded-full text-[10px] font-extrabold ${getPriorityBadgeStyle(selectedLog.priority)}`}>
                  {selectedLog.priority}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Metadata Context</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded border border-slate-205">
                    <span className="text-[9px] text-slate-500 block">Department</span>
                    <span className="font-semibold text-slate-800">{selectedLog.department}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-205">
                    <span className="text-[9px] text-slate-500 block">Log Level</span>
                    <span className="font-semibold text-slate-800">{selectedLog.level}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Raw Content Log</h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-700 break-words leading-relaxed">
                  {selectedLog.content}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Predicted Classification</h4>
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex flex-col gap-1.5">
                  <span className="text-[10px] text-indigo-600 font-bold block">HospitalLM Diagnostic Category:</span>
                  <span className="text-sm font-bold text-slate-800 capitalize font-mono">{selectedLog.category}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-100 pt-3">
                  AI Recommended Action
                </h4>
                
                <div className="flex flex-col gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-amber-705 font-bold block mb-1">Suggested Root Cause:</span>
                    <p className="text-slate-650 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                      {selectedLog.root_cause}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-blue-600 font-bold block mb-1">Recommended Corrective Action:</span>
                    <p className="text-slate-650 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                      {selectedLog.fix}
                    </p>
                  </div>
                </div>
              </div>

              {selectedLog.similar_incidents && selectedLog.similar_incidents.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    RAG Similar Incidents
                  </h4>
                  <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                    {selectedLog.similar_incidents.slice(0, 3).map((inc) => (
                      <div key={inc.id} className="bg-slate-50 p-2.5 rounded border border-slate-200 flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-emerald-600 font-mono">{inc.similarity} Match</span>
                          <span className="text-slate-500 font-mono text-[9px]">{inc.department} • {inc.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-650 italic font-mono leading-relaxed line-clamp-2">
                          "{inc.content}"
                        </p>
                        <div className="text-[10px] bg-slate-100 p-1.5 rounded text-slate-600">
                          <span className="font-semibold block text-slate-700">Resolution History:</span>
                          {inc.fix}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
                <button 
                  onClick={() => triggerSimulatedTicket(selectedLog)}
                  className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs shadow transition-colors cursor-pointer"
                >
                  Confirm & Create Incident Ticket
                </button>
                {ticketCreated === selectedLog.traceId && (
                  <div className="text-center text-[10px] text-emerald-600 font-bold py-1 bg-emerald-50 rounded border border-emerald-200 animate-pulse">
                    ✓ Simulated Incident Registered in SentinelAI Active Queue (ID: {selectedLog.traceId})
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'single' && singleResult ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xl flex flex-col gap-4 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
                Diagnostic Prediction Result
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Predicted Category</span>
                  <span className="text-sm font-bold text-indigo-600 mt-2 font-mono capitalize">{singleResult.category}</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated Priority</span>
                  <span className={`text-md font-extrabold mt-2 px-2 py-0.5 rounded self-start ${getPriorityBadgeStyle(singleResult.priority)}`}>
                    {singleResult.priority}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 mt-1">
                <div>
                  <span className="text-[10px] text-amber-705 font-bold block mb-1">Identified Root Cause:</span>
                  <p className="text-slate-655 text-xs leading-relaxed">
                    {singleResult.root_cause}
                  </p>
                </div>
                
                <div className="border-t border-slate-200 pt-2.5">
                  <span className="text-[10px] text-blue-600 font-bold block mb-1">Action Recommendation:</span>
                  <p className="text-slate-655 text-xs leading-relaxed">
                    {singleResult.fix}
                  </p>
                </div>
              </div>

              {singleResult.similar_incidents && singleResult.similar_incidents.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-slate-250 pt-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    RAG Reference matches
                  </h4>
                  <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {singleResult.similar_incidents.slice(0, 3).map((inc) => (
                      <div key={inc.id} className="bg-slate-50 p-2 rounded border border-slate-200 flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-emerald-600 font-mono">{inc.similarity} Match</span>
                          <span className="text-slate-500 font-mono text-[9px]">{inc.category}</span>
                        </div>
                        <p className="text-[10px] text-slate-550 italic line-clamp-1">"{inc.content}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => triggerSimulatedTicket(singleResult)}
                  className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs shadow transition-colors cursor-pointer"
                >
                  Register in Incident Board
                </button>
                {ticketCreated === singleResult.traceId && (
                  <div className="text-center text-[10px] text-emerald-600 font-bold py-1 bg-emerald-50 rounded border border-emerald-200 animate-pulse">
                    ✓ Simulated Incident Registered in Active Queue
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow text-center flex flex-col justify-center items-center min-h-[300px]">
              <div className="text-4xl text-slate-400 mb-3 select-none">🔬</div>
              <h4 className="text-sm font-semibold text-slate-500 border-b border-transparent">Telemetry Inspector</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
                {activeTab === 'batch' 
                  ? 'Click on any telemetry log line in the batch database table to perform root cause analysis and view action instructions.' 
                  : 'Specify telemetry inputs on the left pane and run prediction model to evaluate logs.'}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
