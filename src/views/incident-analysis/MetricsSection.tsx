import React, { useState } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricPoint, MetricsData, metricsData } from './incidentDetailData';

export default function MetricsSection({ incidentId }: { incidentId: string }) {
  const [activeTab, setActiveTab] = useState<'System' | 'Network' | 'Application' | 'Database'>('System');

  const tabs = ['System', 'Network', 'Application', 'Database'] as const;

  const renderChart = (title: string, data: any[], dataKey: string, type: 'area' | 'line' | 'bar', color: string, description: string, currentValue: string) => {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{title}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>{description}</p>
          </div>
          <span style={{ 
            backgroundColor: color + '15', 
            color: color, 
            padding: '4px 8px', 
            borderRadius: '6px', 
            fontWeight: 600, 
            fontSize: '14px' 
          }}>
            {currentValue}
          </span>
        </div>
        
        <div style={{ height: '180px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                  itemStyle={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill={`url(#grad-${dataKey})`} strokeWidth={2} />
              </AreaChart>
            ) : type === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                  itemStyle={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}
                />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                  itemStyle={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}
                />
                <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const incidentMetrics = metricsData[incidentId] || ({} as MetricsData);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontFamily: "'Inter', system-ui, sans-serif",
      color: '#0f172a',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '16px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Metrics Analysis</h2>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === tab ? '#2563eb' : '#ffffff',
                color: activeTab === tab ? '#ffffff' : '#64748b',
                border: `1px solid ${activeTab === tab ? '#2563eb' : '#e2e8f0'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        backgroundColor: '#f8fafc'
      }}>
        {activeTab === 'System' && (
          <>
            {renderChart('CPU Usage', incidentMetrics.cpu || [], 'value', 'area', '#2563eb', 'Average CPU utilization across pods', '92%')}
            {renderChart('Memory Usage', incidentMetrics.memory || [], 'value', 'area', '#7c3aed', 'Heap and non-heap memory', '8.4 GB')}
            {renderChart('Disk I/O', incidentMetrics.disk || [], 'value', 'area', '#64748b', 'Read and write operations', '142 MB/s')}
          </>
        )}
        {activeTab === 'Network' && (
          <>
            {renderChart('Network Traffic', incidentMetrics.network || [], 'value', 'area', '#0ea5e9', 'Inbound and outbound bandwidth', '1.2 GB/s')}
            {renderChart('Response Time', incidentMetrics.responseTime || [], 'value', 'line', '#ef4444', 'Average latency per request', '1240 ms')}
            {renderChart('Latency P99', incidentMetrics.latencyP99 || [], 'value', 'line', '#f59e0b', '99th percentile response time', '4500 ms')}
          </>
        )}
        {activeTab === 'Application' && (
          <>
            {renderChart('Throughput', incidentMetrics.throughput || [], 'value', 'bar', '#10b981', 'Requests processed per second', '4,200 RPS')}
            {renderChart('Error Rate', incidentMetrics.errorRate || [], 'value', 'line', '#ef4444', 'Percentage of failed requests', '12.4%')}
            {renderChart('Request Count', incidentMetrics.requestCount || [], 'value', 'bar', '#3b82f6', 'Total HTTP requests', '142,000')}
          </>
        )}
        {activeTab === 'Database' && (
          <>
            {renderChart('DB Connections', incidentMetrics.dbConnections || [], 'value', 'line', '#7c3aed', 'Active database connections', '940')}
            {renderChart('Queue Length', incidentMetrics.queueLength || [], 'value', 'line', '#ef4444', 'Pending database queries', '450')}
            {renderChart('Thread Count', incidentMetrics.threadCount || [], 'value', 'area', '#2563eb', 'Active threads in pool', '120')}
            {renderChart('Cache Hit Ratio', incidentMetrics.cacheHitRatio || [], 'value', 'area', '#10b981', 'Redis cache hit percentage', '68%')}
          </>
        )}
      </div>
    </div>
  );
}
