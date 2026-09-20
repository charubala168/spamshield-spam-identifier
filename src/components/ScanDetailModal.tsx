import React from "react";
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Eye, 
  Clock, 
  Link2,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { ScanResult } from "../types";

interface ScanDetailModalProps {
  scan: ScanResult | null;
  onClose: () => void;
  onSubmitFeedback?: (scanId: string, correction: "HAM" | "SPAM", reason: string) => void;
}

export const ScanDetailModal: React.FC<ScanDetailModalProps> = ({
  scan,
  onClose,
  onSubmitFeedback,
}) => {
  const [feedbackFeedback, setFeedbackFeedback] = React.useState<string | null>(null);
  const [feedbackReason, setFeedbackReason] = React.useState("");
  const [selectedCorrection, setSelectedCorrection] = React.useState<"HAM" | "SPAM" | null>(null);

  if (!scan) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "HIGH": return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "MEDIUM": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "LOW": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      default: return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
  };

  const handleSendFeedback = () => {
    if (!selectedCorrection || !onSubmitFeedback) return;
    onSubmitFeedback(scan.id, selectedCorrection, feedbackReason);
    setFeedbackFeedback(`Feedback submitted: Marked as ${selectedCorrection}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              scan.isSpam ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}>
              {scan.isSpam ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Full Threat Inspection Report</h3>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getRiskColor(scan.riskLevel)}`}>
                  {scan.riskLevel} RISK
                </span>
                <span className="text-xs uppercase px-2 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">
                  {scan.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Scan ID: <span className="font-mono text-slate-300">{scan.id}</span> • Analyzed in {scan.latencyMs}ms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">AI Spam Score</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${scan.spamScore >= 50 ? "text-rose-400" : "text-emerald-400"}`}>
                  {scan.spamScore}
                </span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Confidence Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-cyan-400">
                  {scan.confidenceScore}%
                </span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Phishing Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {scan.isPhishing ? (
                  <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Detected
                  </span>
                ) : (
                  <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Clean
                  </span>
                )}
              </div>
            </div>
            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl">
              <span className="text-xs text-slate-400 block mb-1">Sender Alignment</span>
              <div className="text-sm font-semibold truncate text-slate-300">
                {scan.senderAnalysis.spfDkimStatus.includes("FAIL") ? (
                  <span className="text-rose-400 font-bold">Failed SPF/DKIM</span>
                ) : (
                  <span className="text-emerald-400 font-bold">Verified SPF</span>
                )}
              </div>
            </div>
          </div>

          {/* Dangerous Message Explanation Card */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Eye className="w-4 h-4" />
              <span>Dangerous Message Explanation (Plain English)</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {scan.dangerousExplanation.summary}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-700/80">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-0.5">Attack Vector:</span>
                <span className="text-amber-300 font-medium">{scan.dangerousExplanation.attackVector}</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-0.5">Attacker Goal:</span>
                <span className="text-rose-300 font-medium">{scan.dangerousExplanation.attackerGoal}</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-0.5">Potential Impact:</span>
                <span className="text-slate-300 font-medium">{scan.dangerousExplanation.potentialImpact}</span>
              </div>
            </div>

            {scan.dangerousExplanation.immediateAction?.length > 0 && (
              <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 mt-2">
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Recommended Immediate Actions:
                </span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {scan.dangerousExplanation.immediateAction.map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reasons for Detection */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Reasons for Detection</span>
            </h4>
            <div className="space-y-2">
              {scan.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-800/40 border border-slate-700/50 rounded-lg text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sender Analysis */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Sender Deep Analysis</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Sender Name / Address:</span>
                <span className="font-mono text-white text-xs">{scan.senderAnalysis.sender || "None"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Identified Domain:</span>
                <span className="font-mono text-cyan-300 text-xs">{scan.senderAnalysis.domain || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Domain Reputation:</span>
                <span className="font-bold text-slate-200">{scan.senderAnalysis.reputationScore} / 100</span>
              </div>
              <div>
                <span className="text-slate-400 block">Spoofing Flags:</span>
                <span className={scan.senderAnalysis.isSpoofed ? "text-rose-400 font-semibold" : "text-emerald-400"}>
                  {scan.senderAnalysis.isSpoofed ? "Spoofed / Misaligned" : "Domain Aligned"}
                </span>
              </div>
            </div>
            {scan.senderAnalysis.flags.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-700/50">
                {scan.senderAnalysis.flags.map((f, i) => (
                  <p key={i} className="text-xs text-amber-300 flex items-center gap-1.5">
                    <span>⚠</span> {f}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Malicious Link Checker */}
          {scan.detectedLinks.length > 0 && (
            <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-rose-400" />
                <span>Malicious Link Inspector ({scan.detectedLinks.length} Found)</span>
              </h4>
              <div className="space-y-2">
                {scan.detectedLinks.map((link, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-400 break-all">{link.url}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        link.isMalicious ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                        {link.isMalicious ? `RISK ${link.riskScore}%` : "SAFE"}
                      </span>
                    </div>
                    {link.threats.length > 0 && (
                      <div className="text-rose-300 space-y-0.5 pt-1">
                        {link.threats.map((t, ti) => (
                          <div key={ti} className="flex items-center gap-1">
                            <span className="text-[10px]">•</span> {t}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Content Preview */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scanned Message Body</h4>
            {scan.subject && (
              <div className="text-xs text-slate-300 pb-1 border-b border-slate-800">
                <span className="font-semibold text-slate-400">Subject: </span>{scan.subject}
              </div>
            )}
            <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {scan.body}
            </p>
          </div>

          {/* User Feedback System */}
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  User Feedback & Continuous Learning Loop
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Help the Java Naive Bayes & AI models learn. Report if this detection was inaccurate.
                </p>
              </div>
              {scan.userFeedback && (
                <span className="px-2.5 py-1 text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-lg font-semibold">
                  Feedback Logged: {scan.userFeedback.correction}
                </span>
              )}
            </div>

            {feedbackFeedback ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{feedbackFeedback}</span>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedCorrection("HAM")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedCorrection === "HAM"
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Report False Positive (It's Ham/Legitimate)</span>
                  </button>

                  <button
                    onClick={() => setSelectedCorrection("SPAM")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedCorrection === "SPAM"
                        ? "bg-rose-600 text-white border-rose-500"
                        : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Report False Negative (It's Spam/Threat)</span>
                  </button>
                </div>

                {selectedCorrection && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Optional feedback note (e.g. sender is a trusted vendor)..."
                      value={feedbackReason}
                      onChange={(e) => setFeedbackReason(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleSendFeedback}
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
