import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Bot, 
  RefreshCw, 
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { AgentChatMessage, FacultyProfile, GrantCall } from '../types';

interface BujiMascotAssistantProps {
  activeFaculty: FacultyProfile;
  grantCalls: GrantCall[];
  onSelectGrant: (grant: GrantCall) => void;
  onPushToAgent20: (grant: GrantCall) => void;
  onClose?: () => void;
  isDrawer?: boolean;
}

export const BujiMascotAssistant: React.FC<BujiMascotAssistantProps> = ({
  activeFaculty,
  grantCalls,
  onSelectGrant,
  onPushToAgent20,
  onClose,
  isDrawer = false,
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'lara',
      text: `Hi, I'm Lara, your Funding Opportunity Monitoring Agent for Agentic AI Day 2026. I continuously track DST, ANRF/SERB, MeitY, DRDO, and ICMR calls.`,
      timestamp: '10:30 AM',
    },
    {
      id: 'msg-2',
      sender: 'lara',
      text: `Nice to meet you, ${activeFaculty.name}! I've matched 2 high-priority research schemes for your lab: ANRF Core Research Grant (94% match) and DRDO Swarm Drones (91% match). What would you like to explore?`,
      timestamp: '10:31 AM',
      suggestedActions: [
        { label: 'Check ANRF CRG Eligibility', action: 'ANRF_ELIGIBILITY' },
        { label: 'Explain DRDO Swarm Call', action: 'DRDO_CALL' },
        { label: 'Scan Portals for Corrigenda', action: 'SCAN_CORRIGENDA' },
        { label: 'Show 15-Day Critical Deadlines', action: 'SHOW_DEADLINES' },
      ],
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [robotStatus, setRobotStatus] = useState<'standby' | 'analyzing' | 'speaking'>('standby');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);
    setRobotStatus('analyzing');

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          activeFacultyId: activeFaculty.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRobotStatus('speaking');
        setMessages(prev => [
          ...prev,
          {
            id: `lara-${Date.now()}`,
            sender: 'lara',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedActions: data.suggestedActions,
          }
        ]);
        setTimeout(() => setRobotStatus('standby'), 3000);
      } else {
        throw new Error('Chat API returned error');
      }
    } catch (err) {
      // Offline / fallback handler
      setTimeout(() => {
        setRobotStatus('standby');
        setMessages(prev => [
          ...prev,
          {
            id: `lara-${Date.now()}`,
            sender: 'lara',
            text: `I've analyzed the portal index. For ${activeFaculty.name}, the ANRF CRG (deadline Oct 31, 2026) and MeitY C2S Phase II (deadline Oct 10, 2026) are top recommendations aligned with your research profile.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedActions: [
              { label: 'View ANRF CRG Scheme', action: 'VIEW_ANRF' },
              { label: 'Check MeitY C2S Details', action: 'VIEW_MEITY' }
            ]
          }
        ]);
      }, 700);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: string, payload?: any) => {
    if (action === 'ANRF_ELIGIBILITY') {
      const grant = grantCalls.find(c => c.id === 'call-anrf-crg-2026');
      if (grant) onSelectGrant(grant);
      handleSend('What are the eligibility requirements and submission formats for the ANRF Core Research Grant?');
    } else if (action === 'DRDO_CALL') {
      const grant = grantCalls.find(c => c.id === 'call-drdo-eripr-2026');
      if (grant) onSelectGrant(grant);
      handleSend('Tell me about the DRDO Extramural Call on Autonomous Swarms.');
    } else if (action === 'SCAN_CORRIGENDA') {
      handleSend('Were there any recent corrigenda or deadline extensions detected today?');
    } else if (action === 'SHOW_DEADLINES') {
      handleSend('Which research grant opportunities have submission deadlines within the next 30 days?');
    } else if (action === 'VIEW_GRANT' && payload) {
      const grant = grantCalls.find(c => c.id === payload);
      if (grant) onSelectGrant(grant);
    } else if (action === 'PUSH_AGENT_20' && payload) {
      const grant = grantCalls.find(c => c.id === payload);
      if (grant) onPushToAgent20(grant);
    } else {
      handleSend(`Proceed with ${action}`);
    }
  };

  return (
    <div className={`flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${
      isDrawer ? 'h-full' : 'h-[650px]'
    }`}>
      {/* Mascot Card Header - Inspired by the Robot Avatar in the photo */}
      <div className="bg-gradient-to-b from-blue-50/80 via-white to-white px-5 pt-5 pb-3 border-b border-slate-100 relative">
        {isDrawer && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Mascot Robot Graphic recreation */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Robot Floating Body SVG */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-slate-100 shadow-md flex items-center justify-center relative overflow-hidden transition-transform duration-300 ${
              robotStatus === 'analyzing' ? 'scale-105 ring-4 ring-blue-100' : ''
            }`}>
              {/* Visor Area */}
              <div className="w-12 h-7 bg-slate-900 rounded-full flex items-center justify-center gap-2 shadow-inner">
                {/* Glowing Eyes */}
                <div className={`w-2.5 h-3.5 rounded-full transition-all duration-300 ${
                  robotStatus === 'analyzing' 
                    ? 'bg-amber-400 animate-ping' 
                    : robotStatus === 'speaking'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
                }`}></div>
                <div className={`w-2.5 h-3.5 rounded-full transition-all duration-300 ${
                  robotStatus === 'analyzing' 
                    ? 'bg-amber-400 animate-ping' 
                    : robotStatus === 'speaking'
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
                }`}></div>
              </div>

              {/* Status indicator pip */}
              <span className={`absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white ${
                robotStatus === 'analyzing' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
            </div>
            
            {/* Pulse rings */}
            <div className="absolute -inset-1 rounded-2xl bg-blue-400/10 -z-10 animate-pulse"></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Lara AI Assistant
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Agent 22
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              Assisting {activeFaculty.name} ({activeFaculty.department.split(' ')[0]})
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-[11px]">
              <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                <span className={`h-2 w-2 rounded-full ${robotStatus === 'analyzing' ? 'bg-amber-500 animate-spin' : 'bg-emerald-500'}`}></span>
                {robotStatus === 'analyzing' ? 'Ingesting Portals...' : robotStatus === 'speaking' ? 'Synthesizing...' : 'Live Monitoring'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-blue-600 font-medium hover:underline cursor-pointer" onClick={() => handleSend('Show active corrigenda')}>
                2 Corrigenda Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {m.sender === 'lara' && (
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1 px-1">
                ASSISTANT
              </span>
            )}
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {m.timestamp}
            </span>

            {/* Suggested action chips from Buji */}
            {m.suggestedActions && m.suggestedActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {m.suggestedActions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleActionClick(act.action, act.payload)}
                    className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-[11px] transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>{act.label}</span>
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1 px-1">
              ASSISTANT
            </span>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 shadow-2xs flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce"></span>
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Lara is analyzing portal records...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="lara-chat-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Lara about schemes, DST, DRDO, eligibility, deadlines..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />

          <button
            id="lara-chat-submit-btn"
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {/* Bottom Bar matching attached photo: "• Standby / Voice + transcript (assistant & your speech)" */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${robotStatus === 'analyzing' ? 'bg-amber-400' : 'bg-emerald-500'}`}></span>
            <span className="capitalize">{robotStatus === 'analyzing' ? 'Active Ingestion' : 'Standby'}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              isVoiceActive ? 'text-blue-600 font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {isVoiceActive ? <Mic className="h-3.5 w-3.5 text-blue-600 animate-pulse" /> : <MicOff className="h-3.5 w-3.5" />}
            <span className="text-[10px]">Voice + transcript (assistant & your speech)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
