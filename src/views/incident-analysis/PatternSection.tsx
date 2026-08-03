import React from 'react';
import { patternData, similarIncidents } from './incidentDetailData';
import type { PatternData, SimilarIncident } from './incidentDetailData';

interface PatternSectionProps {
  incidentId: string;
}

export default function PatternSection({ incidentId }: PatternSectionProps) {
  const pattern = patternData[incidentId];
  const simIncidents = similarIncidents[incidentId] || [];

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 1: return '#bfdbfe';
      case 2: return '#60a5fa';
      case 3: return '#2563eb';
      case 4: return '#1d4ed8';
      default: return 'transparent';
    }
  };

  const getSimilarityColor = (sim: number) => {
    if (sim > 90) return '#10b981';
    if (sim > 80) return '#f59e0b';
    return '#2563eb';
  };

  if (!pattern) return null;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Pattern Analysis Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', color: '#0f172a' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{pattern.name || 'Pattern Analysis'}</h2>
          <span style={{ backgroundColor: '#ef4444', color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 500 }}>
            {pattern.patternSeverity || 'High'}
          </span>
        </div>
        
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Frequency</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{pattern.frequency}</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Similar Incidents</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{pattern.similarIncidents}</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Historical Occurrences</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{pattern.historicalOccurrences}</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Trend Direction</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>
                {pattern.trendDirection === 'up' ? '↑' : pattern.trendDirection === 'down' ? '↓' : '→'}
              </div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Confidence</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pattern.confidence}%`, height: '100%', backgroundColor: '#2563eb' }}></div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{pattern.confidence}%</span>
              </div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>AI Cluster</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{pattern.aiCluster}</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Pattern Type</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{pattern.patternType}</div>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Pattern Severity</div>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>{pattern.patternSeverity}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Pattern Evolution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pattern.evolution?.map((step: any, index: number) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#7c3aed', zIndex: 1, marginTop: '4px', flexShrink: 0 }}></div>
                    {index < (pattern.evolution?.length || 0) - 1 && (
                      <div style={{ position: 'absolute', left: '5px', top: '16px', bottom: '-16px', width: '2px', backgroundColor: '#e2e8f0' }}></div>
                    )}
                    <div style={{ marginLeft: '16px', fontSize: '13px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>{step.time}</div>
                      <div style={{ color: '#64748b', lineHeight: '1.4' }}>{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Pattern Heatmap</h3>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(pattern.heatmapData || Array(4).fill(Array(7).fill(0))).map((row: number[], weekIdx: number) => (
                    <div key={weekIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                      {row.map((val: number, colIndex: number) => (
                        <div key={colIndex} style={{ aspectRatio: '1', backgroundColor: getIntensityColor(val), border: val === 0 ? '1px solid #e2e8f0' : 'none', borderRadius: '4px' }}></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Incidents Table Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', color: '#0f172a' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Similar Incidents</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#64748b' }}>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Incident ID</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Similarity</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Root Cause</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Resolution</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Engineer</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Res. Time</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '12px 20px', fontWeight: 500 }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {[...simIncidents].sort((a, b) => b.similarity - a.similarity).map((incident: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'default' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td style={{ padding: '16px 20px', fontFamily: 'JetBrains Mono, monospace', color: '#2563eb', fontWeight: 500 }}>
                    {incident.id}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '64px', backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${incident.similarity}%`, height: '100%', backgroundColor: getSimilarityColor(incident.similarity) }}></div>
                      </div>
                      <span style={{ fontWeight: 500, width: '32px' }}>{incident.similarity}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>{incident.rootCause}</td>
                  <td style={{ padding: '16px 20px' }}>{incident.resolution}</td>
                  <td style={{ padding: '16px 20px' }}>{incident.engineer}</td>
                  <td style={{ padding: '16px 20px' }}>{incident.resolutionTime}</td>
                  <td style={{ padding: '16px 20px', color: '#64748b' }}>{incident.date}</td>
                  <td style={{ padding: '16px 20px' }}>{incident.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
