export interface FinancialSummary {
  grossRevenue: number;
  netRevenue: number;
  ticketsSold: number;
  avgTicketPrice: number;
  refundsProcessed: number;
}

export interface AttendanceConversion {
  totalRegistered: number;
  totalCheckedIn: number;
  conversionRatePercentage: number;
  peakHour: string;
}

export interface RegionDemographic {
  region: string;
  country: string;
  count: number;
  percentage: number;
}

export interface AiUsageMetrics {
  tokensUsedThisMonth: number;
  monthlyQuota: number;
  ragQueriesProcessed: number;
  copilotSessions: number;
}
