import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_GRANT_CALLS, 
  INITIAL_FACULTY_PROFILES, 
  INITIAL_MATCH_SCORES, 
  INITIAL_PIPELINE, 
  INITIAL_SOURCES, 
  INITIAL_NOTIFICATIONS 
} from './src/data/mockData.ts';
import { GrantCall, CorrigendumRecord, PipelineOpportunity, NotificationAlert } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory store initialized with seed records
let grantCalls: GrantCall[] = [...INITIAL_GRANT_CALLS];
let facultyProfiles = [...INITIAL_FACULTY_PROFILES];
let matchScores = [...INITIAL_MATCH_SCORES];
let pipelineItems: PipelineOpportunity[] = [...INITIAL_PIPELINE];
let sources = [...INITIAL_SOURCES];
let notifications: NotificationAlert[] = [...INITIAL_NOTIFICATIONS];

// Lazy Gemini AI initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (process.env.GEMINI_API_KEY) {
    if (!aiClient) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      agent: 'Agent 22: Funding Opportunity Monitoring Agent',
      institution: "Vignan's Deemed to be University (CSE Agentic AI Day 2026)",
      monitoredSources: sources.length,
      activeCalls: grantCalls.length,
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Sources endpoints
  app.get('/api/sources', (req: Request, res: Response) => {
    res.json(sources);
  });

  app.post('/api/sources/:id/crawl', (req: Request, res: Response) => {
    const { id } = req.params;
    const sourceIndex = sources.findIndex(s => s.id === id);
    if (sourceIndex === -1) {
      res.status(404).json({ error: 'Source not found' });
      return;
    }

    const source = sources[sourceIndex];
    source.status = 'HEALTHY';
    source.lastRunTime = 'Just now';
    source.callsExtracted += Math.floor(Math.random() * 2) + 1;

    const simulatedLogs = [
      `[INFO] [Python Worker] Initializing spider session for ${source.agency} at ${source.portalUrl}`,
      `[DEBUG] [HTTP GET] ${source.portalUrl} -> 200 OK (${source.latencyMs}ms)`,
      `[INFO] [BeautifulSoup] Parsing DOM selector .call-for-proposals, table.scheme-list`,
      `[INFO] [Deduplication] Evaluated SHA-256 fingerprint on active schemes`,
      `[SUCCESS] Scraped ${source.callsExtracted} current active calls. Corrigenda check: 0 new corrigenda.`,
      `[SYNC] Postgres table 'grant_calls' updated successfully.`
    ];

    res.json({
      success: true,
      source,
      logs: simulatedLogs,
    });
  });

  // Opportunities endpoints
  app.get('/api/opportunities', (req: Request, res: Response) => {
    const { agency, status, query } = req.query;
    let results = [...grantCalls];

    if (agency && agency !== 'ALL') {
      results = results.filter(c => c.agency === agency);
    }
    if (status && status !== 'ALL') {
      results = results.filter(c => c.status === status);
    }
    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      results = results.filter(c => 
        c.schemeName.toLowerCase().includes(q) ||
        c.schemeCode.toLowerCase().includes(q) ||
        c.researchAreas.some(area => area.toLowerCase().includes(q))
      );
    }

    res.json(results);
  });

  // Corrigendum trigger
  app.post('/api/opportunities/:id/corrigendum', (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, newDeadline, type } = req.body;

    const call = grantCalls.find(c => c.id === id);
    if (!call) {
      res.status(404).json({ error: 'Grant call not found' });
      return;
    }

    const previousDeadline = call.submissionDeadline;
    if (newDeadline) {
      call.submissionDeadline = newDeadline;
    }
    call.status = type === 'DEADLINE_EXTENSION' ? 'extended' : 'corrigendum_issued';

    const newCorrigendum: CorrigendumRecord = {
      id: `corr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: title || 'Corrigendum Notice',
      type: type || 'DEADLINE_EXTENSION',
      description: description || 'Corrigendum detected by Agent 22 scraper.',
      previousDeadline,
      newDeadline: newDeadline || previousDeadline,
    };

    call.corrigendaHistory.unshift(newCorrigendum);

    // Auto-create urgent notification
    const matchedFac = matchScores.filter(m => m.callId === id);
    matchedFac.forEach(m => {
      const fac = facultyProfiles.find(f => f.id === m.facultyId);
      notifications.unshift({
        id: `notif-${Date.now()}-${m.facultyId}`,
        callId: id,
        facultyId: m.facultyId,
        facultyName: fac ? fac.name : 'Faculty Investigator',
        callTitle: call.schemeName,
        agency: call.agency,
        alertType: 'CORRIGENDUM_UPDATE',
        deadline: call.submissionDeadline,
        scheduledTime: new Date().toISOString(),
        sentTime: new Date().toISOString(),
        status: 'SENT',
        channels: ['EMAIL', 'PORTAL', 'WHATSAPP'],
        messageBody: `CORRIGENDUM: ${newCorrigendum.title} for ${call.schemeName}. New Deadline: ${call.submissionDeadline}`,
      });
    });

    res.json({ success: true, call, corrigendum: newCorrigendum });
  });

  // Faculty & Matches endpoints
  app.get('/api/faculty', (req: Request, res: Response) => {
    res.json(facultyProfiles);
  });

  app.get('/api/matches', (req: Request, res: Response) => {
    res.json(matchScores);
  });

  app.post('/api/matches/:id/decision', (req: Request, res: Response) => {
    const { id } = req.params;
    const { decision, feedbackNotes } = req.body;
    const match = matchScores.find(m => m.id === id);
    if (!match) {
      res.status(404).json({ error: 'Match record not found' });
      return;
    }

    match.userDecision = decision;
    if (feedbackNotes) match.feedbackNotes = feedbackNotes;

    // If pursued, automatically add or link to Pipeline
    if (decision === 'PURSUED') {
      const call = grantCalls.find(c => c.id === match.callId);
      const fac = facultyProfiles.find(f => f.id === match.facultyId);
      if (call && fac && !pipelineItems.some(p => p.callId === call.id && p.facultyId === fac.id)) {
        pipelineItems.unshift({
          id: `pipe-${Date.now()}`,
          callId: call.id,
          facultyId: fac.id,
          facultyName: fac.name,
          schemeName: call.schemeName,
          agency: call.agency,
          stage: 'PURSUED',
          targetSubmissionDate: call.submissionDeadline,
          coInvestigators: [],
          budgetRequestedLakhs: call.fundingCeilingInLakhs * 0.9,
          agent20Handshake: {
            status: 'NOT_STARTED',
          },
          agent21Compliance: {
            status: 'PENDING',
            issuesFound: [],
          },
          outcomeNotes: 'Initiated via faculty recommendation feed. Handshake ready for Agent 20.',
          updatedAt: new Date().toISOString(),
        });
      }
    }

    res.json({ success: true, match });
  });

  // Pipeline endpoints
  app.get('/api/pipeline', (req: Request, res: Response) => {
    res.json(pipelineItems);
  });

  app.post('/api/pipeline/:id/advance', (req: Request, res: Response) => {
    const { id } = req.params;
    const { nextStage, notes } = req.body;
    const item = pipelineItems.find(p => p.id === id);
    if (!item) {
      res.status(404).json({ error: 'Pipeline item not found' });
      return;
    }

    if (nextStage) item.stage = nextStage;
    if (notes) item.outcomeNotes = notes;
    if (nextStage === 'AGENT20_DRAFTING') {
      item.agent20Handshake.status = 'SYNOPSIS_GENERATED';
      item.agent20Handshake.synopsisDocumentId = `DOC-SYNOPSIS-${Date.now()}`;
      item.agent20Handshake.lastPushedAt = new Date().toISOString();
    }
    if (nextStage === 'AGENT21_COMPLIANCE') {
      item.agent21Compliance.status = 'BUDGET_VERIFIED';
    }
    item.updatedAt = new Date().toISOString();

    res.json({ success: true, item });
  });

  // Notifications endpoints
  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(notifications);
  });

  app.post('/api/notifications', (req: Request, res: Response) => {
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      ...req.body,
    };
    notifications.unshift(newNotif);
    res.json({ success: true, notification: newNotif });
  });

  // Conversational Agent (Buji) endpoint
  app.post('/api/agent/chat', async (req: Request, res: Response) => {
    const { message, activeFacultyId } = req.body;
    const faculty = facultyProfiles.find(f => f.id === activeFacultyId) || facultyProfiles[0];

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are "Buji", the friendly and highly intelligent Funding Opportunity Monitoring Agent for Vignan's Deemed to be University (CSE Department, Agentic AI Day 2026).
Your job is to continuously monitor funding sources (DST, ANRF/SERB, MeitY, DRDO, AICTE, UGC, ICMR, State Councils, International) and guide faculty (currently assisting: ${faculty.name}, ${faculty.designation}, Research Areas: ${faculty.publicationKeywords.join(', ')}).
Available active calls: ${grantCalls.map(c => `${c.schemeName} (${c.agency}, Deadline: ${c.submissionDeadline}, Ceiling: ₹${c.fundingCeilingInLakhs}L)`).join('; ')}.

User asked: "${message}".

Provide a concise, direct, professional, and helpful response. If recommending a scheme, explain why based on faculty profile. Keep answer within 2-3 paragraphs.`;

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        res.json({
          reply: aiResponse.text || "I've checked the latest funding portals. How would you like me to proceed?",
          sender: 'buji',
        });
        return;
      } catch (err: any) {
        console.error('Gemini call error:', err?.message);
        // Fall back to rule engine below
      }
    }

    // Heuristic rule-based fallback responses matching Buji persona
    const msgLower = (message || '').toLowerCase();
    let reply = '';
    let suggestedActions: any[] = [];

    if (msgLower.includes('serb') || msgLower.includes('anrf') || msgLower.includes('crg')) {
      reply = `Hello ${faculty.name}! The ANRF Core Research Grant (CRG) 2026 is currently active with a funding ceiling of ₹75.0 Lakhs. The submission deadline was recently extended to October 31, 2026 via Corrigendum #1. Your profile shows an exceptional 94% match based on your recent publications in Edge AI & Signal Processing!`;
      suggestedActions = [
        { label: 'View ANRF CRG Details', action: 'VIEW_GRANT', payload: 'call-anrf-crg-2026' },
        { label: 'Push to Agent 20 (Drafting)', action: 'PUSH_AGENT_20', payload: 'call-anrf-crg-2026' }
      ];
    } else if (msgLower.includes('drdo') || msgLower.includes('drone') || msgLower.includes('defense')) {
      reply = `The DRDO Extramural Research call (ER&IPR) on Autonomous Swarm Drones & Anti-Jamming RF is open until October 20, 2026. The ceiling is ₹98.0 Lakhs for 36 months. As an ${faculty.designation} with an active lab clearance, you satisfy all eligibility requirements. Would you like to schedule preparation threshold reminders?`;
      suggestedActions = [
        { label: 'View DRDO Call', action: 'VIEW_GRANT', payload: 'call-drdo-eripr-2026' },
        { label: 'Schedule 15-day Alert', action: 'SCHEDULE_ALERT', payload: 'call-drdo-eripr-2026' }
      ];
    } else if (msgLower.includes('meity') || msgLower.includes('c2s') || msgLower.includes('chip') || msgLower.includes('vlsi')) {
      reply = `MeitY Chips to Startup (C2S) Phase II is accepting proposals up to ₹145.0 Lakhs for 60 months. Deadline is October 10, 2026. Note that this requires training at least 25 M.Tech/B.Tech students on EDA tools. Prof. K. Rama Krishna is already preparing a departmental joint submission!`;
      suggestedActions = [
        { label: 'View MeitY C2S', action: 'VIEW_GRANT', payload: 'call-meity-c2s-2026' }
      ];
    } else if (msgLower.includes('corrigend') || msgLower.includes('deadline') || msgLower.includes('extension')) {
      reply = `I continuously monitor corrigenda across all 8 portals. Currently, 2 recent corrigenda are active:\n1. ANRF CRG 2026: Deadline extended from Oct 15 to Oct 31, 2026.\n2. DST TDP: Budget ceiling increased from ₹45 Lakhs to ₹60 Lakhs for drone payload sensors.\nAll matched faculty have received deadline-aware notification alerts.`;
    } else if (msgLower.includes('pipeline') || msgLower.includes('agent 20') || msgLower.includes('draft')) {
      reply = `We currently have 3 proposals in the departmental pipeline: 2 actively handshake with Agent 20 for automated synopsis & drafting, and 1 undergoing internal review before the Dean of R&D. Would you like to export the departmental opportunity pipeline report?`;
    } else {
      reply = `Hi, I'm Buji, your Funding Opportunity Monitoring Agent! I'm scanning DST, ANRF/SERB, MeitY, DRDO, ICMR, AICTE, and international portals every morning at 06:00 IST. I match calls against faculty publication keywords, check designation eligibility, and schedule deadline-aware alerts. What funding call or faculty match would you like to inspect?`;
      suggestedActions = [
        { label: 'Scan ANRF / SERB Now', action: 'SCAN_SOURCE', payload: 'src-1' },
        { label: 'Show Urgent Deadlines (<30 Days)', action: 'FILTER_URGENT' },
        { label: 'View Department Calendar', action: 'GOTO_CALENDAR' }
      ];
    }

    res.json({
      reply,
      sender: 'buji',
      suggestedActions,
    });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Agent 22 Server running on http://localhost:${PORT}`);
  });
}

startServer();
