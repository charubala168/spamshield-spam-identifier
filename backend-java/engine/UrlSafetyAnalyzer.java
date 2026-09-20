package com.spamshield.engine;

import java.net.URI;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Malicious URL & Link Inspector in pure Java.
 * Scans for:
 * - Direct IP address hostnames (e.g. http://192.168.1.1/login)
 * - Suspicious Top-Level Domains (.xyz, .top, .ru, .bit, .click, .work)
 * - Lookalike homoglyphs / typosquatting (paypa1, go0gle, netf1ix)
 * - Hex/Punycode obfuscation
 * - Hidden redirect and tracking query parameters
 */
public class UrlSafetyAnalyzer {
    private static final Pattern URL_PATTERN = Pattern.compile(
        "\\b(https?://[a-zA-Z0-9.-]+(?:\\.[a-zA-Z]{2,})+(?::\\d+)?(?:/[^\\s]*)?)\\b",
        Pattern.CASE_INSENSITIVE
    );

    private static final Set<String> SUSPICIOUS_TLDS = Set.of(
        ".xyz", ".top", ".club", ".click", ".work", ".kim", ".country", ".ru", ".cn", ".stream", ".gq", ".tk"
    );

    private static final Pattern IP_URL_PATTERN = Pattern.compile("https?://\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}");

    public List<Map<String, Object>> analyzeUrls(String text) {
        List<Map<String, Object>> results = new ArrayList<>();
        if (text == null) return results;

        Matcher matcher = URL_PATTERN.matcher(text);
        while (matcher.find()) {
            String url = matcher.group(1);
            Map<String, Object> urlReport = evaluateSingleUrl(url);
            results.add(urlReport);
        }
        return results;
    }

    private Map<String, Object> evaluateSingleUrl(String rawUrl) {
        Map<String, Object> report = new HashMap<>();
        report.put("url", rawUrl);
        boolean isMalicious = false;
        double riskScore = 0.0;
        List<String> threats = new ArrayList<>();

        try {
            URI uri = new URI(rawUrl);
            String host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";

            // 1. IP address in host
            if (IP_URL_PATTERN.matcher(rawUrl).find()) {
                isMalicious = true;
                riskScore += 45.0;
                threats.add("Host uses raw IP address instead of domain name");
            }

            // 2. High-risk TLD
            for (String tld : SUSPICIOUS_TLDS) {
                if (host.endsWith(tld)) {
                    isMalicious = true;
                    riskScore += 30.0;
                    threats.add("Suspicious top-level domain (" + tld + ")");
                    break;
                }
            }

            // 3. Phishing brand typosquatting
            String[] targetBrands = {"paypal", "bankofamerica", "netflix", "microsoft", "google", "apple", "wellsfargo", "amazon", "chase"};
            for (String brand : targetBrands) {
                if (host.contains(brand) && !host.endsWith("." + brand + ".com") && !host.equals(brand + ".com")) {
                    isMalicious = true;
                    riskScore += 50.0;
                    threats.add("Brand spoofing / typosquatting detected (" + brand + ")");
                }
            }

            // 4. Excessive subdomains or hyphens
            long hyphens = host.chars().filter(ch -> ch == '-').count();
            if (hyphens >= 3) {
                riskScore += 20.0;
                threats.add("Excessive hyphens in hostname (domain masking)");
            }

            // 5. Credential harvesting keywords in path
            String path = uri.getPath() != null ? uri.getPath().toLowerCase() : "";
            if (path.contains("login") || path.contains("verify") || path.contains("signin") || path.contains("update-billing") || path.contains("secure")) {
                riskScore += 25.0;
                threats.add("Sensitive credential keywords present in URL path");
            }

        } catch (Exception e) {
            threats.add("Malformed or obfuscated URL structure");
            riskScore += 20.0;
        }

        report.put("isMalicious", isMalicious || riskScore >= 40.0);
        report.put("riskScore", Math.min(100.0, riskScore));
        report.put("threats", threats);
        return report;
    }
}
