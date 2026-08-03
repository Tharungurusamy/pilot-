import React, { useState } from 'react';
import { dependencyMap } from './incidentDetailData';
import type { ServiceNode, ServiceEdge } from './incidentDetailData';

const typeIcons: Record<string, string> = {
 database: '️',
 cache: '',
 queue: '',
 gateway: '',
 service: '️'
};

const statusColors: Record<string, string> = {
 healthy: '#10b981',
 warning: '#f59e0b',
 degraded: '#f59e0b',
 critical: '#ef4444'
};

const statusBgColors: Record<string, string> = {
 healthy: '#ffffff',
 warning: '#fffbeb',
 degraded: '#fffbeb',
 critical: '#fef2f2'
};

export default function DependencyMapSection({ incidentId }: { incidentId: string }) {
 const data = dependencyMap[incidentId] || dependencyMap['default'];
 const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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
 Service Dependency Map
 </div>
 <div style={{ padding: '20px', position: 'relative' }}>
 <svg viewBox="0 0 800 400" style={{ width: '100%', height: 'auto', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
 {/* Edges */}
 {data.edges && data.edges.map((edge: ServiceEdge, idx: number) => {
 const sourceNode = data.nodes.find((n: ServiceNode) => n.id === edge.from);
 const targetNode = data.nodes.find((n: ServiceNode) => n.id === edge.to);
 if (!sourceNode || !targetNode) return null;

 const isHighlighted = hoveredNode === sourceNode.id || hoveredNode === targetNode.id;
 const strokeColor = isHighlighted ? statusColors[edge.status] : (edge.status === 'healthy' ? '#e2e8f0' : statusColors[edge.status]);
 const isDashed = edge.status === 'critical' || edge.status === 'degraded' || edge.status === 'warning';

 const midX = (sourceNode.x + targetNode.x) / 2;
 const midY = (sourceNode.y + targetNode.y) / 2;

 return (
 <g key={`edge-${idx}`}>
 <line
 x1={sourceNode.x}
 y1={sourceNode.y}
 x2={targetNode.x}
 y2={targetNode.y}
 stroke={strokeColor}
 strokeWidth={isHighlighted ? 3 : 2}
 strokeDasharray={isDashed ? '5,5' : 'none'}
 opacity={hoveredNode && !isHighlighted ? 0.3 : 1}
 />
 <rect x={midX - 20} y={midY - 10} width="40" height="20" fill="white" rx="4" stroke="#e2e8f0" opacity={hoveredNode && !isHighlighted ? 0.3 : 1} />
 <text x={midX} y={midY + 4} fontSize="10" textAnchor="middle" fill="#64748b" opacity={hoveredNode && !isHighlighted ? 0.3 : 1}>
 {edge.latency}
 </text>
 </g>
 );
 })}

 {/* Nodes */}
 {data.nodes && data.nodes.map((node: ServiceNode) => {
 const isHovered = hoveredNode === node.id;
 const nodeColor = statusColors[node.status] || '#e2e8f0';
 const bgColor = statusBgColors[node.status] || '#ffffff';

 return (
 <g key={node.id} transform={`translate(${node.x - 60}, ${node.y - 25})`}
 onMouseEnter={() => setHoveredNode(node.id)}
 onMouseLeave={() => setHoveredNode(null)}
 style={{ cursor: 'pointer' }}
 opacity={hoveredNode && !isHovered ? 0.5 : 1}
 >
 <rect
 width="120"
 height="50"
 rx="6"
 fill={bgColor}
 stroke="#e2e8f0"
 strokeWidth="1"
 filter="drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))"
 />
 <rect width="4" height="50" rx="2" fill={nodeColor} />
 <text x="12" y="30" fontSize="16">{typeIcons[node.type] || '️'}</text>
 <text x="36" y="22" fontSize="12" fontWeight="600" fill="#0f172a">{node.label}</text>
 <text x="36" y="38" fontSize="10" fill="#64748b" style={{ textTransform: 'uppercase' }}>{node.status}</text>
 </g>
 );
 })}
 </svg>

 {hoveredNode && (
 <div style={{
 position: 'absolute',
 top: '20px',
 right: '20px',
 backgroundColor: 'white',
 padding: '16px',
 borderRadius: '8px',
 boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
 border: '1px solid #e2e8f0',
 width: '250px',
 pointerEvents: 'none'
 }}>
 {(() => {
 const node = data.nodes.find((n: ServiceNode) => n.id === hoveredNode);
 if (!node) return null;
 return (
 <>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
 <span>{typeIcons[node.type]}</span>
 <span style={{ fontWeight: 600 }}>{node.label}</span>
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 <span style={{ color: '#64748b' }}>Status:</span>
 <span style={{ color: statusColors[node.status], fontWeight: 500, textTransform: 'capitalize' }}>{node.status}</span>
 </div>
 </div>
 </>
 );
 })()}
 </div>
 )}

 <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center', fontSize: '0.75rem', color: '#64748b' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColors.healthy }}></div> Healthy
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColors.warning }}></div> Warning
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColors.degraded }}></div> Degraded
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColors.critical }}></div> Critical
 </div>
 </div>
 </div>
 </div>
 );
}
