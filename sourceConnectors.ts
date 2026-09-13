import { NormalizedFundingCall, upsertFundingCalls } from './database.ts';

export interface SourceFeedConfig {
  name: string;
  agencyCode: string;
  agencyName: string;
  agencyType?: NormalizedFundingCall['agencyType'];
  portalUrl?: string;
  url: string;
}

export interface SourceRunResult {
  configured: boolean;
  feeds: number;
  calls: number;
  saved: number;
  errors: string[];
}

function getFeedConfigs(): SourceFeedConfig[] {
  if (!process.env.SOURCE_FEEDS_JSON) return [];
  try {
    const value = JSON.parse(process.env.SOURCE_FEEDS_JSON);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function stringValue(record: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && String(record[key]).trim()) return String(record[key]);
  }
  return fallback;
}

function stringArray(record: Record<string, unknown>, keys: string[]): string[] {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === 'string') return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
}

function normalizeCall(record: Record<string, unknown>, config: SourceFeedConfig): NormalizedFundingCall | null {
  const title = stringValue(record, ['title', 'scheme_name', 'schemeName']);
  const deadline = stringValue(record, ['deadline', 'submission_deadline', 'submissionDeadline']);
  if (!title || !deadline) return null;

  const status = stringValue(record, ['status'], 'OPEN').toUpperCase();
  return {
    agencyCode: config.agencyCode,
    agencyName: config.agencyName,
    agencyType: config.agencyType,
    portalUrl: config.portalUrl,
    schemeName: stringValue(record, ['scheme_name', 'schemeName'], title),
    title,
    researchAreas: stringArray(record, ['research_areas', 'researchAreas', 'keywords']),
    eligibility: typeof record.eligibility === 'object' && record.eligibility !== null ? record.eligibility as Record<string, unknown> : {},
    fundingCeiling: Number(record.funding_ceiling ?? record.fundingCeiling ?? 0) || undefined,
    durationMonths: Number(record.duration_months ?? record.durationMonths ?? 0) || undefined,
    publishedOn: stringValue(record, ['published_on', 'publishedOn']),
    deadline,
    callUrl: stringValue(record, ['call_url', 'callUrl', 'url'], config.portalUrl),
    status: status === 'EXTENDED' || status === 'CLOSED' || status === 'WITHDRAWN' ? status : 'OPEN',
  };
}

async function fetchFeed(config: SourceFeedConfig): Promise<NormalizedFundingCall[]> {
  const response = await fetch(config.url, {
    signal: AbortSignal.timeout(Number(process.env.SOURCE_TIMEOUT_MS || 15000)),
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`${config.name} returned HTTP ${response.status}`);
  const body = await response.json() as unknown;
  const records = Array.isArray(body) ? body : (body as { calls?: unknown[] }).calls;
  if (!Array.isArray(records)) throw new Error(`${config.name} must return a JSON array or {"calls": [...]}`);
  return records
    .filter((record): record is Record<string, unknown> => typeof record === 'object' && record !== null)
    .map(record => normalizeCall(record, config))
    .filter((call): call is NormalizedFundingCall => call !== null);
}

export async function runConfiguredSourceFeeds(): Promise<SourceRunResult> {
  const configs = getFeedConfigs();
  if (configs.length === 0) return { configured: false, feeds: 0, calls: 0, saved: 0, errors: [] };

  const errors: string[] = [];
  let calls: NormalizedFundingCall[] = [];
  for (const config of configs) {
    try {
      calls = calls.concat(await fetchFeed(config));
    } catch (error) {
      errors.push(`${config.name}: ${error instanceof Error ? error.message : 'Feed failed'}`);
    }
  }

  let saved = 0;
  try {
    saved = await upsertFundingCalls(calls);
  } catch (error) {
    errors.push(`Database ingestion: ${error instanceof Error ? error.message : 'Database write failed'}`);
  }
  return { configured: true, feeds: configs.length, calls: calls.length, saved, errors };
}