package com.spamshield.controller;

import com.spamshield.engine.*;
import com.spamshield.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/java")
@CrossOrigin(origins = "*")
public class SpamDetectionController {

    private final NaiveBayesClassifier naiveBayes = new NaiveBayesClassifier();
    private final UrlSafetyAnalyzer urlAnalyzer = new UrlSafetyAnalyzer();
    private final SenderReputationAnalyzer senderAnalyzer = new SenderReputationAnalyzer();
    private final HeuristicSecurityFilter heuristicFilter = new HeuristicSecurityFilter();
    private final ContinuousLearningStore learningStore = new ContinuousLearningStore();
    private final ModelComparisonRunner comparisonRunner = new ModelComparisonRunner();

    @PostMapping("/analyze")
    public ResponseEntity<SpamAnalysisResult> analyzeMessage(@RequestBody MessagePayload payload) {
        long start = System.currentTimeMillis();
        String combined = (payload.getSubject() != null ? payload.getSubject() : "") + " " + (payload.getBody() != null ? payload.getBody() : "");

        // 1. Naive Bayes Probability
        double nbProb = naiveBayes.predictSpamProbability(combined);

        // 2. URLs
        List<Map<String, Object>> detectedUrls = urlAnalyzer.analyzeUrls(combined);

        // 3. Sender
        Map<String, Object> senderRep = senderAnalyzer.analyzeSender(payload.getSender(), payload.getBody());

        // 4. Heuristics
        List<HeuristicSecurityFilter.RuleMatch> ruleMatches = heuristicFilter.evaluate(payload.getSubject(), payload.getBody());
        double ruleScore = 20.0;
        List<String> reasons = new ArrayList<>();
        for (var m : ruleMatches) {
            ruleScore += m.scoreDelta;
            reasons.add(m.description);
        }

        // Composite Spam Score
        double spamScore = Math.min(100.0, Math.max(0.0, (nbProb * 40.0) + (ruleScore * 0.4) + (detectedUrls.stream().anyMatch(u -> (Boolean) u.get("isMalicious")) ? 25.0 : 0.0)));
        if (Boolean.TRUE.equals(senderRep.get("isSpoofed"))) {
            spamScore = Math.min(100.0, spamScore + 20.0);
            reasons.add("Sender domain spoofing identified: " + senderRep.get("flags"));
        }

        // Risk Level
        String riskLevel = "SAFE";
        if (spamScore >= 80.0) riskLevel = "CRITICAL";
        else if (spamScore >= 60.0) riskLevel = "HIGH";
        else if (spamScore >= 40.0) riskLevel = "MEDIUM";
        else if (spamScore >= 20.0) riskLevel = "LOW";

        SpamAnalysisResult result = new SpamAnalysisResult();
        result.setId(UUID.randomUUID().toString());
        result.setSpamScore(Math.round(spamScore * 10.0) / 10.0);
        result.setRiskLevel(riskLevel);
        result.setSpam(spamScore >= 50.0);
        result.setPhishing(spamScore >= 65.0 && (detectedUrls.size() > 0 || Boolean.TRUE.equals(senderRep.get("isSpoofed"))));
        result.setConfidenceScore(Math.round(Math.max(70.0, 50.0 + Math.abs(spamScore - 50.0)) * 10.0) / 10.0);
        result.setReasons(reasons.isEmpty() ? List.of("Clean message heuristics; no malicious vectors detected") : reasons);
        result.setDetectedLinks(detectedUrls);
        result.setSenderAnalysis(senderRep);
        result.setLatencyMs(System.currentTimeMillis() - start);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/feedback")
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Map<String, String> body) {
        learningStore.recordFeedback(
            body.get("messageId"),
            body.get("originalPrediction"),
            body.get("userCorrection"),
            body.get("reason"),
            body.get("messageText")
        );
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("currentAccuracy", learningStore.getCurrentModelAccuracy());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/retrain")
    public ResponseEntity<Map<String, Object>> retrain() {
        return ResponseEntity.ok(learningStore.triggerRetraining());
    }
}
