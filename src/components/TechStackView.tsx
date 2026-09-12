import React, { useState } from 'react';
import { 
  Code, 
  Database, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Cpu, 
  Layers, 
  Server, 
  FileCode,
  Table as TableIcon,
  Sparkles
} from 'lucide-react';
import { 
  PYTHON_SCRAPER_SCRIPT, 
  POSTGRES_DDL_SCHEMA, 
  DOCKER_COMPOSE_CONFIG 
} from '../data/mockData';
import { GrantCall } from '../types';

interface TechStackViewProps {
  grantCalls: GrantCall[];
}

export const TechStackView: React.FC<TechStackViewProps> = ({ grantCalls }) => {
  const [activeSubTab, setActiveSubTab] = useState<'python' | 'postgres' | 'docker' | 'agentbus'>('python');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // PostgreSQL interactive query runner state
  const [sqlQuery, setSqlQuery] = useState(
    `SELECT scheme_code, agency, funding_ceiling_in_lakhs, submission_deadline \nFROM grant_calls \nWHERE funding_ceiling_in_lakhs >= 60 \nORDER BY submission_deadline ASC;`
  );
  const [queryResults, setQueryResults] = useState<any[] | null>([
    { scheme_code: 'ANRF/CRG/2026/04', agency: 'ANRF/SERB', funding_ceiling_in_lakhs: 75.0, submission_deadline: '2026-10-31' },
    { scheme_code: 'MeitY/C2S/PHASE2/11', agency: 'MeitY', funding_ceiling_in_lakhs: 145.0, submission_deadline: '2026-10-10' },
    { scheme_code: 'DRDO/ERIPR/CYBER/09', agency: 'DRDO', funding_ceiling_in_lakhs: 98.0, submission_deadline: '2026-10-20' },
    { scheme_code: 'DST/TDP/AGRI-AI/03', agency: 'DST', funding_ceiling_in_lakhs: 60.0, submission_deadline: '2026-09-28' },
    { scheme_code: 'ICMR/MEDTECH/AI/2026', agency: 'ICMR', funding_ceiling_in_lakhs: 85.0, submission_deadline: '2026-11-15' },
    { scheme_code: 'IGSTC/2+2/CALL/2026', agency: 'International (Horizon/IGSTC/Indo-US)', funding_ceiling_in_lakhs: 220.0, submission_deadline: '2026-10-25' },
  ]);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Python runner simulation state
  const [pythonExecutionLogs, setPythonExecutionLogs] = useState<string[] | null>(null);
  const [isExecutingPython, setIsExecutingPython] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExecuteSql = () => {
    setIsExecutingSql(true);
    setTimeout(() => {
      // Simulate execution based on grantCalls
      const q = sqlQuery.toLowerCase();
      let filtered = [...grantCalls];

      if (q.includes('where')) {
        if (q.includes('anrf') || q.includes('serb')) {
          filtered = filtered.filter(c => c.agency === 'ANRF/SERB');
        } else if (q.includes('60') || q.includes('75')) {
          filtered = filtered.filter(c => c.fundingCeilingInLakhs >= 60);
        }
      }

      setQueryResults(
        filtered.map(c => ({
          scheme_code: c.schemeCode,
          agency: c.agency,
          funding_ceiling_in_lakhs: c.fundingCeilingInLakhs,
          submission_deadline: c.submissionDeadline,
        }))
      );
      setIsExecutingSql(false);
    }, 300);
  };

  const handleExecutePython = () => {
    setIsExecutingPython(true);
    setPythonExecutionLogs([
      `[INFO] Initializing Python 3.11 virtualenv with Playwright, Scrapy & Pydantic...`,
      `[INFO] Starting daemon task: anrf_serb_spider.py`,
      `[DEBUG] Fetching HTML from https://anrfonline.in/schemes`,
      `[INFO] Discovered 8 scheme DOM cards. Parsing CSS selectors...`,
      `[INFO] Extracted scheme: 'ANRF Core Research Grant (CRG) - Engineering'`,
      `[INFO] Extracted ceiling: INR 75,00,000 | Duration: 36 mos | Deadline: 2026-10-31`,
      `[DEDUP] Generated SHA-256 fingerprint: a8f4b01... matches existing record.`,
      `[CORRIGENDUM] Deadline was extended from 2026-10-15 to 2026-10-31!`,
      `[POSTGRES] Connected to postgresql://research_admin@postgres-db:5432/agent22_grants_db`,
      `[SUCCESS] Ingested 1 corrigendum record. Executed matching RPC for 4 faculty members.`
    ]);
    setTimeout(() => {
      setIsExecutingPython(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Technical Architecture Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Technology Stack & Microservice Architecture
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white font-mono">
              Production Stack
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Built using Python, PostgreSQL, Docker, Node.js, HTML5, CSS3, and JavaScript/TypeScript.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('python')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'python' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Python Scraper</span>
          </button>

          <button
            onClick={() => setActiveSubTab('postgres')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'postgres' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>PostgreSQL Schema</span>
          </button>

          <button
            onClick={() => setActiveSubTab('docker')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'docker' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>Docker Compose</span>
          </button>

          <button
            onClick={() => setActiveSubTab('agentbus')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'agentbus' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Agent 17 / 20 / 21 Bus</span>
          </button>
        </div>
      </div>

      {/* Subtab 1: Python Scraper Daemon */}
      {activeSubTab === 'python' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-600" />
                  <span>Python Spider: Structured Crawling & Deduplication</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Runs as an autonomous background container worker using BeautifulSoup4, Scrapy, Pydantic, and SQLAlchemy.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="run-python-daemon-btn"
                  onClick={handleExecutePython}
                  disabled={isExecutingPython}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{isExecutingPython ? 'Executing...' : 'Run Python Spider'}</span>
                </button>

                <button
                  onClick={() => copyToClipboard(PYTHON_SCRAPER_SCRIPT, 'python')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
                >
                  {copiedKey === 'python' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'python' ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>
            </div>

            {/* Code view */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-96 border border-slate-800">
              <pre>{PYTHON_SCRAPER_SCRIPT}</pre>
            </div>
          </div>

          {/* Live Execution Output if triggered */}
          {pythonExecutionLogs && (
            <div className="bg-slate-950 text-emerald-400 rounded-2xl p-5 border border-slate-800 font-mono text-xs shadow-md">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3 text-slate-300 font-bold">
                <span className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  Python 3.11 Execution STDOUT
                </span>
                <span className="text-[10px] text-emerald-500 font-normal">Exit Code: 0 (Success)</span>
              </div>
              <div className="space-y-1">
                {pythonExecutionLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: PostgreSQL Schema & Live SQL Console */}
      {activeSubTab === 'postgres' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span>Interactive PostgreSQL Console & Schema</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Relational model storing grant calls, corrigenda audit history, faculty research profiles, match scores, and notification queues.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(POSTGRES_DDL_SCHEMA, 'postgres')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
              >
                {copiedKey === 'postgres' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'postgres' ? 'Copied' : 'Copy DDL'}</span>
              </button>
            </div>

            {/* Interactive SQL Editor */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-bold text-slate-700 block">
                Execute SQL Query on agent22_grants_db:
              </label>
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSqlQuery(`SELECT scheme_code, agency, funding_ceiling_in_lakhs, submission_deadline \nFROM grant_calls \nWHERE funding_ceiling_in_lakhs >= 60 \nORDER BY submission_deadline ASC;`)}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Preset: High Value Grants (≥60L)
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={() => setSqlQuery(`SELECT f.full_name, m.overall_score, g.scheme_name \nFROM faculty_grant_matches m \nJOIN faculty_profiles f ON m.faculty_id = f.id \nJOIN grant_calls g ON m.grant_call_id = g.id \nWHERE m.overall_score > 90;`)}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Preset: Top Matches (&gt;90%)
                  </button>
                </div>

                <button
                  id="execute-sql-btn"
                  onClick={handleExecuteSql}
                  disabled={isExecutingSql}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{isExecutingSql ? 'Running...' : 'Execute Query'}</span>
                </button>
              </div>
            </div>

            {/* Query Results Table */}
            {queryResults && (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-50 p-2.5 font-bold text-slate-700 border-b border-slate-200 flex items-center justify-between">
                  <span>Query Results ({queryResults.length} rows returned in 1.4ms)</span>
                  <span className="text-[10px] text-slate-500 font-mono">STATUS: 200 OK</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left divide-y divide-slate-200">
                    <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase">
                      <tr>
                        {Object.keys(queryResults[0] || {}).map((col) => (
                          <th key={col} className="p-2.5 font-bold font-mono">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {queryResults.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          {Object.values(row).map((val: any, i) => (
                            <td key={i} className="p-2.5 text-slate-800">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DDL Schema View */}
            <div className="mt-5">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Full PostgreSQL DDL Schema (init.sql):
              </span>
              <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-72 border border-slate-800">
                <pre>{POSTGRES_DDL_SCHEMA}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Docker Compose */}
      {activeSubTab === 'docker' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-600" />
                <span>Multi-Container Deployment (docker-compose.yml)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Encapsulates Postgres 16 Alpine, the Python Playwright Scraper Daemon, and the Node Express Frontend.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(DOCKER_COMPOSE_CONFIG, 'docker')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
            >
              {copiedKey === 'docker' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'docker' ? 'Copied' : 'Copy Compose YAML'}</span>
            </button>
          </div>

          <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-96 border border-slate-800">
            <pre>{DOCKER_COMPOSE_CONFIG}</pre>
          </div>
        </div>
      )}

      {/* Subtab 4: Agent 17 / 20 / 21 Bus Specification */}
      {activeSubTab === 'agentbus' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              <span>Inter-Agent Communication API Contracts</span>
            </h3>
            <p className="text-xs text-slate-500">
              Agent 22 consumes Agent 17 (Faculty Profiler) and dispatches opportunities to Agent 20 (Proposal Drafting) and Agent 21 (Compliance & Budget).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Input from Agent 17 */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 border border-slate-800">
              <div className="text-blue-400 font-bold mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>CONSUMES: Agent 17 Payload (Faculty Profile)</span>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded">POST /api/faculty</span>
              </div>
              <pre className="text-[11px] text-slate-300 overflow-x-auto">
{`{
  "faculty_id": "fac-1",
  "name": "Dr. Akshay Gupta",
  "designation": "Associate Professor",
  "department": "CSE",
  "publication_keywords": [
    "Edge AI Accelerators",
    "Computer Vision",
    "Autonomous Drones"
  ],
  "h_index": 16,
  "active_commitments": [
    {
      "grant_code": "SERB/SRG/2023",
      "remaining_months": 4
    }
  ]
}`}
              </pre>
            </div>

            {/* Output to Agent 20 */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 border border-slate-800">
              <div className="text-purple-400 font-bold mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>FEEDS: Agent 20 Handshake (Proposal Drafting)</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.2 rounded">POST /api/proposals/ingest</span>
              </div>
              <pre className="text-[11px] text-slate-300 overflow-x-auto">
{`{
  "call_id": "call-anrf-crg-2026",
  "scheme_name": "ANRF Core Research Grant",
  "agency": "ANRF/SERB",
  "proforma_format": "ANRF-CRG-Format-2026-v3",
  "matched_pi": {
    "faculty_id": "fac-1",
    "matched_keywords": ["Edge AI", "Vision"]
  },
  "submission_deadline": "2026-10-31",
  "budget_ceiling_lakhs": 75.0,
  "initiate_sections": [
    "Project Synopsis",
    "Methodology",
    "Milestones Gantt Chart"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
