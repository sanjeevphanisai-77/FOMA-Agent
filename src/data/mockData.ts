import { 
  GrantCall, 
  FacultyProfile, 
  MatchScore, 
  PipelineOpportunity, 
  SourceCrawlerStatus, 
  NotificationAlert 
} from '../types';

export const INITIAL_SOURCES: SourceCrawlerStatus[] = [
  {
    id: 'src-1',
    name: 'Anusandhan National Research Foundation (ANRF / SERB)',
    agency: 'ANRF/SERB',
    portalUrl: 'https://anrfonline.in/schemes',
    cadence: 'Daily (06:00 IST)',
    scrapingMethod: 'Official RSS / API',
    lastRunTime: '10 mins ago',
    nextRunTime: 'Tomorrow 06:00 IST',
    status: 'HEALTHY',
    callsExtracted: 8,
    corrigendaDetected: 2,
    lastHttpCode: 200,
    latencyMs: 342,
  },
  {
    id: 'src-2',
    name: 'Department of Science and Technology (DST)',
    agency: 'DST',
    portalUrl: 'https://dst.gov.in/call-for-proposals',
    cadence: 'Daily (06:00 IST)',
    scrapingMethod: 'Python BeautifulSoup / Headless',
    lastRunTime: '25 mins ago',
    nextRunTime: 'Tomorrow 06:00 IST',
    status: 'HEALTHY',
    callsExtracted: 12,
    corrigendaDetected: 3,
    lastHttpCode: 200,
    latencyMs: 520,
  },
  {
    id: 'src-3',
    name: 'Ministry of Electronics & IT (MeitY)',
    agency: 'MeitY',
    portalUrl: 'https://meity.gov.in/esdm/r-d-proposals',
    cadence: 'Twice Daily',
    scrapingMethod: 'Scrapy Daemon',
    lastRunTime: '1 hour ago',
    nextRunTime: 'Today 18:00 IST',
    status: 'HEALTHY',
    callsExtracted: 6,
    corrigendaDetected: 1,
    lastHttpCode: 200,
    latencyMs: 410,
  },
  {
    id: 'src-4',
    name: 'Defence Research & Development Organisation (DRDO - ER&IPR)',
    agency: 'DRDO',
    portalUrl: 'https://drdo.gov.in/drdo/extramural-research',
    cadence: 'Twice Daily',
    scrapingMethod: 'Python BeautifulSoup / Headless',
    lastRunTime: '2 hours ago',
    nextRunTime: 'Today 20:00 IST',
    status: 'HEALTHY',
    callsExtracted: 5,
    corrigendaDetected: 1,
    lastHttpCode: 200,
    latencyMs: 618,
  },
  {
    id: 'src-5',
    name: 'Indian Council of Medical Research (ICMR)',
    agency: 'ICMR',
    portalUrl: 'https://main.icmr.nic.in/call-for-proposals',
    cadence: 'Daily (06:00 IST)',
    scrapingMethod: 'Official RSS / API',
    lastRunTime: '3 hours ago',
    nextRunTime: 'Tomorrow 06:00 IST',
    status: 'HEALTHY',
    callsExtracted: 7,
    corrigendaDetected: 1,
    lastHttpCode: 200,
    latencyMs: 290,
  },
  {
    id: 'src-6',
    name: 'All India Council for Technical Education (AICTE RPS/MODROB)',
    agency: 'AICTE',
    portalUrl: 'https://facilities.aicte-india.org/research',
    cadence: 'Daily (06:00 IST)',
    scrapingMethod: 'Python BeautifulSoup / Headless',
    lastRunTime: '4 hours ago',
    nextRunTime: 'Tomorrow 06:00 IST',
    status: 'HEALTHY',
    callsExtracted: 9,
    corrigendaDetected: 0,
    lastHttpCode: 200,
    latencyMs: 480,
  },
  {
    id: 'src-7',
    name: 'Indo-German / Indo-US Bilateral Science Schemes (IGSTC / IUSSTF)',
    agency: 'International (Horizon/IGSTC/Indo-US)',
    portalUrl: 'https://igstc.org/2+2-call-2026',
    cadence: 'Weekly',
    scrapingMethod: 'Official RSS / API',
    lastRunTime: 'Yesterday',
    nextRunTime: 'In 6 days',
    status: 'HEALTHY',
    callsExtracted: 4,
    corrigendaDetected: 0,
    lastHttpCode: 200,
    latencyMs: 780,
  },
  {
    id: 'src-8',
    name: 'Andhra Pradesh State Council of Science & Technology (APCOST)',
    agency: 'State Council (AP/TS)',
    portalUrl: 'https://apcost.ap.gov.in/calls',
    cadence: 'Weekly',
    scrapingMethod: 'Python BeautifulSoup / Headless',
    lastRunTime: '3 days ago',
    nextRunTime: 'In 4 days',
    status: 'HEALTHY',
    callsExtracted: 3,
    corrigendaDetected: 1,
    lastHttpCode: 200,
    latencyMs: 512,
  },
];

export const INITIAL_GRANT_CALLS: GrantCall[] = [
  {
    id: 'call-anrf-crg-2026',
    schemeCode: 'ANRF/CRG/2026/04',
    schemeName: 'ANRF Core Research Grant (CRG) - Engineering & Physical Sciences',
    agency: 'ANRF/SERB',
    portalUrl: 'https://anrfonline.in/crg-2026',
    researchAreas: ['Artificial Intelligence', 'Cyber-Physical Systems', 'VLSI Design', 'Robotics', 'Quantum Computing', 'Signal Processing'],
    eligibilityCriteria: {
      minimumDesignation: 'Assistant Professor',
      phdRequired: true,
      institutionTypes: ['Recognized Universities', 'IITs/NITs', 'Deemed to be Universities (NAAC A+)'],
      coPiAllowed: true,
      specialReservations: 'Regular faculty with minimum 3 years of service remaining prior to superannuation',
    },
    fundingCeilingInLakhs: 75.0,
    projectDurationMonths: 36,
    announcementDate: '2026-08-15',
    submissionDeadline: '2026-10-31',
    preparationThresholdDays: 30,
    requiredFormat: 'ANRF-CRG-Format-2026-v3 (Bio-data, Gantt Chart, Plagiarism Certificate, Budget Justification)',
    status: 'extended',
    corrigendaHistory: [
      {
        id: 'corr-crg-1',
        date: '2026-09-04',
        title: 'Deadline Extension Notice (Corrigendum #1)',
        type: 'DEADLINE_EXTENSION',
        description: 'Submission deadline extended from October 15, 2026 to October 31, 2026 due to festive holidays and portal maintenance.',
        previousDeadline: '2026-10-15',
        newDeadline: '2026-10-31',
      }
    ],
    deduplicationHash: 'sha256_anrf_crg_2026_engg_phys',
    discoveredAt: '2026-08-15T09:12:00Z',
    lastScrapedAt: '2026-09-11T10:00:00Z',
    summary: 'Flagship individual investigator scheme funding high-impact fundamental and applied research with overheads at 10% and research personnel fellowships included.',
  },
  {
    id: 'call-meity-c2s-2026',
    schemeCode: 'MeitY/C2S/PHASE2/11',
    schemeName: 'Chips to Startup (C2S) Programme - Specialized ASIC & Edge AI Accelerators',
    agency: 'MeitY',
    portalUrl: 'https://meity.gov.in/c2s-chips-to-startup',
    researchAreas: ['Edge AI Accelerators', 'VLSI Design', 'Embedded Systems', 'IoT Edge Security', 'FPGA Prototyping'],
    eligibilityCriteria: {
      minimumDesignation: 'Associate Professor',
      phdRequired: true,
      institutionTypes: ['Engineering Colleges', 'Deemed Universities', 'State Universities with Electronics Labs'],
      coPiAllowed: true,
      specialReservations: 'Must commit to training minimum 25 M.Tech / B.Tech students on EDA tools',
    },
    fundingCeilingInLakhs: 145.0,
    projectDurationMonths: 60,
    announcementDate: '2026-08-20',
    submissionDeadline: '2026-10-10',
    preparationThresholdDays: 25,
    requiredFormat: 'MeitY-C2S-Detailed-Proposal-Form-Rev4 with industry co-sponsorship letter',
    status: 'active',
    corrigendaHistory: [],
    deduplicationHash: 'sha256_meity_c2s_edge_asic_2026',
    discoveredAt: '2026-08-20T14:30:00Z',
    lastScrapedAt: '2026-09-11T10:15:00Z',
    summary: 'Massive capacity building and hardware silicon prototyping grant aimed at indigenously designed semiconductor accelerators and RISC-V edge IP cores.',
  },
  {
    id: 'call-drdo-eripr-2026',
    schemeCode: 'DRDO/ERIPR/CYBER/09',
    schemeName: 'DRDO Extramural Research: Autonomous Swarm Drones & Anti-Jamming RF Comm',
    agency: 'DRDO',
    portalUrl: 'https://drdo.gov.in/eripr-calls',
    researchAreas: ['Autonomous Drones', 'Swarm Robotics', 'RF Communications', 'Computer Vision', 'Deep Learning'],
    eligibilityCriteria: {
      minimumDesignation: 'Associate Professor',
      phdRequired: true,
      institutionTypes: ['Academic Institutions with Verified Security Clearance & In-house Labs'],
      coPiAllowed: true,
      specialReservations: 'Indian Citizens only. Proposal must adhere to Ministry of Defence security protocol.',
    },
    fundingCeilingInLakhs: 98.0,
    projectDurationMonths: 36,
    announcementDate: '2026-09-01',
    submissionDeadline: '2026-10-20',
    preparationThresholdDays: 30,
    requiredFormat: 'DRDO-ERIPR-Form-A1 (Hardcopy triplicate + Sealed CD/Encrypted Portal Upload)',
    status: 'active',
    corrigendaHistory: [],
    deduplicationHash: 'sha256_drdo_eripr_swarm_drones_2026',
    discoveredAt: '2026-09-01T11:00:00Z',
    lastScrapedAt: '2026-09-11T08:45:00Z',
    summary: 'Defense extramural grant funding algorithms for decentralized swarm navigation under GPS-denied environments and resilient frequency-hopping secure RF links.',
  },
  {
    id: 'call-dst-tdp-2026',
    schemeCode: 'DST/TDP/AGRI-AI/03',
    schemeName: 'DST Technology Development Programme: Precision Agriculture & Drone Sensing',
    agency: 'DST',
    portalUrl: 'https://dst.gov.in/tdp-agri-2026',
    researchAreas: ['Precision Agriculture', 'Hyperspectral Imaging', 'Drone Sensing', 'Machine Learning', 'Sensor Networks'],
    eligibilityCriteria: {
      minimumDesignation: 'Assistant Professor',
      phdRequired: true,
      institutionTypes: ['All UGC/AICTE Recognized Institutions'],
      coPiAllowed: true,
      specialReservations: 'Must involve an active farmer-producer organization or state agriculture department partner.',
    },
    fundingCeilingInLakhs: 60.0,
    projectDurationMonths: 24,
    announcementDate: '2026-08-01',
    submissionDeadline: '2026-09-28',
    preparationThresholdDays: 20,
    requiredFormat: 'DST-TDP-PPR-v2 (Preliminary Project Report followed by DPR)',
    status: 'corrigendum_issued',
    corrigendaHistory: [
      {
        id: 'corr-tdp-1',
        date: '2026-09-08',
        title: 'Budget Ceiling Raised & TRL Benchmark Corrigendum',
        type: 'BUDGET_REVISION',
        description: 'Maximum grant ceiling revised from ₹45.0 Lakhs to ₹60.0 Lakhs to accommodate advanced multispectral camera payloads.',
      }
    ],
    deduplicationHash: 'sha256_dst_tdp_agri_drone_sensor_2026',
    discoveredAt: '2026-08-01T12:00:00Z',
    lastScrapedAt: '2026-09-11T09:30:00Z',
    summary: 'Focuses on commercialization-ready technology transfer (TRL 4 to TRL 7) with sensor payloads, IoT telemetry, and automated crop disease detection.',
  },
  {
    id: 'call-icmr-aimis-2026',
    schemeCode: 'ICMR/MEDTECH/AI/2026',
    schemeName: 'ICMR Healthcare AI Mission: Early Detection of Oncology & Diabetic Retinopathy',
    agency: 'ICMR',
    portalUrl: 'https://main.icmr.nic.in/calls/medtech-ai',
    researchAreas: ['Biomedical AI', 'Medical Image Processing', 'Federated Learning', 'Healthcare Informatics', 'Wearable Sensors'],
    eligibilityCriteria: {
      minimumDesignation: 'Assistant Professor',
      phdRequired: true,
      institutionTypes: ['Academic Institutions in Collaboration with Medical Colleges / Hospitals'],
      coPiAllowed: true,
      specialReservations: 'Mandatory clinical Co-PI from an NMC recognized medical college with IEC clearance.',
    },
    fundingCeilingInLakhs: 85.0,
    projectDurationMonths: 36,
    announcementDate: '2026-08-25',
    submissionDeadline: '2026-11-15',
    preparationThresholdDays: 35,
    requiredFormat: 'ICMR-Adhoc-Call-Format-2026 with IEC/IRB clearance endorsement',
    status: 'active',
    corrigendaHistory: [],
    deduplicationHash: 'sha256_icmr_oncology_retinopathy_2026',
    discoveredAt: '2026-08-25T16:20:00Z',
    lastScrapedAt: '2026-09-11T08:00:00Z',
    summary: 'Clinical validation grant for machine learning models running on non-invasive screening equipment, prioritizing scalable rural diagnostic deployments.',
  },
  {
    id: 'call-aicte-rps-2026',
    schemeCode: 'AICTE/RPS/CSE/2026/01',
    schemeName: 'AICTE Research Promotion Scheme (RPS) - High Performance AI Clusters',
    agency: 'AICTE',
    portalUrl: 'https://facilities.aicte-india.org/rps',
    researchAreas: ['High Performance Computing', 'Distributed AI', 'Cloud Infrastructure', 'NLP for Indic Languages'],
    eligibilityCriteria: {
      minimumDesignation: 'Assistant Professor',
      phdRequired: true,
      maxYearsPostPhd: 12,
      institutionTypes: ['AICTE Approved Engineering Institutions'],
      coPiAllowed: false,
      specialReservations: 'Principal Investigator must be full-time regular faculty; max 1 RPS grant per department.',
    },
    fundingCeilingInLakhs: 25.0,
    projectDurationMonths: 36,
    announcementDate: '2026-09-05',
    submissionDeadline: '2026-11-05',
    preparationThresholdDays: 30,
    requiredFormat: 'AICTE-RPS-Online-Proforma with Institution Endorsement Certificate',
    status: 'active',
    corrigendaHistory: [],
    deduplicationHash: 'sha256_aicte_rps_hpc_ai_2026',
    discoveredAt: '2026-09-05T10:00:00Z',
    lastScrapedAt: '2026-09-11T10:30:00Z',
    summary: 'Promotes research culture in technical institutions by creating cutting-edge GPU and compute testbeds for faculty-led postgraduate and doctoral research.',
  },
  {
    id: 'call-igstc-2plus2-2026',
    schemeCode: 'IGSTC/2+2/CALL/2026',
    schemeName: 'Indo-German 2+2 Partnership Programme: Green Hydrogen & Smart Grid AI',
    agency: 'International (Horizon/IGSTC/Indo-US)',
    portalUrl: 'https://igstc.org/call-2026',
    researchAreas: ['Smart Grid AI', 'Renewable Energy', 'Decarbonization', 'Energy Optimization', 'IoT Sensors'],
    eligibilityCriteria: {
      minimumDesignation: 'Associate Professor',
      phdRequired: true,
      institutionTypes: ['Indian Academia + Indian Industry + German Academia + German Industry (2+2 Consortium)'],
      coPiAllowed: true,
      specialReservations: 'Consortium agreement required before stage 2 submission.',
    },
    fundingCeilingInLakhs: 220.0,
    projectDurationMonths: 36,
    announcementDate: '2026-07-20',
    submissionDeadline: '2026-10-25',
    preparationThresholdDays: 45,
    requiredFormat: 'IGSTC-Joint-Call-Format-2026 (Both DST India and BMBF Germany guidelines)',
    status: 'active',
    corrigendaHistory: [],
    deduplicationHash: 'sha256_igstc_green_hydrogen_smart_grid_2026',
    discoveredAt: '2026-07-20T10:00:00Z',
    lastScrapedAt: '2026-09-11T07:15:00Z',
    summary: 'Bilateral international grant fostering academic-industrial innovation between German and Indian partners with full travel and personnel funding.',
  }
];

export const INITIAL_FACULTY_PROFILES: FacultyProfile[] = [
  {
    id: 'fac-1',
    name: 'Dr. Akshay Gupta',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    email: 'akshay.gupta@vignan.ac.in',
    phone: '+91 98480 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    publicationKeywords: [
      'Artificial Intelligence',
      'Edge AI Accelerators',
      'Computer Vision',
      'Autonomous Drones',
      'Deep Learning',
      'High Performance Computing',
      'Embedded Systems'
    ],
    recentPublicationsCount: 19,
    hIndex: 16,
    activeProjectCommitments: [
      {
        grantTitle: 'DST-SERB Early Career Grant: Low-Power Deep Learning for Edge Vision',
        agency: 'ANRF/SERB',
        remainingMonths: 4,
        fundingLakhs: 32.0,
      }
    ],
    maxConcurrentProjects: 2,
    preferredFundingAgencies: ['ANRF/SERB', 'MeitY', 'DRDO', 'DST'],
    minGrantSizeLakhs: 25.0,
  },
  {
    id: 'fac-2',
    name: 'Prof. K. Rama Krishna',
    designation: 'Professor',
    department: 'Computer Science & Engineering',
    email: 'kramakrishna@vignan.ac.in',
    phone: '+91 94401 56789',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    publicationKeywords: [
      'VLSI Design',
      'Quantum Computing',
      'Cyber-Physical Systems',
      'FPGA Prototyping',
      'Signal Processing',
      'Edge AI Accelerators'
    ],
    recentPublicationsCount: 34,
    hIndex: 24,
    activeProjectCommitments: [],
    maxConcurrentProjects: 3,
    preferredFundingAgencies: ['MeitY', 'ANRF/SERB', 'DRDO', 'International (Horizon/IGSTC/Indo-US)'],
    minGrantSizeLakhs: 50.0,
  },
  {
    id: 'fac-3',
    name: 'Dr. Sunita Sharma',
    designation: 'Assistant Professor',
    department: 'Biotechnology & CSE (Joint Bio-Informatics Lab)',
    email: 'sunita.sharma@vignan.ac.in',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    publicationKeywords: [
      'Biomedical AI',
      'Medical Image Processing',
      'Federated Learning',
      'Healthcare Informatics',
      'Precision Agriculture',
      'Wearable Sensors'
    ],
    recentPublicationsCount: 14,
    hIndex: 11,
    activeProjectCommitments: [],
    maxConcurrentProjects: 2,
    preferredFundingAgencies: ['ICMR', 'DST', 'AICTE', 'State Council (AP/TS)'],
    minGrantSizeLakhs: 15.0,
  },
  {
    id: 'fac-4',
    name: 'Dr. V. Srinivas Rao',
    designation: 'Associate Professor',
    department: 'Electronics & Communication Engineering',
    email: 'vsrao@vignan.ac.in',
    phone: '+91 91234 56780',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    publicationKeywords: [
      'RF Communications',
      'IoT Sensors',
      'Autonomous Swarm Drones',
      'Sensor Networks',
      'Smart Grid AI',
      'Drone Sensing'
    ],
    recentPublicationsCount: 22,
    hIndex: 15,
    activeProjectCommitments: [
      {
        grantTitle: 'APCOST State Project: Smart River Gauging and Telemetry',
        agency: 'State Council (AP/TS)',
        remainingMonths: 14,
        fundingLakhs: 18.5,
      }
    ],
    maxConcurrentProjects: 2,
    preferredFundingAgencies: ['DRDO', 'DST', 'State Council (AP/TS)', 'ANRF/SERB'],
    minGrantSizeLakhs: 20.0,
  }
];

export const INITIAL_MATCH_SCORES: MatchScore[] = [
  {
    id: 'match-1',
    callId: 'call-anrf-crg-2026',
    facultyId: 'fac-1',
    overallScore: 94,
    breakdown: {
      researchFit: 96,
      eligibilityFit: 100,
      commitmentFit: 85,
      agencyFit: 95,
    },
    matchedKeywords: ['Artificial Intelligence', 'Robotics', 'Computer Vision', 'Signal Processing'],
    reasons: [
      'High overlap with 8 recent publications in IEEE/ACM transactions on Edge Vision and AI.',
      'Meets all ANRF criteria: regular Associate Professor with Ph.D., over 10 years to superannuation.',
      'Current SERB grant ends in 4 months, fitting project ramp-up timeline.',
      'ANRF is Dr. Gupta’s primary preferred agency.'
    ],
    eligibilityPassed: true,
    notifiedStatus: 'PREP_THRESHOLD_SENT',
    userDecision: 'PURSUED',
    feedbackNotes: 'Dr. Gupta signaled interest; moving to Agent 20 proposal drafting.',
    matchedAt: '2026-08-16T10:00:00Z',
  },
  {
    id: 'match-2',
    callId: 'call-drdo-eripr-2026',
    facultyId: 'fac-1',
    overallScore: 91,
    breakdown: {
      researchFit: 93,
      eligibilityFit: 95,
      commitmentFit: 80,
      agencyFit: 95,
    },
    matchedKeywords: ['Autonomous Drones', 'Computer Vision', 'Deep Learning'],
    reasons: [
      'Strong research fit with 2025 patent on autonomous drone optical obstacle avoidance.',
      'Indian citizen, Associate Professor designation satisfies DRDO ER&IPR rules.',
      'Faculty has prior institutional clearance from R&D Dean.'
    ],
    eligibilityPassed: true,
    notifiedStatus: 'FIRST_ALERT_SENT',
    userDecision: 'PENDING',
    matchedAt: '2026-09-02T11:30:00Z',
  },
  {
    id: 'match-3',
    callId: 'call-meity-c2s-2026',
    facultyId: 'fac-2',
    overallScore: 98,
    breakdown: {
      researchFit: 99,
      eligibilityFit: 100,
      commitmentFit: 95,
      agencyFit: 98,
    },
    matchedKeywords: ['VLSI Design', 'Edge AI Accelerators', 'FPGA Prototyping', 'Embedded Systems'],
    reasons: [
      'Prof. Rama Krishna is Lead PI of the EDA cadence lab with 30+ publications in VLSI.',
      'Eligible as full Professor; lab trained over 40 M.Tech scholars meeting the C2S human-capital mandate.',
      'Zero concurrent conflicting grants; maximum capacity available.'
    ],
    eligibilityPassed: true,
    notifiedStatus: 'PREP_THRESHOLD_SENT',
    userDecision: 'PURSUED',
    feedbackNotes: 'Proposal synopsis generated; Co-PI Dr. Akshay Gupta added for Edge AI stack.',
    matchedAt: '2026-08-21T09:00:00Z',
  },
  {
    id: 'match-4',
    callId: 'call-icmr-aimis-2026',
    facultyId: 'fac-3',
    overallScore: 95,
    breakdown: {
      researchFit: 98,
      eligibilityFit: 92,
      commitmentFit: 95,
      agencyFit: 95,
    },
    matchedKeywords: ['Biomedical AI', 'Medical Image Processing', 'Healthcare Informatics', 'Federated Learning'],
    reasons: [
      'Dr. Sunita Sharma has 7 publications on diabetic retinopathy and oncological ultrasound segmentation.',
      'Ph.D. completed in 2021; eligible under early career investigator rules.',
      'Hospital MoU in place with NRI Medical College for clinical Co-PI validation.'
    ],
    eligibilityPassed: true,
    notifiedStatus: 'FIRST_ALERT_SENT',
    userDecision: 'PURSUED',
    feedbackNotes: 'Dr. Sharma pursuing; clinical partner onboarded.',
    matchedAt: '2026-08-26T10:15:00Z',
  },
  {
    id: 'match-5',
    callId: 'call-dst-tdp-2026',
    facultyId: 'fac-4',
    overallScore: 89,
    breakdown: {
      researchFit: 92,
      eligibilityFit: 88,
      commitmentFit: 82,
      agencyFit: 90,
    },
    matchedKeywords: ['Drone Sensing', 'Sensor Networks', 'IoT Sensors', 'Hyperspectral Imaging'],
    reasons: [
      'Dr. Srinivas Rao specializes in UAV sensor telemetry and wireless river/crop monitoring.',
      'Corrigendum #1 raised budget to ₹60 Lakhs, making large drone camera payload feasible.',
      'State council commitment ends soon, enabling PI workload balance.'
    ],
    eligibilityPassed: true,
    notifiedStatus: 'PREP_THRESHOLD_SENT',
    userDecision: 'PENDING',
    matchedAt: '2026-08-02T14:00:00Z',
  }
];

export const INITIAL_PIPELINE: PipelineOpportunity[] = [
  {
    id: 'pipe-1',
    callId: 'call-anrf-crg-2026',
    facultyId: 'fac-1',
    facultyName: 'Dr. Akshay Gupta',
    schemeName: 'ANRF Core Research Grant (CRG) - Engineering',
    agency: 'ANRF/SERB',
    stage: 'AGENT20_DRAFTING',
    targetSubmissionDate: '2026-10-25',
    coInvestigators: ['Dr. V. Srinivas Rao'],
    budgetRequestedLakhs: 68.5,
    agent20Handshake: {
      status: 'SYNOPSIS_GENERATED',
      synopsisDocumentId: 'DOC-ANRF-CRG-2026-AG-V1',
      lastPushedAt: '2026-09-10T14:30:00Z',
    },
    agent21Compliance: {
      status: 'OVERHEADS_VERIFIED',
      issuesFound: [],
    },
    outcomeNotes: 'Proposal synopsis transferred to Agent 20. Section 3 (Methodology & Gantt chart) in drafting.',
    updatedAt: '2026-09-11T09:00:00Z',
  },
  {
    id: 'pipe-2',
    callId: 'call-meity-c2s-2026',
    facultyId: 'fac-2',
    facultyName: 'Prof. K. Rama Krishna',
    schemeName: 'MeitY Chips to Startup (C2S) Phase II',
    agency: 'MeitY',
    stage: 'INTERNAL_REVIEW',
    targetSubmissionDate: '2026-10-05',
    coInvestigators: ['Dr. Akshay Gupta', 'Dr. P. Kishore'],
    budgetRequestedLakhs: 138.0,
    agent20Handshake: {
      status: 'COMPLETED',
      synopsisDocumentId: 'DOC-MEITY-C2S-2026-KRK',
      lastPushedAt: '2026-09-08T18:00:00Z',
    },
    agent21Compliance: {
      status: 'BUDGET_VERIFIED',
      issuesFound: [],
    },
    outcomeNotes: 'Dean of R&D committee scheduled review meeting on September 15 for institution sign-off.',
    updatedAt: '2026-09-11T08:30:00Z',
  },
  {
    id: 'pipe-3',
    callId: 'call-icmr-aimis-2026',
    facultyId: 'fac-3',
    facultyName: 'Dr. Sunita Sharma',
    schemeName: 'ICMR Healthcare AI Mission: Oncology Screening',
    agency: 'ICMR',
    stage: 'AGENT20_DRAFTING',
    targetSubmissionDate: '2026-11-01',
    coInvestigators: ['Dr. B. Ramanathan (NRI Med College)'],
    budgetRequestedLakhs: 82.0,
    agent20Handshake: {
      status: 'SYNOPSIS_GENERATED',
      synopsisDocumentId: 'DOC-ICMR-MED-SS-2026',
      lastPushedAt: '2026-09-09T11:20:00Z',
    },
    agent21Compliance: {
      status: 'PENDING',
      issuesFound: ['Institutional Ethics Committee (IEC) clearance certificate pending from hospital'],
    },
    outcomeNotes: 'Agent 21 flagged pending IEC clearance requirement before final upload.',
    updatedAt: '2026-09-11T07:45:00Z',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: 'notif-1',
    callId: 'call-anrf-crg-2026',
    facultyId: 'fac-1',
    facultyName: 'Dr. Akshay Gupta',
    callTitle: 'ANRF Core Research Grant (CRG) 2026',
    agency: 'ANRF/SERB',
    alertType: 'CORRIGENDUM_UPDATE',
    deadline: '2026-10-31',
    scheduledTime: '2026-09-04T12:00:00Z',
    sentTime: '2026-09-04T12:01:10Z',
    status: 'ACKNOWLEDGED',
    channels: ['EMAIL', 'PORTAL', 'WHATSAPP'],
    messageBody: 'URGENT UPDATE: Submission deadline extended to Oct 31, 2026. 50 days remaining to finalize proposal package.',
  },
  {
    id: 'notif-2',
    callId: 'call-meity-c2s-2026',
    facultyId: 'fac-2',
    facultyName: 'Prof. K. Rama Krishna',
    callTitle: 'Chips to Startup (C2S) Edge AI Accelerators',
    agency: 'MeitY',
    alertType: 'PREPARATION_THRESHOLD_30D',
    deadline: '2026-10-10',
    scheduledTime: '2026-09-10T09:00:00Z',
    sentTime: '2026-09-10T09:00:45Z',
    status: 'SENT',
    channels: ['EMAIL', 'PORTAL'],
    messageBody: '30-DAY PREP THRESHOLD: 29 days left for MeitY C2S proposal submission. Internal Dean review recommended by Oct 01.',
  },
  {
    id: 'notif-3',
    callId: 'call-dst-tdp-2026',
    facultyId: 'fac-4',
    facultyName: 'Dr. V. Srinivas Rao',
    callTitle: 'DST Technology Development Programme: Precision Agri',
    agency: 'DST',
    alertType: 'PREPARATION_THRESHOLD_15D',
    deadline: '2026-09-28',
    scheduledTime: '2026-09-13T09:00:00Z',
    status: 'SCHEDULED',
    channels: ['EMAIL', 'PORTAL', 'SMS'],
    messageBody: '15-DAY CRITICAL ALERT: DST TDP proposal due on Sept 28, 2026. Preliminary Project Report draft must be finalized.',
  },
  {
    id: 'notif-4',
    callId: 'call-drdo-eripr-2026',
    facultyId: 'fac-1',
    facultyName: 'Dr. Akshay Gupta',
    callTitle: 'DRDO Swarm Drones & Anti-Jamming RF',
    agency: 'DRDO',
    alertType: 'FIRST_ALERT',
    deadline: '2026-10-20',
    scheduledTime: '2026-09-02T08:00:00Z',
    sentTime: '2026-09-02T08:02:15Z',
    status: 'SENT',
    channels: ['EMAIL', 'PORTAL'],
    messageBody: 'NEW HIGH MATCH (91%): DRDO has released Extramural Call in Autonomous Swarms. 39 days left to apply.',
  }
];

export const PYTHON_SCRAPER_SCRIPT = `"""
Agent 22: Funding Opportunity Autonomous Scraper Daemon
Technologies: Python 3.11, BeautifulSoup4, Scrapy, Pydantic, SQLAlchemy, PostgreSQL
"""

import hashlib
import json
import logging
from datetime import datetime, timedelta
from typing import List, Optional
import requests
from bs4 import BeautifulSoup
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("Agent22Scraper")

class GrantCallSchema(BaseModel):
    scheme_code: str
    scheme_name: str
    agency: str
    research_areas: List[str]
    funding_ceiling_lakhs: float
    project_duration_months: int
    submission_deadline: datetime
    eligibility_criteria: dict
    required_format: str
    deduplication_hash: str

class ANRFSpider:
    """Scrapes ANRF & SERB online portals for new schemes and corrigenda"""
    BASE_URL = "https://anrfonline.in/schemes"

    def __init__(self, db_session):
        self.session = requests.Session()
        self.db = db_session

    def fetch_active_schemes(self) -> List[GrantCallSchema]:
        logger.info(f"Connecting to {self.BASE_URL}...")
        # Simulated response parsing with BeautifulSoup
        extracted_calls = []
        html_payload = """
        <div class="scheme-card" data-code="ANRF/CRG/2026/04">
            <h3 class="title">ANRF Core Research Grant (CRG) - Engineering</h3>
            <span class="agency">ANRF/SERB</span>
            <span class="deadline">2026-10-31</span>
            <span class="ceiling">7500000</span>
            <div class="areas">Artificial Intelligence, Robotics, Quantum Computing, Signal Processing</div>
        </div>
        """
        soup = BeautifulSoup(html_payload, "html.parser")
        for card in soup.select(".scheme-card"):
            code = card["data-code"]
            title = card.select_one(".title").text.strip()
            agency = card.select_one(".agency").text.strip()
            deadline_str = card.select_one(".deadline").text.strip()
            ceiling = float(card.select_one(".ceiling").text.strip()) / 100000.0
            areas = [a.strip() for a in card.select_one(".areas").text.split(",")]
            
            # Deduplication fingerprint
            raw_fingerprint = f"{code}_{title}_{agency}_{deadline_str}"
            dedup_hash = hashlib.sha256(raw_fingerprint.encode('utf-8')).hexdigest()

            # Corrigendum and update check
            existing_record = self.db.query_grant_by_code(code)
            if existing_record and existing_record.submission_deadline != deadline_str:
                logger.warning(f"CORRIGENDUM DETECTED for {code}! Deadline shifted to {deadline_str}")
                self.db.record_corrigendum(code, previous=existing_record.submission_deadline, current=deadline_str)

            extracted_calls.append({
                "code": code,
                "title": title,
                "agency": agency,
                "deadline": deadline_str,
                "ceiling_lakhs": ceiling,
                "areas": areas,
                "hash": dedup_hash
            })
        return extracted_calls

if __name__ == "__main__":
    logger.info("Agent 22 background daemon initializing...")
    # spider = ANRFSpider(db_session=None)
    # spider.fetch_active_schemes()
`;

export const POSTGRES_DDL_SCHEMA = `-- PostgreSQL Schema for Agent 22: Funding Opportunity Monitoring Engine
-- Supports Grant Ingestion, Corrigenda Auditing, Faculty Matching, and Deadline Alerting

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy research keyword matching

-- 1. Funding Portals and Crawl Cadence
CREATE TABLE funding_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_code VARCHAR(50) NOT NULL UNIQUE,
    agency_name VARCHAR(255) NOT NULL,
    portal_url TEXT NOT NULL,
    crawl_cadence VARCHAR(50) DEFAULT 'Daily (06:00 IST)',
    scraping_engine VARCHAR(100) DEFAULT 'BeautifulSoup4 + Headless Chrome',
    last_crawl_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'HEALTHY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Structured Grant Calls (Extracted & Deduplicated)
CREATE TABLE grant_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES funding_sources(id) ON DELETE CASCADE,
    scheme_code VARCHAR(100) NOT NULL,
    scheme_name TEXT NOT NULL,
    agency VARCHAR(100) NOT NULL,
    research_areas TEXT[] NOT NULL,
    funding_ceiling_in_lakhs NUMERIC(10, 2) NOT NULL,
    project_duration_months INTEGER DEFAULT 36,
    submission_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    preparation_threshold_days INTEGER DEFAULT 30,
    required_format TEXT,
    eligibility_criteria JSONB NOT NULL,
    deduplication_hash VARCHAR(64) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Corrigenda & Extension Auditing
CREATE TABLE corrigenda_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grant_call_id UUID REFERENCES grant_calls(id) ON DELETE CASCADE,
    corrigendum_type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    previous_deadline TIMESTAMP WITH TIME ZONE,
    new_deadline TIMESTAMP WITH TIME ZONE,
    description TEXT,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Faculty Profiles (Harvested from Agent 17)
CREATE TABLE faculty_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_uid VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    publication_keywords TEXT[] NOT NULL,
    h_index INTEGER DEFAULT 0,
    active_commitments JSONB DEFAULT '[]'::JSONB,
    preferred_agencies TEXT[] DEFAULT ARRAY['ANRF/SERB', 'DST', 'MeitY'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Match Scores and Active Learning Feedback
CREATE TABLE faculty_grant_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grant_call_id UUID REFERENCES grant_calls(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty_profiles(id) ON DELETE CASCADE,
    overall_score NUMERIC(5, 2) NOT NULL,
    score_breakdown JSONB NOT NULL,
    matched_keywords TEXT[],
    eligibility_passed BOOLEAN DEFAULT TRUE,
    user_decision VARCHAR(50) DEFAULT 'PENDING',
    feedback_notes TEXT,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Deadline-Aware Notification Schedule
CREATE TABLE notification_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES faculty_grant_matches(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    target_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_send_time TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    channels TEXT[] DEFAULT ARRAY['EMAIL', 'PORTAL']
);

-- 7. Grant Proposal Pipeline (Feeds Agent 20 & 21)
CREATE TABLE grant_proposal_pipeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grant_call_id UUID REFERENCES grant_calls(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty_profiles(id) ON DELETE CASCADE,
    stage VARCHAR(50) DEFAULT 'PURSUED',
    agent_20_synopsis_status VARCHAR(50) DEFAULT 'NOT_STARTED',
    agent_21_compliance_status VARCHAR(50) DEFAULT 'PENDING',
    target_submission_date DATE NOT NULL,
    budget_requested_lakhs NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GIN Index on research areas for high-speed keyword search
CREATE INDEX idx_grant_calls_research_areas ON grant_calls USING gin(research_areas);
CREATE INDEX idx_faculty_keywords ON faculty_profiles USING gin(publication_keywords);
`;

export const DOCKER_COMPOSE_CONFIG = `version: '3.8'

services:
  # 1. PostgreSQL Database Service
  postgres-db:
    image: postgres:16-alpine
    container_name: agent22-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: research_admin
      POSTGRES_PASSWORD: VignanResearchPassword2026
      POSTGRES_DB: agent22_grants_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U research_admin -d agent22_grants_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  # 2. Python Scraper & Deduplication Worker Daemon
  python-crawler:
    build:
      context: .
      dockerfile: Dockerfile.python
    container_name: agent22-crawler-daemon
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://research_admin:VignanResearchPassword2026@postgres-db:5432/agent22_grants_db
      SCRAPER_CADENCE_CRON: "0 6,18 * * *" # Twice daily automated run
      PLAYWRIGHT_HEADLESS: "true"
    depends_on:
      postgres-db:
        condition: service_healthy

  # 3. Agent 22 Full-Stack API & UI (Node.js + Express + Vite React)
  agent22-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: agent22-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
      NODE_ENV: production
      DATABASE_URL: postgresql://research_admin:VignanResearchPassword2026@postgres-db:5432/agent22_grants_db
      AGENT17_PROFILER_ENDPOINT: http://agent17-profiler:8017/api/faculty-profiles
      AGENT20_DRAFTING_ENDPOINT: http://agent20-drafting:8020/api/proposals/ingest
      AGENT21_COMPLIANCE_ENDPOINT: http://agent21-checker:8021/api/compliance/validate
    depends_on:
      - postgres-db

volumes:
  pgdata:
`;
