import { FacultyProfile, GrantCall, MatchScore } from './src/types.ts';

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function designationRank(value: FacultyProfile['designation']): number {
  return value === 'Assistant Professor' ? 1 : value === 'Associate Professor' ? 2 : 3;
}

export function calculateMatches(grantCalls: GrantCall[], facultyProfiles: FacultyProfile[], previous: MatchScore[]): MatchScore[] {
  const previousByPair = new Map(previous.map(match => [`${match.callId}:${match.facultyId}`, match]));
  return grantCalls.flatMap(grant => facultyProfiles.map(faculty => {
    const facultyTerms = faculty.publicationKeywords.map(normalize);
    const matchedKeywords = grant.researchAreas.filter(area => facultyTerms.some(term => term.includes(normalize(area)) || normalize(area).includes(term)));
    const researchFit = grant.researchAreas.length === 0 ? 50 : Math.round((matchedKeywords.length / grant.researchAreas.length) * 100);
    const eligibilityFit = designationRank(faculty.designation) >= designationRank(grant.eligibilityCriteria.minimumDesignation as FacultyProfile['designation']) ? 100 : 0;
    const commitmentFit = faculty.activeProjectCommitments.length < faculty.maxConcurrentProjects ? 100 : 45;
    const agencyFit = faculty.preferredFundingAgencies.includes(grant.agency) ? 100 : 60;
    const overallScore = Math.round(researchFit * 0.4 + eligibilityFit * 0.25 + commitmentFit * 0.2 + agencyFit * 0.15);
    const previousMatch = previousByPair.get(`${grant.id}:${faculty.id}`);

    return {
      id: previousMatch?.id || `match-${grant.id}-${faculty.id}`,
      callId: grant.id,
      facultyId: faculty.id,
      overallScore,
      breakdown: { researchFit, eligibilityFit, commitmentFit, agencyFit },
      matchedKeywords,
      reasons: [
        `${matchedKeywords.length} research-area keyword matches found.`,
        eligibilityFit === 100 ? 'Faculty designation satisfies the extracted minimum designation.' : 'Faculty designation may not satisfy the extracted minimum designation.',
        faculty.preferredFundingAgencies.includes(grant.agency) ? 'Agency is listed in the faculty funding preferences.' : 'Agency is outside the faculty preferred-agency list.',
      ],
      eligibilityPassed: eligibilityFit === 100,
      userDecision: previousMatch?.userDecision || 'PENDING',
      feedbackNotes: previousMatch?.feedbackNotes,
      notifiedStatus: previousMatch?.notifiedStatus || 'PENDING',
      matchedAt: previousMatch?.matchedAt || new Date().toISOString(),
    };
  }));
}