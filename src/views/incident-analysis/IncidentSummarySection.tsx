import React, { useState } from 'react';
import { IncidentDetail, AIIncidentSummary, incidentDetails, aiSummaries } from './incidentDetailData';

export default function IncidentSummarySection({ incidentId }: { incidentId: string }) {
 const incident = incidentDetails[incidentId];
 const aiSummary = aiSummaries[incidentId];

 const [expandedSection, setExpandedSection] = useState<string | null>(null);
 const [checkedActions, setCheckedActions] = useState<Set<number>>(new Set());

 const toggleSection = (section: string) => {
 setExpandedSection(prev => prev === section ? null : section);
 };

 const toggleAction = (index: number) => {
 const newChecked = new Set(checkedActions);
 if (newChecked.has(index)) {
 newChecked.delete(index);
 } else {
 newChecked.add(index);
 }
 setCheckedActions(newChecked);
 };

 if (!incident) {
 return <div style={{ fontFamily: "'Inter', system-ui, sans-serif", padding: '16px', color: '#0f172a' }}>Incident not found.</div>;
 }

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

 // --- Styles ---
 const containerStyle: React.CSSProperties = {
 fontFamily: fonts.body,
 display: 'flex',
 flexDirection: 'column',
 gap: '24px',
 color: colors.textPrimary,
 };

 const cardStyle: React.CSSProperties = {
 backgroundColor: colors.bgCard,
 border: `1px solid ${colors.border}`,
 borderRadius: '12px',
 overflow: 'hidden',
 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
 };

 const headerStyle: React.CSSProperties = {
 backgroundColor: colors.bgHeader,
 padding: '16px 24px',
 borderBottom: `1px solid ${colors.border}`,
 fontWeight: 600,
 fontSize: '1.125rem',
 };

 const contentStyle: React.CSSProperties = {
 padding: '24px',
 };

 const gridRowStyle: React.CSSProperties = {
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
 gap: '24px',
 padding: '12px 0',
 borderBottom: `1px solid ${colors.border}`,
 transition: 'background-color 0.2s',
 };

 const fieldStyle: React.CSSProperties = {
 display: 'flex',
 flexDirection: 'column',
 gap: '4px',
 };

 const labelStyle: React.CSSProperties = {
 fontSize: '0.75rem',
 color: colors.textSecondary,
 textTransform: 'uppercase',
 letterSpacing: '0.05em',
 fontWeight: 500,
 };

 const valueStyle: React.CSSProperties = {
 fontSize: '0.875rem',
 fontWeight: 500,
 };

 const monoValueStyle: React.CSSProperties = {
 ...valueStyle,
 fontFamily: fonts.mono,
 };

 const badgeStyle = (color: string): React.CSSProperties => ({
 display: 'inline-flex',
 alignItems: 'center',
 padding: '2px 8px',
 borderRadius: '9999px',
 fontSize: '0.75rem',
 fontWeight: 600,
 backgroundColor: `${color}20`,
 color: color,
 width: 'max-content',
 });

 const getPriorityColor = (priority: string) => {
 switch (priority?.toUpperCase()) {
 case 'P1': return colors.red;
 case 'P2': return colors.yellow;
 case 'P3': return colors.blue;
 default: return colors.textSecondary;
 }
 };

 const getSeverityColor = (severity: string) => {
 switch (severity?.toUpperCase()) {
 case 'CRITICAL': return colors.red;
 case 'HIGH': return colors.yellow;
 case 'MEDIUM': return colors.blue;
 case 'LOW': return colors.green;
 default: return colors.textSecondary;
 }
 };

 const getEnvColor = (env: string) => {
 switch (env?.toUpperCase()) {
 case 'PRODUCTION': return colors.red;
 case 'STAGING': return colors.yellow;
 case 'DEV': return colors.green;
 default: return colors.textSecondary;
 }
 };

 const getProgressBarColor = (percent: number) => {
 if (percent < 50) return colors.green;
 if (percent < 80) return colors.yellow;
 return colors.red;
 };

 const accordionHeaderStyle: React.CSSProperties = {
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 padding: '12px 16px',
 backgroundColor: colors.bgHeader,
 borderRadius: '8px',
 cursor: 'pointer',
 fontWeight: 500,
 marginTop: '12px',
 border: `1px solid ${colors.border}`,
 };

 const accordionContentStyle: React.CSSProperties = {
 padding: '16px',
 border: `1px solid ${colors.border}`,
 borderTop: 'none',
 borderBottomLeftRadius: '8px',
 borderBottomRightRadius: '8px',
 fontSize: '0.875rem',
 lineHeight: 1.6,
 color: colors.textSecondary,
 };

 return (
 <div style={containerStyle}>
 {/* SECTION 1: INCIDENT SUMMARY */}
 <div style={cardStyle}>
 <div style={headerStyle}>Incident Summary</div>
 <div style={contentStyle}>
 {/* Row 1 */}
 <div style={{ ...gridRowStyle, paddingTop: 0 }}>
 <div style={fieldStyle}>
 <span style={labelStyle}>Incident ID</span>
 <span style={{ ...monoValueStyle, color: colors.blue }}>{incident.id || incidentId}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Title</span>
 <span style={{ ...valueStyle, fontWeight: 600 }}>{incident.title || 'Unknown Title'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Priority</span>
 <span style={badgeStyle(getPriorityColor(incident.priority))}>{incident.priority || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Severity</span>
 <span style={badgeStyle(getSeverityColor(incident.severity))}>{incident.severity || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Status</span>
 <span style={{ ...badgeStyle(colors.textSecondary), border: `1px solid ${colors.border}` }}>{incident.status || 'N/A'}</span>
 </div>
 </div>

 {/* Row 2 */}
 <div style={gridRowStyle}>
 <div style={fieldStyle}>
 <span style={labelStyle}>Category</span>
 <span style={valueStyle}>{incident.category || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Service Name</span>
 <span style={valueStyle}>{incident.serviceName || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Application Name</span>
 <span style={valueStyle}>{incident.applicationName || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Environment</span>
 <span style={badgeStyle(getEnvColor(incident.environment))}>{incident.environment || 'N/A'}</span>
 </div>
 </div>

 {/* Row 3 */}
 <div style={gridRowStyle}>
 <div style={fieldStyle}>
 <span style={labelStyle}>Region</span>
 <span style={monoValueStyle}>{incident.region || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Cluster</span>
 <span style={monoValueStyle}>{incident.cluster || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Namespace</span>
 <span style={monoValueStyle}>{incident.namespace || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Host Name</span>
 <span style={monoValueStyle}>{incident.hostName || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Container Name</span>
 <span style={monoValueStyle}>{incident.containerName || 'N/A'}</span>
 </div>
 </div>

 {/* Row 4 */}
 <div style={gridRowStyle}>
 <div style={fieldStyle}>
 <span style={labelStyle}>Deployment Version</span>
 <span style={monoValueStyle}>{incident.deploymentVersion || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Assigned Engineer</span>
 <span style={valueStyle}>{incident.assignedEngineer || 'Unassigned'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Team</span>
 <span style={valueStyle}>{incident.team || 'N/A'}</span>
 </div>
 </div>

 {/* Row 5 */}
 <div style={gridRowStyle}>
 <div style={fieldStyle}>
 <span style={labelStyle}>SLA Timer</span>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <div style={{ flex: 1, height: '8px', backgroundColor: colors.border, borderRadius: '4px', overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${incident.slaPercent || 0}%`, backgroundColor: getProgressBarColor(incident.slaPercent || 0),
 transition: 'width 0.3s ease'
 }} />
 </div>
 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{incident.slaPercent || 0}%</span>
 </div>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Business Impact</span>
 <span style={valueStyle}>{incident.businessImpact || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Customer Impact</span>
 <span style={valueStyle}>{incident.customerImpact || 'N/A'}</span>
 </div>
 </div>

 {/* Row 6 */}
 <div style={{ ...gridRowStyle, borderBottom: 'none', paddingBottom: 0 }}>
 <div style={fieldStyle}>
 <span style={labelStyle}>Detection Time</span>
 <span style={monoValueStyle}>{incident.detectionTime || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Resolution ETA</span>
 <span style={monoValueStyle}>{incident.resolutionETA || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>MTTA</span>
 <span style={monoValueStyle}>{incident.mtta || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>MTTR</span>
 <span style={monoValueStyle}>{incident.mttr || 'N/A'}</span>
 </div>
 </div>
 </div>
 </div>

 {/* SECTION 2: AI INCIDENT SUMMARY */}
 {aiSummary && (
 <div style={{ ...cardStyle, borderLeft: `4px solid ${colors.purple}` }}>
 <div style={{ ...headerStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <span></span> AI Analysis
 </div>
 <span style={{ ...badgeStyle(colors.purple), fontSize: '0.875rem' }}>
 {aiSummary.confidenceScore || 0}% Confidence
 </span>
 </div>
 <div style={contentStyle}>
 <div style={{ marginBottom: '24px' }}>
 <div style={{ ...labelStyle, marginBottom: '8px' }}>Executive Summary</div>
 <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, color: colors.textSecondary }}>
 {aiSummary.executiveSummary || 'No executive summary available.'}
 </p>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <div style={{ ...labelStyle, marginBottom: '8px' }}>Systems Affected</div>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
 {(aiSummary.systemsAffected || []).map((sys: string, idx: number) => (
 <span key={idx} style={{ ...badgeStyle(colors.blue), backgroundColor: colors.bgHeader, border: `1px solid ${colors.border}` }}>
 {sys}
 </span>
 ))}
 </div>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
 <div style={fieldStyle}>
 <span style={labelStyle}>Users Impacted</span>
 <span style={valueStyle}>{aiSummary.usersImpacted || '0'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Confidence Score</span>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
 <div style={{ flex: 1, height: '6px', backgroundColor: colors.border, borderRadius: '3px', overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${aiSummary.confidenceScore || 0}%`, backgroundColor: colors.purple }} />
 </div>
 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{aiSummary.confidenceScore || 0}%</span>
 </div>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>AI Risk Score</span>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
 <div style={{ flex: 1, height: '6px', backgroundColor: colors.border, borderRadius: '3px', overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${aiSummary.aiRiskScore || 0}%`, backgroundColor: getProgressBarColor(aiSummary.aiRiskScore || 0) }} />
 </div>
 <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{aiSummary.aiRiskScore || 0}%</span>
 </div>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Resolution Complexity</span>
 <span style={valueStyle}>{aiSummary.resolutionComplexity || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Estimated Downtime</span>
 <span style={valueStyle}>{aiSummary.estimatedDowntime || 'N/A'}</span>
 </div>
 <div style={fieldStyle}>
 <span style={labelStyle}>Predicted Next Failure</span>
 <span style={valueStyle}>{aiSummary.predictedNextFailure || 'N/A'}</span>
 </div>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <div style={{ ...labelStyle, marginBottom: '8px' }}>Similar Historical Incidents</div>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
 {String(aiSummary.similarHistoricalIncidents || 0)}
 </div>
 </div>

 {/* Expandable Sections */}
 <div>
 <div style={accordionHeaderStyle} onClick={() => toggleSection('businessImpact')}>
 <span>Business Impact Detailed</span>
 <span>{expandedSection === 'businessImpact' ? '▲' : '▼'}</span>
 </div>
 {expandedSection === 'businessImpact' && (
 <div style={accordionContentStyle}>
 {aiSummary.businessImpact || 'Detailed business impact analysis is not available.'}
 </div>
 )}

 <div style={accordionHeaderStyle} onClick={() => toggleSection('technicalSummary')}>
 <span>Technical Summary</span>
 <span>{expandedSection === 'technicalSummary' ? '▲' : '▼'}</span>
 </div>
 {expandedSection === 'technicalSummary' && (
 <div style={accordionContentStyle}>
 {aiSummary.technicalSummary || 'Technical summary is not available.'}
 </div>
 )}

 <div style={accordionHeaderStyle} onClick={() => toggleSection('rootCause')}>
 <span>Probable Root Cause</span>
 <span>{expandedSection === 'rootCause' ? '▲' : '▼'}</span>
 </div>
 {expandedSection === 'rootCause' && (
 <div style={accordionContentStyle}>
 {aiSummary.probableRootCause || 'Root cause analysis is not available.'}
 </div>
 )}
 </div>

 <div style={{ marginTop: '24px' }}>
 <div style={{ ...labelStyle, marginBottom: '12px' }}>Recommended Immediate Actions</div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
 {(aiSummary.recommendedActions || []).map((action: string, idx: number) => (
 <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
 <input type="checkbox" checked={checkedActions.has(idx)}
 onChange={() => toggleAction(idx)}
 style={{ marginTop: '4px', cursor: 'pointer' }}
 />
 <span style={{ fontSize: '0.875rem', color: checkedActions.has(idx) ? colors.textMuted : colors.textPrimary, textDecoration: checkedActions.has(idx) ? 'line-through' : 'none' }}>
 {idx + 1}. {action}
 </span>
 </label>
 ))}
 </div>
 </div>

 </div>
 </div>
 )}
 </div>
 );
}
