import React, { useState } from 'react';
import { AIRecommendation, KBItem, aiRecommendations, knowledgeBase } from './incidentDetailData';

const STYLES = {
 card: {
 backgroundColor: '#ffffff',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 overflow: 'hidden',
 marginBottom: '24px',
 fontFamily: "'Inter', system-ui, sans-serif",
 color: '#0f172a',
 },
 header: {
 backgroundColor: '#f8fafc',
 padding: '16px 20px',
 borderBottom: '1px solid #e2e8f0',
 fontWeight: 600,
 fontSize: '18px',
 margin: 0,
 display: 'flex',
 alignItems: 'center',
 gap: '8px',
 },
 content: {
 padding: '20px',
 },
 mono: {
 fontFamily: "'JetBrains Mono', monospace",
 },
 textSecondary: {
 color: '#64748b',
 },
 textMuted: {
 color: '#94a3b8',
 },
};

const getPriorityColor = (priority: string) => {
 switch (priority) {
 case 'P1': return '#ef4444';
 case 'P2': return '#f59e0b';
 case 'P3': return '#2563eb';
 default: return '#64748b';
 }
};

const getKbTypeColor = (type: string) => {
 switch (type) {
 case 'Runbook': return '#2563eb';
 case 'SOP': return '#7c3aed';
 case 'Documentation': return '#10b981';
 case 'Historical RCA': return '#f59e0b';
 case 'Related Ticket': return '#ef4444';
 case 'Wiki': return '#0ea5e9';
 case 'Engineering Note': return '#64748b';
 case 'Fix History': return '#94a3b8';
 default: return '#64748b';
 }
};

function RecommendationCard({ rec }: { rec: AIRecommendation }) {
 const [expanded, setExpanded] = useState(false);

 return (
 <div style={{
 border: '1px solid #e2e8f0',
 borderRadius: '8px',
 marginBottom: '12px',
 overflow: 'hidden',
 }}>
 <div onClick={() => setExpanded(!expanded)}
 style={{
 padding: '16px',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 cursor: 'pointer',
 backgroundColor: expanded ? '#f8fafc' : '#ffffff',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
 <span style={{
 backgroundColor: getPriorityColor(rec.priority) + '20',
 color: getPriorityColor(rec.priority),
 padding: '4px 8px',
 borderRadius: '12px',
 fontSize: '12px',
 fontWeight: 600,
 }}>{rec.priority}</span>
 <span style={{ fontWeight: 500 }}>{rec.recommendation}</span>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '150px' }}>
 <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
 <div style={{ width: `${rec.confidence}%`, height: '100%', backgroundColor: '#2563eb' }} />
 </div>
 <span style={{ ...STYLES.mono, fontSize: '12px', color: '#64748b' }}>{rec.confidence}%</span>
 <span style={{ color: '#94a3b8', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
 </div>
 </div>
 {expanded && (
 <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
 <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', fontSize: '14px' }}>
 <div>
 <span style={STYLES.textSecondary}>Est. Resolution: </span>
 <span style={{ fontWeight: 500 }}>{rec.estimatedResolutionTime}</span>
 </div>
 <div>
 <span style={STYLES.textSecondary}>Risk Level: </span>
 <span style={{ fontWeight: 500 }}>{rec.risk}</span>
 </div>
 {rec.automationAvailable && (
 <span style={{
 backgroundColor: '#10b98120',
 color: '#10b981',
 padding: '2px 8px',
 borderRadius: '12px',
 fontSize: '12px',
 fontWeight: 500,
 }}> Automation Available</span>
 )}
 </div>
 {rec.commands && rec.commands.length > 0 && (
 <div style={{ marginBottom: '16px' }}>
 <div style={{ fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Commands:</div>
 {rec.commands.map((cmd, idx) => (
 <div key={idx} style={{
 ...STYLES.mono,
 backgroundColor: '#1e293b',
 color: '#ffffff',
 padding: '12px',
 borderRadius: '6px',
 fontSize: '13px',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 marginBottom: '8px',
 }}>
 <span>{cmd}</span>
 <button style={{
 background: 'none',
 border: '1px solid #475569',
 color: '#cbd5e1',
 borderRadius: '4px',
 padding: '4px 8px',
 cursor: 'pointer',
 fontSize: '12px',
 }}>Copy</button>
 </div>
 ))}
 </div>
 )}
 {rec.rollbackOption && (
 <div style={{ marginBottom: '16px' }}>
 <div style={{ fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Rollback Option:</div>
 <div style={{ ...STYLES.mono, backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '6px', fontSize: '13px' }}>
 {rec.rollbackOption}
 </div>
 </div>
 )}
 <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
 {rec.documentation && (
 <a href={rec.documentation} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
 Documentation
 </a>
 )}
 {rec.runbook && (
 <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
 {rec.runbook}
 </span>
 )}
 {rec.relatedKBArticle && (
 <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
 {rec.relatedKBArticle}
 </span>
 )}
 </div>
 </div>
 )}
 </div>
 );
}

export default function AIRecommendationsSection({ incidentId }: { incidentId: string }) {
 // Sort recommendations by priority (P1 < P2 < P3) then confidence (descending)
 const sortedRecs = [...(aiRecommendations[incidentId] || [])].sort((a, b) => {
 if (a.priority !== b.priority) return a.priority.localeCompare(b.priority);
 return b.confidence - a.confidence;
 });

 const sortedKB = [...(knowledgeBase[incidentId] || [])].sort((a, b) => b.relevance - a.relevance);

 return (
 <div>
 {/* AI Recommendations */}
 <div style={STYLES.card}>
 <h2 style={STYLES.header}> AI Recommendations</h2>
 <div style={STYLES.content}>
 {sortedRecs.map((rec, idx) => (
 <RecommendationCard key={idx} rec={rec} />
 ))}
 </div>
 </div>

 {/* Knowledge Base */}
 <div style={STYLES.card}>
 <h2 style={STYLES.header}> Knowledge Base</h2>
 <div style={STYLES.content}>
 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
 <th style={{ padding: '12px 8px', fontWeight: 500 }}>Type</th>
 <th style={{ padding: '12px 8px', fontWeight: 500 }}>Title</th>
 <th style={{ padding: '12px 8px', fontWeight: 500 }}>ID</th>
 <th style={{ padding: '12px 8px', fontWeight: 500 }}>Relevance</th>
 <th style={{ padding: '12px 8px', fontWeight: 500 }}>Last Updated</th>
 <th style={{ padding: '12px 8px', fontWeight: 500 }}>Author</th>
 </tr>
 </thead>
 <tbody>
 {sortedKB.map((kb, idx) => (
 <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
 <td style={{ padding: '12px 8px' }}>
 <span style={{
 backgroundColor: getKbTypeColor(kb.type) + '15',
 color: getKbTypeColor(kb.type),
 padding: '4px 8px',
 borderRadius: '12px',
 fontSize: '12px',
 fontWeight: 500,
 whiteSpace: 'nowrap',
 }}>{kb.type}</span>
 </td>
 <td style={{ padding: '12px 8px', color: '#0f172a', fontWeight: 500 }}>{kb.title}</td>
 <td style={{ padding: '12px 8px', ...STYLES.mono, fontSize: '13px', color: '#64748b' }}>{kb.id}</td>
 <td style={{ padding: '12px 8px', minWidth: '120px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
 <div style={{ width: `${kb.relevance}%`, height: '100%', backgroundColor: '#2563eb' }} />
 </div>
 <span style={{ ...STYLES.mono, fontSize: '12px', color: '#64748b' }}>{kb.relevance}%</span>
 </div>
 </td>
 <td style={{ padding: '12px 8px', color: '#64748b', fontSize: '13px' }}>{kb.lastUpdated}</td>
 <td style={{ padding: '12px 8px', color: '#64748b', fontSize: '13px' }}>{kb.author}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
