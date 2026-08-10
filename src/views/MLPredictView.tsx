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
  
  // Batch states
  const [batchRawText, setBatchRawText] = useState("");
  const [batchResults, setBatchResults] = useState<PredictionLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filtering & Detail drawer states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState<PredictionLine | null>(null);
  const [ticketCreated, setTicketCreated] = useState<string | null>(null);

  // Preset Sample Datasets
  const samples = {
    database: `[14:02:11] [INFO] [EMR Login] User employee_102 successfully authenticated via SSO.
[14:05:00] [ERROR] [Pharmacy] Database connection timeout: pool exhausted after 5000ms.
[14:05:12] [ERROR] [Pharmacy] SQLException thrown: timeout after 5000ms acquiring DB connection.
[14:06:50] [WARN] [Pharmacy] Thread pool utilization reached 100% threshold.
[14:08:00] [INFO] [EMR Login] Nightly records backup completed successfully.`,
    
    network: `[13:50:00] [INFO] [Insurance] Gateway connecting to remote insurance clearinghouse API.
[13:51:12] [ERROR] [Lab] DNS resolution failed for Laboratory Information System endpoint 'lab-results.internal'.
[13:51:40] [ERROR] [Lab] Connection timeout while contacting LIS server: ENOTFOUND.
[13:53:00] [WARN] [Lab] VPN connection to remote hospital network dropped unexpectedly.
[13:55:00] [INFO] [ICU] IoT Heartbeat channel successfully established.`,
    
    resources: `[12:10:00] [INFO] [ICU] Initializing ICU remote monitoring subsystem.
[12:15:30] [FATAL] [Emergency Ward] Container OOM killed: OutOfMemoryError in EMR-web-frontend pod.
[12:15:45] [ERROR] [Emergency Ward] Uncaught Exception: Java heap space exhausted during PDF image generation.
[12:20:00] [INFO] [Emergency Ward] Re-routing traffic to backup nodes after deploy regression.`
  };

  const loadSample = (type: 'database' | 'network' | 'resources') => {
    setBatchRawText(samples[type]);
    setSelectedLog(null);
    setTicketCreated(null);
  };

  const handlePredictSingle = async () => {
    if (!singleContent.trim()) return;
    setLoading(true);
    setError(null);
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
      if (!response.ok) throw new Error('Prediction failed: ' + response.statusText);
      const data = await response.json();
      setSingleResult({
        timestamp: new Date().toLocaleTimeString(),
        level: singleLevel,
        department: singleDepartment,
        content: singleContent,
        traceId: 'TRC-SINGLE',
        category: data.category,
        priority: data.priority,
        root_cause: data.root_cause,
        fix: data.fix
      });
    } catch (err: any) {
      setError(err.message || 'Error executing ML model prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handlePredictBatch = async () => {
    if (!batchRawText.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedLog(null);
    setTicketCreated(null);
    try {
      const response = await fetch('/api/predict-raw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: batchRawText })
      });
      if (!response.ok) throw new Error('Batch logs analysis failed: ' + response.statusText);
      const data = await response.json();
      setBatchResults(data);
    } catch (err: any) {
      setError(err.message || 'Error occurred while running batch ML prediction pipeline.');
    } finally {
      setLoading(false);
    }
  };

  // Helper stats for dashboard
  const totalLogs = batchResults.length;
  const anomalousLogs = batchResults.filter(r => r.category !== 'normal').length;
  const p1Count = batchResults.filter(r => r.priority === 'P1').length;
  
  // Calculate category distribution
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
      case 'P1': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'P2': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'P3': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'FATAL': return 'bg-purple-900/30 text-purple-300 border border-purple-800/30';
      case 'ERROR': return 'bg-red-950/40 text-red-300 border border-red-900/30';
      case 'WARN': return 'bg-amber-950/40 text-amber-300 border border-amber-900/30';
      case 'INFO': return 'bg-blue-950/40 text-blue-300 border border-blue-900/30';
      default: return 'bg-slate-900/40 text-slate-300 border border-slate-800/30';
    }
  };

  const triggerSimulatedTicket = (log: PredictionLine) => {
    setTicketCreated(log.traceId);
    setTimeout(() => {
      setTicketCreated(null);
    }, 4000);
  };

  return (
    <div className="p-6 min-h-[calc(100vh-60px)] font-sans antialiased text-slate-100 flex flex-col gap-6" style={{ background: '#0b0f17' }}>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1" style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
            HospitalLM Log Analyzer
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Power triage processes using deep ML telemetry. Mine structured raw text log streams to predict alert categories, priorities, and execute root cause diagnostics.
          </p>
        </div>
        
        {/* Tab Controls */}
        <div className="flex bg-[#121824] p-1.5 rounded-xl border border-slate-850">
          <button 
            onClick={() => setActiveTab('batch')}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'batch' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Batch Analyzers
          </button>
          <button 
            onClick={() => setActiveTab('single')}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Single Diagnostic
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Action Panel Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {activeTab === 'batch' ? (
            <div className="bg-[#121824] rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  Log Stream Intake
                </h2>
                {/* Samples */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Load Samples:</span>
                  <button onClick={() => loadSample('database')} className="text-xs font-medium cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-700/50 transition-colors">
                    Database
                  </button>
                  <button onClick={() => loadSample('network')} className="text-xs font-medium cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-700/50 transition-colors">
                    Network
                  </button>
                  <button onClick={() => loadSample('resources')} className="text-xs font-medium cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-700/50 transition-colors">
                    Resources
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea 
                  className="w-full bg-[#0a0d14] border border-slate-800 text-slate-100 rounded-xl p-4 min-h-[190px] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 leading-relaxed scrollbar-thin"
                  placeholder="Paste raw log lines here or click a sample dataset above..."
                  value={batchRawText}
                  onChange={(e) => setBatchRawText(e.target.value)}
                />
              </div>

              <div className="flex flex-row justify-between items-center mt-2">
                <button 
                  onClick={handlePredictBatch}
                  disabled={loading || !batchRawText.trim()}
                  className="relative cursor-pointer bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-lg py-2.5 px-6 text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group duration-200"
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
            <div className="bg-[#121824] rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col gap-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Structured Log Diagnostic
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Source Department</label>
                  <select 
                    value={singleDepartment}
                    onChange={(e) => setSingleDepartment(e.target.value)}
                    className="bg-[#0a0d14] border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Telemetry Level</label>
                  <select 
                    value={singleLevel}
                    onChange={(e) => setSingleLevel(e.target.value)}
                    className="bg-[#0a0d14] border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ERROR">ERROR</option>
                    <option value="FATAL">FATAL</option>
                    <option value="WARN">WARN</option>
                    <option value="INFO">INFO</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Log Message Content</label>
                <textarea 
                  className="w-full bg-[#0a0d14] border border-slate-800 text-slate-100 rounded-xl p-4 min-h-[100px] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="DNS lookup failures for database hosts..."
                  value={singleContent}
                  onChange={(e) => setSingleContent(e.target.value)}
                />
              </div>

              <button 
                onClick={handlePredictSingle}
                disabled={loading || !singleContent.trim()}
                className="w-full sm:w-auto self-start cursor-pointer bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-lg py-2.5 px-6 text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Invoking Models..." : "Run Specific Prediction"}
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-xl text-red-300 text-sm shadow-inner">
              <span className="font-bold mr-1">Error:</span> {error}
            </div>
          )}

          {/* Results Table list for Batch */}
          {activeTab === 'batch' && batchResults.length > 0 && (
            <div className="bg-[#121824] rounded-xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
              
              {/* Table search & filter controls */}
              <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <input 
                  type="text" 
                  placeholder="Filter by trace ID, category, or notes..." 
                  className="bg-[#0a0d14] border border-slate-800 rounded-lg py-2 px-4 text-xs max-w-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-100 placeholder-slate-550"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Level:</span>
                    <select 
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="bg-[#0a0d14] border border-slate-800 rounded-lg py-1.5 px-3 text-[11px] text-slate-300 focus:outline-none"
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
                      className="bg-[#0a0d14] border border-slate-800 rounded-lg py-1.5 px-3 text-[11px] text-slate-300 focus:outline-none"
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
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/20 select-none">
                      <th className="p-3 font-semibold text-center select-none" style={{ width: '40px' }}>ID</th>
                      <th className="p-3 font-semibold">Level</th>
                      <th className="p-3 font-semibold">Department</th>
                      <th className="p-3 font-semibold">Predicted Category</th>
                      <th className="p-3 font-semibold">ML Priority</th>
                      <th className="p-3 font-semibold">Content Message</th>
                      <th className="p-3 font-semibold text-right" style={{ width: '70px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
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
                          className={`cursor-pointer hover:bg-slate-800/40 transition-colors ${selectedLog?.traceId === log.traceId ? 'bg-slate-850/60 border-l-[3px] border-blue-500' : 'border-l-[3px] border-transparent'}`}
                        >
                          <td className="p-3 font-mono text-[10px] text-slate-400 text-center">{log.traceId.replace("TRC-", "")}</td>
                          <td className="p-3">
                            <span className={`inline-block py-0.5 px-1.5 rounded text-[10px] font-extrabold uppercase ${getLevelBadgeStyle(log.level)}`}>
                              {log.level}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-200">{log.department}</td>
                          <td className="p-3">
                            <span className="font-mono text-indigo-400 py-0.5 px-2 bg-indigo-950/20 border border-indigo-900/30 rounded">
                              {log.category}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block py-0.5 px-2 rounded-full text-[10px] font-extrabold ${getPriorityBadgeStyle(log.priority)}`}>
                              {log.priority}
                            </span>
                          </td>
                          <td className="p-3 max-w-[240px] truncate text-slate-300 font-medium">{log.content}</td>
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => setSelectedLog(selectedLog?.traceId === log.traceId ? null : log)}
                              className="text-xs text-blue-400 hover:text-blue-300 font-bold bg-blue-950/40 hover:bg-blue-900/40 py-1 px-2.5 rounded border border-blue-900/30 transition-colors cursor-pointer"
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
            <div className="bg-[#121824] rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2">
                Log Batch Analytics
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0a0d14] rounded-xl p-3 border border-slate-850 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Total Logs</span>
                  <span className="text-xl font-bold font-mono text-white mt-1">{totalLogs}</span>
                </div>
                
                <div className="bg-[#0a0d14] rounded-xl p-3 border border-slate-850 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Critical Anomalies</span>
                  <span className={`text-xl font-bold font-mono mt-1 ${anomalousLogs > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {anomalousLogs}
                  </span>
                </div>

                <div className="bg-[#0a0d14] rounded-xl p-3 border border-slate-850 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">P1 Alerts</span>
                  <span className={`text-xl font-bold font-mono mt-1 ${p1Count > 0 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                    {p1Count}
                  </span>
                </div>
                
                <div className="bg-[#0a0d14] rounded-xl p-3 border border-slate-850 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Top Failure Mode</span>
                  <span className="text-xs font-bold text-slate-200 mt-2.5 truncate font-mono">{mostCommonCategory}</span>
                </div>
              </div>

              {/* Progress/Ratio Bar */}
              {totalLogs > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>Incident Severity Ratio</span>
                    <span>{Math.round((anomalousLogs / totalLogs) * 100)}% Anomaly</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 border border-slate-850 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-l-full" 
                      style={{ width: `${(anomalousLogs / totalLogs) * 100}%` }}
                    />
                    <div 
                      className="bg-slate-800 h-full" 
                      style={{ width: `${((totalLogs - anomalousLogs) / totalLogs) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Diagnostic Details Summary Drawer */}
          {activeTab === 'batch' && selectedLog ? (
            <div className="bg-[#121824] rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-blue-400">{selectedLog.traceId}</span>
                <span className={`py-0.5 px-2 rounded-full text-[10px] font-extrabold ${getPriorityBadgeStyle(selectedLog.priority)}`}>
                  {selectedLog.priority}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Metadata Context</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0a0d14] p-2 rounded border border-slate-850">
                    <span className="text-[9px] text-slate-500 block">Department</span>
                    <span className="font-semibold text-slate-200">{selectedLog.department}</span>
                  </div>
                  <div className="bg-[#0a0d14] p-2 rounded border border-slate-850">
                    <span className="text-[9px] text-slate-500 block">Log Level</span>
                    <span className="font-semibold text-slate-200">{selectedLog.level}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Raw Content Log</h4>
                <div className="bg-[#0a0d14] p-3 rounded-lg border border-slate-850 font-mono text-xs text-slate-300 break-words leading-relaxed">
                  {selectedLog.content}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Predicted Classification</h4>
                <div className="bg-indigo-950/20 border border-indigo-900/30 p-3 rounded-lg flex flex-col gap-1.5">
                  <span className="text-[10px] text-indigo-400 font-bold block">HospitalLM Diagnostic Category:</span>
                  <span className="text-sm font-bold text-white capitalize">{selectedLog.category}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-800 pt-3">
                  AI Recommended Action
                </h4>
                
                <div className="flex flex-col gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold block mb-1">Suggested Root Cause:</span>
                    <p className="text-slate-300 leading-relaxed bg-slate-900/30 p-2.5 rounded border border-slate-850">
                      {selectedLog.root_cause}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-blue-400 font-bold block mb-1">Recommended Corrective Action:</span>
                    <p className="text-slate-300 leading-relaxed bg-slate-900/30 p-2.5 rounded border border-slate-850">
                      {selectedLog.fix}
                    </p>
                  </div>
                </div>
              </div>

              {selectedLog.similar_incidents && selectedLog.similar_incidents.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    RAG Similar Incidents
                  </h4>
                  <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                    {selectedLog.similar_incidents.slice(0, 3).map((inc) => (
                      <div key={inc.id} className="bg-[#0a0d14] p-2.5 rounded border border-slate-850 flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-emerald-400 font-mono">{inc.similarity} Match</span>
                          <span className="text-slate-500 font-mono text-[9px]">{inc.department} • {inc.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-350 italic font-mono leading-relaxed line-clamp-2">
                          "{inc.content}"
                        </p>
                        <div className="text-[10px] bg-slate-900/60 p-1.5 rounded text-slate-400">
                          <span className="font-semibold block text-slate-300">Resolution History:</span>
                          {inc.fix}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
                <button 
                  onClick={() => triggerSimulatedTicket(selectedLog)}
                  className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs shadow-md transition-colors cursor-pointer"
                >
                  Confirm & Create Incident Ticket
                </button>
                {ticketCreated === selectedLog.traceId && (
                  <div className="text-center text-[10px] text-emerald-400 font-bold py-1 bg-emerald-950/20 rounded border border-emerald-900/30 animate-pulse">
                    ✓ Simulated Incident Registered in SentinelAI Active Queue (ID: {selectedLog.traceId})
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'single' && singleResult ? (
            <div className="bg-[#121824] rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4 animate-fade-in">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-2">
                Diagnostic Prediction Result
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0a0d14] rounded-xl p-3.5 border border-slate-850 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Predicted Category</span>
                  <span className="text-sm font-bold text-indigo-400 mt-2 font-mono capitalize">{singleResult.category}</span>
                </div>
                
                <div className="bg-[#0a0d14] rounded-xl p-3.5 border border-slate-850 flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated Priority</span>
                  <span className={`text-md font-extrabold mt-2 px-2 py-0.5 rounded self-start ${getPriorityBadgeStyle(singleResult.priority)}`}>
                    {singleResult.priority}
                  </span>
                </div>
              </div>

              <div className="bg-[#0a0d14] border border-slate-850 rounded-xl p-4 flex flex-col gap-3 mt-1">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold block mb-1">Identified Root Cause:</span>
                  <p className="text-slate-350 text-xs leading-relaxed">
                    {singleResult.root_cause}
                  </p>
                </div>
                
                <div className="border-t border-slate-850 pt-2.5">
                  <span className="text-[10px] text-blue-400 font-bold block mb-1">Action Recommendation:</span>
                  <p className="text-slate-350 text-xs leading-relaxed">
                    {singleResult.fix}
                  </p>
                </div>
              </div>

              {singleResult.similar_incidents && singleResult.similar_incidents.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-slate-850 pt-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    RAG Reference matches
                  </h4>
                  <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {singleResult.similar_incidents.slice(0, 3).map((inc) => (
                      <div key={inc.id} className="bg-[#0a0d14] p-2 rounded border border-slate-850 flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-emerald-400 font-mono">{inc.similarity} Match</span>
                          <span className="text-slate-500 font-mono text-[9px]">{inc.category}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 italic line-clamp-1">"{inc.content}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => triggerSimulatedTicket(singleResult)}
                  className="w-full text-center bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-xs shadow-md transition-colors cursor-pointer"
                >
                  Register in Incident Board
                </button>
                {ticketCreated === singleResult.traceId && (
                  <div className="text-center text-[10px] text-emerald-400 font-bold py-1 bg-emerald-950/20 rounded border border-emerald-900/30 animate-pulse">
                    ✓ Simulated Incident Registered in Active Queue
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#121824] rounded-xl border border-slate-800 p-6 shadow-xl text-center flex flex-col justify-center items-center min-h-[300px]">
              <div className="text-4xl text-slate-600 mb-3 select-none">🔬</div>
              <h4 className="text-sm font-semibold text-slate-400 border-b border-transparent">Telemetry Inspector</h4>
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
