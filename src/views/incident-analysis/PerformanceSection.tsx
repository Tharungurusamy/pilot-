import React from 'react';
import { PerformanceInsights, performanceInsights } from './incidentDetailData';

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
  },
  content: {
    padding: '24px',
  },
  mono: {
    fontFamily: "'JetBrains Mono', monospace",
  },
};

function Gauge({ value, label, size = 100, strokeWidth = 10 }: { value: number, label: string, size?: number, strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  let color = '#ef4444'; // red
  if (value > 80) color = '#10b981'; // green
  else if (value > 50) color = '#f59e0b'; // yellow

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            stroke="#f1f5f9" strokeWidth={strokeWidth} fill="transparent" 
          />
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            stroke={color} strokeWidth={strokeWidth} fill="transparent" 
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...STYLES.mono,
          fontSize: size * 0.25,
          fontWeight: 600,
        }}>
          {value}%
        </div>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>{label}</div>
    </div>
  );
}

export default function PerformanceSection({ incidentId }: { incidentId: string }) {
  const data: PerformanceInsights = performanceInsights[incidentId] || {
    mtta: '2m', mttr: '45m', mttd: '1m',
    availability: 99.9, errorBudget: 45, slaCompliance: 98.5,
    sloStatus: [], reliabilityScore: 92, healthScore: 85
  };

  return (
    <div style={STYLES.card}>
      <h2 style={STYLES.header}>Performance Insights</h2>
      <div style={STYLES.content}>
        
        {/* Top Row: MTTA, MTTR, MTTD */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'MTTA', value: data.mtta, desc: 'Mean Time to Acknowledge' },
            { label: 'MTTD', value: data.mttd, desc: 'Mean Time to Detect' },
            { label: 'MTTR', value: data.mttr, desc: 'Mean Time to Resolve' },
          ].map((metric, idx) => (
            <div key={idx} style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>{metric.label}</div>
              <div style={{ ...STYLES.mono, fontSize: '32px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{metric.value}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{metric.desc}</div>
            </div>
          ))}
        </div>

        {/* Middle Row: Availability, Error Budget, SLA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '24px', marginBottom: '32px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#10b981', ...STYLES.mono }}>{data.availability}%</div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>System Availability</div>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              <span>Error Budget Consumed ({data.errorBudget}%)</span>
              <span style={{ color: '#64748b' }}>Remaining: {100 - data.errorBudget}%</span>
            </div>
            <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${data.errorBudget}%`, backgroundColor: data.errorBudget > 80 ? '#ef4444' : '#f59e0b' }} />
              <div style={{ width: `${100 - data.errorBudget}%`, backgroundColor: '#10b981' }} />
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#2563eb', ...STYLES.mono }}>{data.slaCompliance}%</div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>SLA Compliance</div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '32px 0' }} />

        {/* SLO Status Table */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', marginTop: 0 }}>SLO Status</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Target</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Current</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data.sloStatus || []).map((slo, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 500 }}>{slo.name}</td>
                  <td style={{ padding: '12px 8px', ...STYLES.mono, color: '#64748b' }}>{slo.target}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ ...STYLES.mono, width: '45px' }}>{slo.current}</span>
                      <div style={{ flex: 1, maxWidth: '100px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
                        <div style={{ width: '100%', height: '100%', backgroundColor: slo.status === 'breached' ? '#ef4444' : slo.status === 'at-risk' ? '#f59e0b' : '#10b981', borderRadius: '3px' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{
                      backgroundColor: slo.status === 'met' ? '#10b98120' : slo.status === 'at-risk' ? '#f59e0b20' : '#ef444420',
                      color: slo.status === 'met' ? '#10b981' : slo.status === 'at-risk' ? '#f59e0b' : '#ef4444',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>{slo.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Row: Scores */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '64px' }}>
          <Gauge value={data.reliabilityScore} label="Reliability Score" size={120} strokeWidth={12} />
          <Gauge value={data.healthScore} label="Health Score" size={120} strokeWidth={12} />
        </div>

      </div>
    </div>
  );
}
