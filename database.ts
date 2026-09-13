import { Pool, QueryResultRow } from 'pg';
import {
  FacultyProfile,
  FundingAgency,
  GrantCall,
  MatchScore,
  PipelineOpportunity,
  PipelineStage,
} from './src/types.ts';

let pool: Pool | null = null;

function getPool(): Pool | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
      max: Number(process.env.DATABASE_POOL_SIZE || 10),
    });
  }
  return pool;
}

function textValue(row: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = row[key];
    if (value !== null && value !== undefined && String(value).trim()) return String(value);
  }
  return fallback;
}

function numberValue(row: Record<string, unknown>, keys: string[], fallback = 0): number {
  const value = textValue(row, keys);
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function arrayValue(row: Record<string, unknown>, keys: string[]): string[] {
  for (const key of keys) {
    const value = row[key];
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
  }
  return [];
}

function normalizeAgency(value: string): FundingAgency {
  const agency = value.toUpperCase();
  if (agency.includes('ANRF') || agency.includes('SERB')) return 'ANRF/SERB';
  if (agency.includes('MEITY')) return 'MeitY';
  if (agency.includes('DRDO')) return 'DRDO';
  if (agency.includes('DST')) return 'DST';
  if (agency.includes('ICMR')) return 'ICMR';
  if (agency.includes('AICTE')) return 'AICTE';
  if (agency.includes('UGC')) return 'UGC';
  if (agency.includes('INTERNATIONAL')) return 'International (Horizon/IGSTC/Indo-US)';
  return 'Industry (TCS/Google/Intel)';
}

function normalizeDesignation(value: string): FacultyProfile['designation'] {
  if (value.toLowerCase().includes('assistant')) return 'Assistant Professor';
  if (value.toLowerCase().includes('dean')) return 'Dean (R&D)';
  if (value.toLowerCase().includes('associate')) return 'Associate Professor';
  return 'Professor';
}

function mapCall(row: Record<string, unknown>): GrantCall {
  const agency = normalizeAgency(textValue(row, ['agency_code', 'agency_name'], 'Other'));
  const status = textValue(row, ['status'], 'OPEN').toUpperCase();
  const deadline = textValue(row, ['deadline'], new Date().toISOString().slice(0, 10));
  const eligibility = (row.eligibility || {}) as Record<string, unknown>;
  const maxYearsPostPhd = numberValue(eligibility, ['maxYearsPostPhd', 'max_years_post_phd'], -1);

  return {
    id: textValue(row, ['funding_call_id', 'id']),
    schemeCode: textValue(row, ['scheme_code', 'code'], textValue(row, ['funding_call_id', 'id'])),
    schemeName: textValue(row, ['scheme_name', 'title'], 'Funding opportunity'),
    agency,
    portalUrl: textValue(row, ['call_url', 'portal_url']),
    researchAreas: arrayValue(row, ['research_areas']),
    eligibilityCriteria: {
      minimumDesignation: textValue(eligibility, ['minimumDesignation', 'minimum_designation'], 'Assistant Professor'),
      phdRequired: Boolean(eligibility.phdRequired ?? eligibility.phd_required ?? true),
      ...(maxYearsPostPhd >= 0 ? { maxYearsPostPhd } : {}),
      institutionTypes: Array.isArray(eligibility.institutionTypes)
        ? eligibility.institutionTypes.map(String)
        : ['Eligible higher-education institutions'],
      coPiAllowed: Boolean(eligibility.coPiAllowed ?? eligibility.co_pi_allowed ?? true),
      specialReservations: textValue(eligibility, ['specialReservations', 'special_reservations']),
    },
    fundingCeilingInLakhs: process.env.FUNDING_CEILING_UNIT === 'RUPEES'
      ? numberValue(row, ['funding_ceiling']) / 100000
      : numberValue(row, ['funding_ceiling']),
    projectDurationMonths: numberValue(row, ['duration_months'], 12),
    announcementDate: textValue(row, ['published_on'], deadline),
    submissionDeadline: deadline,
    preparationThresholdDays: 30,
    requiredFormat: 'See official call document',
    status: status === 'EXTENDED' ? 'extended' : status === 'CLOSED' || status === 'WITHDRAWN' ? 'closed' : status === 'OPEN' ? 'active' : 'corrigendum_issued',
    corrigendaHistory: [],
    deduplicationHash: `database:${textValue(row, ['funding_call_id', 'id'])}`,
    discoveredAt: textValue(row, ['published_on'], new Date().toISOString()),
    lastScrapedAt: textValue(row, ['source_checked_at'], new Date().toISOString()),
    summary: textValue(row, ['description', 'summary'], 'Imported from the institutional funding database.'),
  };
}

function mapFaculty(row: Record<string, unknown>): FacultyProfile {
  const id = textValue(row, ['faculty_id', 'person_id', 'id']);
  return {
    id,
    name: textValue(row, ['full_name', 'name', 'display_name'], `Faculty ${id.slice(0, 8)}`),
    designation: normalizeDesignation(textValue(row, ['designation', 'academic_rank'])),
    department: textValue(row, ['department_name', 'department', 'department_code'], 'Research Department'),
    email: textValue(row, ['official_email', 'email']),
    phone: textValue(row, ['phone', 'mobile']),
    avatarUrl: textValue(row, ['avatar_url', 'photo_url']),
    publicationKeywords: arrayValue(row, ['publication_keywords', 'research_interests', 'keywords']),
    recentPublicationsCount: numberValue(row, ['recent_publications_count', 'publication_count']),
    hIndex: numberValue(row, ['h_index']),
    activeProjectCommitments: [],
    maxConcurrentProjects: numberValue(row, ['max_concurrent_projects'], 3),
    preferredFundingAgencies: arrayValue(row, ['preferred_agencies']).map(normalizeAgency),
    minGrantSizeLakhs: numberValue(row, ['min_grant_size_lakhs']),
  };
}

export async function loadDatabaseData(): Promise<{
  grantCalls: GrantCall[];
  facultyProfiles: FacultyProfile[];
  matchScores: MatchScore[];
  pipeline: PipelineOpportunity[];
}> {
  const database = getPool();
  if (!database) return { grantCalls: [], facultyProfiles: [], matchScores: [], pipeline: [] };

  const [callsResult, facultyResult, matchesResult, pipelineResult] = await Promise.all([
    database.query(`
      SELECT fc.*, fa.code AS agency_code, fa.name AS agency_name
      FROM research.funding_call fc
      JOIN research.funding_agency fa ON fa.funding_agency_id = fc.funding_agency_id
      ORDER BY fc.deadline ASC NULLS LAST
    `),
    database.query(`SELECT to_jsonb(f) AS row FROM people.faculty f`).catch(() => ({ rows: [] as QueryResultRow[] })),
    database.query(`SELECT * FROM research.call_faculty_match ORDER BY match_score DESC NULLS LAST`).catch(() => ({ rows: [] as QueryResultRow[] })),
    database.query(`
      SELECT p.*, fc.scheme_name, fc.title, fc.deadline, fa.code AS agency_code
      FROM research.proposal p
      LEFT JOIN research.funding_call fc ON fc.funding_call_id = p.funding_call_id
      LEFT JOIN research.funding_agency fa ON fa.funding_agency_id = fc.funding_agency_id
      ORDER BY p.submitted_on DESC NULLS LAST, p.outcome_date DESC NULLS LAST
    `).catch(() => ({ rows: [] as QueryResultRow[] })),
  ]);

  const grantCalls = callsResult.rows.map(row => mapCall(row as Record<string, unknown>));
  const facultyProfiles = facultyResult.rows
    .map(row => (row as { row?: Record<string, unknown> }).row)
    .filter((row): row is Record<string, unknown> => Boolean(row))
    .map(mapFaculty);
  const matchScores = matchesResult.rows.map(row => {
    const record = row as Record<string, unknown>;
    const outcome = textValue(record, ['outcome'], 'PENDING');
    return {
      id: textValue(record, ['call_faculty_match_id', 'id']),
      callId: textValue(record, ['funding_call_id', 'grant_call_id']),
      facultyId: textValue(record, ['faculty_id']),
      overallScore: numberValue(record, ['match_score']),
      breakdown: { researchFit: numberValue(record, ['match_score']), eligibilityFit: 100, commitmentFit: 100, agencyFit: 100 },
      matchedKeywords: [],
      reasons: [textValue(record, ['match_reason'], 'Imported from the institutional matching table.')],
      eligibilityPassed: outcome !== 'NOT_ELIGIBLE',
      notifiedStatus: record.notified_at ? 'FIRST_ALERT_SENT' : 'PENDING',
      userDecision: outcome === 'APPLIED' ? 'PURSUED' : outcome === 'IGNORED' ? 'DISMISSED' : 'PENDING',
      matchedAt: textValue(record, ['created_at', 'matched_at'], new Date().toISOString()),
    } as MatchScore;
  });
  const pipeline = pipelineResult.rows.map(row => {
    const record = row as Record<string, unknown>;
    const proposalStatus = textValue(record, ['status'], 'DRAFT');
    const stageMap: Record<string, PipelineStage> = {
      DRAFT: 'AGENT20_DRAFTING', INTERNAL_REVIEW: 'INTERNAL_REVIEW', SUBMITTED: 'SUBMITTED',
      UNDER_REVIEW: 'INTERNAL_REVIEW', SANCTIONED: 'AWARDED', REJECTED: 'REJECTED', WITHDRAWN: 'REJECTED',
    };
    return {
      id: textValue(record, ['proposal_id', 'id']),
      callId: textValue(record, ['funding_call_id']),
      facultyId: textValue(record, ['pi_faculty_id']),
      facultyName: textValue(record, ['faculty_name'], 'Principal Investigator'),
      schemeName: textValue(record, ['scheme_name', 'title'], 'Funding proposal'),
      agency: normalizeAgency(textValue(record, ['agency_code'], 'Other')),
      stage: stageMap[proposalStatus] || 'PURSUED',
      targetSubmissionDate: textValue(record, ['deadline'], new Date().toISOString().slice(0, 10)),
      coInvestigators: [],
      budgetRequestedLakhs: process.env.FUNDING_CEILING_UNIT === 'RUPEES' ? numberValue(record, ['amount_requested']) / 100000 : numberValue(record, ['amount_requested']),
      agent20Handshake: { status: proposalStatus === 'DRAFT' ? 'DRAFT_IN_PROGRESS' : 'COMPLETED' },
      agent21Compliance: { status: 'PENDING', issuesFound: [] },
      outcomeNotes: textValue(record, ['reviewer_comments']),
      updatedAt: textValue(record, ['submitted_on', 'outcome_date'], new Date().toISOString()),
    } as PipelineOpportunity;
  });

  return { grantCalls, facultyProfiles, matchScores, pipeline };
}

export async function updateMatchOutcome(matchId: string, decision: string, feedbackNotes?: string): Promise<void> {
  const database = getPool();
  if (!database) return;
  const outcome = decision === 'PURSUED' ? 'APPLIED' : decision === 'DISMISSED' ? 'IGNORED' : null;
  if (!outcome) return;
  await database.query(
    `UPDATE research.call_faculty_match SET outcome = $1, match_reason = COALESCE($2, match_reason) WHERE call_faculty_match_id = $3`,
    [outcome, feedbackNotes || null, matchId],
  );
}

export async function updateProposalStage(proposalId: string, stage: PipelineStage, notes?: string): Promise<void> {
  const database = getPool();
  if (!database) return;
  const statusMap: Partial<Record<PipelineStage, string>> = {
    AGENT20_DRAFTING: 'DRAFT', INTERNAL_REVIEW: 'INTERNAL_REVIEW', SUBMITTED: 'SUBMITTED',
    AWARDED: 'SANCTIONED', REJECTED: 'REJECTED',
  };
  const status = statusMap[stage];
  if (!status) return;
  await database.query(
    `UPDATE research.proposal SET status = $1, reviewer_comments = COALESCE($2, reviewer_comments) WHERE proposal_id = $3`,
    [status, notes || null, proposalId],
  );
}

export async function databaseHealth(): Promise<{ configured: boolean; connected: boolean; error?: string }> {
  const database = getPool();
  if (!database) return { configured: false, connected: false };
  try {
    await database.query('SELECT 1');
    return { configured: true, connected: true };
  } catch (error) {
    return { configured: true, connected: false, error: error instanceof Error ? error.message : 'Database connection failed' };
  }
}

export interface NormalizedFundingCall {
  agencyCode: string;
  agencyName: string;
  agencyType?: 'CENTRAL' | 'STATE' | 'INDUSTRY' | 'INTERNATIONAL' | 'NGO';
  portalUrl?: string;
  schemeName: string;
  title: string;
  researchAreas: string[];
  eligibility?: Record<string, unknown>;
  fundingCeiling?: number;
  durationMonths?: number;
  publishedOn?: string;
  deadline: string;
  callUrl?: string;
  status?: 'OPEN' | 'EXTENDED' | 'CLOSED' | 'WITHDRAWN';
}

export async function upsertFundingCalls(calls: NormalizedFundingCall[]): Promise<number> {
  const database = getPool();
  if (!database || calls.length === 0) return 0;
  let saved = 0;

  for (const call of calls) {
    const agencyResult = await database.query(
      `INSERT INTO research.funding_agency (code, name, agency_type, portal_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, portal_url = COALESCE(EXCLUDED.portal_url, research.funding_agency.portal_url)
       RETURNING funding_agency_id`,
      [call.agencyCode, call.agencyName, call.agencyType || 'CENTRAL', call.portalUrl || null],
    );
    const agencyId = agencyResult.rows[0].funding_agency_id;
    const existing = await database.query(
      `SELECT funding_call_id FROM research.funding_call
       WHERE funding_agency_id = $1 AND scheme_name = $2 AND title = $3
       ORDER BY source_checked_at DESC NULLS LAST LIMIT 1`,
      [agencyId, call.schemeName, call.title],
    );
    const values = [
      agencyId,
      call.schemeName,
      call.title,
      call.researchAreas,
      JSON.stringify(call.eligibility || {}),
      call.fundingCeiling || null,
      call.durationMonths || null,
      call.publishedOn || null,
      call.deadline,
      call.callUrl || null,
      call.status || 'OPEN',
    ];
    if (existing.rows[0]) {
      await database.query(
        `UPDATE research.funding_call SET research_areas = $1, eligibility = $2, funding_ceiling = $3,
         duration_months = $4, published_on = $5, deadline = $6, call_url = $7, status = $8, source_checked_at = now()
         WHERE funding_call_id = $9`,
        [values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], existing.rows[0].funding_call_id],
      );
    } else {
      await database.query(
        `INSERT INTO research.funding_call
          (funding_agency_id, scheme_name, title, research_areas, eligibility, funding_ceiling,
           duration_months, published_on, deadline, call_url, status, source_checked_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now())`,
        values,
      );
    }
    saved += 1;
  }
  return saved;
}

export async function persistMatchScores(matches: MatchScore[]): Promise<number> {
  const database = getPool();
  if (!database || matches.length === 0) return 0;
  let saved = 0;
  for (const match of matches) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(match.callId)
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(match.facultyId)) continue;
    await database.query(
      `INSERT INTO research.call_faculty_match
        (funding_call_id, faculty_id, match_score, match_reason, outcome)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (funding_call_id, faculty_id) DO UPDATE SET
         match_score = EXCLUDED.match_score,
         match_reason = EXCLUDED.match_reason`,
      [match.callId, match.facultyId, match.overallScore, match.reasons.join(' '), match.userDecision === 'PURSUED' ? 'APPLIED' : match.userDecision === 'DISMISSED' ? 'IGNORED' : null],
    );
    saved += 1;
  }
  return saved;
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}