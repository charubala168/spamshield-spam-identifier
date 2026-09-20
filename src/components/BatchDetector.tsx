import React, { useState } from "react";
import { 
  Layers, 
  Play, 
  Upload, 
  Download, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  FileText 
} from "lucide-react";
import { ScanResult, MessageChannelType } from "../types";
import { SAMPLE_MESSAGES } from "../sampleData";

interface BatchDetectorProps {
  onInspectScan: (scan: ScanResult) => void;
}

export const BatchDetector: React.FC<BatchDetectorProps> = ({ onInspectScan }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batchResults, setBatchResults] = useState<ScanResult[]>([]);
  const [batchSummary, setBatchSummary] = useState<{
    total: number;
    spamCount: number;
    phishingCount: number;
    safeCount: number;
    averageSpamScore: number;
  } | null>(null);

  const [inputMode, setInputMode] = useState<"preset" | "custom">("preset");
  const [customJson, setCustomJson] = useState("");

  const runPresetBatch = async () => {
    setIsRunning(true);
    setProgress(15);
    try {
      const itemsToScan = SAMPLE_MESSAGES.map((s) => ({
        type: s.type,
        sender: s.sender,
        subject: s.subject,
        body: s.body,
      }));

      setProgress(40);
      const resp = await fetch("/api/batch-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToScan }),
      });

      setProgress(85);
      if (resp.ok) {
        const data = await resp.json();
        setBatchResults(data.results || []);
        setBatchSummary({
          total: data.total,
          spamCount: data.spamCount,
          phishingCount: data.phishingCount,
          safeCount: data.safeCount,
          averageSpamScore: data.averageSpamScore,
        });
      }
      setProgress(100);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const runCustomBatch = async () => {
    if (!customJson.trim()) return;
    setIsRunning(true);
    setProgress(20);
    try {
      const parsed = JSON.parse(customJson);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      setProgress(50);
      const resp = await fetch("/api/batch-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      setProgress(85);
      if (resp.ok) {
        const data = await resp.json();
        setBatchResults(data.results || []);
        setBatchSummary({
          total: data.total,
          spamCount: data.spamCount,
          phishingCount: data.phishingCount,
          safeCount: data.safeCount,
          averageSpamScore: data.averageSpamScore,
        });
      }
      setProgress(100);
    } catch (e: any) {
      alert("Invalid JSON format: " + e.message);
    } finally {
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(batchResults, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `spamshield-batch-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Bulk Analysis Engine
            </span>
            <span className="text-xs text-slate-400">High-throughput asynchronous detection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Batch Spam & Phishing Detection
          </h2>
        </div>

        {batchResults.length > 0 && (
          <button
            onClick={exportResults}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Batch Results (JSON)</span>
          </button>
        )}
      </div>

      {/* Control Panel: Presets or Custom JSON */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Batch Input Source</h3>
          </div>

          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setInputMode("preset")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                inputMode === "preset"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Curated Threat Benchmark (6 Items)
            </button>
            <button
              onClick={() => {
                setInputMode("custom");
                if (!customJson) {
                  setCustomJson(
                    JSON.stringify(
                      [
                        {
                          type: "email",
                          sender: "Security Alert <alert@paypal-login-verify.xyz>",
                          subject: "Urgent account alert",
                          body: "Click http://182.20.10.4/login to restore access immediately.",
                        },
                        {
                          type: "email",
                          sender: "Dave Miller <dave@acme.com>",
                          subject: "Weekly engineering sprint notes",
                          body: "Great job this week everyone! Let us review the sprint retrospective notes.",
                        },
                      ],
                      null,
                      2
                    )
                  );
                }
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                inputMode === "custom"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Custom JSON Payload
            </button>
          </div>
        </div>

        {inputMode === "preset" ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Run bulk verification against our standardized 6-scenario benchmark corpus comprising PayPal Phishing, USPS Smishing SMS, Chase Bank wire alerts, 419 inheritance spam, and authentic enterprise engineering correspondence.
            </p>
            <button
              onClick={runPresetBatch}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isRunning ? "Executing Parallel ML Pipelines..." : "Start Batch Analysis (6 Items)"}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 block">
              Enter JSON array of items ({`[ { "type": "email", "sender": "...", "subject": "...", "body": "..." } ]`}):
            </label>
            <textarea
              rows={6}
              value={customJson}
              onChange={(e) => setCustomJson(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={runCustomBatch}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isRunning ? "Processing Custom Batch..." : "Scan Custom Batch"}</span>
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {isRunning && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Scanning messages with Laplace Naive Bayes & Gemini AI...</span>
              <span className="font-mono text-cyan-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Batch Summary Cards */}
      {batchSummary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <span className="text-xs text-slate-400 block mb-1">Batch Items Processed</span>
            <span className="text-2xl font-black text-white">{batchSummary.total}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <span className="text-xs text-slate-400 block mb-1">Spam Detected</span>
            <span className="text-2xl font-black text-orange-400">{batchSummary.spamCount}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <span className="text-xs text-slate-400 block mb-1">Phishing Threats</span>
            <span className="text-2xl font-black text-rose-400">{batchSummary.phishingCount}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
            <span className="text-xs text-slate-400 block mb-1">Mean Threat Score</span>
            <span className="text-2xl font-black text-cyan-400">{batchSummary.averageSpamScore} / 100</span>
          </div>
        </div>
      )}

      {/* Results Table */}
      {batchResults.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Batch Scan Results ({batchResults.length})</h3>
            <span className="text-xs text-slate-400">Click inspect on any row for full XAI analysis</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Subject / Body Snippet</th>
                  <th className="p-3 text-center">Spam Score</th>
                  <th className="p-3 text-center">Phishing</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {batchResults.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.riskLevel === "CRITICAL" ? "bg-rose-500/20 text-rose-300 border-rose-500/30" :
                        item.riskLevel === "HIGH" ? "bg-orange-500/20 text-orange-300 border-orange-500/30" :
                        item.riskLevel === "MEDIUM" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                        item.riskLevel === "LOW" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                        "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="p-3 uppercase font-mono text-[10px] text-slate-400">
                      {item.type}
                    </td>
                    <td className="p-3 font-mono text-slate-300 max-w-[150px] truncate" title={item.sender}>
                      {item.sender}
                    </td>
                    <td className="p-3 text-slate-200 max-w-[240px] truncate">
                      {item.subject || item.body}
                    </td>
                    <td className="p-3 text-center font-bold">
                      <span className={item.spamScore >= 50 ? "text-rose-400" : "text-emerald-400"}>
                        {item.spamScore}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {item.isPhishing ? (
                        <span className="text-rose-400 font-bold">🚨 YES</span>
                      ) : (
                        <span className="text-slate-500">NO</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onInspectScan(item)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
