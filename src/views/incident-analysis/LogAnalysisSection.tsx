import React, { useState } from 'react';
import { LogEntry, logEntries } from './incidentDetailData';

export default function LogAnalysisSection({ incidentId }: { incidentId: string }) {
 const [search, setSearch] = useState('');
 const [levelFilter, setLevelFilter] = useState('ALL');
 const [expandedRow, setExpandedRow] = useState<string | null>(null);

 const filteredLogs = (logEntries[incidentId] || []).filter((log: LogEntry) => {
 const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || log.service.toLowerCase().includes(search.toLowerCase());
 const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
 return matchesSearch && matchesLevel;
 });

 const getLevelColor = (level: string) => {
 switch (level) {
 case 'CRITICAL': return '#ef4444';
 case 'ERROR': return '#ef4444';
 case 'WARN': return '#f59e0b';
 case 'INFO': return '#3b82f6';
 default: return '#64748b';
 }
 };

 return (
 <div style={{
 backgroundColor: '#ffffff',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 fontFamily: "'Inter', system-ui, sans-serif",
 overflow: 'hidden',
 color: '#0f172a'
 }}>
 <div style={{
 backgroundColor: '#f8fafc',
 padding: '16px 20px',
 borderBottom: '1px solid #e2e8f0',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center'
 }}>
 <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Log Analysis</h2>
 <div style={{ display: 'flex', gap: '12px' }}>
 <input type="text" placeholder="Search logs..." value={search}
 onChange={(e) => setSearch(e.target.value)}
 style={{
 padding: '8px 14px',
 border: '1px solid #e2e8f0',
 borderRadius: '8px',
 fontSize: '14px'
 }}
 />
 <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
 style={{
 padding: '8px 14px',
 border: '1px solid #e2e8f0',
 borderRadius: '8px',
 fontSize: '14px',
 backgroundColor: '#fff'
 }}
 >
 <option value="ALL">ALL</option>
 <option value="CRITICAL">CRITICAL</option>
 <option value="ERROR">ERROR</option>
 <option value="WARN">WARN</option>
 <option value="INFO">INFO</option>
 </select>
 </div>
 </div>
 <div style={{ overflowX: 'auto' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
 <th style={{ padding: '12px 16px', fontWeight: 500 }}>Timestamp</th>
 <th style={{ padding: '12px 16px', fontWeight: 500 }}>Level</th>
 <th style={{ padding: '12px 16px', fontWeight: 500 }}>Service</th>
 <th style={{ padding: '12px 16px', fontWeight: 500 }}>Pod</th>
 <th style={{ padding: '12px 16px', fontWeight: 500 }}>Trace ID</th>
 <th style={{ padding: '12px 16px', fontWeight: 500 }}>Message</th>
 </tr>
 </thead>
 <tbody>
 {filteredLogs.map(log => {
 const isExpanded = expandedRow === log.traceId;
 const isRootCause = log.isRootCause;
 return (
 <React.Fragment key={log.traceId}>
 <tr onClick={() => setExpandedRow(isExpanded ? null : log.traceId)}
 style={{ borderBottom: '1px solid #e2e8f0',
 backgroundColor: isRootCause ? '#fef2f2' : '#ffffff',
 borderLeft: isRootCause ? '3px solid #ef4444' : '3px solid transparent',
 cursor: 'pointer'
 }}
 >
 <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
 {log.timestamp}
 </td>
 <td style={{ padding: '12px 16px' }}>
 <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: getLevelColor(log.level) + '20', color: getLevelColor(log.level),
 fontWeight: 600,
 fontSize: '12px'
 }}>
 {log.level}
 </span>
 </td>
 <td style={{ padding: '12px 16px', fontWeight: 500 }}>{log.service}</td>
 <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#64748b', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
 {log.pod}
 </td>
 <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#64748b', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
 {log.traceId}
 </td>
 <td style={{ padding: '12px 16px', maxWidth: '300px' }}>
 <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
 {log.message}
 </div>
 {log.aiAnnotation && (
 <div style={{ color: '#7c3aed', fontStyle: 'italic', fontSize: '12px', marginTop: '4px' }}>
 {log.aiAnnotation}
 </div>
 )}
 </td>
 </tr>
 {isExpanded && (
 <tr>
 <td colSpan={6} style={{ padding: 0 }}>
 <div style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px',
 overflowX: 'auto'
 }}>
 <div style={{ marginBottom: '8px' }}><strong>Message:</strong> {log.message}</div>
 {log.namespace && <div><strong>Namespace:</strong> {log.namespace}</div>}
 {log.container && <div><strong>Container:</strong> {log.container}</div>}
 {log.host && <div><strong>Host:</strong> {log.host}</div>}
 {log.correlationId && <div><strong>Correlation ID:</strong> {log.correlationId}</div>}
 {log.errorCode && <div><strong>Error Code:</strong> {log.errorCode}</div>}
 {log.exception && <div><strong>Exception:</strong> {log.exception}</div>}
 {log.stackTrace && (
 <div style={{ marginTop: '12px' }}>
 <strong>Stack Trace:</strong>
 <pre style={{ margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>{log.stackTrace}</pre>
 </div>
 )}
 </div>
 </td>
 </tr>
 )}
 </React.Fragment>
 );
 })}
 </tbody>
 </table>
 </div>
 <div style={{
 padding: '12px 20px',
 backgroundColor: '#f8fafc',
 borderTop: '1px solid #e2e8f0',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 fontSize: '14px',
 color: '#64748b'
 }}>
 <span>Total Logs: {filteredLogs.length}</span>
 <button style={{
 padding: '6px 12px',
 backgroundColor: '#ffffff',
 border: '1px solid #e2e8f0',
 borderRadius: '6px',
 cursor: 'pointer',
 fontWeight: 500,
 color: '#0f172a'
 }}>
 Export
 </button>
 </div>
 </div>
 );
}
