import React, { useEffect, useState } from "react";
import { 
  BarChart3, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Cpu, 
  Globe, 
  RefreshCw, 
  CheckCircle2, 
  Mail, 
  Zap, 
  ArrowUpRight 
} from "lucide-react";
import { AnalyticsData } from "../types";

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !data) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-white">Loading Security Email Analytics...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Dashboard Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Live Threat Telemetry
            </span>
            <span className="text-xs text-slate-400">Real-time aggregate detection telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Email & SMS Security Analytics Dashboard
          </h2>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Top 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyzed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scanned</span>
            <Mail className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white tracking-tight">
              {data.totalScanned}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +100% active
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Continuous ingestion across Email & SMS vectors
          </p>
        </div>

        {/* Spam Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Spam Detection Rate</span>
            <ShieldAlert className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-orange-400 tracking-tight">
              {data.spamRatePercentage}%
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {data.spamCount} flagged
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Filtered by Java Laplace Naive Bayes & Rule Engine
          </p>
        </div>

        {/* Phishing Attacks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Phishing Threats</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-rose-400 tracking-tight">
              {data.phishingRatePercentage}%
            </span>
            <span className="text-xs font-semibold text-rose-400/80">
              {data.phishingCount} attacks
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            High-severity credential theft & impersonation
          </p>
        </div>

        {/* AI Confidence & Model Accuracy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Engine Accuracy</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-cyan-400 tracking-tight">
              {data.modelAccuracy}%
            </span>
            <span className="text-xs font-semibold text-indigo-400">
              Cycle #{data.continuousLearningCycles}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {data.averageConfidence}% mean decision confidence
          </p>
        </div>
      </div>

      {/* 2-Column Section: 24h Hourly Threat Volume & Risk Level Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 24-Hour Threat Volume Trend */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>24-Hour Threat Traffic Trend</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Hourly comparison of incoming Spam vs Benign (Ham) volume
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" />
                <span>Spam/Phishing</span>
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" />
                <span>Benign Ham</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Visual */}
          <div className="pt-4 pb-2">
            <div className="flex items-end justify-between gap-2 h-44 px-2">
              {data.hourlyTrends.map((bar, idx) => {
                const maxVal = 70;
                const spamHeight = Math.max(8, (bar.spam / maxVal) * 100);
                const hamHeight = Math.max(8, (bar.ham / maxVal) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-36">
                      {/* Spam bar */}
                      <div
                        className="w-1/2 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-sm transition-all duration-300 group-hover:brightness-125 relative"
                        style={{ height: `${spamHeight}%` }}
                        title={`${bar.hour} - Spam: ${bar.spam}`}
                      />
                      {/* Ham bar */}
                      <div
                        className="w-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm transition-all duration-300 group-hover:brightness-125 relative"
                        style={{ height: `${hamHeight}%` }}
                        title={`${bar.hour} - Ham: ${bar.ham}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {bar.hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Message Risk Level Distribution */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>Risk Level Severity Distribution</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Categorized across the 5 standardized threat tiers
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { label: "Critical Risk (80-100)", count: data.riskDistribution.CRITICAL, color: "bg-rose-500", text: "text-rose-400" },
              { label: "High Risk (60-79)", count: data.riskDistribution.HIGH, color: "bg-orange-500", text: "text-orange-400" },
              { label: "Medium Suspicious (40-59)", count: data.riskDistribution.MEDIUM, color: "bg-amber-500", text: "text-amber-400" },
              { label: "Low Risk (20-39)", count: data.riskDistribution.LOW, color: "bg-blue-500", text: "text-blue-400" },
              { label: "Safe / Legitimate (0-19)", count: data.riskDistribution.SAFE, color: "bg-emerald-500", text: "text-emerald-400" },
            ].map((tier, idx) => {
              const pct = data.totalScanned > 0 ? Math.round((tier.count / data.totalScanned) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{tier.label}</span>
                    <span className={`font-mono font-bold ${tier.text}`}>
                      {tier.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${tier.color} transition-all duration-500`}
                      style={{ width: `${Math.max(3, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Threat Categories & Top Detected Malicious Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Threat Categories Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Threat Vector Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Credential Phishing
              </span>
              <span className="text-xl font-bold text-rose-400">
                {data.threatCategories.credentialPhishing}
              </span>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Financial Wire Fraud
              </span>
              <span className="text-xl font-bold text-amber-400">
                {data.threatCategories.financialFraud}
              </span>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Delivery Smishing
              </span>
              <span className="text-xl font-bold text-orange-400">
                {data.threatCategories.smishingUrgent}
              </span>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Malicious Links Blocked
              </span>
              <span className="text-xl font-bold text-cyan-400">
                {data.threatCategories.maliciousUrls}
              </span>
            </div>
          </div>
        </div>

        {/* Top Flagged Threat Domains */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Top Flagged Malicious Domains</span>
          </h3>

          <div className="space-y-2 pt-1">
            {data.topThreatDomains.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-mono font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-slate-200">{item.domain}</span>
                </div>
                <span className="text-rose-400 font-bold font-mono">
                  {item.count} detections
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
