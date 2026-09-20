package com.spamshield.engine;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Heuristic Security Rule Engine (SpamAssassin & RFC Header rules).
 * Assigns calibrated positive/negative weights based on adversarial indicators.
 */
public class HeuristicSecurityFilter {
    public static class RuleMatch {
        public final String ruleName;
        public final double scoreDelta;
        public final String description;

        public RuleMatch(String ruleName, double scoreDelta, String description) {
            this.ruleName = ruleName;
            this.scoreDelta = scoreDelta;
            this.description = description;
        }
    }

    private static final List<RuleDefinition> RULES = new ArrayList<>();

    static {
        RULES.add(new RuleDefinition("URGENT_CALL_TO_ACTION", 22.0, "Contains artificial urgency indicators ('immediately', 'within 24 hours', 'action required')",
            "(?i)\\b(immediately|within 24 hours|account will be closed|urgent action required|final notice|immediate verification)\\b"));
        
        RULES.add(new RuleDefinition("FINANCIAL_LURE", 20.0, "Unsolicited monetary gain, lottery, crypto, or inheritance claims",
            "(?i)\\b(wire transfer|inheritance|crypto giveaway|bitcoin reward|lottery winning|100% guaranteed profit|claim your prize|beneficiary)\\b"));
            
        RULES.add(new RuleDefinition("CREDENTIAL_TRAP", 28.0, "Requests to verify passwords, PINs, or update security credentials",
            "(?i)\\b(verify your password|confirm your identity|validate your ssn|update credit card|billing information has expired)\\b"));

        RULES.add(new RuleDefinition("EXCESSIVE_CAPS", 12.0, "High density of capitalized words or aggressive screaming typography",
            "\\b[A-Z]{4,}\\b.*\\b[A-Z]{4,}\\b.*\\b[A-Z]{4,}\\b"));

        RULES.add(new RuleDefinition("SUSPICIOUS_SMS_KEYWORD", 18.0, "Typical Smishing prompts asking recipient to click bit.ly or reply with STOP",
            "(?i)\\b(reply stop|usps package pending|toll balance overdue|click link to confirm delivery)\\b"));

        RULES.add(new RuleDefinition("BENIGN_BUSINESS_MARKERS", -15.0, "Standard legitimate business correspondence markers",
            "(?i)\\b(meeting invite|calendar update|per our conversation|please find attached the invoice you requested|attached report|project deliverable)\\b"));
    }

    public List<RuleMatch> evaluate(String subject, String body) {
        List<RuleMatch> matches = new ArrayList<>();
        String combined = (subject != null ? subject : "") + " " + (body != null ? body : "");

        for (RuleDefinition rule : RULES) {
            if (rule.pattern.matcher(combined).find()) {
                matches.add(new RuleMatch(rule.name, rule.weight, rule.description));
            }
        }
        return matches;
    }

    private static class RuleDefinition {
        final String name;
        final double weight;
        final String description;
        final Pattern pattern;

        RuleDefinition(String name, double weight, String description, String regex) {
            this.name = name;
            this.weight = weight;
            this.description = description;
            this.pattern = Pattern.compile(regex);
        }
    }
}
