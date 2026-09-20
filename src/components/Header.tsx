import React from "react";
import { 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  Layers, 
  History, 
  Cpu, 
  Terminal, 
  Sparkles,
  ChevronDown
} from "lucide-react";
import { SAMPLE_MESSAGES, SampleMessage } from "../sampleData";

interface HeaderProps {
  activeTab: "detector" | "analytics" | "batch" | "history" | "learning" | "javacode";
  onSelectTab: (tab: "detector" | "analytics" | "batch" | "history" | "learning" | "javacode") => void;
  onSelectSample: (sample: SampleMessage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onSelectSample,
}) => {
  const [showSamplesMenu, setShowSamplesMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Engine Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab("detector")}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    SpamShield
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                    Java + AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Adaptive Spam & Phishing Detection Platform
                </p>
              </div>
            </button>

            {/* Live Status Pulse */}
            <div className="hidden lg:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-800 text-[11px] text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Java Engine & AI Active</span>
            </div>
          </div>

          {/* Quick Action: Load Curated Sample */}
          <div className="relative">
            <button
              id="quick-sample-menu-btn"
              onClick={() => setShowSamplesMenu(!showSamplesMenu)}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors shadow-sm"
              title="Select sample email or SMS to analyze"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Load Sample</span>
              <span className="sm:hidden">Samples</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showSamplesMenu ? "rotate-180" : ""}`} />
            </button>

            {showSamplesMenu && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-slate-200"
                onMouseLeave={() => setShowSamplesMenu(false)}
              >
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between">
                  <span>Pre-Configured Threat Scenarios</span>
                  <span className="text-cyan-400">1-Click Test</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 mt-1">
                  {SAMPLE_MESSAGES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onSelectSample(sample);
                        setShowSamplesMenu(false);
                        onSelectTab("detector");
                      }}
                      className="w-full text-left p-2.5 hover:bg-slate-800/80 rounded-lg transition-colors flex items-start gap-2.5 group"
                    >
                      <span className={`mt-0.5 px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider shrink-0 ${
                        sample.category === "phishing" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                        sample.category === "smishing" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                        sample.category === "spam" ? "bg-orange-500/20 text-orange-300 border border-orange-500/30" :
                        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}>
                        {sample.category}
                      </span>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                          {sample.name}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {sample.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/70 text-xs font-medium">
          <button
            id="tab-detector"
            onClick={() => onSelectTab("detector")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "detector"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Live Detector</span>
          </button>

          <button
            id="tab-analytics"
            onClick={() => onSelectTab("analytics")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "analytics"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Email Analytics</span>
          </button>

          <button
            id="tab-batch"
            onClick={() => onSelectTab("batch")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "batch"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Batch Detection</span>
          </button>

          <button
            id="tab-history"
            onClick={() => onSelectTab("history")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "history"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Detection History</span>
          </button>

          <button
            id="tab-learning"
            onClick={() => onSelectTab("learning")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "learning"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Continuous Learning</span>
          </button>

          <button
            id="tab-javacode"
            onClick={() => onSelectTab("javacode")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "javacode"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Java Backend Engine</span>
          </button>
        </div>
      </div>
    </header>
  );
};
