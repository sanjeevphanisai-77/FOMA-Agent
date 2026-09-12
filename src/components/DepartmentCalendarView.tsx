import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  Download, 
  Filter, 
  ExternalLink,
  CheckCircle2,
  CalendarDays,
  ListOrdered,
  AlertTriangle
} from 'lucide-react';
import { GrantCall, FundingAgency } from '../types';

interface DepartmentCalendarViewProps {
  grantCalls: GrantCall[];
  onSelectGrant: (grant: GrantCall) => void;
}

export const DepartmentCalendarView: React.FC<DepartmentCalendarViewProps> = ({
  grantCalls,
  onSelectGrant,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'timeline'>('month');
  const [currentMonth, setCurrentMonth] = useState<number>(9); // October 2026 (0-indexed: 9 = October)
  const currentYear = 2026;
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const filteredCalls = grantCalls.filter(c => {
    if (selectedAgency !== 'ALL' && c.agency !== selectedAgency) return false;
    return true;
  });

  // Calculate days remaining
  const getDaysRemaining = (deadlineStr: string) => {
    const today = new Date('2026-09-11');
    const deadline = new Date(deadlineStr);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Agency color mappings
  const getAgencyColor = (agency: FundingAgency) => {
    switch (agency) {
      case 'ANRF/SERB':
        return 'bg-blue-600 text-white border-blue-700';
      case 'MeitY':
        return 'bg-purple-600 text-white border-purple-700';
      case 'DRDO':
        return 'bg-emerald-700 text-white border-emerald-800';
      case 'DST':
        return 'bg-amber-600 text-white border-amber-700';
      case 'ICMR':
        return 'bg-rose-600 text-white border-rose-700';
      case 'AICTE':
        return 'bg-indigo-600 text-white border-indigo-700';
      default:
        return 'bg-slate-700 text-white border-slate-800';
    }
  };

  // Calendar matrix generator for October 2026
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  // Calls sorted by deadline for the timeline view
  const chronologicalCalls = [...filteredCalls].sort(
    (a, b) => new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime()
  );

  const exportCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Vignan University//Agent 22 Funding Monitor//EN
${filteredCalls.map(c => `BEGIN:VEVENT
SUMMARY:${c.schemeName} (${c.agency} Due)
DESCRIPTION:Funding Ceiling: ₹${c.fundingCeilingInLakhs} Lakhs. Required Format: ${c.requiredFormat}
DTSTART:${c.submissionDeadline.replace(/-/g, '')}T170000Z
DTEND:${c.submissionDeadline.replace(/-/g, '')}T180000Z
STATUS:CONFIRMED
END:VEVENT`).join('\n')}
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Vignan_RND_Funding_Calendar_${monthNames[currentMonth]}_${currentYear}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Departmental Funding & Submission Calendar
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Coordinator & Dean View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking submission deadlines, preparation thresholds (30d/15d kickoff), and corrigenda across all agencies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'month' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="h-4 w-4 inline mr-1" />
              Monthly Grid
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'timeline' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListOrdered className="h-4 w-4 inline mr-1" />
              Timeline List
            </button>
          </div>

          {/* Export iCal */}
          <button
            onClick={exportCalendar}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export iCal</span>
          </button>
        </div>
      </div>

      {/* Agency Legend / Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-500">Agencies:</span>
          {['ALL', 'ANRF/SERB', 'MeitY', 'DRDO', 'DST', 'ICMR', 'AICTE'].map((agency) => (
            <button
              key={agency}
              onClick={() => setSelectedAgency(agency)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedAgency === agency
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {agency}
            </button>
          ))}
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>
            <span>ANRF/SERB</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-600"></span>
            <span>MeitY</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-700"></span>
            <span>DRDO</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-600"></span>
            <span>DST</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
            <span>Corrigendum Issued</span>
          </div>
        </div>
      </div>

      {/* View: Monthly Grid */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Month Navigation */}
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                (Today is September 11, 2026 - Planning Window)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentMonth(prev => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(9)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentMonth(prev => Math.min(11, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-600 py-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 bg-slate-100/50">
            {blankDays.map(d => (
              <div key={`blank-${d}`} className="min-h-[110px] bg-slate-50/60 p-2 text-slate-300 text-xs"></div>
            ))}

            {daysArray.map(day => {
              // Construct YYYY-MM-DD
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              // Deadlines on this date
              const dayCalls = filteredCalls.filter(c => c.submissionDeadline === dateStr);

              // 30-day prep threshold marker
              const isThresholdDay = filteredCalls.some(c => {
                const deadline = new Date(c.submissionDeadline);
                const thresholdDate = new Date(deadline.getTime() - c.preparationThresholdDays * 24 * 60 * 60 * 1000);
                return thresholdDate.toISOString().split('T')[0] === dateStr;
              });

              return (
                <div
                  key={day}
                  className={`min-h-[115px] p-2 bg-white transition-colors hover:bg-blue-50/30 flex flex-col justify-between ${
                    dayCalls.length > 0 ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${dayCalls.length > 0 ? 'text-blue-700 font-extrabold' : 'text-slate-700'}`}>
                      {day}
                    </span>
                    {isThresholdDay && (
                      <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-800" title="30-day preparation kickoff threshold">
                        Kickoff 30d
                      </span>
                    )}
                  </div>

                  {/* Badges for calls on this date */}
                  <div className="space-y-1 mt-1 flex-1">
                    {dayCalls.map(c => (
                      <div
                        key={c.id}
                        onClick={() => onSelectGrant(c)}
                        className={`text-[10px] p-1.5 rounded font-bold cursor-pointer transition-transform hover:scale-[1.02] shadow-2xs border ${getAgencyColor(c.agency)}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{c.agency}</span>
                          <span className="opacity-90">₹{c.fundingCeilingInLakhs}L</span>
                        </div>
                        <div className="truncate font-normal text-[9px] opacity-95">
                          {c.schemeName}
                        </div>
                        {c.corrigendaHistory.length > 0 && (
                          <div className="text-[8px] bg-amber-400 text-slate-950 px-1 rounded font-bold mt-0.5 flex items-center gap-0.5">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            <span>Extended</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View: Timeline List */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 font-bold text-xs text-slate-600 flex items-center justify-between">
            <span>Upcoming Grant Deadlines (Chronological Order)</span>
            <span>Total Calls: {chronologicalCalls.length}</span>
          </div>

          {chronologicalCalls.map((call) => {
            const daysLeft = getDaysRemaining(call.submissionDeadline);
            const isUrgent = daysLeft <= 25;

            return (
              <div
                key={call.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2.5 rounded-xl text-center min-w-[65px] border ${
                    isUrgent ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    <span className="text-[10px] block font-semibold uppercase">
                      {new Date(call.submissionDeadline).toLocaleDateString('en-IN', { month: 'short' })}
                    </span>
                    <span className="text-lg font-black block leading-tight">
                      {new Date(call.submissionDeadline).getDate()}
                    </span>
                    <span className="text-[9px] font-bold block mt-0.5">
                      {daysLeft}d left
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900 text-white">
                        {call.agency}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {call.schemeCode}
                      </span>
                      {call.corrigendaHistory.length > 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Corrigendum Applied
                        </span>
                      )}
                    </div>

                    <h4 
                      onClick={() => onSelectGrant(call)}
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer mt-1"
                    >
                      {call.schemeName}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span>Ceiling: <strong className="text-slate-800">₹{call.fundingCeilingInLakhs} Lakhs</strong></span>
                      <span>•</span>
                      <span>Duration: <strong className="text-slate-800">{call.projectDurationMonths} mos</strong></span>
                      <span>•</span>
                      <span>Prep Window: <strong className="text-slate-800">{call.preparationThresholdDays} days</strong></span>
                      <span>•</span>
                      <span className="text-blue-600">{call.requiredFormat.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => onSelectGrant(call)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    View Scheme
                  </button>
                  <a
                    href={call.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Open official portal"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
