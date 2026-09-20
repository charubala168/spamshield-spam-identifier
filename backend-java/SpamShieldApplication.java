package com.spamshield;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SpamShield - Enterprise-grade AI & Statistical Spam & Phishing Detection Engine.
 * Features:
 * - Multinomial Naive Bayes with Laplace Smoothing
 * - Heuristic Rule Engine (RFC/SpamAssassin inspired)
 * - Malicious URL & Homoglyph Analyzer
 * - Sender Spoofing & SPF/DKIM Verification
 * - Continuous Learning with Feedback Loops
 */
@SpringBootApplication
public class SpamShieldApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpamShieldApplication.class, args);
        System.out.println("🛡️ SpamShield Java Backend Engine started successfully on port 8080/3000");
    }
}
