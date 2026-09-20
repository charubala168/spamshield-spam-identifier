import React, { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  Trash2, 
  Download, 
  Eye, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck, 
  Filter 
} from "lucide-react";
import { ScanResult } from "../types";

interface DetectionHistoryProps {
  onInspectScan: (scan: ScanResult) => void;
}

export const DetectionHistory: React.FC<DetectionHistoryProps> = ({ onInspectScan }) => {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "email" | "sms">("all");
  const [verdictFilter, setVerdictFilter] = useState<"all" | "spam" | "phishing" | "ham">("all");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let url = "/api/history?";
      if (typeFilter !== "all") url += `type=${typeFilter}&`;
      if (verdictFilter !== "all") url += `filter=${verdictFilter}&`;
      if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;

      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        setHistory(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [typeFilter, verdictFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleClear = async () => {
    if (!confirm("Are you sure you want to reset scan history to default benchmark data?")) return;
    try {
      await fetch("/api/history/clear", { method: "POST" });
      fetchHistory();
    } catch (e) {
      console.error(e);
    }
  };

  const exportHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `spamshield-audit-log-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Audit & Compliance
            </span>
            <span className="text-xs text-slate-400">Searchable detection ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Detection History & Security Logs
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Log</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset Logs</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by sender, domain, subject keywords, or scan ID..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Channel filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Channels</option>
              <option value="email">Email Only</option>
              <option value="sms">SMS Only</option>
            </select>

            {/* Verdict filter */}
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Classifications</option>
              <option value="spam">Spam Only</option>
              <option value="phishing">Phishing Threats</option>
              <option value="ham">Clean Ham</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl transition-colors"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
            <span className="text-xs">Fetching audit records...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No Detection Records Found</p>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Risk Level</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Sender Address / Phone</th>
                  <th className="p-3.5">Subject / Message Snippet</th>
                  <th className="p-3.5 text-center">Spam Score</th>
                  <th className="p-3.5 text-center">Phishing</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {history.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        scan.riskLevel === "CRITICAL" ? "bg-rose-500/20 text-rose-300 border-rose-500/30" :
                        scan.riskLevel === "HIGH" ? "bg-orange-500/20 text-orange-300 border-orange-500/30" :
                        scan.riskLevel === "MEDIUM" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
                        scan.riskLevel === "LOW" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                        "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}>
                        {scan.riskLevel}
                      </span>
                    </td>
                    <td className="p-3.5 uppercase font-mono text-[10px] text-slate-400">
                      {scan.type}
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px] whitespace-nowrap font-mono">
                      {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300 max-w-[160px] truncate" title={scan.sender}>
                      {scan.sender}
                    </td>
                    <td className="p-3.5 text-slate-200 max-w-[220px] truncate">
                      {scan.subject || scan.body}
                    </td>
                    <td className="p-3.5 text-center font-bold">
                      <span className={scan.spamScore >= 50 ? "text-rose-400" : "text-emerald-400"}>
                        {scan.spamScore}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {scan.isPhishing ? (
                        <span className="text-rose-400 font-bold">🚨 YES</span>
                      ) : (
                        <span className="text-slate-500">NO</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onInspectScan(scan)}
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
        )}
      </div>
    </div>
  );
};
