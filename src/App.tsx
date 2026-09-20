/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Header } from "./components/Header";
import { LiveDetector } from "./components/LiveDetector";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { BatchDetector } from "./components/BatchDetector";
import { DetectionHistory } from "./components/DetectionHistory";
import { ContinuousLearningView } from "./components/ContinuousLearningView";
import { JavaBackendViewer } from "./components/JavaBackendViewer";
import { ScanDetailModal } from "./components/ScanDetailModal";
import { ScanResult } from "./types";
import { SampleMessage } from "./sampleData";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "detector" | "analytics" | "batch" | "history" | "learning" | "javacode"
  >("detector");

  const [selectedSample, setSelectedSample] = useState<SampleMessage | null>(null);
  const [inspectedScan, setInspectedScan] = useState<ScanResult | null>(null);

  const handleSelectSample = (sample: SampleMessage) => {
    setSelectedSample(sample);
    setActiveTab("detector");
  };

  const handleScanCompleted = (result: ScanResult) => {
    // Optionally trigger side-effects or notifications
  };

  const handleSubmitFeedback = async (
    scanId: string,
    correction: "HAM" | "SPAM",
    reason: string
  ) => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanId,
          originalPrediction: inspectedScan?.isSpam ? "SPAM" : "HAM",
          userCorrection: correction,
          reason,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Header with Navigation and Quick Scenarios */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSelectSample={handleSelectSample}
      />

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "detector" && (
          <LiveDetector
            initialSample={selectedSample}
            onScanCompleted={handleScanCompleted}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "analytics" && <AnalyticsDashboard />}

        {activeTab === "batch" && (
          <BatchDetector onInspectScan={(scan) => setInspectedScan(scan)} />
        )}

        {activeTab === "history" && (
          <DetectionHistory onInspectScan={(scan) => setInspectedScan(scan)} />
        )}

        {activeTab === "learning" && <ContinuousLearningView />}

        {activeTab === "javacode" && <JavaBackendViewer />}
      </main>

      {/* Detail Inspection Modal */}
      {inspectedScan && (
        <ScanDetailModal
          scan={inspectedScan}
          onClose={() => setInspectedScan(null)}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">SpamShield</span>
            <span>•</span>
            <span>Multinomial Naive Bayes + Heuristic RFC Engine + Gemini Deep AI</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>16 Detection Vectors Active</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab("javacode")}
              className="text-cyan-400 hover:underline"
            >
              View Java Engine
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab("analytics")}
              className="text-cyan-400 hover:underline"
            >
              Email Analytics
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
