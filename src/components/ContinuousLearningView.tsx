import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  RotateCw, 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown, 
  BookOpen, 
  TrendingUp, 
  Sparkles,
  Sliders,
  History
} from "lucide-react";
import { ContinuousLearningData } from "../types";

export const ContinuousLearningView: React.FC = () => {
  const [data, setData] = useState<ContinuousLearningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainNotice, setRetrainNotice] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/continuous-learning");
      if (resp.ok) {
        const json = await resp.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerRetrain = async () => {
    setIsRetraining(true);
    setRetrainNotice(null);
    try {
      const resp = await fetch("/api/continuous-learning/retrain", { method: "POST" });
      if (resp.ok) {
        const result = await resp.json();
        setRetrainNotice(result.message || "Model weights re-converged successfully!");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRetraining(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center text-slate-400 space-y-3">
        <RotateCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-white">Loading Active Continuous Learning State...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Active Feedback Loop
            </span>
            <span className="text-xs text-slate-400">Dynamic Java Naive Bayes token adaptation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Continuous Learning & Model Adaptation
          </h2>
        </div>

        <button
          onClick={handleTriggerRetrain}
          disabled={isRetraining}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRetraining ? "animate-spin" : ""}`} />
          <span>{isRetraining ? "Re-weighting Model Weights..." : "Trigger Model Retraining"}</span>
        </button>
      </div>

      {retrainNotice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-800/60 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{retrainNotice}</span>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Converged Accuracy
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-400">
              {data.currentAccuracy}%
            </span>
            <span className="text-xs text-emerald-400/80 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> +0.8% gain
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Validated against live user false positive & false negative corrections
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Retraining Cycles
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-cyan-400">
              #{data.retrainCycles}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Auto-Adaptive
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Incremental batch iterations on stochastic gradient weights
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Feedback Submissions
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-indigo-400">
              {data.totalFeedbackItems}
            </span>
            <span className="text-xs text-indigo-300 font-semibold">
              Live Audited
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            User-reported false positives and false negatives
          </p>
        </div>
      </div>

      {/* Learned Token Dictionary Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Learned Token Weights & Classification Bias</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Dynamic multipliers applied to the Java Laplace Naive Bayes log-likelihood calculations
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {data.vocabulary.length} Active Tokens
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data.vocabulary.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">
                  "{item.word}"
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    item.classificationBias === "SPAM_BIAS"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : item.classificationBias === "HAM_BIAS"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {item.classificationBias === "SPAM_BIAS" ? "Spam Multiplier" : "Ham Safe Multiplier"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                <span>Weight Multiplier:</span>
                <span className="font-mono font-bold text-cyan-300">
                  {item.weight}x
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Observed Frequency:</span>
                <span>{item.occurrences} instances</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback Submissions History */}
      {data.feedbackHistory.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <span>Recent Feedback Audit Submissions</span>
            </h3>
            <span className="text-xs text-slate-400">Fed directly into continuous learning</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {data.feedbackHistory.map((fb) => (
              <div key={fb.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Original:</span>
                    <span className="font-bold text-slate-300">{fb.originalPrediction}</span>
                    <span className="text-slate-500">➔</span>
                    <span className="text-slate-400">User Correction:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      fb.userCorrection === "SPAM" ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"
                    }`}>
                      {fb.userCorrection}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    "{fb.reason}"
                  </p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(fb.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
