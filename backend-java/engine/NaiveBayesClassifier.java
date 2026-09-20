package com.spamshield.engine;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Multinomial Naive Bayes Classifier in pure Java with Laplace Add-1 Smoothing.
 * Supports token frequency accumulation and dynamic log-likelihood inference.
 */
public class NaiveBayesClassifier {
    private final Map<String, Integer> spamWordCounts = new ConcurrentHashMap<>();
    private final Map<String, Integer> hamWordCounts = new ConcurrentHashMap<>();
    private int totalSpamWords = 0;
    private int totalHamWords = 0;
    private int spamDocuments = 0;
    private int hamDocuments = 0;

    public NaiveBayesClassifier() {
        seedInitialCorpus();
    }

    private void seedInitialCorpus() {
        // High-frequency Spam & Phishing priors
        String[] spamTokens = {
            "urgent", "act", "now", "verify", "account", "suspended", "password", "reset",
            "prize", "winner", "lottery", "crypto", "bitcoin", "investment", "guaranteed",
            "claim", "free", "gift", "card", "irs", "tax", "refund", "wire", "transfer",
            "security", "alert", "unauthorized", "login", "bank", "billing", "declined",
            "overdue", "invoice", "payment", "beneficiary", "fund", "million", "dollars"
        };
        for (String token : spamTokens) {
            spamWordCounts.put(token, 25);
            totalSpamWords += 25;
        }
        spamDocuments = 1500;

        // High-frequency Ham (Legitimate) priors
        String[] hamTokens = {
            "meeting", "schedule", "calendar", "project", "agenda", "discussion", "update",
            "attached", "report", "review", "colleague", "regards", "thanks", "sincerely",
            "team", "office", "quarterly", "document", "notes", "sync", "call", "zoom"
        };
        for (String token : hamTokens) {
            hamWordCounts.put(token, 30);
            totalHamWords += 30;
        }
        hamDocuments = 2000;
    }

    public double predictSpamProbability(String text) {
        List<String> tokens = tokenize(text);
        if (tokens.isEmpty()) return 0.05;

        // Prior probabilities (log space)
        double totalDocs = spamDocuments + hamDocuments;
        double logPriorSpam = Math.log((double) spamDocuments / totalDocs);
        double logPriorHam = Math.log((double) hamDocuments / totalDocs);

        // Vocabulary size for Laplace smoothing
        Set<String> vocab = new HashSet<>(spamWordCounts.keySet());
        vocab.addAll(hamWordCounts.keySet());
        vocab.addAll(tokens);
        int vocabSize = Math.max(vocab.size(), 100);

        double logLikelihoodSpam = logPriorSpam;
        double logLikelihoodHam = logPriorHam;

        for (String token : tokens) {
            int spamCount = spamWordCounts.getOrDefault(token, 0);
            int hamCount = hamWordCounts.getOrDefault(token, 0);

            // Laplace smoothing: (count + 1) / (total + |V|)
            double pWordGivenSpam = (spamCount + 1.0) / (totalSpamWords + vocabSize);
            double pWordGivenHam = (hamCount + 1.0) / (totalHamWords + vocabSize);

            logLikelihoodSpam += Math.log(pWordGivenSpam);
            logLikelihoodHam += Math.log(pWordGivenHam);
        }

        // Convert log likelihood difference to normalized posterior probability: P(Spam | X) = 1 / (1 + e^(logHam - logSpam))
        double diff = logLikelihoodHam - logLikelihoodSpam;
        if (diff > 50.0) return 0.0001;
        if (diff < -50.0) return 0.9999;
        return 1.0 / (1.0 + Math.exp(diff));
    }

    public synchronized void train(String text, boolean isSpam) {
        List<String> tokens = tokenize(text);
        if (isSpam) {
            spamDocuments++;
            for (String t : tokens) {
                spamWordCounts.merge(t, 1, Integer::sum);
                totalSpamWords++;
            }
        } else {
            hamDocuments++;
            for (String t : tokens) {
                hamWordCounts.merge(t, 1, Integer::sum);
                totalHamWords++;
            }
        }
    }

    public List<String> tokenize(String text) {
        if (text == null) return Collections.emptyList();
        String cleaned = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ");
        String[] rawTokens = cleaned.split("\\s+");
        List<String> tokens = new ArrayList<>();
        for (String t : rawTokens) {
            if (t.length() >= 3 && !isStopword(t)) {
                tokens.add(t);
            }
        }
        return tokens;
    }

    private boolean isStopword(String word) {
        Set<String> stops = Set.of("the", "and", "is", "in", "it", "to", "for", "with", "that", "this", "are", "from", "you", "your", "have");
        return stops.contains(word);
    }

    public Map<String, Integer> getSpamWordCounts() { return Collections.unmodifiableMap(spamWordCounts); }
    public int getTotalSpamWords() { return totalSpamWords; }
    public int getTotalHamWords() { return totalHamWords; }
}
