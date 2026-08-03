import React from 'react';
import { impactData, riskData } from './incidentDetailData';
import type { ImpactData, RiskData } from './incidentDetailData';

const RiskGauge = ({ label, value, inverse = false }: { label: string, value: number, inverse?: boolean }) => {
 let color = '#10b981'; // Green
 if (value > 33 && value <= 66) color = '#f59e0b'; // Yellow
 if (value > 66) color = '#ef4444'; // Red

 if (inverse) {
 color = '#10b981'; // Green
 if (value < 66 && value >= 33) color = '#f59e0b'; // Yellow
 if (value < 33) color = '#ef4444'; // Red
 }

 return (
 <div style={{ marginBottom: '16px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.875rem' }}>
 <span style={{ color: '#0f172a', fontWeight: 500 }}>{label}</span>
 <span style={{ fontFamily: 'JetBrains Mono, monospace', color: color, fontWeight: 600 }}>{value}%</span>
 </div>
 <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${value}%`, backgroundColor: color, borderRadius: '4px' }}></div>
 </div>
 </div>
 );
};

export default function ImpactSection({ incidentId }: { incidentId: string }) {
 const impact = impactData[incidentId] || impactData['default'];
 const risk = riskData[incidentId] || riskData['default'];

 if (!impact || !risk) return null;

 return (
 <div style={{ fontFamily: 'Inter, sans-serif' }}>
 {/* Impact Analysis Card */}
 <div style={{
 backgroundColor: '#ffffff',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 color: '#0f172a',
 overflow: 'hidden',
 marginBottom: '24px'
 }}>
 <div style={{
 backgroundColor: '#f8fafc',
 padding: '16px 20px',
 borderBottom: '1px solid #e2e8f0',
 fontWeight: 600,
 fontSize: '1.125rem'
 }}>
 Impact Analysis
 </div>
 <div style={{ padding: '20px' }}>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px',
 marginBottom: '24px'
 }}>
 {/* Box: Customers */}
 <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Affected Customers</div>
 <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{impact.affectedCustomers?.toLocaleString() || 0}</div>
 </div>

 {/* Box: Revenue */}
 <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Revenue Impact</div>
 <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{impact.revenueImpact}</div>
 </div>

 {/* Box: Business Criticality */}
 <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Business Criticality</div>
 <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>{impact.businessCriticality}</div>
 </div>

 {/* Box: Service Health */}
 <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
 <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px', alignSelf: 'flex-start' }}>Service Health</div>
 <svg width="60" height="60" viewBox="0 0 36 36">
 <path
 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
 fill="none"
 stroke="#e2e8f0"
 strokeWidth="3"
 />
 <path
 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
 fill="none"
 stroke={impact.serviceHealth > 80 ? '#10b981' : (impact.serviceHealth > 50 ? '#f59e0b' : '#ef4444')}
 strokeWidth="3"
 strokeDasharray={`${impact.serviceHealth}, 100`}
 />
 <text x="18" y="20.35" fill="#0f172a" fontSize="8" fontWeight="600" textAnchor="middle">{impact.serviceHealth}%</text>
 </svg>
 </div>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
 <div>
 <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>Affected Applications</h4>
 <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.875rem', color: '#0f172a' }}>
 {impact.affectedApplications && impact.affectedApplications.map((app: string) => <li key={app} style={{ marginBottom: '4px' }}>{app}</li>)}
 </ul>
 </div>
 <div>
 <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>Affected APIs</h4>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
 {impact.affectedAPIs && impact.affectedAPIs.map((api: string) => (
 <span key={api} style={{ backgroundColor: '#f1f5f9', color: '#2563eb', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
 {api}
 </span>
 ))}
 </div>
 </div>
 </div>
 <div style={{ marginBottom: '24px' }}>
 <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>Affected Databases</h4>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
 {impact.affectedDatabases && impact.affectedDatabases.map((db: string) => (
 <span key={db} style={{ backgroundColor: '#fffbeb', color: '#d97706', fontSize: '0.875rem', padding: '4px 10px', borderRadius: '16px', border: '1px solid #fde68a' }}>
 ️ {db}
 </span>
 ))}
 </div>
 </div>

 <div>
 <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase' }}>Regional Impact</h4>
 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
 <thead>
 <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
 <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Region</th>
 <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Status</th>
 <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>Users Affected</th>
 </tr>
 </thead>
 <tbody>
 {impact.regionalImpact && impact.regionalImpact.map((reg: any, idx: number) => (
 <tr key={reg.region} style={{ borderBottom: idx < impact.regionalImpact.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
 <td style={{ padding: '12px', fontWeight: 500 }}>{reg.region}</td>
 <td style={{ padding: '12px' }}>
 <span style={{
 backgroundColor: reg.status === 'down' ? '#fee2e2' : (reg.status === 'degraded' ? '#fef3c7' : '#d1fae5'),
 color: reg.status === 'down' ? '#ef4444' : (reg.status === 'degraded' ? '#d97706' : '#10b981'),
 padding: '2px 8px',
 borderRadius: '10px',
 fontSize: '0.75rem',
 fontWeight: 600,
 textTransform: 'uppercase'
 }}>{reg.status}</span>
 </td>
 <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{reg.usersAffected?.toLocaleString()}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* Risk Assessment Card */}
 <div style={{
 backgroundColor: '#ffffff',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 color: '#0f172a',
 overflow: 'hidden'
 }}>
 <div style={{
 backgroundColor: '#f8fafc',
 padding: '16px 20px',
 borderBottom: '1px solid #e2e8f0',
 fontWeight: 600,
 fontSize: '1.125rem'
 }}>
 Risk Assessment
 </div>
 <div style={{ padding: '20px' }}>
 {risk.predictedFailureWindow && (
 <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px', marginBottom: '24px',
 display: 'flex',
 alignItems: 'center',
 gap: '12px',
 color: '#991b1b'
 }}>
 <span style={{ fontSize: '1.5rem' }}>️</span>
 <div>
 <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Predicted Failure Window</div>
 <div style={{ fontSize: '0.875rem' }}>{risk.predictedFailureWindow}</div>
 </div>
 </div>
 )}

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
 <div>
 <RiskGauge label="Incident Risk" value={risk.incidentRisk || 0} />
 <RiskGauge label="Escalation Probability" value={risk.escalationProbability || 0} />
 <RiskGauge label="Business Risk" value={risk.businessRisk || 0} />
 <RiskGauge label="Customer Impact Score" value={risk.customerImpactScore || 0} />
 </div>
 <div>
 <RiskGauge label="Service Availability" value={risk.serviceAvailability || 0} inverse={true} />
 <RiskGauge label="Recovery Probability" value={risk.recoveryProbability || 0} inverse={true} />
 <RiskGauge label="Confidence Score" value={risk.confidence || 0} inverse={true} />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
