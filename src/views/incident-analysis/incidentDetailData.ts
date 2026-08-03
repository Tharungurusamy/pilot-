// ── Enterprise Incident Detail Mock Data ─────────────────────────────────────
// All data for the 19-section enterprise incident analysis drill-down view.

// ── §1 Incident Summary ────────────────────────────────────────────────────────
export interface IncidentDetail {
 id: string
 title: string
 priority: string
 severity: string
 status: string
 category: string
 serviceName: string
 applicationName: string
 environment: string
 region: string
 cluster: string
 namespace: string
 hostName: string
 containerName: string
 deploymentVersion: string
 assignedEngineer: string
 team: string
 slaTimer: string
 slaPercent: number
 businessImpact: string
 customerImpact: string
 detectionTime: string
 resolutionETA: string
 mtta: string
 mttr: string
}

const _incidentDetails: Record<string, IncidentDetail> = {
 'INC-4821': {
 id: 'INC-4821', title: 'Pharmacy DB Connection Pool Exhaustion — Critical Service Degradation',
 priority: 'P1', severity: 'critical', status: 'in-progress', category: 'Database',
 serviceName: 'pharmacy-service', applicationName: 'MediWatch Pharmacy Portal',
 environment: 'Production', region: 'us-east-1', cluster: 'prod-cluster-01',
 namespace: 'pharmacy-ns', hostName: 'ip-10-0-1-42.ec2.internal',
 containerName: 'pharmacy-api-7b4d6f8c9-xk2mv', deploymentVersion: 'v2.14.3',
 assignedEngineer: 'Sarah K.', team: 'Platform Reliability',
 slaTimer: '00:42:18', slaPercent: 35,
 businessImpact: 'High — Prescription processing halted across 3 facilities',
 customerImpact: '~2,400 patients affected — prescription delays reported',
 detectionTime: '2024-01-15 14:32:07 UTC', resolutionETA: '~25 minutes',
 mtta: '1m 12s', mttr: '18m 34s',
 },
 'INC-4820': {
 id: 'INC-4820', title: 'LIS Lab API Retry Storm — External Endpoint 504 Errors',
 priority: 'P2', severity: 'high', status: 'assigned', category: 'API / Integration',
 serviceName: 'lis-lab-service', applicationName: 'MediWatch Lab Integration',
 environment: 'Production', region: 'us-east-1', cluster: 'prod-cluster-02',
 namespace: 'lab-ns', hostName: 'ip-10-0-2-18.ec2.internal',
 containerName: 'lis-api-5a3c7d9e1-qr8nw', deploymentVersion: 'v3.8.1',
 assignedEngineer: 'Mike T.', team: 'Integration Engineering',
 slaTimer: '01:15:42', slaPercent: 62,
 businessImpact: 'Medium — Lab result delivery delayed for 2 departments',
 customerImpact: '~840 patients — lab results pending',
 detectionTime: '2024-01-15 14:20:45 UTC', resolutionETA: '~40 minutes',
 mtta: '2m 05s', mttr: '32m 10s',
 },
}

// ── §2 AI Incident Summary ──────────────────────────────────────────────────────
export interface AIIncidentSummary {
 executiveSummary: string
 businessImpact: string
 technicalSummary: string
 probableRootCause: string
 systemsAffected: string[]
 usersImpacted: number
 confidenceScore: number
 aiRiskScore: number
 resolutionComplexity: string
 estimatedDowntime: string
 predictedNextFailure: string
 similarHistoricalIncidents: number
 recommendedActions: string[]
}

const _aiSummaries: Record<string, AIIncidentSummary> = {
 'INC-4821': {
 executiveSummary: 'The Pharmacy database connection pool has been exhausted due to a sudden spike in concurrent prescription queries following a batch processing job. The connection pool limit of 50 was reached at 14:32 UTC, causing cascading timeouts across the pharmacy service cluster. AI analysis indicates this is a recurring pattern (12 historical matches) typically triggered by end-of-day batch reconciliation combined with peak clinical hours.',
 businessImpact: 'Prescription processing is halted across Memorial Hospital, City Medical Center, and Westside Clinic. Approximately 2,400 patients are experiencing delays in prescription fulfillment. Revenue impact estimated at $18,400/hour.',
 technicalSummary: 'Connection pool (HikariCP) reached max_pool_size=50 at 14:32:07. Active connections: 50/50, pending queue: 127. P99 latency spiked from 45ms to 12,400ms. Error rate increased from 0.02% to 34.7%. Database CPU at 94%, memory at 87%.',
 probableRootCause: 'Connection pool exhaustion triggered by concurrent batch reconciliation job (cron: 14:30 UTC) overlapping with peak prescription processing window (14:00-15:00 UTC). Contributing factor: connection leak in pharmacy-batch-processor v2.14.3 — connections not released on timeout exceptions.',
 systemsAffected: ['pharmacy-service', 'pharmacy-batch-processor', 'prescription-api', 'pharmacy-db-primary', 'pharmacy-db-replica-1', 'notification-service'],
 usersImpacted: 2400,
 confidenceScore: 94,
 aiRiskScore: 87,
 resolutionComplexity: 'Medium',
 estimatedDowntime: '25 minutes',
 predictedNextFailure: 'Tomorrow 14:30 UTC if batch schedule unchanged',
 similarHistoricalIncidents: 12,
 recommendedActions: [
 'Increase connection pool max_size from 50 to 100',
 'Reschedule batch reconciliation to off-peak hours (02:00 UTC)',
 'Patch connection leak in pharmacy-batch-processor v2.14.4',
 'Add connection pool exhaustion alert at 80% threshold',
 'Enable connection pool metrics in Prometheus',
 ],
 },
}

// ── §3 Incident Timeline ────────────────────────────────────────────────────────
export interface TimelineEvent {
 id: string
 timestamp: string
 eventType: string
 service: string
 source: string
 user: string
 severity: string
 description: string
 icon: string
}

const _timelineEvents: Record<string, TimelineEvent[]> = {
 'INC-4821': [
 { id: 'evt-1', timestamp: '14:30:00', eventType: 'Deployment Started', service: 'pharmacy-batch-processor', source: 'CI/CD Pipeline', user: 'jenkins-bot', severity: 'info', description: 'Batch reconciliation cron job initiated', icon: '' },
 { id: 'evt-2', timestamp: '14:31:15', eventType: 'Metric Spike', service: 'pharmacy-db-primary', source: 'Prometheus', user: 'system', severity: 'warning', description: 'DB active connections jumped from 22 to 48 within 60s', icon: '' },
 { id: 'evt-3', timestamp: '14:31:45', eventType: 'Configuration Change', service: 'pharmacy-service', source: 'ConfigMap', user: 'system', severity: 'info', description: 'Auto-scaling triggered — pod count increased from 3 to 5', icon: '️' },
 { id: 'evt-4', timestamp: '14:32:01', eventType: 'First Error', service: 'pharmacy-service', source: 'Application Log', user: 'system', severity: 'high', description: 'HikariPool-1 — Connection is not available, request timed out after 30000ms', icon: '' },
 { id: 'evt-5', timestamp: '14:32:07', eventType: 'Alert Triggered', service: 'pharmacy-service', source: 'PagerDuty', user: 'system', severity: 'critical', description: 'CRITICAL: Pharmacy service error rate > 30% — P1 alert fired', icon: '' },
 { id: 'evt-6', timestamp: '14:32:15', eventType: 'Infrastructure Event', service: 'pharmacy-db-primary', source: 'CloudWatch', user: 'system', severity: 'high', description: 'RDS CPU utilization exceeded 90% threshold', icon: '️' },
 { id: 'evt-7', timestamp: '14:33:22', eventType: 'Network Issue', service: 'pharmacy-service', source: 'Istio', user: 'system', severity: 'medium', description: 'Connection reset by peer — downstream timeout cascade detected', icon: '' },
 { id: 'evt-8', timestamp: '14:35:10', eventType: 'Recovery Started', service: 'pharmacy-service', source: 'MediWatch AI', user: 'Sarah K.', severity: 'info', description: 'Engineer acknowledged — initiating connection pool increase', icon: '' },
 { id: 'evt-9', timestamp: '14:42:30', eventType: 'Deployment Completed', service: 'pharmacy-service', source: 'ArgoCD', user: 'Sarah K.', severity: 'info', description: 'Hotfix deployed — pool_size increased to 100, batch rescheduled', icon: '' },
 { id: 'evt-10', timestamp: '14:48:00', eventType: 'Recovery Completed', service: 'pharmacy-service', source: 'MediWatch AI', user: 'system', severity: 'info', description: 'Error rate returned to baseline (0.03%), all connections healthy', icon: '' },
 { id: 'evt-11', timestamp: '14:52:00', eventType: 'Incident Closed', service: 'pharmacy-service', source: 'ServiceNow', user: 'Sarah K.', severity: 'info', description: 'Incident closed — postmortem scheduled for 2024-01-16', icon: '' },
 ],
}

// ── §4 Root Cause Analysis ──────────────────────────────────────────────────────
export interface RootCauseData {
 aiRootCause: string
 confidencePercent: number
 dependencyChain: string[]
 affectedComponents: string[]
 faultPropagation: string[]
 contributingFactors: string[]
 triggerEvent: string
 correlations: {
 timeline: string
 infrastructure: string
 deployment: string
 metric: string
 log: string
 trace: string
 network: string
 }
}

const _rootCauseData: Record<string, RootCauseData> = {
 'INC-4821': {
 aiRootCause: 'Connection pool exhaustion caused by concurrent batch reconciliation job overlapping with peak prescription processing. Connection leak in pharmacy-batch-processor v2.14.3 exacerbated the issue — connections not released on timeout exceptions in the BatchReconciliationService.processQueue() method.',
 confidencePercent: 94,
 dependencyChain: ['pharmacy-batch-processor', 'pharmacy-service', 'pharmacy-db-primary', 'prescription-api', 'notification-service'],
 affectedComponents: ['HikariCP Connection Pool', 'PostgreSQL Primary (pharmacy-db)', 'Pharmacy REST API', 'Prescription Processing Queue', 'Notification Dispatch'],
 faultPropagation: [
 'Batch job acquired 28 connections simultaneously',
 'Connection pool reached 50/50 capacity',
 'New requests queued (timeout: 30s)',
 'Cascading timeouts across pharmacy API endpoints',
 'Prescription processing halted',
 'Notification service backlog accumulated',
 ],
 contributingFactors: [
 'Batch job scheduled during peak hours (14:30 UTC)',
 'Connection leak in BatchReconciliationService (v2.14.3)',
 'No connection pool exhaustion alerting configured',
 'Pool size not scaled with increased traffic',
 'Missing circuit breaker on batch→DB path',
 ],
 triggerEvent: 'Batch reconciliation cron job started at 14:30:00 UTC',
 correlations: {
 timeline: 'Batch job start (14:30) → Connection spike (14:31) → Pool exhaustion (14:32) — 2-minute propagation window',
 infrastructure: 'RDS CPU 94%, Memory 87%, IOPS 4,200 (normal: 1,800) — database under heavy load from batch queries',
 deployment: 'pharmacy-batch-processor v2.14.3 deployed 3 days ago — connection leak introduced in commit a8f3c2d',
 metric: 'P99 latency spike from 45ms to 12,400ms correlates exactly with pool exhaustion timestamp',
 log: '847 ERROR entries in 3-minute window: "HikariPool-1 — Connection is not available" across 5 pod instances',
 trace: 'Trace ID abc-123-def shows 28 parallel DB calls from single batch invocation — no connection release on exception path',
 network: 'TCP RST packets increased 340% — downstream services timing out on pharmacy API',
 },
 },
}

// ── §5 Pattern Analysis ─────────────────────────────────────────────────────────
export interface PatternData {
 name: string
 frequency: string
 similarIncidents: number
 historicalOccurrences: number
 trendDirection: string
 confidence: number
 aiCluster: string
 patternType: string
 patternSeverity: string
 evolution: string[]
 heatmapData: number[][]
}

const _patternData: Record<string, PatternData> = {
 'INC-4821': {
 name: 'DB Timeout Loop',
 frequency: '~2.3x per week',
 similarIncidents: 12,
 historicalOccurrences: 47,
 trendDirection: 'increasing',
 confidence: 94,
 aiCluster: 'database-exhaustion-cluster-A',
 patternType: 'Resource Exhaustion',
 patternSeverity: 'critical',
 evolution: [
 'Q3 2023: First occurrence — manual detection (45m MTTR)',
 'Q4 2023: Frequency increased to weekly — AI pattern detected',
 'Jan 2024: Frequency 2.3x/week — automated correlation enabled',
 'Current: Escalating — pool size insufficient for traffic growth',
 ],
 heatmapData: [
 [0,0,1,2,1,0,0], // Sun-Sat week 1
 [0,1,0,3,2,0,0],
 [1,0,2,1,0,1,0],
 [0,2,1,4,2,0,0], // current week
 ],
 },
}

// ── §6 Log Analysis ─────────────────────────────────────────────────────────────
export interface LogEntry {
 timestamp: string
 level: string
 service: string
 namespace: string
 container: string
 pod: string
 host: string
 traceId: string
 correlationId: string
 errorCode: string
 exception: string
 stackTrace: string
 aiAnnotation: string
 isRootCause: boolean
 message: string
}

const _logEntries: Record<string, LogEntry[]> = {
 'INC-4821': [
 { timestamp: '14:31:58.234', level: 'WARN', service: 'pharmacy-service', namespace: 'pharmacy-ns', container: 'pharmacy-api', pod: 'pharmacy-api-7b4d6f8c9-xk2mv', host: 'ip-10-0-1-42', traceId: 'abc-123-def-456', correlationId: 'corr-789', errorCode: '', exception: '', stackTrace: '', aiAnnotation: 'Connection pool nearing capacity (45/50)', isRootCause: false, message: 'HikariPool-1 — Pool stats (total=50, active=45, idle=5, waiting=0)' },
 { timestamp: '14:32:01.102', level: 'ERROR', service: 'pharmacy-service', namespace: 'pharmacy-ns', container: 'pharmacy-api', pod: 'pharmacy-api-7b4d6f8c9-xk2mv', host: 'ip-10-0-1-42', traceId: 'abc-123-def-457', correlationId: 'corr-790', errorCode: 'CONN_TIMEOUT', exception: 'SQLTransientConnectionException', stackTrace: 'com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:696)\n at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:197)\n at com.mediwatch.pharmacy.repository.PrescriptionRepository.findActive(PrescriptionRepository.java:84)', aiAnnotation: '️ ROOT CAUSE — First connection timeout. Pool exhausted.', isRootCause: true, message: 'HikariPool-1 — Connection is not available, request timed out after 30000ms' },
 { timestamp: '14:32:01.340', level: 'ERROR', service: 'pharmacy-service', namespace: 'pharmacy-ns', container: 'pharmacy-api', pod: 'pharmacy-api-7b4d6f8c9-ab3cd', host: 'ip-10-0-1-43', traceId: 'abc-123-def-458', correlationId: 'corr-791', errorCode: 'CONN_TIMEOUT', exception: 'SQLTransientConnectionException', stackTrace: 'com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:696)', aiAnnotation: 'Same root cause — cascading across pods', isRootCause: false, message: 'HikariPool-1 — Connection is not available, request timed out after 30000ms' },
 { timestamp: '14:32:02.891', level: 'ERROR', service: 'pharmacy-batch-processor', namespace: 'pharmacy-ns', container: 'batch-proc', pod: 'batch-proc-4a2b5c7d8-mn1op', host: 'ip-10-0-1-44', traceId: 'abc-123-def-459', correlationId: 'corr-batch-01', errorCode: 'CONN_LEAK', exception: 'ConnectionLeakException', stackTrace: 'com.mediwatch.batch.BatchReconciliationService.processQueue(BatchReconciliationService.java:142)\n at com.mediwatch.batch.scheduler.ReconciliationScheduler.execute(ReconciliationScheduler.java:67)', aiAnnotation: ' CONNECTION LEAK — 28 connections acquired, 0 released on exception path', isRootCause: true, message: 'Apparent connection leak detected — connection was not released within 30000ms' },
 { timestamp: '14:32:05.443', level: 'WARN', service: 'prescription-api', namespace: 'pharmacy-ns', container: 'rx-api', pod: 'rx-api-9c8d7e6f5-gh4ij', host: 'ip-10-0-1-45', traceId: 'abc-123-def-460', correlationId: 'corr-792', errorCode: 'UPSTREAM_TIMEOUT', exception: '', stackTrace: '', aiAnnotation: 'Downstream impact — pharmacy-service unreachable', isRootCause: false, message: 'Upstream pharmacy-service returned 504 Gateway Timeout after 30s' },
 { timestamp: '14:32:07.001', level: 'CRITICAL', service: 'pharmacy-service', namespace: 'pharmacy-ns', container: 'pharmacy-api', pod: 'pharmacy-api-7b4d6f8c9-xk2mv', host: 'ip-10-0-1-42', traceId: 'abc-123-def-461', correlationId: 'corr-793', errorCode: 'SVC_DEGRADED', exception: 'ServiceDegradationException', stackTrace: 'com.mediwatch.pharmacy.health.HealthCheckService.evaluate(HealthCheckService.java:52)', aiAnnotation: ' Service entered degraded state — error rate 34.7%', isRootCause: false, message: 'Service health check FAILED — error rate 34.7% exceeds 5% threshold' },
 { timestamp: '14:33:22.567', level: 'WARN', service: 'notification-service', namespace: 'notify-ns', container: 'notifier', pod: 'notifier-2a1b3c4d5-ef6gh', host: 'ip-10-0-2-11', traceId: 'abc-123-def-462', correlationId: 'corr-794', errorCode: 'QUEUE_BACKLOG', exception: '', stackTrace: '', aiAnnotation: 'Secondary impact — notification queue growing', isRootCause: false, message: 'Notification queue depth: 342 (normal: <20) — pharmacy notifications backing up' },
 { timestamp: '14:35:10.112', level: 'INFO', service: 'pharmacy-service', namespace: 'pharmacy-ns', container: 'pharmacy-api', pod: 'pharmacy-api-7b4d6f8c9-xk2mv', host: 'ip-10-0-1-42', traceId: '', correlationId: 'corr-fix-01', errorCode: '', exception: '', stackTrace: '', aiAnnotation: ' Remediation started', isRootCause: false, message: 'Engineer Sarah K. initiated connection pool resize — new max_size=100' },
 ],
}

// ── §7 Metrics Analysis ─────────────────────────────────────────────────────────
export interface MetricPoint { time: string; value: number }

export interface MetricsData {
 cpu: MetricPoint[]
 memory: MetricPoint[]
 disk: MetricPoint[]
 network: MetricPoint[]
 responseTime: MetricPoint[]
 throughput: MetricPoint[]
 errorRate: MetricPoint[]
 requestCount: MetricPoint[]
 latencyP99: MetricPoint[]
 dbConnections: MetricPoint[]
 queueLength: MetricPoint[]
 threadCount: MetricPoint[]
 cacheHitRatio: MetricPoint[]
}

const timeSlots = ['14:25','14:26','14:27','14:28','14:29','14:30','14:31','14:32','14:33','14:34','14:35','14:36','14:37','14:38','14:39','14:40']

const _metricsData: Record<string, MetricsData> = {
 'INC-4821': {
 cpu: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 42+Math.random()*5 : i < 8 ? 60+i*5 : i < 12 ? 94-i*2 : 48+Math.random()*3 })),
 memory: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 61+Math.random()*2 : i < 8 ? 72+i*3 : i < 12 ? 87-i : 64+Math.random()*2 })),
 disk: timeSlots.map((t,i) => ({ time: t, value: 45+Math.random()*3 })),
 network: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 120+Math.random()*20 : i < 8 ? 340+i*40 : i < 12 ? 180-i*5 : 130+Math.random()*15 })),
 responseTime: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 45+Math.random()*10 : i < 8 ? 2400+i*1200 : i < 12 ? 320-i*20 : 48+Math.random()*8 })),
 throughput: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 1200+Math.random()*100 : i < 8 ? 400-i*30 : i < 12 ? 800+i*50 : 1180+Math.random()*80 })),
 errorRate: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 0.02+Math.random()*0.01 : i < 8 ? 12+i*4 : i < 12 ? 2-i*0.1 : 0.03+Math.random()*0.01 })),
 requestCount: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 450+Math.random()*50 : i < 8 ? 380-i*20 : i < 12 ? 420+i*10 : 460+Math.random()*30 })),
 latencyP99: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 120+Math.random()*20 : i < 8 ? 8000+i*1500 : i < 12 ? 400-i*25 : 125+Math.random()*15 })),
 dbConnections: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 22+Math.random()*3 : i < 8 ? 42+i*2 : i < 12 ? 50 : 28+Math.random()*4 })),
 queueLength: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 3+Math.random()*2 : i < 8 ? 80+i*15 : i < 12 ? 20-i : 5+Math.random()*3 })),
 threadCount: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 48+Math.random()*4 : i < 8 ? 120+i*10 : i < 12 ? 60-i*2 : 50+Math.random()*3 })),
 cacheHitRatio: timeSlots.map((t,i) => ({ time: t, value: i < 5 ? 94+Math.random()*2 : i < 8 ? 72-i*3 : i < 12 ? 88+i : 95+Math.random() })),
 },
}

// ── §8 Deployment Analysis ──────────────────────────────────────────────────────
export interface DeploymentData {
 version: string
 previousVersion: string
 deploymentTime: string
 changedFiles: number
 commits: { hash: string; message: string; author: string }[]
 pullRequests: { id: string; title: string; status: string }[]
 pipeline: string
 buildNumber: string
 deploymentStatus: string
 rollbackAvailable: boolean
 engineer: string
 deploymentDuration: string
 configChanges: { key: string; oldValue: string; newValue: string }[]
}

const _deploymentData: Record<string, DeploymentData> = {
 'INC-4821': {
 version: 'v2.14.3', previousVersion: 'v2.14.2',
 deploymentTime: '2024-01-12 09:15:00 UTC',
 changedFiles: 14,
 commits: [
 { hash: 'a8f3c2d', message: 'feat: add batch reconciliation retry logic', author: 'dev-john' },
 { hash: 'b7e4d1f', message: 'fix: update prescription query optimization', author: 'dev-sarah' },
 { hash: 'c6f5e0a', message: 'chore: bump HikariCP dependency to 5.1.0', author: 'dev-mike' },
 { hash: 'd5a4b3c', message: 'feat: add reconciliation report generation', author: 'dev-john' },
 ],
 pullRequests: [
 { id: 'PR-1247', title: 'Batch Reconciliation Retry Logic', status: 'merged' },
 { id: 'PR-1245', title: 'Prescription Query Optimization', status: 'merged' },
 ],
 pipeline: 'pharmacy-service-ci', buildNumber: '#4821',
 deploymentStatus: 'Completed', rollbackAvailable: true,
 engineer: 'DevOps Bot (auto-deploy)',
 deploymentDuration: '4m 32s',
 configChanges: [
 { key: 'hikari.max_pool_size', oldValue: '30', newValue: '50' },
 { key: 'batch.reconciliation.retry_count', oldValue: '3', newValue: '5' },
 { key: 'batch.reconciliation.timeout_ms', oldValue: '15000', newValue: '30000' },
 ],
 },
}

// ── §9 Service Dependency Map ───────────────────────────────────────────────────
export interface ServiceNode {
 id: string
 label: string
 type: string
 status: string
 x: number
 y: number
}

export interface ServiceEdge {
 from: string
 to: string
 status: string
 latency: string
}

const _dependencyMap: Record<string, { nodes: ServiceNode[]; edges: ServiceEdge[] }> = {
 'INC-4821': {
 nodes: [
 { id: 'api-gw', label: 'API Gateway', type: 'gateway', status: 'healthy', x: 400, y: 40 },
 { id: 'auth', label: 'Authentication', type: 'service', status: 'healthy', x: 200, y: 120 },
 { id: 'pharmacy', label: 'Pharmacy Service', type: 'service', status: 'critical', x: 400, y: 120 },
 { id: 'user-svc', label: 'User Service', type: 'service', status: 'healthy', x: 600, y: 120 },
 { id: 'rx-api', label: 'Prescription API', type: 'service', status: 'degraded', x: 250, y: 220 },
 { id: 'batch', label: 'Batch Processor', type: 'service', status: 'critical', x: 550, y: 220 },
 { id: 'notify', label: 'Notification Svc', type: 'service', status: 'degraded', x: 700, y: 220 },
 { id: 'db-primary', label: 'Pharmacy DB', type: 'database', status: 'critical', x: 400, y: 320 },
 { id: 'db-replica', label: 'DB Replica', type: 'database', status: 'warning', x: 550, y: 320 },
 { id: 'cache', label: 'Redis Cache', type: 'cache', status: 'healthy', x: 250, y: 320 },
 { id: 'queue', label: 'Message Queue', type: 'queue', status: 'warning', x: 700, y: 320 },
 ],
 edges: [
 { from: 'api-gw', to: 'auth', status: 'healthy', latency: '2ms' },
 { from: 'api-gw', to: 'pharmacy', status: 'critical', latency: '12400ms' },
 { from: 'api-gw', to: 'user-svc', status: 'healthy', latency: '8ms' },
 { from: 'pharmacy', to: 'rx-api', status: 'degraded', latency: '8500ms' },
 { from: 'pharmacy', to: 'batch', status: 'critical', latency: 'timeout' },
 { from: 'pharmacy', to: 'db-primary', status: 'critical', latency: '30000ms' },
 { from: 'pharmacy', to: 'cache', status: 'healthy', latency: '1ms' },
 { from: 'batch', to: 'db-primary', status: 'critical', latency: '30000ms' },
 { from: 'db-primary', to: 'db-replica', status: 'warning', latency: '450ms' },
 { from: 'pharmacy', to: 'notify', status: 'degraded', latency: '5200ms' },
 { from: 'notify', to: 'queue', status: 'warning', latency: '120ms' },
 ],
 },
}

// ── §10 Impact Analysis + §16 Risk Assessment ──────────────────────────────────
export interface ImpactData {
 affectedApplications: string[]
 affectedAPIs: string[]
 affectedDatabases: string[]
 affectedCustomers: number
 revenueImpact: string
 slaRisk: string
 complianceRisk: string
 businessCriticality: string
 serviceHealth: number
 regionalImpact: { region: string; status: string; users: number }[]
}

export interface RiskData {
 incidentRisk: number
 escalationProbability: number
 businessRisk: number
 customerImpactScore: number
 serviceAvailability: number
 recoveryProbability: number
 confidence: number
 predictedFailureWindow: string
}

const _impactData: Record<string, ImpactData> = {
 'INC-4821': {
 affectedApplications: ['MediWatch Pharmacy Portal', 'MediWatch Mobile App', 'Prescription Management Console'],
 affectedAPIs: ['/api/v2/prescriptions', '/api/v2/pharmacy/inventory', '/api/v2/rx/dispense', '/api/v2/batch/reconcile'],
 affectedDatabases: ['pharmacy-db-primary (PostgreSQL)', 'pharmacy-db-replica-1 (PostgreSQL)'],
 affectedCustomers: 2400,
 revenueImpact: '$18,400/hour',
 slaRisk: 'High — SLA breach in 42 minutes if unresolved',
 complianceRisk: 'Medium — HIPAA audit trail maintained, prescription delays documented',
 businessCriticality: 'Critical — Core pharmacy operations',
 serviceHealth: 23,
 regionalImpact: [
 { region: 'US East (Primary)', status: 'critical', users: 1800 },
 { region: 'US West', status: 'degraded', users: 420 },
 { region: 'EU Central', status: 'healthy', users: 180 },
 ],
 },
}

const _riskData: Record<string, RiskData> = {
 'INC-4821': {
 incidentRisk: 87,
 escalationProbability: 72,
 businessRisk: 91,
 customerImpactScore: 84,
 serviceAvailability: 23,
 recoveryProbability: 88,
 confidence: 94,
 predictedFailureWindow: 'Tomorrow 14:30 UTC (recurring batch trigger)',
 },
}

// ── §11 AI Recommendations ──────────────────────────────────────────────────────
export interface AIRecommendation {
 id: string
 recommendation: string
 confidence: number
 priority: string
 estimatedResolutionTime: string
 commands: string[]
 automationAvailable: boolean
 risk: string
 rollbackOption: string
 documentation: string
 runbook: string
 relatedKBArticle: string
}

const _aiRecommendations: Record<string, AIRecommendation[]> = {
 'INC-4821': [
 { id: 'rec-1', recommendation: 'Increase HikariCP connection pool max_size from 50 to 100', confidence: 96, priority: 'P1', estimatedResolutionTime: '5 minutes', commands: ['kubectl set env deployment/pharmacy-service HIKARI_MAX_POOL_SIZE=100 -n pharmacy-ns', 'kubectl rollout restart deployment/pharmacy-service -n pharmacy-ns'], automationAvailable: true, risk: 'Low', rollbackOption: 'kubectl set env deployment/pharmacy-service HIKARI_MAX_POOL_SIZE=50', documentation: 'https://docs.mediwatch.io/pharmacy/connection-pool', runbook: 'RB-291: Connection Pool Exhaustion', relatedKBArticle: 'KB-1042: HikariCP Tuning Guide' },
 { id: 'rec-2', recommendation: 'Reschedule batch reconciliation to off-peak hours (02:00 UTC)', confidence: 92, priority: 'P2', estimatedResolutionTime: '2 minutes', commands: ['kubectl edit cronjob pharmacy-batch-reconciliation -n pharmacy-ns'], automationAvailable: true, risk: 'Low', rollbackOption: 'Revert cron schedule to 14:30 UTC', documentation: 'https://docs.mediwatch.io/pharmacy/batch-jobs', runbook: 'RB-187: Batch Job Scheduling', relatedKBArticle: 'KB-892: Peak Hour Management' },
 { id: 'rec-3', recommendation: 'Patch connection leak in BatchReconciliationService.processQueue()', confidence: 94, priority: 'P1', estimatedResolutionTime: '30 minutes', commands: ['git cherry-pick fix/conn-leak-batch-processor', 'kubectl rollout status deployment/pharmacy-batch-processor -n pharmacy-ns'], automationAvailable: false, risk: 'Medium', rollbackOption: 'kubectl rollout undo deployment/pharmacy-batch-processor', documentation: 'https://docs.mediwatch.io/pharmacy/batch-processor', runbook: 'RB-312: Connection Leak Remediation', relatedKBArticle: 'KB-1108: JDBC Connection Management' },
 { id: 'rec-4', recommendation: 'Add connection pool exhaustion alert at 80% threshold', confidence: 98, priority: 'P3', estimatedResolutionTime: '10 minutes', commands: ['kubectl apply -f monitoring/alerts/connection-pool-alert.yaml'], automationAvailable: true, risk: 'None', rollbackOption: 'kubectl delete prometheusrule conn-pool-alert', documentation: 'https://docs.mediwatch.io/monitoring/alerts', runbook: 'RB-156: Alert Configuration', relatedKBArticle: 'KB-734: Prometheus Alerting Best Practices' },
 { id: 'rec-5', recommendation: 'Enable circuit breaker on batch→database communication path', confidence: 88, priority: 'P2', estimatedResolutionTime: '20 minutes', commands: ['kubectl apply -f config/circuit-breaker-batch-db.yaml'], automationAvailable: false, risk: 'Low', rollbackOption: 'kubectl delete destinationrule batch-db-circuit-breaker', documentation: 'https://docs.mediwatch.io/resilience/circuit-breakers', runbook: 'RB-267: Circuit Breaker Configuration', relatedKBArticle: 'KB-956: Resilience Patterns' },
 ],
}

// ── §12 Similar Incidents ───────────────────────────────────────────────────────
export interface SimilarIncident {
 id: string
 similarity: number
 rootCause: string
 resolution: string
 engineer: string
 resolutionTime: string
 date: string
 confidence: number
}

const _similarIncidents: Record<string, SimilarIncident[]> = {
 'INC-4821': [
 { id: 'INC-4814', similarity: 97, rootCause: 'Connection pool exhaustion — same batch overlap', resolution: 'Temporary pool increase + batch reschedule', engineer: 'Sarah K.', resolutionTime: '22m', date: '2024-01-15', confidence: 97 },
 { id: 'INC-4702', similarity: 91, rootCause: 'HikariCP pool exhaustion during peak', resolution: 'Pool size increased from 30 to 50', engineer: 'Mike T.', resolutionTime: '35m', date: '2024-01-08', confidence: 91 },
 { id: 'INC-4589', similarity: 87, rootCause: 'DB connection timeout cascade', resolution: 'Query optimization + connection pool tuning', engineer: 'Ana L.', resolutionTime: '48m', date: '2023-12-22', confidence: 87 },
 { id: 'INC-4401', similarity: 82, rootCause: 'Batch job connection leak (v2.12.x)', resolution: 'Patched connection release in finally block', engineer: 'James R.', resolutionTime: '1h 12m', date: '2023-12-01', confidence: 82 },
 { id: 'INC-4198', similarity: 76, rootCause: 'Connection pool sized for lower traffic', resolution: 'Pool auto-scaling implementation', engineer: 'Chris M.', resolutionTime: '2h 05m', date: '2023-11-15', confidence: 76 },
 ],
}

// ── §13 Knowledge Base ──────────────────────────────────────────────────────────
export interface KBItem {
 type: string
 title: string
 id: string
 relevance: number
 lastUpdated: string
 author: string
}

const _knowledgeBase: Record<string, KBItem[]> = {
 'INC-4821': [
 { type: 'Runbook', title: 'RB-291: Connection Pool Exhaustion Response', id: 'RB-291', relevance: 98, lastUpdated: '2024-01-10', author: 'Sarah K.' },
 { type: 'Runbook', title: 'RB-312: Connection Leak Remediation', id: 'RB-312', relevance: 94, lastUpdated: '2023-12-15', author: 'James R.' },
 { type: 'SOP', title: 'SOP-042: Database Incident Response Procedure', id: 'SOP-042', relevance: 96, lastUpdated: '2024-01-05', author: 'Platform Team' },
 { type: 'Documentation', title: 'HikariCP Connection Pool Configuration Guide', id: 'DOC-118', relevance: 92, lastUpdated: '2023-11-20', author: 'Dev Docs' },
 { type: 'Historical RCA', title: 'RCA: INC-4702 — Pool Exhaustion During Peak Hours', id: 'RCA-4702', relevance: 91, lastUpdated: '2024-01-08', author: 'Mike T.' },
 { type: 'Related Ticket', title: 'JIRA-8834: Implement connection pool auto-scaling', id: 'JIRA-8834', relevance: 85, lastUpdated: '2024-01-12', author: 'Chris M.' },
 { type: 'Wiki', title: 'Pharmacy Service Architecture & Dependencies', id: 'WIKI-067', relevance: 88, lastUpdated: '2023-12-01', author: 'Architecture' },
 { type: 'Engineering Note', title: 'Post-mortem: Recurring DB Pool Issues Q4 2023', id: 'ENG-NOTE-23', relevance: 90, lastUpdated: '2024-01-02', author: 'Sarah K.' },
 { type: 'Fix History', title: 'Historical fixes for pharmacy-service DB issues', id: 'FIX-HIST-12', relevance: 86, lastUpdated: '2024-01-10', author: 'Platform Team' },
 ],
}

// ── §14 Collaboration Panel ─────────────────────────────────────────────────────
export interface CollaborationData {
 assignedEngineers: { name: string; role: string; avatar: string; status: string }[]
 comments: { user: string; time: string; text: string; type: string }[]
 activityLog: { time: string; action: string; user: string }[]
 escalations: { level: string; to: string; time: string; reason: string }[]
 statusUpdates: { time: string; from: string; to: string; user: string }[]
}

const _collaborationData: Record<string, CollaborationData> = {
 'INC-4821': {
 assignedEngineers: [
 { name: 'Sarah K.', role: 'Primary Responder', avatar: 'SK', status: 'online' },
 { name: 'Mike T.', role: 'Database SME', avatar: 'MT', status: 'online' },
 { name: 'James R.', role: 'Platform Engineer', avatar: 'JR', status: 'away' },
 ],
 comments: [
 { user: 'Sarah K.', time: '14:33:15', text: 'Confirmed connection pool exhaustion. Increasing max_pool_size to 100 as immediate fix.', type: 'update' },
 { user: 'Mike T.', time: '14:34:22', text: 'DB side looks stable — CPU is high but not in danger zone. Recommend checking batch processor for connection leaks.', type: 'analysis' },
 { user: 'MediWatch AI', time: '14:34:45', text: 'AI analysis complete: 94% confidence on root cause. Connection leak detected in BatchReconciliationService.processQueue() — see trace abc-123-def-459.', type: 'ai' },
 { user: 'Sarah K.', time: '14:36:00', text: 'Hotfix deployed. Monitoring recovery. Will also schedule batch job to off-peak hours.', type: 'update' },
 { user: 'James R.', time: '14:38:10', text: 'Confirmed from infra side — network metrics normalizing. TCP RST packets returning to baseline.', type: 'analysis' },
 ],
 activityLog: [
 { time: '14:32:07', action: 'Incident created — P1 alert triggered', user: 'System' },
 { time: '14:32:15', action: 'Auto-assigned to Sarah K. (on-call)', user: 'PagerDuty' },
 { time: '14:32:20', action: 'AI analysis initiated', user: 'MediWatch AI' },
 { time: '14:33:00', action: 'Incident acknowledged', user: 'Sarah K.' },
 { time: '14:33:30', action: 'Mike T. joined as collaborator', user: 'Sarah K.' },
 { time: '14:34:45', action: 'AI root cause analysis complete (94% confidence)', user: 'MediWatch AI' },
 { time: '14:35:10', action: 'Remediation started — pool resize', user: 'Sarah K.' },
 { time: '14:42:30', action: 'Hotfix deployed (v2.14.3-hotfix.1)', user: 'Sarah K.' },
 ],
 escalations: [
 { level: 'L2', to: 'Platform Reliability Team', time: '14:32:15', reason: 'P1 auto-escalation — critical service impact' },
 ],
 statusUpdates: [
 { time: '14:32:07', from: 'New', to: 'Triggered', user: 'System' },
 { time: '14:33:00', from: 'Triggered', to: 'Acknowledged', user: 'Sarah K.' },
 { time: '14:35:10', from: 'Acknowledged', to: 'In Progress', user: 'Sarah K.' },
 ],
 },
}

// ── §17 Performance Insights ────────────────────────────────────────────────────
export interface PerformanceInsights {
 mtta: string
 mttr: string
 mttd: string
 availability: number
 errorBudget: number
 slaCompliance: number
 sloStatus: { name: string; target: number; current: number; status: string }[]
 reliabilityScore: number
 healthScore: number
}

const _performanceInsights: Record<string, PerformanceInsights> = {
 'INC-4821': {
 mtta: '1m 12s', mttr: '18m 34s', mttd: '0m 48s',
 availability: 99.94,
 errorBudget: 62,
 slaCompliance: 97.8,
 sloStatus: [
 { name: 'Availability', target: 99.95, current: 99.94, status: 'at-risk' },
 { name: 'Latency P99 < 200ms', target: 99.0, current: 94.2, status: 'breached' },
 { name: 'Error Rate < 1%', target: 99.5, current: 96.8, status: 'at-risk' },
 { name: 'Throughput > 1000 rps', target: 99.0, current: 99.1, status: 'met' },
 ],
 reliabilityScore: 78,
 healthScore: 45,
 },
}

// ── §15 AI Copilot capabilities ─────────────────────────────────────────────────
export const copilotCapabilities = [
 { id: 'explain-incident', label: 'Explain Incident', icon: '', description: 'Get a plain-language explanation of what happened' },
 { id: 'explain-logs', label: 'Explain Logs', icon: '', description: 'AI analysis of relevant log entries' },
 { id: 'explain-metrics', label: 'Explain Metrics', icon: '', description: 'Understand metric anomalies and trends' },
 { id: 'generate-rca', label: 'Generate RCA', icon: '', description: 'Generate a detailed root cause analysis report' },
 { id: 'compare-incidents', label: 'Compare Incidents', icon: '', description: 'Compare with similar historical incidents' },
 { id: 'generate-summary', label: 'Generate Summary', icon: '', description: 'Create an executive summary for stakeholders' },
 { id: 'suggest-fix', label: 'Suggest Fix', icon: '', description: 'Get AI-powered fix suggestions with commands' },
 { id: 'generate-runbook', label: 'Generate Runbook', icon: '', description: 'Auto-generate a runbook for this incident type' },
 { id: 'create-ticket', label: 'Create Ticket', icon: '', description: 'Draft a Jira/ServiceNow ticket' },
 { id: 'notify-team', label: 'Notify Team', icon: '', description: 'Send notifications to relevant teams' },
 { id: 'draft-postmortem', label: 'Draft Postmortem', icon: '', description: 'Generate a postmortem document template' },
]

// ── §18 Export & Actions ────────────────────────────────────────────────────────
export const actionButtons = [
 { id: 'assign', label: 'Assign Engineer', icon: '', color: '#2563eb' },
 { id: 'escalate', label: 'Escalate', icon: '️', color: '#ef4444' },
 { id: 'jira', label: 'Create Jira Ticket', icon: '', color: '#2563eb' },
 { id: 'servicenow', label: 'Open ServiceNow', icon: '', color: '#10b981' },
 { id: 'slack', label: 'Notify Slack', icon: '', color: '#7c3aed' },
 { id: 'teams', label: 'Notify Teams', icon: '', color: '#5b5fc7' },
 { id: 'pdf', label: 'Export PDF', icon: '', color: '#64748b' },
 { id: 'csv', label: 'Export CSV', icon: '', color: '#64748b' },
 { id: 'report', label: 'Generate Report', icon: '', color: '#f59e0b' },
 { id: 'rca-download', label: 'Download RCA', icon: '️', color: '#64748b' },
 { id: 'share', label: 'Share Incident', icon: '', color: '#0ea5e9' },
]


// --- PROXY EXPORTS ---
const createProxy = (obj) => new Proxy(obj, { get: (target, prop) => target[prop] || target['INC-4821'] || Object.values(target)[0] });
export const incidentDetails = createProxy(_incidentDetails);
export const aiSummaries = createProxy(_aiSummaries);
export const timelineEvents = createProxy(_timelineEvents);
export const rootCauseData = createProxy(_rootCauseData);
export const patternData = createProxy(_patternData);
export const logEntries = createProxy(_logEntries);
export const metricsData = createProxy(_metricsData);
export const deploymentData = createProxy(_deploymentData);
export const dependencyMap = createProxy(_dependencyMap);
export const impactData = createProxy(_impactData);
export const riskData = createProxy(_riskData);
export const aiRecommendations = createProxy(_aiRecommendations);
export const similarIncidents = createProxy(_similarIncidents);
export const knowledgeBase = createProxy(_knowledgeBase);
export const collaborationData = createProxy(_collaborationData);
export const performanceInsights = createProxy(_performanceInsights);
