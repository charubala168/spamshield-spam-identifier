import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Send, 
  Mail, 
  MessageSquare, 
  Link2, 
  UserCheck, 
  Cpu, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { ScanResult, MessageChannelType, RiskLevel } from "../types";
import { SAMPLE_MESSAGES, SampleMessage } from "../sampleData";

interface LiveDetectorProps {
  initialSample?: SampleMessage | null;
  onScanCompleted: (result: ScanResult) => void;
  onNavigateTab: (tab: "detector" | "analytics" | "batch" | "history" | "learning" | "javacode") => void;
}

export const LiveDetector: React.FC<LiveDetectorProps> = ({
  initialSample,
  onScanCompleted,
  onNavigateTab,
}) => {
  const [channel, setChannel] = useState<MessageChannelType>("email");
  const [sender, setSender] = useState("PayPal Security Alert <service-notice@paypal-verify-alert.xyz>");
  const [subject, setSubject] = useState("URGENT: Your PayPal account has been temporarily restricted!");
  const [body, setBody] = useState(
    "Dear Customer,\n\nWe detected unauthorized login attempts from IP 194.26.29.112 in Bucharest. Your account privileges have been suspended. You must verify your credentials immediately within 24 hours or your balance will be held permanently.\n\nClick here to restore account: http://194.26.29.112/paypal-login/auth-token.php\n\nPayPal Account Protection"
  );

  const [isScanning, setIsScanning] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);

  // Apply initial sample if prop updates
  useEffect(() => {
    if (initialSample) {
      setChannel(initialSample.type);
      setSender(initialSample.sender);
      setSubject(initialSample.subject);
      setBody(initialSample.body);
      handleScan(initialSample.type, initialSample.sender, initialSample.subject, initialSample.body);
    }
  }, [initialSample]);

  // Real-time dynamic analysis as user types (debounced)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!realtimeEnabled) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (body.trim().length > 10 || subject.trim().length > 5) {
        handleScan(channel, sender, subject, body, true);
      }
    }, 450);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [body, subject, sender, channel, realtimeEnabled]);

  // Trigger initial scan once mounted
  useEffect(() => {
    handleScan(channel, sender, subject, body);
  }, []);

  const handleScan = async (
    ch: MessageChannelType,
    snd: string,
    sbj: string,
    bdy: string,
    isRealtimeTick = false
  ) => {
    if (!isRealtimeTick) setIsScanning(true);
    setFeedbackStatus(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: ch,
          sender: snd,
          subject: ch === "email" ? sbj : "",
          body: bdy,
        }),
      });

      if (!response.ok) throw new Error("Failed to scan message");
      const data: ScanResult = await response.json();
      setCurrentResult(data);
      onScanCompleted(data);
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      if (!isRealtimeTick) setIsScanning(false);
    }
  };

  const handleFeedback = async (correction: "HAM" | "SPAM") => {
    if (!currentResult) return;
    try {
      const resp = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanId: currentResult.id,
          originalPrediction: currentResult.isSpam ? "SPAM" : "HAM",
          userCorrection: correction,
          reason: `User marked as ${correction} in Live Detector`,
        }),
      });
      if (resp.ok) {
        setFeedbackStatus(`Marked as ${correction}. Weights adjusted in Continuous Learning.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case "CRITICAL":
        return {
          bg: "bg-rose-500/15 text-rose-300 border-rose-500/30",
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
          label: "CRITICAL RISK",
          color: "text-rose-400",
        };
      case "HIGH":
        return {
          bg: "bg-orange-500/15 text-orange-300 border-orange-500/30",
          icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
          label: "HIGH RISK",
          color: "text-orange-400",
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: "SUSPICIOUS / MEDIUM",
          color: "text-amber-400",
        };
      case "LOW":
        return {
          bg: "bg-blue-500/15 text-blue-300 border-blue-500/30",
          icon: <Info className="w-4 h-4 text-blue-400" />,
          label: "LOW RISK",
          color: "text-blue-400",
        };
      default:
        return {
          bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          label: "SAFE / LEGITIMATE",
          color: "text-emerald-400",
        };
    }
  };

  const riskBadge = currentResult ? getRiskBadge(currentResult.riskLevel) : getRiskBadge("SAFE");

  return (
    <div className="space-y-6">
      {/* Top Banner / Scenario Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                16 Multi-Feature Engine
              </span>
              <span className="text-slate-400 text-xs">
                Real-Time Java Classification + Deep AI Phishing Defense
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Spam, Phishing & Smishing Identifier
            </h1>
          </div>

          {/* Channel Selector & Real-Time Toggle */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Email / SMS Selector */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                id="btn-channel-email"
                onClick={() => {
                  setChannel("email");
                  setSender("PayPal Security <service@paypal-verify-alert.xyz>");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  channel === "email"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Scan</span>
              </button>
              <button
                id="btn-channel-sms"
                onClick={() => {
                  setChannel("sms");
                  setSender("+1 (800) 555-0199");
                  setSubject("");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  channel === "sms"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>SMS / Smishing</span>
              </button>
            </div>

            {/* Real-time toggle */}
            <button
              onClick={() => setRealtimeEnabled(!realtimeEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                realtimeEnabled
                  ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
              title="Toggle live typing detection"
            >
              <Zap className={`w-3.5 h-3.5 ${realtimeEnabled ? "text-emerald-400" : "text-slate-400"}`} />
              <span>Real-Time {realtimeEnabled ? "Active" : "Paused"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Left Input Panel | Right Real-Time Assessment Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input Workspace */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">
                  {channel === "email" ? "Email Message Payload" : "SMS Text Message Payload"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSender("");
                  setSubject("");
                  setBody("");
                }}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                title="Clear input fields"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Sender Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {channel === "email" ? "Sender (From Header):" : "Sender Phone / Shortcode:"}
              </label>
              <input
                id="input-sender"
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder={channel === "email" ? "e.g. Bank of America <alerts@security-domain.com>" : "+1 (800) 555-0199"}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              />
            </div>

            {/* Subject (Only for Email) */}
            {channel === "email" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Subject Line:
                </label>
                <input
                  id="input-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. URGENT: Action required on your account"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            )}

            {/* Message Body */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  {channel === "email" ? "Email Body Content:" : "SMS Message Text:"}
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {body.length} chars
                </span>
              </div>
              <textarea
                id="input-body"
                rows={channel === "email" ? 9 : 6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={channel === "email" ? "Paste or write email text here..." : "Paste SMS text with any links..."}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed transition-colors resize-y"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                id="btn-deep-scan"
                onClick={() => handleScan(channel, sender, subject, body)}
                disabled={isScanning}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{isScanning ? "Scanning Deep AI & Java Models..." : "Deep Neural Scan (Manual)"}</span>
              </button>
            </div>

            {/* Quick Test Presets Pill Row */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Quick Test Scenarios:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_MESSAGES.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setChannel(s.type);
                      setSender(s.sender);
                      setSubject(s.subject);
                      setBody(s.body);
                      handleScan(s.type, s.sender, s.subject, s.body);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    {s.name.split(" ")[0]} ({s.category})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Results & All 16 Features */}
        <div className="lg:col-span-7 space-y-5">
          {currentResult ? (
            <>
              {/* PRIMARY SCORE & RISK CARD */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                {/* Background ambient glow based on threat */}
                <div 
                  className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
                    currentResult.spamScore >= 50 ? "bg-rose-500" : "bg-emerald-500"
                  }`} 
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${riskBadge.bg}`}>
                      {riskBadge.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${riskBadge.bg}`}>
                          {riskBadge.label}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {currentResult.latencyMs}ms scan
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white mt-1">
                        {currentResult.isSpam ? "Threat Detected" : "Verified Legitimate (Ham)"}
                      </div>
                    </div>
                  </div>

                  {/* High Level Phishing Indicator */}
                  <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">Phishing Status:</span>
                    {currentResult.isPhishing ? (
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        PHISHING ATTEMPT
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        CLEAN / NO PHISH
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Meters Grid: AI Spam Score & Confidence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  {/* 1. AI Spam Score (0 - 100) */}
                  <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        1. AI Spam Score
                      </span>
                      <span className={`text-xs font-bold ${currentResult.spamScore >= 50 ? "text-rose-400" : "text-emerald-400"}`}>
                        {currentResult.spamScore >= 50 ? "High Probability Spam" : "Low Probability"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-3xl font-black tracking-tight ${
                        currentResult.spamScore >= 80 ? "text-rose-400" :
                        currentResult.spamScore >= 60 ? "text-orange-400" :
                        currentResult.spamScore >= 40 ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {currentResult.spamScore}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">/ 100.0</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          currentResult.spamScore >= 80 ? "bg-gradient-to-r from-orange-500 to-rose-500" :
                          currentResult.spamScore >= 50 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                          "bg-gradient-to-r from-emerald-500 to-cyan-500"
                        }`}
                        style={{ width: `${Math.max(4, Math.min(100, currentResult.spamScore))}%` }}
                      />
                    </div>
                  </div>

                  {/* 14. Confidence Score */}
                  <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        14. Confidence Score
                      </span>
                      <span className="text-xs font-bold text-cyan-400">
                        High Certainty
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-black tracking-tight text-white">
                        {currentResult.confidenceScore}%
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">statistical confidence</span>
                    </div>

                    {/* Confidence Meter */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${currentResult.confidenceScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Structured Reasons for Detection */}
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>2. Reasons for Detection</span>
                  </h4>
                  <div className="space-y-1.5">
                    {currentResult.reasons.map((reason, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 16. Dangerous Message Explanation */}
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                      <Eye className="w-4 h-4" />
                      <span>16. Dangerous Message Explanation (Plain English)</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {currentResult.dangerousExplanation.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                      <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Attack Vector:
                        </span>
                        <span className="text-amber-300 font-semibold">
                          {currentResult.dangerousExplanation.attackVector}
                        </span>
                      </div>
                      <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Attacker Goal:
                        </span>
                        <span className="text-rose-300 font-semibold">
                          {currentResult.dangerousExplanation.attackerGoal}
                        </span>
                      </div>
                      <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Potential Impact:
                        </span>
                        <span className="text-slate-300 font-semibold">
                          {currentResult.dangerousExplanation.potentialImpact}
                        </span>
                      </div>
                    </div>

                    {currentResult.dangerousExplanation.immediateAction?.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-slate-300 block mb-1">
                          Recommended Actions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentResult.dangerousExplanation.immediateAction.map((act, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md"
                            >
                              ✓ {act}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 13. MULTIPLE ML MODEL COMPARISON */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-sm text-white">
                      13. Multiple ML Model Comparison
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    4 Models Compared in Real-Time
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(currentResult.modelComparison).map(([key, model]) => (
                    <div
                      key={key}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">
                            {model.modelName}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {model.algorithmType}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                            model.classification === "SPAM"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {model.classification}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                        <span className="text-slate-400">Score: <strong className="text-slate-200">{model.spamScore}</strong></span>
                        <span className="text-slate-400">Conf: <strong className="text-cyan-400">{model.confidence}%</strong></span>
                        <span className="text-slate-400 font-mono text-[10px]">{model.latencyMs}ms</span>
                      </div>

                      <p className="text-[10px] text-slate-400 italic line-clamp-1">
                        Sensitivity: {model.primarySensitivity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. MALICIOUS LINK CHECKER & 6. SENDER ANALYSIS (2 Col Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 4. Malicious Link Checker */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                        4. Malicious Link Checker
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {currentResult.detectedLinks.length} URLs extracted
                    </span>
                  </div>

                  {currentResult.detectedLinks.length === 0 ? (
                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                      No hyperlinks extracted in message body
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {currentResult.detectedLinks.map((link, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs text-cyan-300 truncate max-w-[200px]" title={link.url}>
                              {link.url}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                link.isMalicious
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {link.isMalicious ? `RISK ${link.riskScore}%` : "BENIGN"}
                            </span>
                          </div>

                          {link.threats.length > 0 && (
                            <div className="space-y-0.5 pt-1 border-t border-slate-800/80">
                              {link.threats.map((t, ti) => (
                                <p key={ti} className="text-[10px] text-rose-400 flex items-center gap-1">
                                  <span>⚠</span> {t}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Sender Analysis */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                        6. Sender Reputation & Spoofing
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Reputation: {currentResult.senderAnalysis.reputationScore}/100
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Sender Display / Email:</span>
                      <span className="font-mono text-white text-xs truncate block" title={currentResult.senderAnalysis.sender}>
                        {currentResult.senderAnalysis.sender || "None"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Domain:</span>
                        <span className="font-mono text-cyan-300 text-xs">
                          {currentResult.senderAnalysis.domain || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">SPF / DKIM:</span>
                        <span className={`text-[11px] font-semibold ${
                          currentResult.senderAnalysis.spfDkimStatus.includes("FAIL") ? "text-rose-400" : "text-emerald-400"
                        }`}>
                          {currentResult.senderAnalysis.spfDkimStatus.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {currentResult.senderAnalysis.flags.length > 0 && (
                      <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300 space-y-1">
                        {currentResult.senderAnalysis.flags.map((flg, fi) => (
                          <div key={fi} className="flex items-start gap-1">
                            <span className="text-rose-400">•</span>
                            <span>{flg}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 8. EXPLAINABLE AI (XAI) SALIENCY MAP & 11. USER FEEDBACK */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                      8. Explainable AI (XAI) Token Attribution
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Influential Tokens Shifting Prediction
                  </span>
                </div>

                {currentResult.explainableTokens.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    No extreme outlier tokens detected in vocabulary dictionary.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {currentResult.explainableTokens.map((t, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono ${
                          t.label === "SPAM"
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        }`}
                      >
                        <span className="font-bold">{t.token}</span>
                        <span className="text-[10px] opacity-75">
                          {t.label === "SPAM" ? `+${t.weight}` : `-${t.weight}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 11. User Feedback System Bar */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      11. User Feedback System & Continuous Learning
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Does this result look incorrect? Submit feedback to update the Java Naive Bayes weights.
                    </p>
                  </div>

                  {feedbackStatus ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {feedbackStatus}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFeedback("HAM")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors"
                        title="Mark as false positive (It's legitimate)"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>False Positive (Ham)</span>
                      </button>
                      <button
                        onClick={() => handleFeedback("SPAM")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 transition-colors"
                        title="Mark as false negative (It's spam)"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>False Negative (Spam)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <Zap className="w-8 h-8 text-cyan-400 mx-auto animate-pulse" />
              <p className="text-sm font-semibold text-white">Analyzing payload in real time...</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Running tokenization, Java Laplace Naive Bayes, malicious link scanner, sender analysis, and Gemini AI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
