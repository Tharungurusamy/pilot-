import React from 'react';
import { rootCauseData } from './incidentDetailData';
import type { RootCauseData } from './incidentDetailData';

interface RootCauseSectionProps {
 incidentId: string;
}

export default function RootCauseSection({ incidentId }: RootCauseSectionProps) {
 const data = rootCauseData[incidentId];
 if (!data) return null;

 const confidenceColor = data.confidencePercent > 90 ? '#10b981' : data.confidencePercent > 70 ? '#f59e0b' : '#ef4444';

 return (
 <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', color: '#0f172a' }}>
 <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Root Cause Analysis</h2>
 <span style={{ backgroundColor: confidenceColor, color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 }}>
 {data.confidencePercent}% Confidence
 </span>
 </div>
 <div style={{ padding: '20px' }}>
 <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '8px', marginBottom: '24px', borderLeft: '4px solid #ef4444' }}>
 <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#ef4444', fontWeight: 600 }}>AI Root Cause</h3>
 <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{data.aiRootCause}</p>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Trigger Event</h3>
 <p style={{ margin: 0, fontSize: '14px' }}>{data.triggerEvent}</p>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Dependency Chain</h3>
 <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
 {data.dependencyChain?.map((service: string, index: number) => (
 <React.Fragment key={index}>
 <span style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '16px', fontSize: '13px' }}>
 {service}
 </span>
 {index < (data.dependencyChain?.length || 0) - 1 && <span style={{ color: '#94a3b8' }}>→</span>}
 </React.Fragment>
 ))}
 </div>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Affected Components</h3>
 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
 {data.affectedComponents?.map((comp: string, index: number) => (
 <span key={index} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
 {comp}
 <span style={{ fontSize: '8px', color: '#ef4444' }}>●</span>
 </span>
 ))}
 </div>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Fault Propagation</h3>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 {data.faultPropagation?.map((step: string, index: number) => (
 <div key={index} style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
 <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', zIndex: 1, flexShrink: 0 }}>
 {index + 1}
 </div>
 {index < (data.faultPropagation?.length || 0) - 1 && (
 <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-16px', width: '2px', backgroundColor: '#e2e8f0' }}></div>
 )}
 <div style={{ marginLeft: '12px', fontSize: '14px', paddingTop: '2px' }}>
 {step}
 </div>
 </div>
 ))}
 </div>
 </div>

 <div style={{ marginBottom: '24px' }}>
 <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Contributing Factors</h3>
 <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
 {data.contributingFactors?.map((factor: string, index: number) => (
 <li key={index} style={{ listStyleType: 'none', position: 'relative' }}>
 <span style={{ color: '#f59e0b', position: 'absolute', left: '-20px' }}>️</span> {factor}
 </li>
 ))}
 </ul>
 </div>

 <div>
 <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Correlations</h3>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
 {Object.entries(data.correlations || {}).map(([key, text], index) => {
 const corrMeta: Record<string, { icon: string; color: string; label: string }> = {
 timeline: { icon: '', color: '#2563eb', label: 'Timeline' },
 infrastructure: { icon: '️', color: '#7c3aed', label: 'Infrastructure' },
 deployment: { icon: '', color: '#f59e0b', label: 'Deployment' },
 metric: { icon: '', color: '#10b981', label: 'Metric' },
 log: { icon: '', color: '#ef4444', label: 'Log' },
 trace: { icon: '', color: '#0ea5e9', label: 'Trace' },
 network: { icon: '', color: '#64748b', label: 'Network' },
 };
 const meta = corrMeta[key] || { icon: '', color: '#2563eb', label: key };
 return (
 <div key={index} style={{ border: '1px solid #e2e8f0', borderLeft: `4px solid ${meta.color}`, borderRadius: '6px', padding: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
 <span style={{ fontSize: '16px' }}>{meta.icon}</span>
 <div>
 <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{meta.label}</div>
 <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>{text}</div>
 </div>
 </div>
 );
 })}
 </div>
 </div>

 </div>
 </div>
 );
}
