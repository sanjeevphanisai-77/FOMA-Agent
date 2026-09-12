import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Send, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { GrantCall, FacultyProfile, NotificationAlert } from '../types';

interface NotificationScheduleModalProps {
  grant: GrantCall | null;
  activeFaculty: FacultyProfile;
  notifications: NotificationAlert[];
  onClose: () => void;
  onSendTestNotification: (alert: Partial<NotificationAlert>) => void;
}

export const NotificationScheduleModal: React.FC<NotificationScheduleModalProps> = ({
  grant,
  activeFaculty,
  notifications,
  onClose,
  onSendTestNotification,
}) => {
  if (!grant) return null;

  const [channels, setChannels] = useState<{ [key: string]: boolean }>({
    EMAIL: true,
    PORTAL: true,
    WHATSAPP: true,
    SMS: false,
  });
  const [prepDays, setPrepDays] = useState(grant.preparationThresholdDays || 30);
  const [customMsg, setCustomMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const deadline = new Date(grant.submissionDeadline);
  const kickoffDate = new Date(deadline.getTime() - prepDays * 24 * 60 * 60 * 1000);
  const review15dDate = new Date(deadline.getTime() - 15 * 24 * 60 * 60 * 1000);
  const final48hDate = new Date(deadline.getTime() - 2 * 24 * 60 * 60 * 1000);

  const relevantNotifs = notifications.filter(
    n => n.callId === grant.id && n.facultyId === activeFaculty.id
  );

  const handleTriggerInstantAlert = () => {
    setIsSending(true);
    setTimeout(() => {
      const activeChannels = Object.keys(channels).filter(k => channels[k]) as any[];
      onSendTestNotification({
        callId: grant.id,
        facultyId: activeFaculty.id,
        facultyName: activeFaculty.name,
        callTitle: grant.schemeName,
        agency: grant.agency,
        alertType: 'PREPARATION_THRESHOLD_30D',
        deadline: grant.submissionDeadline,
        channels: activeChannels,
        messageBody: customMsg || `Preparation Alert for ${activeFaculty.name}: ${grant.schemeName} (${grant.agency}) deadline is ${grant.submissionDeadline}. Kickoff preparation recommended immediately.`,
      });
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Deadline-Aware Notification Schedule
              </h2>
              <p className="text-xs text-slate-400">
                Configured for {activeFaculty.name} • {grant.agency}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {/* Grant Context */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-blue-600 block uppercase">
                Target Scheme
              </span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                {grant.schemeName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Final Deadline</span>
              <span className="font-bold text-red-600 text-xs sm:text-sm">
                {new Date(grant.submissionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Automated Schedule Timeline */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5 text-xs sm:text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Multi-Stage Deadline Alert Cadence</span>
            </h4>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Stage 1: Discovery / Publication */}
              <div className="flex items-start gap-3 pl-6 relative">
                <div className="absolute left-1.5 top-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"></div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">1. First Alert on Publication</strong>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                      Delivered
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Triggered when scheme was first extracted from {grant.agency} portal. Sent to {activeFaculty.email}.
                  </p>
                </div>
              </div>

              {/* Stage 2: Preparation Threshold */}
              <div className="flex items-start gap-3 pl-6 relative">
                <div className="absolute left-1.5 top-1 h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-100"></div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">2. Preparation Kickoff Threshold ({prepDays} Days)</strong>
                    <span className="text-[10px] font-mono text-slate-500">
                      {kickoffDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pushes proposal templates, co-investigator recommendations, and Handshake trigger for Agent 20.
                  </p>
                </div>
              </div>

              {/* Stage 3: 15-Day Critical Draft Threshold */}
              <div className="flex items-start gap-3 pl-6 relative">
                <div className="absolute left-1.5 top-1 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-white ring-2 ring-amber-100"></div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">3. Internal Dean Review Alert (15 Days)</strong>
                    <span className="text-[10px] font-mono text-slate-500">
                      {review15dDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Urgent reminder to submit draft to Departmental Research Committee for institutional endorsement.
                  </p>
                </div>
              </div>

              {/* Stage 4: 48-Hour Final Countdown */}
              <div className="flex items-start gap-3 pl-6 relative">
                <div className="absolute left-1.5 top-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white ring-2 ring-red-100"></div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">4. Final Portal Countdown (48 Hours)</strong>
                    <span className="text-[10px] font-mono text-slate-500">
                      {final48hDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    SMS and WhatsApp alerts to PI and research coordinator before portal upload lock.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Channels */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 text-xs sm:text-sm">Delivery Notification Channels</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'EMAIL', label: 'Email', icon: Mail, desc: activeFaculty.email },
                { key: 'PORTAL', label: 'In-Portal', icon: Bell, desc: 'Web Dashboard' },
                { key: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare, desc: activeFaculty.phone },
                { key: 'SMS', label: 'SMS Gateway', icon: Smartphone, desc: 'Priority SMS' },
              ].map(({ key, label, icon: Icon, desc }) => (
                <label
                  key={key}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    channels[key]
                      ? 'bg-blue-50/70 border-blue-300 text-blue-900 ring-1 ring-blue-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <input
                      type="checkbox"
                      checked={channels[key]}
                      onChange={(e) => setChannels({ ...channels, [key]: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                  </div>
                  <div className="mt-2">
                    <span className="font-bold block text-xs">{label}</span>
                    <span className="text-[10px] text-slate-500 truncate block">{desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Trigger Immediate Alert Test */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 text-xs sm:text-sm">
              Send Immediate Notification Alert Now
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Trigger a test dispatch through configured channels to verify PI delivery.
            </p>

            <button
              onClick={handleTriggerInstantAlert}
              disabled={isSending}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSending ? 'Dispatching...' : 'Dispatch Alert to PI Now'}</span>
            </button>

            {sentSuccess && (
              <div className="mt-2.5 p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Notification dispatched successfully across Email & WhatsApp gateways!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
