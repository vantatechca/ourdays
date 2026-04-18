export type IdeaStatus = "detected" | "reviewing" | "approved" | "declined" | "incubating" | "archived" | "starred";
export type ComplianceFlag = "green" | "yellow" | "red";
export type RuleType = "must_have" | "must_avoid" | "prefer" | "deprioritize";
export type RuleDirection = "boost" | "penalize" | "block" | "require";
export type IdeaCategory = "ebook" | "course" | "template" | "calculator" | "saas_tool" | "ai_app" | "membership" | "printable" | "tracker" | "community" | "coaching" | "other";
export type OpportunityType = "proven_model" | "gap_opportunity" | "emerging_trend" | "first_mover" | "improvement";

export interface IdeaCardData {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: IdeaStatus;
  compositeScore: number;
  trendScore: number;
  demandScore: number;
  competitionScore: number;
  feasibilityScore: number;
  revenuePotentialScore: number;
  confidenceScore: number;
  category: string;
  subcategory?: string;
  peptideTopics: string[];
  productType: string[];
  subNiche: string[];
  targetAudience?: string;
  opportunityType?: string;
  complianceFlag: ComplianceFlag;
  complianceNotes?: string;
  googleTrendsScore?: number;
  googleTrendsDirection?: string;
  redditMentionCount: number;
  redditQuestionCount: number;
  youtubeVideoCount: number;
  etsyCompetitorCount: number;
  whopCompetitorCount: number;
  estimatedPriceRange?: string;
  effortToBuild?: string;
  timeToBuild?: string;
  sourceUrls: string[];
  sourcePlatforms: string[];
  discoveredAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalIdeas: number;
  pendingReview: number;
  approved: number;
  declined: number;
  incubating: number;
  avgScore: number;
  ideasThisWeek: number;
  topTrendingTopic: string;
}

export interface TrendData {
  keyword: string;
  platform: string;
  value: number;
  direction: "rising" | "stable" | "declining" | "breakout";
  changePercent: number;
}
