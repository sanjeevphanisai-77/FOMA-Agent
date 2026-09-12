import React, { useState } from 'react';
import { 
  Activity, 
  RefreshCw, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Play, 
  Cpu, 
  Database,
  Search,
  Filter
} from 'lucide-react';
import { SourceCrawlerStatus, GrantCall } from '../types';

interface SourcesScraperMonitorProps {
  sources: SourceCrawlerStatus[];
  grantCalls: GrantCall[];
  onTriggerCrawl: (sourceId: string) => Promise<void>;
  onSimulateCorrigendum: (callId: string, title: string, newDeadline: string, type: any) => Promise<void>;
  onSelectGrant: (grant: GrantCall) => void;
}

export const SourcesScraperMonitor: React.FC<SourcesScraperMonitorProps> = ({
  sources,
  grantCalls,
  onTriggerCrawl,
  onSimulateCorrigendum,
  onSelectGrant,
}) => {
  const [activeCrawlerLog, setActiveCrawlerLog] = useState<{
    sourceName: string;
    logs: string[];
  } | null>(null);
  const [isRunningCrawl, setIsRunningCrawl] = useState<string | null>(null);

  // Corrigendum simulation modal/box state
  const [selectedCallForCorrigendum, setSelectedCallForCorrigendum] = useState<string>(grantCalls[0]?.id || '');
  const [corrigendumTitle, setCorrigendumTitle] = useState('Corrigendum: Deadline Extension by 14 Days');
  const [corrigendumDeadline, setCorrigendumDeadline] = useState('2026-11-15');
  const [corrigendumType, setCorrigendumType] = useState('DEADLINE_EXTENSION');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState(false);

  const handleCrawlClick = async (source: SourceCrawlerStatus) => {
    setIsRunningCrawl(source.id);
    setActiveCrawlerLog({
      sourceName: source.name,
      logs: [
        `[SPIDER_INIT] Spawning asynchronous Python Playwright/BeautifulSoup crawler daemon...`,
        `[TARGET] Connecting to ${source.portalUrl}`,
        `[CADENCE] Cadence policy: ${source.cadence}`,
      ]
    });

    try {
      await onTriggerCrawl(source.id);
      setActiveCrawlerLog(prev => prev ? {
        ...prev,
        logs: [
          ...prev.logs,
          `[HTTP_REQ] GET ${source.portalUrl} -> 200 OK (${source.latencyMs}ms)`,
          `[PARSER] Extracting structured meta: scheme_name, agency, research_areas, eligibility, ceiling, deadline`,
          `[DEDUP_ENGINE] Computing SHA-256 fingerprint on portal payload table rows`,
          `[POSTGRES] Ingestion commit OK. Updated table 'grant_calls'.`,
          `[AGENT_BUS] Dispatched new calls to Matching Engine for faculty matching.`
        ]
      } : null);
    } finally {
      setIsRunningCrawl(null);
    }
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCallForCorrigendum) return;
    setIsSimulating(true);
    setSimulationSuccess(false);

    try {
      await onSimulateCorrigendum(
        selectedCallForCorrigendum,
        corrigendumTitle,
        corrigendumDeadline,
        corrigendumType
      );
      setSimulationSuccess(true);
      setTimeout(() => setSimulationSuccess(false), 4000);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Autonomous Funding Sources & Scraper Cadence
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Cadence: 06:00 IST
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Continuously ingests official RSS feeds and executes structured Python scrapers across DST, ANRF/SERB, MeitY, DRDO, ICMR, AICTE, and state/international portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center text-xs">
            <span className="text-slate-400 block text-[10px]">Monitored Portals</span>
            <span className="text-base font-extrabold text-slate-900">{sources.length} Active</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center text-xs">
            <span className="text-slate-400 block text-[10px]">Active Calls Extracted</span>
            <span className="text-base font-extrabold text-blue-600">{grantCalls.length} Schemes</span>
          </div>
        </div>
      </div>

      {/* Grid of Monitored Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src) => {
          const isCrawling = isRunningCrawl === src.id;

          return (
            <div
              key={src.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 text-white">
                      {src.agency}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1.5 leading-snug">
                      {src.name}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {src.status}
                  </span>
                </div>

                <div className="mt-3 text-xs text-slate-500 font-mono flex items-center gap-1.5 truncate">
                  <span className="text-slate-400">URL:</span>
                  <a
                    href={src.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {src.portalUrl}
                  </a>
                  <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                </div>

                {/* Scraper details */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Cadence</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{src.cadence}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Extraction Method</span>
                    <span className="font-semibold text-slate-800 text-[11px] truncate block">{src.scrapingMethod.split('/')[0]}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Latency / Health</span>
                    <span className="font-semibold text-emerald-600 text-[11px]">{src.latencyMs}ms (200 OK)</span>
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400 text-[11px]">
                  Last run: {src.lastRunTime} • {src.callsExtracted} calls ingested
                </span>

                <button
                  id={`trigger-crawl-${src.id}`}
                  onClick={() => handleCrawlClick(src)}
                  disabled={isCrawling}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isCrawling ? 'animate-spin' : ''}`} />
                  <span>{isCrawling ? 'Crawling...' : 'Run Scraper Now'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Scraper Terminal Log Modal/Card if triggered */}
      {activeCrawlerLog && (
        <div className="bg-slate-950 text-emerald-400 rounded-2xl p-5 border border-slate-800 font-mono text-xs shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-slate-200">
                Live Python Worker Terminal Stream ({activeCrawlerLog.sourceName})
              </span>
            </div>
            <button
              onClick={() => setActiveCrawlerLog(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
            >
              Close Stream
            </button>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {activeCrawlerLog.logs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Corrigenda & Extension Simulation Suite */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Corrigenda & Deadline Extension Simulator
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Test Agent 22's autonomous update detector: simulate when a funding portal issues an official corrigendum (e.g. extending submission deadline or revising budget ceilings). Agent 22 detects the diff and triggers instant alerts.
        </p>

        <form onSubmit={handleRunSimulation} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Select Target Call</label>
            <select
              value={selectedCallForCorrigendum}
              onChange={(e) => setSelectedCallForCorrigendum(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {grantCalls.map(c => (
                <option key={c.id} value={c.id}>
                  {c.agency}: {c.schemeName.substring(0, 35)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Corrigendum Title</label>
            <input
              type="text"
              value={corrigendumTitle}
              onChange={(e) => setCorrigendumTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">New Submission Deadline</label>
            <input
              type="date"
              value={corrigendumDeadline}
              onChange={(e) => setCorrigendumDeadline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              id="simulate-corrigendum-btn"
              type="submit"
              disabled={isSimulating}
              className="w-full py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{isSimulating ? 'Publishing...' : 'Publish Corrigendum'}</span>
            </button>
          </div>
        </form>

        {simulationSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>
              <strong>Corrigendum Detected & Logged:</strong> Grant call updated with new deadline. Agent 22 auto-dispatched urgent notifications to all matched faculty!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
