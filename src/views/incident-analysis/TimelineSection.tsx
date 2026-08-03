import React, { useState } from 'react';
import { TimelineEvent, timelineEvents } from './incidentDetailData';

export default function TimelineSection({ incidentId }: { incidentId: string }) {
 const events: TimelineEvent[] = (timelineEvents[incidentId] || []).slice().sort((a, b) => {
 return a.timestamp.localeCompare(b.timestamp);
 });

 const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
 const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

 const toggleEvent = (id: string) => {
 setExpandedEventId(prev => prev === id ? null : id);
 };

 // --- Theme Constants ---
 const colors = {
 bgCard: '#ffffff',
 bgHeader: '#f8fafc',
 border: '#e2e8f0',
 textPrimary: '#0f172a',
 textSecondary: '#64748b',
 textMuted: '#94a3b8',
 blue: '#2563eb',
 purple: '#7c3aed',
 green: '#10b981',
 yellow: '#f59e0b',
 red: '#ef4444',
 };

 const fonts = {
 body: "'Inter', system-ui, sans-serif",
 mono: "'JetBrains Mono', monospace",
 };

 if (events.length === 0) {
 return (
 <div style={{ fontFamily: fonts.body, padding: '24px', color: colors.textSecondary }}>
 No timeline events found for this incident.
 </div>
 );
 }

 const getSeverityColor = (severity: string) => {
 switch (severity?.toLowerCase()) {
 case 'critical': return colors.red;
 case 'high': return colors.yellow;
 case 'medium': return colors.blue;
 case 'info':
 case 'low': return colors.green;
 default: return colors.textSecondary;
 }
 };

 const getEventIcon = (type: string) => {
 switch (type?.toLowerCase()) {
 case 'alert': return '';
 case 'deployment': return '';
 case 'rollback': return '';
 case 'user_action': return '';
 case 'system': return '️';
 case 'note': return '';
 default: return '';
 }
 };

 const badgeStyle = (color: string): React.CSSProperties => ({
 display: 'inline-flex',
 alignItems: 'center',
 padding: '2px 8px',
 borderRadius: '9999px',
 fontSize: '0.75rem',
 fontWeight: 600,
 backgroundColor: `${color}15`,
 color: color,
 width: 'max-content',
 border: `1px solid ${color}30`,
 });

 return (
 <div style={{
 fontFamily: fonts.body,
 backgroundColor: colors.bgCard,
 border: `1px solid ${colors.border}`,
 borderRadius: '12px',
 padding: '24px',
 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
 marginTop: '24px'
 }}>
 <div style={{
 fontSize: '1.125rem',
 fontWeight: 600,
 color: colors.textPrimary,
 marginBottom: '24px',
 borderBottom: `1px solid ${colors.border}`,
 paddingBottom: '16px'
 }}>
 Interactive Incident Timeline
 </div>

 <div style={{ position: 'relative', paddingLeft: '24px' }}>
 {/* Vertical Line */}
 <div style={{
 position: 'absolute',
 left: '7px',
 top: '8px',
 bottom: '24px',
 width: '2px',
 backgroundColor: colors.border,
 zIndex: 0
 }} />

 <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
 {events.map((event: any, index: number) => {
 const isHovered = hoveredEventId === event.id;
 const isExpanded = expandedEventId === event.id;
 const dotColor = getSeverityColor(event.severity);
 const isCritical = event.severity?.toLowerCase() === 'critical';

 return (
 <div key={event.id || index}
 className="fade-slide-in"
 onMouseEnter={() => setHoveredEventId(event.id)}
 onMouseLeave={() => setHoveredEventId(null)}
 style={{
 position: 'relative',
 display: 'flex',
 gap: '16px',
 opacity: 0,
 animation: `fadeSlideIn 0.5s ease forwards ${index * 0.1}s`
 }}
 >
 <style>
 {`
 @keyframes fadeSlideIn {
 from { opacity: 0; transform: translateY(10px); }
 to { opacity: 1; transform: translateY(0); }
 }
 @keyframes pulse {
 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
 70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
 }
 `}
 </style>

 {/* Timeline Dot */}
 <div style={{
 position: 'absolute',
 left: '-24px',
 top: '6px',
 width: '16px',
 height: '16px',
 borderRadius: '50%',
 backgroundColor: dotColor,
 border: '3px solid #ffffff',
 zIndex: 1,
 boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
 animation: isCritical ? 'pulse 2s infinite' : 'none'
 }} />

 {/* Event Content Card */}
 <div onClick={() => toggleEvent(event.id)}
 style={{
 flex: 1,
 backgroundColor: isHovered ? `${colors.bgHeader}80` : 'transparent',
 border: `1px solid ${isHovered ? colors.border : 'transparent'}`,
 borderRadius: '8px',
 padding: '12px 16px',
 cursor: 'pointer',
 transition: 'all 0.2s ease',
 }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
 <span style={{ fontFamily: fonts.mono, fontSize: '0.75rem', color: colors.textSecondary }}>
 {new Date(event.timestamp).toLocaleString()}
 </span>
 <span style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.textPrimary }}>
 {getEventIcon(event.type)} {event.type}
 </span>
 {event.severity && (
 <span style={badgeStyle(getSeverityColor(event.severity))}>
 {event.severity}
 </span>
 )}
 </div>

 <div style={{ fontSize: '0.875rem', color: colors.textPrimary, lineHeight: 1.5 }}>
 {event.description}
 </div>

 {/* Meta info tags */}
 <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
 {event.serviceName && (
 <span style={{ fontSize: '0.75rem', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
 <span style={{ color: colors.textMuted }}>Service:</span> {event.serviceName}
 </span>
 )}
 {event.source && (
 <span style={{ fontSize: '0.75rem', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
 <span style={{ color: colors.textMuted }}>Source:</span> {event.source}
 </span>
 )}
 {event.user && (
 <span style={{ fontSize: '0.75rem', color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
 <span style={{ color: colors.textMuted }}>User:</span> {event.user}
 </span>
 )}
 </div>
 </div>

 {/* Expand indicator */}
 <div style={{ color: colors.textMuted, marginTop: '4px' }}>
 {isExpanded ? '▲' : '▼'}
 </div>

 </div>

 {/* Expanded Detail View */}
 {isExpanded && (
 <div style={{
 marginTop: '16px',
 paddingTop: '16px',
 borderTop: `1px solid ${colors.border}`,
 fontSize: '0.875rem',
 color: colors.textSecondary,
 backgroundColor: colors.bgCard,
 padding: '16px',
 borderRadius: '8px',
 border: `1px solid ${colors.border}`
 }}>
 <div style={{ marginBottom: '12px', fontWeight: 600, color: colors.textPrimary }}>Detailed Event Data</div>
 <pre style={{
 fontFamily: fonts.mono,
 fontSize: '0.75rem',
 backgroundColor: colors.bgHeader,
 padding: '12px',
 borderRadius: '6px',
 overflowX: 'auto',
 margin: 0,
 border: `1px solid ${colors.border}`
 }}>
 {JSON.stringify(event.payload || event, null, 2)}
 </pre>
 </div>
 )}

 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 );
}
