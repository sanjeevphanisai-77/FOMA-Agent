/**
 * Data contracts and interfaces for Agent 22: Funding Opportunity Monitoring Agent
 */

export type FundingAgency = 
  | 'DST' 
  | 'ANRF/SERB' 
  | 'MeitY' 
  | 'DRDO' 
  | 'AICTE' 
  | 'UGC' 
  | 'ICMR' 
  | 'State Council (AP/TS)' 
  | 'Industry (TCS/Google/Intel)' 
  | 'International (Horizon/IGSTC/Indo-US)';

export type GrantStatus = 'active' | 'extended' | 'corrigendum_issued' | 'closed';

export interface CorrigendumRecord {
  id: string;
  date: string;
  title: string;
  type: 'DEADLINE_EXTENSION' | 'BUDGET_REVISION' | 'ELIGIBILITY_UPDATE' | 'FORMAT_CORRECTION';
  description: string;
  previousDeadline?: string;
  newDeadline?: string;
  documentUrl?: string;
}

export interface GrantCall {
  id: string;
  schemeCode: string;
  schemeName: string;
  agency: FundingAgency;
  portalUrl: string;
  researchAreas: string[];
  eligibilityCriteria: {
    minimumDesignation: string;
    phdRequired: boolean;
    maxYearsPostPhd?: number;
    institutionTypes: string[];
    coPiAllowed: boolean;
    specialReservations?: string;
  };
  fundingCeilingInLakhs: number;
  projectDurationMonths: number;
  announcementDate: string;
  submissionDeadline: string;
  preparationThresholdDays: number; // e.g. 30 days before deadline
  requiredFormat: string; // e.g. 'ANRF-CRG-2026-v2.docx + Online Bio-data'
  status: GrantStatus;
  corrigendaHistory: CorrigendumRecord[];
  deduplicationHash: string;
  discoveredAt: string;
  lastScrapedAt: string;
  summary: string;
}

export interface FacultyProfile {
  id: string;
  name: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Dean (R&D)';
  department: string;
  email: string;
  phone: string;
  avatarUrl: string;
  publicationKeywords: string[];
  recentPublicationsCount: number;
  hIndex: number;
  activeProjectCommitments: {
    grantTitle: string;
    agency: FundingAgency;
    remainingMonths: number;
    fundingLakhs: number;
  }[];
  maxConcurrentProjects: number;
  preferredFundingAgencies: FundingAgency[];
  minGrantSizeLakhs: number;
}

export interface MatchScore {
  id: string;
  callId: string;
  facultyId: string;
  overallScore: number; // 0-100
  breakdown: {
    researchFit: number;      // 40%
    eligibilityFit: number;   // 25%
    commitmentFit: number;    // 20%
    agencyFit: number;        // 15%
  };
  matchedKeywords: string[];
  reasons: string[];
  eligibilityPassed: boolean;
  disqualificationReason?: string;
  notifiedStatus: 'PENDING' | 'FIRST_ALERT_SENT' | 'PREP_THRESHOLD_SENT' | 'FINAL_REMINDER_SENT';
  userDecision: 'PENDING' | 'PURSUED' | 'DISMISSED';
  feedbackNotes?: string;
  matchedAt: string;
}

export type PipelineStage = 
  | 'DISCOVERED'
  | 'MATCHED'
  | 'PURSUED'
  | 'AGENT20_DRAFTING'
  | 'AGENT21_COMPLIANCE'
  | 'INTERNAL_REVIEW'
  | 'SUBMITTED'
  | 'AWARDED'
  | 'REJECTED';

export interface PipelineOpportunity {
  id: string;
  callId: string;
  facultyId: string;
  facultyName: string;
  schemeName: string;
  agency: FundingAgency;
  stage: PipelineStage;
  targetSubmissionDate: string;
  coInvestigators: string[];
  budgetRequestedLakhs: number;
  agent20Handshake: {
    status: 'NOT_STARTED' | 'SYNOPSIS_GENERATED' | 'DRAFT_IN_PROGRESS' | 'COMPLETED';
    synopsisDocumentId?: string;
    lastPushedAt?: string;
  };
  agent21Compliance: {
    status: 'PENDING' | 'BUDGET_VERIFIED' | 'OVERHEADS_VERIFIED' | 'FLAGGED';
    issuesFound: string[];
  };
  outcomeNotes?: string;
  updatedAt: string;
}

export interface NotificationAlert {
  id: string;
  callId: string;
  facultyId: string;
  facultyName: string;
  callTitle: string;
  agency: FundingAgency;
  alertType: 'FIRST_ALERT' | 'PREPARATION_THRESHOLD_30D' | 'PREPARATION_THRESHOLD_15D' | 'FINAL_REMINDER_48H' | 'CORRIGENDUM_UPDATE';
  deadline: string;
  scheduledTime: string;
  sentTime?: string;
  status: 'SCHEDULED' | 'SENT' | 'ACKNOWLEDGED';
  channels: ('EMAIL' | 'SMS' | 'WHATSAPP' | 'PORTAL')[];
  messageBody: string;
}

export interface SourceCrawlerStatus {
  id: string;
  name: string;
  agency: FundingAgency;
  portalUrl: string;
  cadence: 'Hourly' | 'Daily (06:00 IST)' | 'Twice Daily' | 'Weekly';
  scrapingMethod: 'Official RSS / API' | 'Python BeautifulSoup / Headless' | 'Scrapy Daemon';
  lastRunTime: string;
  nextRunTime: string;
  status: 'ACTIVE' | 'SCRAPING' | 'HEALTHY' | 'ERROR';
  callsExtracted: number;
  corrigendaDetected: number;
  lastHttpCode: number;
  latencyMs: number;
}

export interface AgentChatMessage {
  id: string;
  sender: 'lara' | 'user' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  highlightCallId?: string;
}
