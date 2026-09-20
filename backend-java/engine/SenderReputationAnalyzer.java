package com.spamshield.engine;

import java.util.*;

/**
 * Sender Reputation & Spoofing Analyzer in pure Java.
 * Evaluates:
 * - Display name spoofing (e.g. "Google Security Team <random123@freemail.com>")
 * - Freemail mismatch against financial/corporate claims
 * - Disposable temporary email domain lists
 * - Synthetic SPF / DKIM alignment scoring
 */
public class SenderReputationAnalyzer {
    private static final Set<String> FREE_MAIL_PROVIDERS = Set.of(
        "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "proton.me", "mail.com"
    );

    private static final Set<String> DISPOSABLE_PROVIDERS = Set.of(
        "tempmail.com", "10minutemail.com", "guerrillamail.com", "throwawaymail.com", "yopmail.com"
    );

    private static final String[] CRITICAL_ORGANIZATIONS = {
        "paypal", "chase", "wells fargo", "bank of america", "irs", "citibank", "microsoft", "apple", "netflix"
    };

    public Map<String, Object> analyzeSender(String senderString, String body) {
        Map<String, Object> analysis = new HashMap<>();
        String email = extractEmail(senderString);
        String displayName = extractDisplayName(senderString);
        String domain = email.contains("@") ? email.substring(email.indexOf("@") + 1).toLowerCase() : "";

        double reputationScore = 85.0; // Baseline good
        List<String> flags = new ArrayList<>();
        boolean isSpoofed = false;

        if (DISPOSABLE_PROVIDERS.contains(domain)) {
            reputationScore -= 60.0;
            flags.add("Sender domain is a known burner/disposable email service");
            isSpoofed = true;
        }

        // Display name spoofing vs actual domain
        String lowerDisplay = displayName.toLowerCase();
        for (String org : CRITICAL_ORGANIZATIONS) {
            if (lowerDisplay.contains(org)) {
                if (FREE_MAIL_PROVIDERS.contains(domain)) {
                    reputationScore -= 65.0;
                    flags.add("High Risk: Official organization name '" + org + "' sent from generic public provider @" + domain);
                    isSpoofed = true;
                } else if (!domain.contains(org.replace(" ", ""))) {
                    reputationScore -= 50.0;
                    flags.add("Mismatch: Display name claims to be '" + org + "' but domain is @" + domain);
                    isSpoofed = true;
                }
            }
        }

        // Check if email claims to be bank in body but sent from personal account
        String lowerBody = body != null ? body.toLowerCase() : "";
        if ((lowerBody.contains("your bank") || lowerBody.contains("wire transfer") || lowerBody.contains("tax refund")) 
                && FREE_MAIL_PROVIDERS.contains(domain)) {
            reputationScore -= 30.0;
            flags.add("Body contains banking/financial claims sent from a consumer mailbox");
        }

        reputationScore = Math.max(5.0, Math.min(100.0, reputationScore));

        analysis.put("sender", senderString);
        analysis.put("email", email);
        analysis.put("displayName", displayName);
        analysis.put("domain", domain);
        analysis.put("reputationScore", reputationScore);
        analysis.put("isFreeMail", FREE_MAIL_PROVIDERS.contains(domain));
        analysis.put("isDisposable", DISPOSABLE_PROVIDERS.contains(domain));
        analysis.put("isSpoofed", isSpoofed);
        analysis.put("flags", flags);
        analysis.put("spfDkimStatus", isSpoofed ? "FAIL (Header alignment mismatch)" : "PASS (Domain aligned)");

        return analysis;
    }

    private String extractEmail(String raw) {
        if (raw == null) return "unknown@sender.com";
        int start = raw.indexOf("<");
        int end = raw.indexOf(">");
        if (start != -1 && end != -1 && end > start) {
            return raw.substring(start + 1, end).trim();
        }
        return raw.trim();
    }

    private String extractDisplayName(String raw) {
        if (raw == null) return "";
        int start = raw.indexOf("<");
        if (start != -1) {
            return raw.substring(0, start).replace("\"", "").trim();
        }
        return raw.trim();
    }
}
