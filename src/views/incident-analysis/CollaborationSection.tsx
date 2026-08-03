import React, { useState } from 'react';
import { CollaborationData, collaborationData } from './incidentDetailData';

const STYLES = {
 card: {
 backgroundColor: '#ffffff',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 overflow: 'hidden',
 marginBottom: '24px',
 fontFamily: "'Inter', system-ui, sans-serif",
 color: '#0f172a',
 display: 'flex',
 flexDirection: 'column' as const,
 height: '600px',
 },
 header: {
 backgroundColor: '#f8fafc',
 padding: '16px 20px',
 borderBottom: '1px solid #e2e8f0',
 fontWeight: 600,
 fontSize: '18px',
 margin: 0,
 },
 mono: {
 fontFamily: "'JetBrains Mono', monospace",
 },
};

function getInitials(name: string) {
 return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function stringToColor(str: string) {
 let hash = 0;
 for (let i = 0; i < str.length; i++) {
 hash = str.charCodeAt(i) + ((hash << 5) - hash);
 }
 const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
 return '#' + '00000'.substring(0, 6 - c.length) + c;
}

export default function CollaborationSection({ incidentId }: { incidentId: string }) {
 const [commentText, setCommentText] = useState('');
 const data: CollaborationData = collaborationData[incidentId] || { assignedEngineers: [], comments: [], activityLog: [], escalations: [], statusUpdates: [] };

 return (
 <div style={STYLES.card}>
 <h2 style={STYLES.header}>Collaboration</h2>
 <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
 {/* Left Column: Comments/Chat */}
 <div style={{ width: '60%', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
 <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
 {data.comments.map((comment, idx) => {
 const isAI = comment.type === 'ai';
 return (
 <div key={idx} style={{
 display: 'flex',
 gap: '12px',
 paddingLeft: isAI ? '12px' : '0',
 borderLeft: isAI ? '4px solid #7c3aed' : 'none',
 }}>
 <div style={{
 width: '36px',
 height: '36px',
 borderRadius: '50%',
 backgroundColor: isAI ? '#7c3aed' : stringToColor(comment.user),
 color: '#ffffff',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontWeight: 600,
 fontSize: '14px',
 flexShrink: 0,
 }}>
 {isAI ? '' : getInitials(comment.user)}
 </div>
 <div>
 <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
 <span style={{ fontWeight: 600, fontSize: '14px' }}>{isAI ? 'AI Assistant' : comment.user}</span>
 <span style={{ ...STYLES.mono, fontSize: '12px', color: '#94a3b8' }}>{comment.time}</span>
 </div>
 <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5 }}>
 {comment.text}
 </div>
 </div>
 </div>
 );
 })}
 </div>
 <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
 <div style={{ display: 'flex', gap: '12px' }}>
 <input type="text" value={commentText}
 onChange={(e) => setCommentText(e.target.value)}
 placeholder="Add comment..." style={{
 flex: 1,
 padding: '10px 16px',
 borderRadius: '20px',
 border: '1px solid #cbd5e1',
 outline: 'none',
 fontSize: '14px',
 fontFamily: 'inherit',
 }}
 />
 <button style={{
 backgroundColor: '#2563eb',
 color: '#ffffff',
 border: 'none',
 borderRadius: '20px',
 padding: '0 20px',
 fontWeight: 500,
 cursor: 'pointer',
 }}>
 Send
 </button>
 </div>
 </div>
 </div>

 {/* Right Column: Sidebar Info */}
 <div style={{ width: '40%', overflowY: 'auto', padding: '20px', backgroundColor: '#fafafa' }}>
 <div style={{ marginBottom: '24px' }}>
 <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', marginTop: 0 }}>Assigned Engineers</h3>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
 {data.assignedEngineers.map((eng, idx) => (
 <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
 <div style={{ position: 'relative' }}>
 <div style={{
 width: '32px',
 height: '32px',
 borderRadius: '50%',
 backgroundColor: stringToColor(eng.name),
 color: '#ffffff',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontWeight: 500,
 fontSize: '12px',
 }}>
 {getInitials(eng.name)}
 </div>
 <div style={{
 position: 'absolute',
 bottom: 0,
 right: 0,
 width: '8px',
 height: '8px',
 borderRadius: '50%',
 backgroundColor: eng.status === 'online' ? '#10b981' : '#f59e0b',
 border: '2px solid #ffffff',
 }} />
 </div>
 <div>
 <div style={{ fontSize: '14px', fontWeight: 500 }}>{eng.name}</div>
 <div style={{ fontSize: '12px', color: '#64748b' }}>{eng.role}</div>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Status Updates</h3>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
 {data.statusUpdates.map((update, idx) => (
 <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <span style={{ fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>{update.to}</span>
 {idx < data.statusUpdates.length - 1 && <span style={{ color: '#cbd5e1' }}>↓</span>}
 </div>
 ))}
 </div>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Escalations</h3>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
 {data.escalations.map((esc, idx) => (
 <div key={idx} style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
 <span style={{ backgroundColor: '#ef444420', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{esc.level}</span>
 <span style={{ ...STYLES.mono, fontSize: '11px', color: '#94a3b8' }}>{esc.time}</span>
 </div>
 <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>Escalated to: {esc.to}</div>
 <div style={{ fontSize: '12px', color: '#64748b' }}>{esc.reason}</div>
 </div>
 ))}
 </div>
 </div>

 <div>
 <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Activity Log</h3>
 <div style={{ borderLeft: '2px solid #e2e8f0', marginLeft: '8px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
 {data.activityLog.map((log, idx) => (
 <div key={idx} style={{ position: 'relative' }}>
 <div style={{
 position: 'absolute',
 left: '-21px',
 top: '4px',
 width: '8px',
 height: '8px',
 borderRadius: '50%',
 backgroundColor: '#cbd5e1',
 border: '2px solid #fafafa'
 }} />
 <div style={{ ...STYLES.mono, fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>{log.time}</div>
 <div style={{ fontSize: '13px', color: '#334155' }}>
 <span style={{ fontWeight: 500, color: '#0f172a' }}>{log.user}</span> {log.action}
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>
 </div>
 </div>
 );
}
