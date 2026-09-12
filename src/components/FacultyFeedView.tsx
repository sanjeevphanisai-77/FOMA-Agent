import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  IndianRupee, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  ExternalLink, 
  Search, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark, 
  BookOpen, 
  Bell, 
  UserCheck, 
  Briefcase,
  Layers,
  FileText,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { FacultyProfile, GrantCall, MatchScore, FundingAgency } from '../types';

interface FacultyFeedViewProps {
  activeFaculty: FacultyProfile;
  grantCalls: GrantCall[];
  matchScores: MatchScore[];
  onSelectGrant: (grant: GrantCall) => void;
  onPursueGrant: (grant: GrantCall, match: MatchScore) => void;
  onDismissMatch: (matchId: string) => void;
  onOpenNotificationModal: (grant: GrantCall) => void;
}

export const FacultyFeedView: React.FC<FacultyFeedViewProps> = ({
  activeFaculty,
  grantCalls,
  matchScores,
  onSelectGrant,
  onPursueGrant,
  onDismissMatch,
  onOpenNotificationModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(75);
  const [sortOrder, setSortOrder] = useState<'score' | 'deadline' | 'funding'>('score');

  // Filter and sort matches for active faculty
  const facultyMatches = matchScores.filter(m => m.facultyId === activeFaculty.id);

  const matchedItems = facultyMatches
    .map(match => {
      const grant = grantCalls.find(g => g.id === match.callId);
      return { match, grant };
    })
    .filter((item): item is { match: MatchScore; grant: GrantCall } => !!item.grant)
    .filter(({ match, grant }) => {
      if (match.overallScore < minScoreFilter) return false;
      if (selectedAgency !== 'ALL' && grant.agency !== selectedAgency) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = grant.schemeName.toLowerCase().includes(q);
        const matchesCode = grant.schemeCode.toLowerCase().includes(q);
        const matchesAreas = grant.researchAreas.some(a => a.toLowerCase().includes(q));
        const matchesAgency = grant.agency.toLowerCase().includes(q);
        return matchesName || matchesCode || matchesAreas || matchesAgency;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'score') {
        return b.match.overallScore - a.match.overallScore;
      }
      if (sortOrder === 'funding') {
        return b.grant.fundingCeilingInLakhs - a.grant.fundingCeilingInLakhs;
      }
      // deadline
      return new Date(a.grant.submissionDeadline).getTime() - new Date(b.grant.submissionDeadline).getTime();
    });

  // Calculate days remaining
  const getDaysRemaining = (deadlineStr: string) => {
    const today = new Date('2026-09-11'); // Anchored to environment time
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const agenciesList: FundingAgency[] = [
    'ANRF/SERB', 
    'MeitY', 
    'DRDO', 
    'DST', 
    'ICMR', 
    'AICTE', 
    'International (Horizon/IGSTC/Indo-US)'
  ];

  return (
    <div className="space-y-6">
      {/* Faculty Profile Summary Banner (Ingested from Agent 17) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Avatar + Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={activeFaculty.avatarUrl}
                alt={activeFaculty.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                PI
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {activeFaculty.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {activeFaculty.designation}
                </span>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium border border-blue-100">
                  Agent 17 Profile Ingested
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {activeFaculty.department} • <span className="font-mono text-slate-700">{activeFaculty.email}</span>
              </p>

              {/* Research Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Expertise:</span>
                {activeFaculty.publicationKeywords.slice(0, 5).map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 text-[11px] font-medium border border-slate-200/80"
                  >
                    {kw}
                  </span>
                ))}
                {activeFaculty.publicationKeywords.length > 5 && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    +{activeFaculty.publicationKeywords.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Capacity & Publications Metrics */}
          <div className="flex items-center gap-3 sm:gap-4 divide-x divide-slate-100 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
            <div className="px-2 text-center">
              <span className="text-xs text-slate-500 block font-medium">h-Index</span>
              <span className="text-lg font-extrabold text-slate-900">{activeFaculty.hIndex}</span>
            </div>
            <div className="px-3 text-center">
              <span className="text-xs text-slate-500 block font-medium">Papers</span>
              <span className="text-lg font-extrabold text-blue-600">{activeFaculty.recentPublicationsCount}</span>
            </div>
            <div className="px-3 text-center">
              <span className="text-xs text-slate-500 block font-medium">Active Grants</span>
              <span className="text-lg font-extrabold text-slate-900">
                {activeFaculty.activeProjectCommitments.length} / {activeFaculty.maxConcurrentProjects}
              </span>
            </div>
            <div className="px-3 text-center">
              <span className="text-xs text-slate-500 block font-medium">Grant Capacity</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Eligible
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="faculty-feed-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, keywords, agencies..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <select
            id="agency-filter-select"
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Funding Agencies</option>
            {agenciesList.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Min Match:</span>
            <select
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-800"
            >
              <option value={70}>70%+</option>
              <option value={80}>80%+</option>
              <option value={85}>85%+ (Recommended)</option>
              <option value={90}>90%+ (Top Tier)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Sort by:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-800"
            >
              <option value="score">Match Score (Highest)</option>
              <option value="deadline">Urgency (Days Left)</option>
              <option value="funding">Ceiling Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Curated Opportunities List */}
      <div className="space-y-4">
        {matchedItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Sparkles className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No funding calls match the current filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try lowering the minimum match score threshold or clearing the agency search filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAgency('ALL');
                setMinScoreFilter(70);
              }}
              className="mt-4 px-4 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          matchedItems.map(({ match, grant }) => {
            const daysLeft = getDaysRemaining(grant.submissionDeadline);
            const isUrgent = daysLeft <= 25;
            const isPursued = match.userDecision === 'PURSUED';
            const isDismissed = match.userDecision === 'DISMISSED';

            return (
              <div
                key={grant.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md overflow-hidden ${
                  isPursued 
                    ? 'border-blue-400 ring-2 ring-blue-100' 
                    : isDismissed 
                    ? 'opacity-60 border-slate-200 bg-slate-50/50' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Corrigendum Announcement Strip if active */}
                {grant.corrigendaHistory.length > 0 && (
                  <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>{grant.corrigendaHistory[0].title}: {grant.corrigendaHistory[0].description}</span>
                    </div>
                    <span className="text-[11px] font-mono opacity-80">
                      Corrigendum #{grant.corrigendaHistory.length}
                    </span>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  {/* Top Bar: Match Score Badge + Agency + Deadline Countdown */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Overall Match Score Pill */}
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${
                        match.overallScore >= 90
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : match.overallScore >= 80
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{match.overallScore}% Overall Match</span>
                      </div>

                      {/* Agency badge */}
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-white tracking-wide">
                        {grant.agency}
                      </span>

                      <span className="text-xs font-mono text-slate-400">
                        {grant.schemeCode}
                      </span>

                      {isPursued && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Pursued (In Pipeline)
                        </span>
                      )}
                    </div>

                    {/* Deadline & Urgency */}
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                        isUrgent
                          ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        <Clock className="h-3.5 w-3.5" />
                        <span>{daysLeft} days remaining</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        Due: {new Date(grant.submissionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Title and Summary */}
                  <div className="mt-3">
                    <h3 
                      onClick={() => onSelectGrant(grant)}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {grant.schemeName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {grant.summary}
                    </p>
                  </div>

                  {/* Key Grant Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Funding Ceiling</span>
                      <span className="text-slate-900 font-extrabold text-sm sm:text-base flex items-center">
                        ₹{grant.fundingCeilingInLakhs.toFixed(1)} <span className="text-xs font-normal text-slate-500 ml-1">Lakhs</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Project Duration</span>
                      <span className="text-slate-900 font-bold text-sm sm:text-base">
                        {grant.projectDurationMonths} <span className="text-xs font-normal text-slate-500">Months</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Eligible Ranks</span>
                      <span className="text-slate-900 font-semibold text-xs sm:text-sm truncate block">
                        {grant.eligibilityCriteria.minimumDesignation}+
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Format / Proforma</span>
                      <span className="text-blue-600 font-medium text-xs truncate block" title={grant.requiredFormat}>
                        {grant.requiredFormat.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Explainable Matching Breakdown Bar */}
                  <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100/70 mb-4">
                    <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1 text-blue-900">
                        <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                        Match Reasoning (Why this was pushed to {activeFaculty.name}):
                      </span>
                      <span className="text-blue-700 text-[11px]">
                        Research: {match.breakdown.researchFit}% • Eligibility: {match.breakdown.eligibilityFit}% • Capacity: {match.breakdown.commitmentFit}%
                      </span>
                    </div>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {match.reasons.slice(0, 2).map((r, i) => (
                        <li key={i} className="leading-tight">{r}</li>
                      ))}
                    </ul>

                    {/* Matched Keywords Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-blue-100/60 text-[11px]">
                      <span className="text-slate-500 font-medium">Matched Keywords:</span>
                      {match.matchedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.2 rounded bg-white text-blue-700 border border-blue-200 font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectGrant(grant)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>Eligibility & Scheme Details</span>
                      </button>

                      <button
                        onClick={() => onOpenNotificationModal(grant)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                      >
                        <Bell className="h-3.5 w-3.5" />
                        <span>Alert Schedule</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Active Learning Feedback: Dismiss */}
                      {!isPursued && (
                        <button
                          onClick={() => onDismissMatch(match.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                          title="Not relevant: refines matching weights"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Dismiss</span>
                        </button>
                      )}

                      {/* Pursue Opportunity Action (Connects to Agent 20) */}
                      <button
                        id={`pursue-grant-btn-${grant.id}`}
                        onClick={() => onPursueGrant(grant, match)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                          isPursued
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                        }`}
                      >
                        <span>{isPursued ? 'Pursuing (In Pipeline)' : 'Pursue Call (Send to Agent 20)'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
