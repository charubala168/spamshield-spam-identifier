package com.spamshield.model;

import java.util.List;
import java.util.Map;

public class SpamAnalysisResult {
    private String id;
    private double spamScore; // 0.0 - 100.0
    private String riskLevel; // SAFE, LOW, MEDIUM, HIGH, CRITICAL
    private boolean isSpam;
    private boolean isPhishing;
    private double confidenceScore; // 0.0 - 100.0
    private List<String> reasons;
    private List<Map<String, Object>> detectedLinks;
    private Map<String, Object> senderAnalysis;
    private Map<String, Double> explainableTokens; // Word saliency weights
    private Map<String, Map<String, Object>> modelComparison; // NaiveBayes, SVM/Logistic, Heuristic, AI Ensemble
    private String dangerousExplanation;
    private List<String> recommendedActions;
    private long latencyMs;

    public SpamAnalysisResult() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public double getSpamScore() { return spamScore; }
    public void setSpamScore(double spamScore) { this.spamScore = spamScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public boolean isSpam() { return isSpam; }
    public void setSpam(boolean spam) { isSpam = spam; }

    public boolean isPhishing() { return isPhishing; }
    public void setPhishing(boolean phishing) { isPhishing = phishing; }

    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }

    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }

    public List<Map<String, Object>> getDetectedLinks() { return detectedLinks; }
    public void setDetectedLinks(List<Map<String, Object>> detectedLinks) { this.detectedLinks = detectedLinks; }

    public Map<String, Object> getSenderAnalysis() { return senderAnalysis; }
    public void setSenderAnalysis(Map<String, Object> senderAnalysis) { this.senderAnalysis = senderAnalysis; }

    public Map<String, Double> getExplainableTokens() { return explainableTokens; }
    public void setExplainableTokens(Map<String, Double> explainableTokens) { this.explainableTokens = explainableTokens; }

    public Map<String, Map<String, Object>> getModelComparison() { return modelComparison; }
    public void setModelComparison(Map<String, Map<String, Object>> modelComparison) { this.modelComparison = modelComparison; }

    public String getDangerousExplanation() { return dangerousExplanation; }
    public void setDangerousExplanation(String dangerousExplanation) { this.dangerousExplanation = dangerousExplanation; }

    public List<String> getRecommendedActions() { return recommendedActions; }
    public void setRecommendedActions(List<String> recommendedActions) { this.recommendedActions = recommendedActions; }

    public long getLatencyMs() { return latencyMs; }
    public void setLatencyMs(long latencyMs) { this.latencyMs = latencyMs; }
}
