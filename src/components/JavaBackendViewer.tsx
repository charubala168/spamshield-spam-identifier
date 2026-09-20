import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  Copy, 
  Check, 
  FileCode, 
  Download, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  RefreshCw 
} from "lucide-react";
import { JavaBackendData, JavaCodeFile } from "../types";

export const JavaBackendViewer: React.FC = () => {
  const [data, setData] = useState<JavaBackendData | null>(null);
  const [selectedFile, setSelectedFile] = useState<JavaCodeFile | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJava = async () => {
      setLoading(true);
      try {
        const resp = await fetch("/api/java-code");
        if (resp.ok) {
          const json: JavaBackendData = await resp.json();
          setData(json);
          if (json.files?.length > 0) {
            setSelectedFile(json.files[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJava();
  }, []);

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    if (!data) return;
    const combined = data.files
      .map((f) => `// ==========================================\n// FILE: ${f.name} (${f.path})\n// DESCRIPTION: ${f.description}\n// ==========================================\n\n${f.code}\n\n`)
      .join("\n");
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(combined);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "SpamShield-Java-Backend-Source.java");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading && !data) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-white">Loading Java Backend Source Engine...</p>
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Java Backend Architecture
            </span>
            <span className="text-xs text-slate-400 font-mono">Java 17+ (LTS) • Spring Boot Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            SpamShield Java Source Code & Engine Explorer
          </h2>
        </div>

        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download All Java Classes (.java)</span>
        </button>
      </div>

      {/* Architectural Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>Multinomial Naive Bayes</span>
          </div>
          <p className="text-xs text-slate-400">
            Log-likelihood inference with Laplace α=1 smoothing, active frequency maps, and zero-frequency protection.
          </p>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Threat Security Filter</span>
          </div>
          <p className="text-xs text-slate-400">
            Regex heuristics checking urgency triggers, financial lures, credential traps, and homoglyphs.
          </p>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>Adaptive Feedback Loop</span>
          </div>
          <p className="text-xs text-slate-400">
            ContinuousLearningStore dynamically updates token weights upon receiving false positive/negative submissions.
          </p>
        </div>
      </div>

      {/* Code Explorer: Left File Tree | Right Code Editor View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Java Files List */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Java Source Files ({data.files.length})</span>
          </h3>

          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {data.files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 border ${
                  selectedFile?.path === file.path
                    ? "bg-indigo-600/15 border-indigo-500/40 text-white"
                    : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-200 truncate">
                    {file.name}
                  </span>
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                    {file.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {file.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {selectedFile ? (
            <>
              {/* Code Viewer Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono text-xs font-bold text-white">
                      com.spamshield.{selectedFile.path.replace(".java", "").replace("/", ".")}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedFile.description}
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Java Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Editor Body */}
              <div className="p-4 bg-slate-950/95 overflow-x-auto max-h-[580px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
                <pre>
                  <code>{selectedFile.code}</code>
                </pre>
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-slate-500">
              Select a Java class file on the left to view implementation details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
