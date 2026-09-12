import React, { useState } from 'react';
import { 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  FileText, 
  Award, 
  XCircle, 
  Send, 
  Plus, 
  TrendingUp,
  Download,
  Building2
} from 'lucide-react';
import { PipelineOpportunity, PipelineStage, GrantCall, FacultyProfile } from '../types';

interface PipelineTrackerViewProps {
  pipeline: PipelineOpportunity[];
  grantCalls: GrantCall[];
  facultyProfiles: FacultyProfile[];
  onAdvancePipeline: (id: string, nextStage: PipelineStage, notes?: string) => void;
  onSelectGrant: (grant: GrantCall) => void;
}

export const PipelineTrackerView: React.FC<PipelineTrackerViewProps> = ({
  pipeline,
  grantCalls,
  facultyProfiles,
  onAdvancePipeline,
  onSelectGrant,
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');

  // Stages definition
  const STAGES: { key: PipelineStage; label: string; description: string; color: string }[] = [
    { 
      key: 'PURSUED', 
      label: '1. Pursued / Matched', 
      description: 'Faculty expressed interest via Agent 22 match feed',
      color: 'bg-blue-50 text-blue-700 border-blue-200' 
    },
    { 
      key: 'AGENT20_DRAFTING', 
      label: '2. Agent 20 (Drafting)', 
      description: 'AI Proposal Drafting Assistant generating narrative & Gantt',
      color: 'bg-purple-50 text-purple-700 border-purple-200' 
    },
    { 
      key: 'AGENT21_COMPLIANCE', 
      label: '3. Agent 21 (Compliance)', 
      description: 'Checking overheads, budget ceilings, ethics & formats',
      color: 'bg-amber-50 text-amber-700 border-amber-200' 
    },
    { 
      key: 'INTERNAL_REVIEW', 
      label: '4. Dean Review', 
      description: 'Departmental R&D committee evaluation & institutional endorsement',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200' 
    },
    { 
      key: 'SUBMITTED', 
      label: '5. Portal Submitted', 
      description: 'Final signed package uploaded to official agency portal',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    },
    { 
      key: 'AWARDED', 
      label: '6. Grant Awarded', 
      description: 'Sanction letter received; active learning loop reinforced',
      color: 'bg-green-100 text-green-800 border-green-300' 
    }
  ];

  // Pipeline metrics
  const totalBudgetLakhs = pipeline.reduce((sum, item) => sum + item.budgetRequestedLakhs, 0);
  const activeProposals = pipeline.filter(p => p.stage !== 'AWARDED' && p.stage !== 'REJECTED');
  const awardedCount = pipeline.filter(p => p.stage === 'AWARDED').length;

  const exportReport = () => {
    const csvRows = [
      ['Proposal ID', 'Faculty PI', 'Scheme Name', 'Agency', 'Stage', 'Budget Requested (Lakhs)', 'Target Deadline', 'Agent 20 Status', 'Agent 21 Status'],
      ...pipeline.map(p => [
        p.id,
        p.facultyName,
        `"${p.schemeName}"`,
        p.agency,
        p.stage,
        p.budgetRequestedLakhs,
        p.targetSubmissionDate,
        p.agent20Handshake.status,
        p.agent21Compliance.status
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Vignan_Opportunity_Pipeline_Report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Metrics & Inter-Agent Bus Architecture */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Departmental Research Proposal Pipeline
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                Agent 20 & 21 Feed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              End-to-end tracking of pursued calls from discovery to proposal drafting, budget verification, and sanction outcome.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportReport}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export Pipeline Report (CSV)</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-xs text-slate-500 font-medium block">Total Pipeline Value</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
              ₹{(totalBudgetLakhs / 100).toFixed(2)} Cr
            </span>
            <span className="text-[11px] text-slate-500">across {pipeline.length} active submissions</span>
          </div>

          <div className="bg-purple-50/60 rounded-xl p-3 border border-purple-100">
            <span className="text-xs text-purple-700 font-medium block">Agent 20 Drafting Handshakes</span>
            <span className="text-xl font-extrabold text-purple-900 mt-0.5 block">
              {pipeline.filter(p => p.agent20Handshake.status !== 'NOT_STARTED').length} Calls
            </span>
            <span className="text-[11px] text-purple-600">Automated Synopsis Synced</span>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
            <span className="text-xs text-emerald-700 font-medium block">Agent 21 Compliance Passes</span>
            <span className="text-xl font-extrabold text-emerald-900 mt-0.5 block">
              {pipeline.filter(p => p.agent21Compliance.status === 'BUDGET_VERIFIED' || p.agent21Compliance.status === 'OVERHEADS_VERIFIED').length} Cleared
            </span>
            <span className="text-[11px] text-emerald-600">Overheads & Ceilings Checked</span>
          </div>

          <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
            <span className="text-xs text-blue-700 font-medium block">Dean Review Ready</span>
            <span className="text-xl font-extrabold text-blue-900 mt-0.5 block">
              {pipeline.filter(p => p.stage === 'INTERNAL_REVIEW').length} Proposals
            </span>
            <span className="text-[11px] text-blue-600">Scheduled for R&D Sign-off</span>
          </div>
        </div>
      </div>

      {/* Pipeline Inter-Agent Flow Diagram */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-blue-400" />
            Inter-Agent Architecture Data Bus (Agent 17 ➜ Agent 22 ➜ Agent 20/21)
          </span>
          <span className="text-emerald-400 font-mono text-[11px]">Active RPC Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
            <span className="text-[10px] font-bold text-blue-400 block uppercase">Input Node</span>
            <span className="font-bold text-sm text-white block mt-0.5">Agent 17</span>
            <p className="text-[11px] text-slate-300 mt-1 leading-tight">
              Faculty Research Profiler: Pushes Scopus/WoS publication keywords, h-index, and workload limits.
            </p>
          </div>

          <div className="bg-blue-950/80 rounded-xl p-3 border border-blue-700 relative">
            <span className="text-[10px] font-bold text-blue-300 block uppercase">Current Engine</span>
            <span className="font-bold text-sm text-white block mt-0.5">Agent 22 (This Agent)</span>
            <p className="text-[11px] text-blue-100 mt-1 leading-tight">
              Monitors DST/ANRF/DRDO portals, matches calls, tracks corrigenda, schedules deadline alerts.
            </p>
          </div>

          <div className="bg-purple-950/80 rounded-xl p-3 border border-purple-700">
            <span className="text-[10px] font-bold text-purple-300 block uppercase">Downstream Feeder</span>
            <span className="font-bold text-sm text-white block mt-0.5">Agent 20</span>
            <p className="text-[11px] text-purple-200 mt-1 leading-tight">
              Proposal Drafting Assistant: Consumes call proforma & faculty keywords to draft project synopsis.
            </p>
          </div>

          <div className="bg-amber-950/80 rounded-xl p-3 border border-amber-700">
            <span className="text-[10px] font-bold text-amber-300 block uppercase">Downstream Validator</span>
            <span className="font-bold text-sm text-white block mt-0.5">Agent 21</span>
            <p className="text-[11px] text-amber-200 mt-1 leading-tight">
              Compliance & Budget Checker: Enforces 10% overhead rule, travel ceilings, and ethical clearances.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Cards by Stage */}
      <div className="space-y-4">
        {pipeline.map((item) => {
          const grant = grantCalls.find(g => g.id === item.callId);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-white">
                    {item.agency}
                  </span>

                  <span className="text-xs font-bold text-slate-800">
                    PI: {item.facultyName}
                  </span>

                  <span className="text-slate-300">•</span>

                  <span className="text-xs text-slate-500 font-mono">
                    Due: {new Date(item.targetSubmissionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Stage Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Stage:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {item.stage.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Title & Grant overview */}
              <div className="mt-3">
                <h3 
                  onClick={() => grant && onSelectGrant(grant)}
                  className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                >
                  {item.schemeName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Budget Requested: <strong className="text-slate-900 font-bold">₹{item.budgetRequestedLakhs} Lakhs</strong>
                  {item.coInvestigators.length > 0 && (
                    <span> • Co-PIs: {item.coInvestigators.join(', ')}</span>
                  )}
                </p>
              </div>

              {/* Inter-Agent Status Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                {/* Agent 20 Handshake Status */}
                <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5">
                  <Bot className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-purple-900 block">
                      Agent 20 (Drafting Handshake): {item.agent20Handshake.status}
                    </span>
                    {item.agent20Handshake.synopsisDocumentId ? (
                      <span className="text-[10px] text-purple-700 font-mono block">
                        Doc: {item.agent20Handshake.synopsisDocumentId}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 block">
                        Pending faculty initiation
                      </span>
                    )}
                  </div>
                </div>

                {/* Agent 21 Compliance Status */}
                <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-emerald-900 block">
                      Agent 21 (Compliance & Budget): {item.agent21Compliance.status}
                    </span>
                    {item.agent21Compliance.issuesFound.length > 0 ? (
                      <span className="text-[10px] text-amber-700 font-medium block">
                        Flag: {item.agent21Compliance.issuesFound[0]}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-medium block">
                        All format & budget ceilings validated
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Outcome / Progress Notes */}
              {item.outcomeNotes && (
                <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                  <strong className="text-slate-700">R&D Coordinator Log:</strong> {item.outcomeNotes}
                </div>
              )}

              {/* Action Toolbar to Advance Stages & Refine Matching */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Last synced: {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {item.stage === 'PURSUED' && (
                    <button
                      onClick={() => onAdvancePipeline(item.id, 'AGENT20_DRAFTING', 'Proposal synopsis generated and pushed to Agent 20.')}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bot className="h-3.5 w-3.5" />
                      <span>Push to Agent 20 (Drafting)</span>
                    </button>
                  )}

                  {item.stage === 'AGENT20_DRAFTING' && (
                    <button
                      onClick={() => onAdvancePipeline(item.id, 'AGENT21_COMPLIANCE', 'Draft received; Agent 21 initiated compliance & budget audit.')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Pass to Agent 21 (Compliance)</span>
                    </button>
                  )}

                  {item.stage === 'AGENT21_COMPLIANCE' && (
                    <button
                      onClick={() => onAdvancePipeline(item.id, 'INTERNAL_REVIEW', 'All compliance checks passed. Forwarded to Dean of R&D Committee.')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      <span>Submit for Dean Review</span>
                    </button>
                  )}

                  {item.stage === 'INTERNAL_REVIEW' && (
                    <button
                      onClick={() => onAdvancePipeline(item.id, 'SUBMITTED', 'Institutional endorsement certificate signed. Submitted on official agency portal.')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Mark Portal Submitted</span>
                    </button>
                  )}

                  {item.stage === 'SUBMITTED' && (
                    <>
                      <button
                        onClick={() => onAdvancePipeline(item.id, 'AWARDED', 'Grant sanctioned! Sanction order received. Machine learning match weight increased.')}
                        className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="h-3.5 w-3.5" />
                        <span>Mark Awarded (Reinforce Match)</span>
                      </button>

                      <button
                        onClick={() => onAdvancePipeline(item.id, 'REJECTED', 'Not funded this cycle. Feedback captured for match refinement.')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Rejected</span>
                      </button>
                    </>
                  )}

                  {item.stage === 'AWARDED' && (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-green-700" />
                      Sanctioned & Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
