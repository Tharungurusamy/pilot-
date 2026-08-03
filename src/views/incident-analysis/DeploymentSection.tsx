import React from 'react';
import { deploymentData } from './incidentDetailData';
import type { DeploymentData } from './incidentDetailData';

export default function DeploymentSection({ incidentId }: { incidentId: string }) {
  const data = deploymentData[incidentId] || deploymentData['default'];

  if (!data) return null;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontFamily: 'Inter, sans-serif',
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
        Deployment Analysis
      </div>
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                backgroundColor: '#f1f5f9',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                color: '#64748b'
              }}>v{data.previousVersion} → v{data.version}</span>
              
              <span style={{
                backgroundColor: data.deploymentStatus === 'completed' ? '#d1fae5' : '#fee2e2',
                color: data.deploymentStatus === 'completed' ? '#10b981' : '#ef4444',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>{data.deploymentStatus}</span>
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Deployed by <span style={{ color: '#0f172a', fontWeight: 500 }}>{data.engineer}</span> on {data.deploymentTime} ({data.deploymentDuration})
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>
              Pipeline: <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0f172a' }}>{data.pipeline}</span> | Build: <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0f172a' }}>{data.buildNumber}</span>
            </div>
          </div>
          
          {data.rollbackAvailable && (
            <button style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <polyline points="7 23 3 19 7 15"></polyline>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>
              Rollback Available
            </button>
          )}
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commits ({data.commits?.length || 0})</h4>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            {data.commits && data.commits.map((commit: any, idx: number) => (
              <div key={commit.hash} style={{ 
                padding: '12px 16px', 
                borderBottom: idx < data.commits.length - 1 ? '1px solid #e2e8f0' : 'none',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontFamily: 'JetBrains Mono, monospace', 
                  color: '#2563eb', 
                  fontSize: '0.875rem' 
                }}>{commit.hash.substring(0, 7)}</span>
                <span style={{ flex: 1, fontSize: '0.875rem' }}>{commit.message}</span>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{commit.author}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pull Requests ({data.pullRequests?.length || 0})</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {data.pullRequests && data.pullRequests.map((pr: any) => (
              <div key={pr.id} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                backgroundColor: '#f8fafc'
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2563eb', fontSize: '0.875rem' }}>{pr.id}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{pr.title}</span>
                <span style={{
                  backgroundColor: pr.status === 'merged' ? '#ede9fe' : '#f1f5f9',
                  color: pr.status === 'merged' ? '#7c3aed' : '#64748b',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 500
                }}>{pr.status}</span>
              </div>
            ))}
          </div>
        </div>

        {data.configChanges && data.configChanges.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Configuration Changes</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Key</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>Old Value</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b' }}>New Value</th>
                </tr>
              </thead>
              <tbody>
                {data.configChanges.map((change: any, idx: number) => (
                  <tr key={change.key} style={{ borderBottom: idx < data.configChanges.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                    <td style={{ padding: '12px', fontFamily: 'JetBrains Mono, monospace', color: '#0f172a' }}>{change.key}</td>
                    <td style={{ padding: '12px', color: '#ef4444', textDecoration: 'line-through', fontFamily: 'JetBrains Mono, monospace' }}>{change.oldValue}</td>
                    <td style={{ padding: '12px', color: '#10b981', fontFamily: 'JetBrains Mono, monospace' }}>{change.newValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
