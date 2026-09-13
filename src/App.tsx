import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FacultyFeedView } from './components/FacultyFeedView';
import { DepartmentCalendarView } from './components/DepartmentCalendarView';
import { PipelineTrackerView } from './components/PipelineTrackerView';
import { SourcesScraperMonitor } from './components/SourcesScraperMonitor';
import { TechStackView } from './components/TechStackView';
import { LaraMascotAssistant } from './components/LaraMascotAssistant';
import { GrantDetailModal } from './components/GrantDetailModal';
import { NotificationScheduleModal } from './components/NotificationScheduleModal';
import { 
  GrantCall, 
  FacultyProfile, 
  MatchScore, 
  PipelineOpportunity, 
  SourceCrawlerStatus, 
  NotificationAlert, 
  PipelineStage 
} from './types';
import { 
  INITIAL_GRANT_CALLS, 
  INITIAL_FACULTY_PROFILES, 
  INITIAL_MATCH_SCORES, 
  INITIAL_PIPELINE, 
  INITIAL_SOURCES, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { Sparkles, Bot, Calendar, Layers, Activity, Database, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'feed' | 'calendar' | 'pipeline' | 'sources' | 'tech'>('feed');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Core Data State
  const [grantCalls, setGrantCalls] = useState<GrantCall[]>(INITIAL_GRANT_CALLS);
  const [facultyProfiles, setFacultyProfiles] = useState<FacultyProfile[]>(INITIAL_FACULTY_PROFILES);
  const [matchScores, setMatchScores] = useState<MatchScore[]>(INITIAL_MATCH_SCORES);
  const [pipeline, setPipeline] = useState<PipelineOpportunity[]>(INITIAL_PIPELINE);
  const [sources, setSources] = useState<SourceCrawlerStatus[]>(INITIAL_SOURCES);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);

  // Active Faculty PI Selection (Defaults to Dr. Akshay Gupta from image/demo)
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(INITIAL_FACULTY_PROFILES[0].id);

  // Modals state
  const [selectedGrantForModal, setSelectedGrantForModal] = useState<GrantCall | null>(null);
  const [grantForNotificationModal, setGrantForNotificationModal] = useState<GrantCall | null>(null);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  // Fetch initial data from full-stack API on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [resCalls, resFac, resMatches, resPipe, resSources, resNotifs] = await Promise.all([
          fetch('/api/opportunities'),
          fetch('/api/faculty'),
          fetch('/api/matches'),
          fetch('/api/pipeline'),
          fetch('/api/sources'),
          fetch('/api/notifications'),
        ]);

        if (resCalls.ok) {
          const data = await resCalls.json();
          if (Array.isArray(data) && data.length > 0) setGrantCalls(data);
        }
        if (resFac.ok) {
          const data = await resFac.json();
          if (Array.isArray(data) && data.length > 0) setFacultyProfiles(data);
        }
        if (resMatches.ok) {
          const data = await resMatches.json();
          if (Array.isArray(data) && data.length > 0) setMatchScores(data);
        }
        if (resPipe.ok) {
          const data = await resPipe.json();
          if (Array.isArray(data) && data.length > 0) setPipeline(data);
        }
        if (resSources.ok) {
          const data = await resSources.json();
          if (Array.isArray(data) && data.length > 0) setSources(data);
        }
        if (resNotifs.ok) {
          const data = await resNotifs.json();
          if (Array.isArray(data) && data.length > 0) setNotifications(data);
        }
      } catch (err) {
        console.warn('Backend API connection defaulted to client-side reactive store');
      }
    }

    loadBackendData();
  }, []);

  const activeFaculty = facultyProfiles.find(f => f.id === selectedFacultyId) || facultyProfiles[0];

  // Handler: Pursue Grant (Feeds Agent 20)
  const handlePursueGrant = async (grant: GrantCall, match: MatchScore) => {
    // 1. Update Match Decision
    setMatchScores(prev => prev.map(m => m.id === match.id ? { ...m, userDecision: 'PURSUED' } : m));

    // 2. Add or Promote in Pipeline
    const existingIndex = pipeline.findIndex(p => p.callId === grant.id && p.facultyId === activeFaculty.id);
    if (existingIndex === -1) {
      const newPipelineItem: PipelineOpportunity = {
        id: `pipe-${Date.now()}`,
        callId: grant.id,
        facultyId: activeFaculty.id,
        facultyName: activeFaculty.name,
        schemeName: grant.schemeName,
        agency: grant.agency,
        stage: 'AGENT20_DRAFTING',
        targetSubmissionDate: grant.submissionDeadline,
        coInvestigators: [],
        budgetRequestedLakhs: grant.fundingCeilingInLakhs * 0.9,
        agent20Handshake: {
          status: 'SYNOPSIS_GENERATED',
          synopsisDocumentId: `DOC-${grant.agency}-${Date.now().toString().slice(-4)}`,
          lastPushedAt: new Date().toISOString(),
        },
        agent21Compliance: {
          status: 'PENDING',
          issuesFound: [],
        },
        outcomeNotes: `Initiated by ${activeFaculty.name}. Synopsis pushed to Agent 20 (Proposal Drafting).`,
        updatedAt: new Date().toISOString(),
      };

      setPipeline(prev => [newPipelineItem, ...prev]);

      // Server sync
      try {
        await fetch(`/api/matches/${match.id}/decision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision: 'PURSUED' }),
        });
      } catch (e) {}

      showToast(
        'Handshake Sent to Agent 20!',
        `Proposal synopsis generated for ${grant.schemeName}. Moving to drafting stage.`
      );
    } else {
      showToast('Already in Pipeline', `${grant.schemeName} is already active in your proposal pipeline.`);
    }
  };

  // Handler: Dismiss Match (Active learning feedback)
  const handleDismissMatch = async (matchId: string) => {
    setMatchScores(prev => prev.map(m => m.id === matchId ? { ...m, userDecision: 'DISMISSED' } : m));
    try {
      await fetch(`/api/matches/${matchId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision: 'DISMISSED', feedbackNotes: 'Filtered by faculty as low immediate fit' }),
      });
    } catch (e) {}

    showToast('Match Dismissed', 'Feedback logged. Agent 22 active learning model will refine future match weights.');
  };

  // Handler: Advance Pipeline Stage
  const handleAdvancePipeline = async (id: string, nextStage: PipelineStage, notes?: string) => {
    setPipeline(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stage: nextStage,
          outcomeNotes: notes || item.outcomeNotes,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    }));

    try {
      await fetch(`/api/pipeline/${id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextStage, notes }),
      });
    } catch (e) {}

    showToast('Pipeline Updated', `Opportunity advanced to: ${nextStage.replace(/_/g, ' ')}`);
  };

  // Handler: Trigger immediate crawl on a source
  const handleTriggerCrawl = async (sourceId: string) => {
    try {
      const res = await fetch(`/api/sources/${sourceId}/crawl`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setSources(prev => prev.map(s => s.id === sourceId ? data.source : s));
      } else {
        throw new Error('Fallback to local state');
      }
    } catch (e) {
      setSources(prev => prev.map(s => {
        if (s.id === sourceId) {
          return {
            ...s,
            lastRunTime: 'Just now',
            callsExtracted: s.callsExtracted + 1,
            status: 'HEALTHY',
          };
        }
        return s;
      }));
    }

    showToast('Crawler Completed', 'Ingested latest portal calls and validated SHA-256 deduplication.');
  };

  // Handler: Simulate Corrigendum / Deadline Extension
  const handleSimulateCorrigendum = async (callId: string, title: string, newDeadline: string, type: any) => {
    try {
      const res = await fetch(`/api/opportunities/${callId}/corrigendum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, newDeadline, type }),
      });

      if (res.ok) {
        const data = await res.json();
        setGrantCalls(prev => prev.map(c => c.id === callId ? data.call : c));
      } else {
        throw new Error('Fallback local update');
      }
    } catch (e) {
      setGrantCalls(prev => prev.map(c => {
        if (c.id === callId) {
          return {
            ...c,
            submissionDeadline: newDeadline,
            status: 'extended',
            corrigendaHistory: [
              {
                id: `corr-${Date.now()}`,
                date: '2026-09-11',
                title,
                type: 'DEADLINE_EXTENSION',
                description: `Official extension notice detected. Deadline moved to ${newDeadline}`,
                previousDeadline: c.submissionDeadline,
                newDeadline,
              },
              ...c.corrigendaHistory,
            ]
          };
        }
        return c;
      }));
    }

    showToast('Corrigendum Detected!', `Deadline updated to ${newDeadline}. Dispatched urgent alert to matched faculty.`);
  };

  // Handler: Send Test Notification
  const handleSendTestNotification = (alertData: Partial<NotificationAlert>) => {
    const newAlert: NotificationAlert = {
      id: `notif-${Date.now()}`,
      callId: alertData.callId || '',
      facultyId: alertData.facultyId || activeFaculty.id,
      facultyName: alertData.facultyName || activeFaculty.name,
      callTitle: alertData.callTitle || '',
      agency: alertData.agency || 'ANRF/SERB',
      alertType: alertData.alertType || 'PREPARATION_THRESHOLD_30D',
      deadline: alertData.deadline || '2026-10-31',
      scheduledTime: new Date().toISOString(),
      sentTime: new Date().toISOString(),
      status: 'SENT',
      channels: alertData.channels || ['EMAIL', 'WHATSAPP'],
      messageBody: alertData.messageBody || 'Deadline notification alert.',
    };

    setNotifications(prev => [newAlert, ...prev]);
    showToast('Alert Dispatched', `Notification sent to ${activeFaculty.name} via ${newAlert.channels.join(', ')}.`);
  };

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Urgent deadlines count (<25 days)
  const urgentCount = grantCalls.filter(c => {
    const diff = new Date(c.submissionDeadline).getTime() - new Date('2026-09-11').getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) <= 25;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased font-sans">
      {/* Institutional Vignan Header with Accreditation & Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        facultyProfiles={facultyProfiles}
        selectedFacultyId={selectedFacultyId}
        onSelectFacultyId={setSelectedFacultyId}
        urgentDeadlinesCount={urgentCount}
        activeProposalsCount={pipeline.length}
        onToggleChatDrawer={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Layout: Main View + Side Lara Mascot Panel on large screens */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Main Primary View (8 cols or full width if chat is toggled) */}
          <div className={`${isChatOpen ? 'xl:col-span-8' : 'xl:col-span-12'} transition-all duration-300`}>
            {activeTab === 'feed' && (
              <FacultyFeedView
                activeFaculty={activeFaculty}
                grantCalls={grantCalls}
                matchScores={matchScores}
                onSelectGrant={(g) => setSelectedGrantForModal(g)}
                onPursueGrant={handlePursueGrant}
                onDismissMatch={handleDismissMatch}
                onOpenNotificationModal={(g) => setGrantForNotificationModal(g)}
              />
            )}

            {activeTab === 'calendar' && (
              <DepartmentCalendarView
                grantCalls={grantCalls}
                onSelectGrant={(g) => setSelectedGrantForModal(g)}
              />
            )}

            {activeTab === 'pipeline' && (
              <PipelineTrackerView
                pipeline={pipeline}
                grantCalls={grantCalls}
                facultyProfiles={facultyProfiles}
                onAdvancePipeline={handleAdvancePipeline}
                onSelectGrant={(g) => setSelectedGrantForModal(g)}
              />
            )}

            {activeTab === 'sources' && (
              <SourcesScraperMonitor
                sources={sources}
                grantCalls={grantCalls}
                onTriggerCrawl={handleTriggerCrawl}
                onSimulateCorrigendum={handleSimulateCorrigendum}
                onSelectGrant={(g) => setSelectedGrantForModal(g)}
              />
            )}

            {activeTab === 'tech' && (
              <TechStackView grantCalls={grantCalls} />
            )}
          </div>

          {/* Side Panel: Lara Mascot Assistant (Inspired by the photo's left chatbot interface!) */}
          {isChatOpen && (
            <div className="xl:col-span-4 sticky top-24">
              <LaraMascotAssistant
                activeFaculty={activeFaculty}
                grantCalls={grantCalls}
                onSelectGrant={(g) => setSelectedGrantForModal(g)}
                onPushToAgent20={(g) => {
                  const m = matchScores.find(match => match.callId === g.id && match.facultyId === activeFaculty.id) || matchScores[0];
                  handlePursueGrant(g, m);
                }}
                onClose={() => setIsChatOpen(false)}
                isDrawer={true}
              />
            </div>
          )}
        </div>
      </main>

      {/* Floating Lara Trigger when drawer is closed */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
          title="Open Lara AI Copilot"
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-blue-600 animate-ping"></span>
          </div>
          <span className="font-bold text-xs pr-1">Ask Lara Copilot</span>
        </button>
      )}

      {/* Toast Notification Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 max-w-md animate-in slide-in-from-bottom-5 duration-200 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-xs block text-slate-100">{toastMessage.title}</span>
            <span className="text-[11px] text-slate-300 leading-tight block mt-0.5">{toastMessage.desc}</span>
          </div>
        </div>
      )}

      {/* Grant Call Detail Modal */}
      <GrantDetailModal
        grant={selectedGrantForModal}
        onClose={() => setSelectedGrantForModal(null)}
        facultyProfiles={facultyProfiles}
        matchScores={matchScores}
        onPursueGrant={handlePursueGrant}
        onOpenNotificationModal={(g) => {
          setSelectedGrantForModal(null);
          setGrantForNotificationModal(g);
        }}
      />

      {/* Deadline Notification Schedule Modal */}
      <NotificationScheduleModal
        grant={grantForNotificationModal}
        activeFaculty={activeFaculty}
        notifications={notifications}
        onClose={() => setGrantForNotificationModal(null)}
        onSendTestNotification={handleSendTestNotification}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Agent 22: Funding Opportunity Monitoring Agent</span>
            <span>•</span>
            <span>Vignan's Deemed to be University (CSE Agentic AI Day 2026)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Consumes Agent 17 (Faculty Profiler)</span>
            <span>•</span>
            <span>Feeds Agent 20 (Drafting) & Agent 21 (Compliance)</span>
            <span>•</span>
            <span className="font-mono text-emerald-600 font-semibold">Postgres + Python 3.11</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
