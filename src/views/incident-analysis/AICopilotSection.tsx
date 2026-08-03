import React, { useState, useEffect } from 'react';
import { copilotCapabilities } from './incidentDetailData';

const STYLES = {
 card: {
 backgroundColor: '#ffffff',
 border: '1px solid #e2e8f0',
 borderLeft: '4px solid #7c3aed',
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
 display: 'flex',
 alignItems: 'center',
 gap: '8px',
 },
 content: {
 padding: '20px',
 },
};

type Message = {
 role: 'user' | 'ai';
 content: string;
};

export default function AICopilotSection({ incidentId }: { incidentId: string }) {
 const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
 const [inputText, setInputText] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 const [chatMessages, setChatMessages] = useState<Message[]>([
 { role: 'user', content: 'Explain the root cause' },
 { role: 'ai', content: 'Based on the logs, the root cause appears to be a sudden spike in database connections exceeding the maximum pool size (5000), which led to a connection timeout for incoming API requests.' }
 ]);

 const capabilities = copilotCapabilities || [
 { id: '1', icon: '', label: 'Analyze Logs', description: 'Find anomalies in recent logs' },
 { id: '2', icon: '', label: 'Draft RCA', description: 'Generate a preliminary RCA report' },
 { id: '3', icon: '️', label: 'Security Check', description: 'Scan for potential security breaches' },
 ];

 const handleSend = () => {
 if (!inputText.trim()) return;
 const userMsg = inputText;
 setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
 setInputText('');
 setIsTyping(true);
 setTimeout(() => {
 setIsTyping(false);
 setChatMessages(prev => [...prev, { role: 'ai', content: 'I have analyzed the request. Based on current data, this seems to be an anomaly in the load balancer configuration.' }]);
 }, 1500);
 };

 return (
 <div style={STYLES.card}>
 <h2 style={STYLES.header}> AI Copilot</h2>
 <div style={STYLES.content}>
 {/* Capabilities Grid */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
 {capabilities.map((cap: any) => (
 <button
 key={cap.id}
 onClick={() => setSelectedCapability(cap.id)}
 style={{
 backgroundColor: '#ffffff',
 border: '1px solid',
 borderColor: selectedCapability === cap.id ? '#7c3aed' : '#e2e8f0',
 borderRadius: '10px',
 padding: '16px',
 textAlign: 'left',
 cursor: 'pointer',
 transition: 'all 0.2s',
 boxShadow: selectedCapability === cap.id ? '0 4px 6px -1px rgba(124, 58, 237, 0.1)' : 'none',
 }}
 onMouseEnter={(e) => { if(selectedCapability !== cap.id) e.currentTarget.style.backgroundColor = '#f8fafc' }}
 onMouseLeave={(e) => { if(selectedCapability !== cap.id) e.currentTarget.style.backgroundColor = '#ffffff' }}
 >
 <div style={{ fontSize: '24px', marginBottom: '8px' }}>{cap.icon}</div>
 <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{cap.label}</div>
 <div style={{ fontSize: '12px', color: '#64748b' }}>{cap.description}</div>
 </button>
 ))}
 </div>

 {/* Chat Interface */}
 <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
 <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '200px', maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
 {chatMessages.map((msg, idx) => (
 <div key={idx} style={{
 alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
 maxWidth: '80%',
 }}>
 <div style={{
 backgroundColor: msg.role === 'user' ? '#2563eb' : '#ffffff',
 color: msg.role === 'user' ? '#ffffff' : '#0f172a',
 padding: '12px 16px',
 borderRadius: '12px',
 border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none',
 borderLeft: msg.role === 'ai' ? '4px solid #7c3aed' : 'none',
 fontSize: '14px',
 lineHeight: 1.5,
 boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
 }}>
 {msg.content}
 </div>
 </div>
 ))}
 {isTyping && (
 <div style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #7c3aed' }}>
 <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '20px' }}>
 <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
 <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.2s' }} />
 <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.4s' }} />
 </div>
 </div>
 )}
 <style>
 {`
 @keyframes pulse {
 0%, 100% { opacity: 0.4; transform: scale(0.8); }
 50% { opacity: 1; transform: scale(1.2); }
 }
 `}
 </style>
 </div>
 <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', display: 'flex', gap: '12px' }}>
 <input type="text" value={inputText}
 onChange={(e) => setInputText(e.target.value)}
 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
 placeholder="Ask AI anything about this incident..." style={{
 flex: 1,
 padding: '12px 16px',
 borderRadius: '8px',
 border: '1px solid #cbd5e1',
 outline: 'none',
 fontSize: '14px',
 fontFamily: 'inherit',
 }}
 />
 <button onClick={handleSend}
 style={{
 backgroundColor: '#7c3aed',
 color: '#ffffff',
 border: 'none',
 borderRadius: '8px',
 padding: '0 20px',
 fontWeight: 500,
 cursor: 'pointer',
 }}
 >
 Send
 </button>
 </div>
 </div>

 </div>
 </div>
 );
}
