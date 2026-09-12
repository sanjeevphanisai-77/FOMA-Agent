import React from 'react';
import { 
  Building2, 
  Calendar, 
  Sparkles, 
  Cpu, 
  Database, 
  BellRing, 
  Layers, 
  Activity,
  Bot
} from 'lucide-react';
import { FacultyProfile } from '../types';

interface HeaderProps {
  activeTab: 'feed' | 'calendar' | 'pipeline' | 'sources' | 'tech';
  setActiveTab: (tab: 'feed' | 'calendar' | 'pipeline' | 'sources' | 'tech') => void;
  facultyProfiles: FacultyProfile[];
  selectedFacultyId: string;
  onSelectFacultyId: (id: string) => void;
  urgentDeadlinesCount: number;
  activeProposalsCount: number;
  onToggleChatDrawer: () => void;
  isChatOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  facultyProfiles,
  selectedFacultyId,
  onSelectFacultyId,
  urgentDeadlinesCount,
  activeProposalsCount,
  onToggleChatDrawer,
  isChatOpen,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Institutional Header Bar - Matching Vignan's University Style in Uploaded Image */}
      <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Vignan's Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-red-600 flex items-center justify-center font-bold text-white tracking-wider text-sm shadow-inner">
                V
              </div>
              <div>
                <span className="font-extrabold tracking-tight text-white uppercase text-sm block leading-none">
                  VIGNAN'S
                </span>
                <span className="text-[10px] text-slate-300 font-medium tracking-wide block leading-tight">
                  Foundation for Science, Technology & Research (Deemed to be University)
                </span>
              </div>
            </div>
            <span className="hidden sm:inline-block h-4 w-px bg-slate-700"></span>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300 font-medium text-[11px]">
              <span className="text-red-400 font-semibold">CSE PRESENTS</span>
              <span>AGENTIC AI DAY 2026</span>
            </div>
          </div>

          {/* Accreditation Badges from photo: NAAC A+, NIRF, NBA, UGC, AICTE, ABET */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold">
              NAAC A+
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
              NIRF Top 100
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
              NBA Accredited
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
              UGC / AICTE
            </span>
            <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
              ABET
            </span>
          </div>

          {/* System Agent Health Status */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-emerald-300">Crawler: Active (Cadence 06:00)</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-blue-300">
              <span className="font-mono">Bus: Agent 17 ➜ 22 ➜ 20/21</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Title and Agent ID */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                Agent 22: Funding Opportunity Monitoring Agent
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Autonomous
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>DST • ANRF/SERB • MeitY • DRDO • ICMR • AICTE • Bilateral</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-medium">8 Portals Monitored</span>
            </p>
          </div>
        </div>

        {/* Action Controls: Faculty Selector, Buji Assistant Button, Quick Stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Faculty Selector (Simulates Agent 17 profile ingestion) */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium px-2 hidden sm:inline">Active PI:</span>
            <select
              id="faculty-select-dropdown"
              value={selectedFacultyId}
              onChange={(e) => onSelectFacultyId(e.target.value)}
              className="bg-white text-slate-800 font-semibold rounded px-2 py-1 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {facultyProfiles.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.designation.split(' ')[0]}) - {f.department.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Buji Mascot AI Chat Toggle Button */}
          <button
            id="toggle-buji-copilot-btn"
            onClick={onToggleChatDrawer}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
              isChatOpen 
                ? 'bg-blue-700 text-white shadow-blue-500/25 ring-2 ring-blue-300' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Buji Copilot</span>
            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 border-t border-slate-100 overflow-x-auto text-xs sm:text-sm font-medium">
        <button
          id="tab-curated-feed"
          onClick={() => setActiveTab('feed')}
          className={`px-3 sm:px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'feed'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Curated Faculty Feed</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
            Matches
          </span>
        </button>

        <button
          id="tab-calendar-view"
          onClick={() => setActiveTab('calendar')}
          className={`px-3 sm:px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'calendar'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Department Calendar & Deadlines</span>
          {urgentDeadlinesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[11px] font-bold animate-pulse">
              {urgentDeadlinesCount} Urgent
            </span>
          )}
        </button>

        <button
          id="tab-pipeline-view"
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 sm:px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'pipeline'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Opportunity Pipeline</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold">
            {activeProposalsCount} Active
          </span>
        </button>

        <button
          id="tab-sources-view"
          onClick={() => setActiveTab('sources')}
          className={`px-3 sm:px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'sources'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Portals & Scraper Cadence</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
        </button>

        <button
          id="tab-tech-stack-view"
          onClick={() => setActiveTab('tech')}
          className={`px-3 sm:px-4 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'tech'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Tech Stack & Architecture</span>
          <span className="text-[10px] px-1 rounded bg-slate-100 text-slate-600 font-mono">
            Python/Postgres/Docker
          </span>
        </button>
      </div>
    </header>
  );
};
