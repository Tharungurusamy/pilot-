const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'views', 'incident-analysis', 'incidentDetailData.ts');
let content = fs.readFileSync(targetFile, 'utf8');

const records = [
  'incidentDetails', 'aiSummaries', 'timelineEvents', 'rootCauseData',
  'patternData', 'logEntries', 'metricsData', 'deploymentData',
  'dependencyMap', 'impactData', 'riskData', 'aiRecommendations',
  'similarIncidents', 'knowledgeBase', 'collaborationData', 'performanceInsights'
];

let addedExports = `\n\n// --- PROXY EXPORTS ---\nconst createProxy = (obj) => new Proxy(obj, { get: (target, prop) => target[prop] || target['INC-4821'] || Object.values(target)[0] });\n`;

for (const name of records) {
  const regex = new RegExp("export const " + name + ":\\s*(Record<[^=]+>)\\s*=\\s*{", 'g');
  if (regex.test(content)) {
    content = content.replace(regex, "const _" + name + ": $1 = {");
    addedExports += "export const " + name + " = createProxy(_" + name + ");\n";
  }
}

if (!content.includes('PROXY EXPORTS')) {
  fs.writeFileSync(targetFile, content + addedExports);
  console.log('Successfully updated incidentDetailData.ts to use proxies.');
} else {
  console.log('Already proxied.');
}
