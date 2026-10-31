export interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  deliverables: string;
  dependencies: string;
  targetDate: string;
  weight: number;
  approved: boolean;
  matchedTaskId?: string;
  matchedTaskTitle?: string;
  similarityScore: number;
}

export interface ProposalItem {
  id: string;
  eventId: string;
  title: string;
  fileName: string;
  summary: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  milestones: MilestoneItem[];
}

export interface EventProgressData {
  eventId: string;
  eventTitle: string;
  actualProgress: number;
  plannedProgress: number;
  progressGap: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  blockedTasks: number;
  approvedMilestonesCount: number;
  missingMilestonesCount: number;
  formulaDescription: string;
  overdueTaskTitles: string[];
  blockedTaskTitles: string[];
  missingMilestoneTitles: string[];
}

export interface DelayPredictionData {
  eventId: string;
  delayProbability: number;
  willMissDeadline: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  riskFactors: { factor: string; impact: string; importance: number }[];
  correctiveActions: string[];
  modelName: string;
  baselineComparison: string;
  trainingDataNote: string;
}

export interface RegistrationForecastData {
  eventId: string;
  currentRegistrations: number;
  targetCapacity: number;
  predictedFinalRegistrations: number;
  lowerBound: number;
  upperBound: number;
  riskOfMissingTarget: number;
  registrationVelocityPerDay: number;
  daysRemaining: number;
  baselineLinearEstimate: number;
  modelName: string;
  note: string;
}

export interface NoShowPredictionData {
  eventId: string;
  totalRegistrations: number;
  expectedAttendees: number;
  expectedNoShows: number;
  averageNoShowProbability: number;
  highRiskCount: number;
  riskBreakdown: { LOW_RISK: number; MEDIUM_RISK: number; HIGH_RISK: number };
  topFactors: string[];
  reminderStrategies: string[];
  modelName: string;
  safetyNotice: string;
}

export interface AnomalyDetectionData {
  eventId: string;
  totalTransactionsAnalyzed: number;
  flaggedAnomaliesCount: number;
  overallAnomalyRate: number;
  flaggedEvents: {
    timestampOffset: string;
    anomalyScore: number;
    type: string;
    details: string;
    action: string;
  }[];
  modelName: string;
  isolationForestBaseline: string;
  securityDisclaimer: string;
}

export interface SessionCrowdData {
  eventId: string;
  totalSessionsTracked: number;
  overcrowdingAlertsCount: number;
  sessionForecasts: {
    sessionId: string;
    title: string;
    roomCapacity: number;
    predictedCrowd: number;
    overcrowded: boolean;
    action: string;
  }[];
  modelName: string;
  venueSafetyNote: string;
}

export interface PriceSimulationPoint {
  price: number;
  projectedSales: number;
  projectedRevenue: number;
  selloutProbability: number;
}

export interface DynamicPricingData {
  eventId: string;
  currentPrice: number;
  optimalPrice: number;
  priceDifferencePct: number;
  recommendedAction: 'SURGE_INCREASE' | 'DISCOUNT_STIMULATE' | 'HOLD_CURRENT';
  rationale: string;
  projectedGrossRevenue: number;
  currentProjectedRevenue: number;
  projectedRevenueUplift: number;
  expectedTotalSales: number;
  targetCapacity: number;
  elasticityCoefficient: number;
  demandSurgeFactor: number;
  priceFloor: number;
  priceCeiling: number;
  simulationCurve: PriceSimulationPoint[];
  algorithm: string;
}

export interface IntelligenceDashboardData {
  eventId: string;
  eventTitle: string;
  progress: EventProgressData;
  delayPrediction: DelayPredictionData;
  registrationForecast: RegistrationForecastData;
  noShowPrediction: NoShowPredictionData;
  anomalyDetection: AnomalyDetectionData;
  sessionCrowd: SessionCrowdData;
  dynamicPricing?: DynamicPricingData;
  proposals: ProposalItem[];
}
