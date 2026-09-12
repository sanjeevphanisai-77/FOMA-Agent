import React from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  IndianRupee, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Building, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { GrantCall, FacultyProfile, MatchScore } from '../types';

interface GrantDetailModalProps {
  grant: GrantCall | null;
  onClose: () => void;
  facultyProfiles: FacultyProfile[];
  matchScores: MatchScore[];
  onPursueGrant: (grant: GrantCall, match: MatchScore) => void;
  onOpenNotificationModal: (grant: GrantCall) => void;
}

export const GrantDetailModal: React.FC<GrantDetailModalProps> = ({
  grant,
  onClose,
  facultyProfiles,
  matchScores,
  onPursueGrant,
  onOpenNotificationModal,
}) => {
  if (!grant) return null;

  const relevantMatches = matchScores
    .filter(m => m.callId === grant.id)
    .sort((a, b) => b.overallScore - a.overallScore);

  const daysRemaining = Math.ceil(
    (new Date(grant.submissionDeadline).getTime() - new Date('2026-09-11').getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-600 text-white">
                {grant.agency}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {grant.schemeCode}
              </span>
              {grant.corrigendaHistory.length > 0 && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Corrigendum Issued
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-2 tracking-tight">
              {grant.schemeName}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 text-xs block">Funding Ceiling</span>
              <span className="text-slate-900 font-extrabold text-base sm:text-lg">
                ₹{grant.fundingCeilingInLakhs} <span className="text-xs font-normal text-slate-500">Lakhs</span>
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block">Duration</span>
              <span className="text-slate-900 font-bold text-base sm:text-lg">
                {grant.projectDurationMonths} <span className="text-xs font-normal text-slate-500">Months</span>
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block">Submission Deadline</span>
              <span className="text-red-700 font-bold text-sm sm:text-base block">
                {new Date(grant.submissionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">({daysRemaining} days left)</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block">Preparation Window</span>
              <span className="text-slate-900 font-bold text-base">
                {grant.preparationThresholdDays} <span className="text-xs font-normal text-slate-500">Days Kickoff</span>
              </span>
            </div>
          </div>

          {/* Scheme Summary */}
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Scheme Overview & Objectives</h4>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {grant.summary}
            </p>
          </div>

          {/* Research Areas */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Target Research Thrust Areas</h4>
            <div className="flex flex-wrap gap-1.5">
              {grant.researchAreas.map((area, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-xs"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria Extracted */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs sm:text-sm">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Extracted Eligibility Criteria</span>
            </h4>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>
                <strong>Minimum Designation:</strong> {grant.eligibilityCriteria.minimumDesignation} or above.
              </li>
              <li>
                <strong>Ph.D. Requirement:</strong> {grant.eligibilityCriteria.phdRequired ? 'Mandatory doctorate degree in relevant discipline.' : 'Not mandatory.'}
              </li>
              <li>
                <strong>Eligible Institutions:</strong> {grant.eligibilityCriteria.institutionTypes.join(', ')}.
              </li>
              <li>
                <strong>Co-Principal Investigator:</strong> {grant.eligibilityCriteria.coPiAllowed ? 'Permitted (Interdisciplinary Co-PI encouraged).' : 'Single investigator only.'}
              </li>
              {grant.eligibilityCriteria.specialReservations && (
                <li>
                  <strong>Special Clause:</strong> {grant.eligibilityCriteria.specialReservations}
                </li>
              )}
            </ul>
          </div>

          {/* Required Format & Proforma */}
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Prescribed Proposal Format</h4>
            <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-700">
              {grant.requiredFormat}
            </div>
          </div>

          {/* Corrigenda Audit History if present */}
          {grant.corrigendaHistory.length > 0 && (
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Corrigenda & Extension Log ({grant.corrigendaHistory.length})</span>
              </h4>
              {grant.corrigendaHistory.map((corr) => (
                <div key={corr.id} className="text-xs text-amber-800 pb-2 border-b border-amber-200/60 last:border-0">
                  <div className="flex items-center justify-between font-bold">
                    <span>{corr.title}</span>
                    <span>{corr.date}</span>
                  </div>
                  <p className="mt-0.5">{corr.description}</p>
                  {corr.newDeadline && (
                    <div className="mt-1 font-mono text-[11px] text-amber-950 font-bold">
                      Deadline Shifted: {corr.previousDeadline} ➜ {corr.newDeadline}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Matched Faculty for this Call */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Matched Faculty Investigators</h4>
            <div className="space-y-2">
              {relevantMatches.map((m) => {
                const fac = facultyProfiles.find(f => f.id === m.facultyId);
                if (!fac) return null;

                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={fac.avatarUrl}
                        alt={fac.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {fac.name} ({fac.designation})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {fac.department} • h-index: {fac.hIndex}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full font-bold text-xs bg-emerald-100 text-emerald-800">
                        {m.overallScore}% Match
                      </span>
                      <button
                        onClick={() => {
                          onPursueGrant(grant, m);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Pursue for PI
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <a
            href={grant.portalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Open Official Portal Link</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenNotificationModal(grant)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              Configure Alerts
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
