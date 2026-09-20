import { MessageChannelType } from "./types";

export interface SampleMessage {
  id: string;
  name: string;
  category: "phishing" | "smishing" | "spam" | "ham";
  type: MessageChannelType;
  sender: string;
  subject: string;
  body: string;
  description: string;
}

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: "sample-1",
    name: "PayPal Account Suspension (Phishing)",
    category: "phishing",
    type: "email",
    sender: "PayPal Security Dept <service-notice@paypal-verify-alert.xyz>",
    subject: "URGENT: Your PayPal account has been temporarily restricted!",
    body: "Dear Customer,\n\nWe detected suspicious login attempts from unknown IP address 194.26.29.112 in Bucharest, Romania. Your PayPal account privileges and linked debit cards have been locked.\n\nYou must verify your password, full billing address, and SSN within 24 hours to restore full access. Failure to comply will result in permanent account termination and forfeiture of your remaining balance.\n\nVerify Now: http://194.26.29.112/paypal-login/auth-token.php\n\nSincerely,\nPayPal Account Protection Team",
    description: "Classic brand impersonation with spoofed domain, raw IP address link, and artificial urgency.",
  },
  {
    id: "sample-2",
    name: "USPS Delivery Smishing (SMS)",
    category: "smishing",
    type: "sms",
    sender: "+1 (800) 555-0199",
    subject: "Package Delivery Notice",
    body: "USPS Notification: Package #US984210 is on hold due to incomplete street address details. Update your delivery information immediately to avoid return to warehouse: https://usps-parcel-track.click/re-route",
    description: "High-frequency courier smishing attack targeting mobile users with deceptive parcel redirection links.",
  },
  {
    id: "sample-3",
    name: "Chase Fraud Alert (SMS)",
    category: "smishing",
    type: "sms",
    sender: "CHASE-VERIFY",
    subject: "Security Notification",
    body: "Chase Bank Alert: Did you authorize a $1,250.00 wire transfer to BITCOIN_ATM_EXCHANGE? If NO, reply STOP immediately and cancel the transaction at: http://chase-security-verify.top/cancel-hold",
    description: "Financial panic trigger with suspicious top-level domain (.top) and credential harvesting.",
  },
  {
    id: "sample-4",
    name: "Crypto Lottery & Beneficiary (Spam)",
    category: "spam",
    type: "email",
    sender: "Rev. Thomas Sterling <thomas.sterling99@freemail-direct.com>",
    subject: "CONFIDENTIAL PROPOSAL: Grant Fund Distribution of $4.5M USD",
    body: "Beloved in Christ,\n\nI am contacting you regarding an unclaimed inheritance fund of $4,500,000.00 USD currently deposited with an international clearing house. Due to terminal illness, I have selected you as the foreign beneficiary.\n\nSend your full name, private telephone number, copy of passport, and bank account details for immediate wire transfer processing.\n\nGod bless you,\nRev. Thomas Sterling",
    description: "Advance-fee 419 inheritance fraud with religious appeals and financial lures.",
  },
  {
    id: "sample-5",
    name: "Engineering Sprint Sync (Legitimate Ham)",
    category: "ham",
    type: "email",
    sender: "Elena Vance <elena.vance@techcorp.io>",
    subject: "Sprint 42 Architecture Review & Release Notes",
    body: "Hi Team,\n\nPlease find attached our slide deck for today's engineering sync at 2:00 PM PST. We will review our Kafka pipeline latency, the Laplace smoothed Naive Bayes backend benchmarks, and the upcoming Q4 infrastructure roadmap.\n\nLet me know if you would like to add any items to the agenda.\n\nBest regards,\nElena Vance\nStaff Platform Engineer, TechCorp",
    description: "Benign corporate communication with verified domain, technical terms, and zero threats.",
  },
  {
    id: "sample-6",
    name: "GitHub Pull Request Review (Legitimate Ham)",
    category: "ham",
    type: "email",
    sender: "GitHub Notifications <notifications@github.com>",
    subject: "[techcorp/spamshield] Pull Request #14: Optimize tokenization latency (merged)",
    body: "Alex Rivers merged commit a84fb2 into main:\n\n- Improved memory footprint of continuous learning vocabulary\n- Enhanced Laplace smoothing unit tests\n\nView diff on GitHub: https://github.com/techcorp/spamshield/pull/14\n\nYou are receiving this because you are subscribed to the repository.",
    description: "Authentic automated developer notification with verified SPF/DKIM headers.",
  },
];
