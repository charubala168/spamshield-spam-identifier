export type MessageChannelType = "email" | "sms";
export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";

export interface DetectedLink {
  url: string;
  isMalicious: boolean;
  riskScore: number;
  threats: string[];
}

export interface SenderAnalysis {
  sender: string;
  email: string;
  displayName: string;
  domain: string;
  reputationScore: number;
  isFreeMail: boolean;
  isDisposable: boolean;
  isSpoofed: boolean;
  flags: string[];
  spfDkimStatus: string;
}

export interface ExplainableToken {
  token: string;
  weight: number;
  label: "SPAM" | "HAM";
}

export interface ModelPredictionDetail {
  modelName: string;
  algorithmType: string;
  spamScore: number;
  classification: string;
  confidence: number;
  latencyMs: number;
  primarySensitivity: string;
}

export interface DangerousExplanation {
  summary: string;
  attackVector: string;
  attackerGoal: string;
  potentialImpact: string;
  immediateAction: string[];
}

export interface ScanResult {
  id: string;
  type: MessageChannelType;
  sender: string;
  subject: string;
  body: string;
  timestamp: string;
  spamScore: number;
  riskLevel: RiskLevel;
  isSpam: boolean;
  isPhishing: boolean;
  confidenceScore: number;
  reasons: string[];
  detectedLinks: DetectedLink[];
  senderAnalysis: SenderAnalysis;
  explainableTokens: ExplainableToken[];
  modelComparison: {
    naiveBayes: ModelPredictionDetail;
    logisticSvm: ModelPredictionDetail;
    heuristicRules: ModelPredictionDetail;
    aiEnsemble: ModelPredictionDetail;
  };
  dangerousExplanation: DangerousExplanation;
  latencyMs: number;
  userFeedback?: {
    correction: "HAM" | "SPAM";
    reason: string;
    timestamp: string;
  };
}

export interface AnalyticsData {
  totalScanned: number;
  spamCount: number;
  phishingCount: number;
  safeCount: number;
  spamRatePercentage: number;
  phishingRatePercentage: number;
  averageConfidence: number;
  riskDistribution: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
    SAFE: number;
  };
  threatCategories: {
    credentialPhishing: number;
    financialFraud: number;
    smishingUrgent: number;
    maliciousUrls: number;
    senderSpoofing: number;
    cleanEnterprise: number;
  };
  hourlyTrends: Array<{ hour: string; spam: number; ham: number }>;
  topThreatDomains: Array<{ domain: string; count: number }>;
  learnedVocabularySize: number;
  continuousLearningCycles: number;
  modelAccuracy: number;
}

export interface ContinuousLearningData {
  retrainCycles: number;
  currentAccuracy: number;
  totalFeedbackItems: number;
  feedbackHistory: Array<{
    id: string;
    scanId: string;
    originalPrediction: string;
    userCorrection: string;
    reason: string;
    timestamp: string;
  }>;
  vocabulary: Array<{
    word: string;
    weight: number;
    occurrences: number;
    classificationBias: "SPAM_BIAS" | "HAM_BIAS" | "NEUTRAL";
  }>;
}

export interface JavaCodeFile {
  path: string;
  name: string;
  category: string;
  code: string;
  description: string;
}

export interface JavaBackendData {
  engineName: string;
  javaVersion: string;
  architecture: string;
  files: JavaCodeFile[];
}
