'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ShieldAlert,
  Users,
  FileText,
  Upload,
  ArrowRight,
  RefreshCw,
  Loader2,
  Calendar,
  Layers,
  Info,
  Check,
  X,
  MapPin,
  Flame,
  Activity,
  Sliders,
  BellRing,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { intelligenceService } from '../services/intelligence.service';
import {
  IntelligenceDashboardData,
  ProposalItem,
  MilestoneItem,
} from '../types/intelligence.types';
import { DynamicYieldSimulator } from './DynamicYieldSimulator';

interface EventIntelligenceStudioProps {
  eventId: string;
  eventTitle?: string;
}

export const EventIntelligenceStudio: React.FC<EventIntelligenceStudioProps> = ({
  eventId,
  eventTitle,
}) => {
  const [activeTab, setActiveTab] = useState<
    'model1' | 'proposals' | 'model2' | 'model3' | 'model4' | 'model5' | 'pricing'
  >('model1');

  const [data, setData] = useState<IntelligenceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Proposal Upload Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalContent, setProposalContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Milestone Approval State
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<string[]>([]);
  const [isApproving, setIsApproving] = useState(false);

  // Load Dashboard Data
  const loadDashboard = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await intelligenceService.getDashboardIntelligence(eventId);
      setData(res);
      // Preselect pending milestones for approval
      if (res?.proposals && res.proposals.length > 0) {
        const firstProposal = res.proposals[0];
        const pending = firstProposal.milestones
          .filter((m) => m.approved)
          .map((m) => m.id);
        setSelectedMilestoneIds(pending);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load Event Intelligence data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      loadDashboard();
    }
  }, [eventId]);

  // Handle Proposal Upload
  const handleUploadProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalTitle.trim() || !proposalContent.trim()) {
      toast.error('Please enter proposal title and operational details');
      return;
    }

    setIsUploading(true);
    try {
      const proposal = await intelligenceService.uploadProposal(
        eventId,
        proposalTitle,
        proposalContent
      );
      toast.success(
        `Proposal analyzed! Extracted ${proposal.milestones?.length || 0} milestones via Gemini 1.5 Flash.`
      );
      setShowUploadModal(false);
      setProposalTitle('');
      setProposalContent('');
      await loadDashboard(true);
      setActiveTab('proposals');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Proposal analysis failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle Milestone Selection
  const toggleMilestone = (id: string) => {
    setSelectedMilestoneIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Approve Selected Milestones
  const handleApproveMilestones = async (proposalId: string) => {
    setIsApproving(true);
    try {
      await intelligenceService.approveMilestones(proposalId, selectedMilestoneIds, 'APPROVED');
      toast.success('Milestones approved! Added to organizer checklist.');
      await loadDashboard(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve milestones');
    } finally {
      setIsApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4 bg-neutral-900/60 border border-neutral-800 rounded-3xl min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <div className="text-center">
          <h4 className="text-sm font-bold text-white">Synthesizing Event Intelligence</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Running 5 ML models & analyzing milestone checklist schedule...
          </p>
        </div>
      </div>
    );
  }

  const progress = data?.progress;
  const delay = data?.delayPrediction;
  const forecast = data?.registrationForecast;
  const noshow = data?.noShowPrediction;
  const anomaly = data?.anomalyDetection;
  const crowd = data?.sessionCrowd;
  const proposals = data?.proposals || [];

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="p-6 bg-gradient-to-r from-indigo-950/70 via-neutral-900 to-purple-950/70 border border-neutral-800 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              EventSphere Predictive Intelligence Studio
            </h2>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded uppercase">
              5-Model ML Engine
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Deterministic proposal-to-checklist progress calculation paired with calibrated ML risk
            forecasting
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Re-evaluate ML Models</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Proposal</span>
          </button>
        </div>
      </div>

      {/* 2. Deterministic Progress & Schedule Lag Hero Banner */}
      {progress && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Actual Progress */}
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl relative overflow-hidden">
            <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
              Actual Progress (Weighted)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {progress.actualProgress}%
              </span>
              <span className="text-xs text-neutral-400">
                {progress.completedTasks}/{progress.totalTasks} Done
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, progress.actualProgress)}%` }}
              />
            </div>
            <span className="text-[9px] text-neutral-400 block mt-2 truncate">
              {progress.formulaDescription}
            </span>
          </div>

          {/* Planned Progress */}
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
              Planned Schedule Target
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono text-indigo-400">
                {progress.plannedProgress}%
              </span>
              <span className="text-xs text-neutral-400">Timeline Elapsed</span>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, progress.plannedProgress)}%` }}
              />
            </div>
            <span className="text-[9px] text-neutral-400 block mt-2">
              Based on approved milestone timeline
            </span>
          </div>

          {/* Schedule Gap */}
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
              Progress Gap (Actual - Planned)
            </span>
            <div className="flex items-baseline justify-between">
              <span
                className={`text-2xl font-bold font-mono ${
                  progress.progressGap < 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {progress.progressGap > 0 ? `+${progress.progressGap}` : progress.progressGap}%
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  progress.progressGap < -5
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {progress.progressGap < -5 ? 'Schedule Lag' : 'On Track'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-2">
              {progress.progressGap < 0
                ? `${Math.abs(progress.progressGap)}% behind schedule`
                : 'Pacing ahead of target deadline'}
            </p>
          </div>

          {/* Blockers & Missing Milestones */}
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
              Checklist Friction & Blockers
            </span>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1">
                <span className="text-xl font-bold font-mono text-red-400">
                  {progress.overdueTasks}
                </span>
                <span className="text-[10px] text-neutral-400 block">Overdue Tasks</span>
              </div>
              <div className="h-8 w-px bg-neutral-800" />
              <div className="flex-1">
                <span className="text-xl font-bold font-mono text-orange-400">
                  {progress.blockedTasks}
                </span>
                <span className="text-[10px] text-neutral-400 block">Blocked Items</span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-neutral-400 flex items-center gap-1">
              <span className="text-indigo-400 font-bold">{progress.missingMilestonesCount}</span>
              <span>missing proposal milestones</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('model1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'model1'
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-300 border border-orange-500/40 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Model 1: Delay Risk & Readiness</span>
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'proposals'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Proposal & Milestones ({proposals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('model2')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'model2'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Model 2: Registration Forecast</span>
        </button>

        <button
          onClick={() => setActiveTab('model3')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'model3'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>Model 3: Attendee No-Show</span>
        </button>

        <button
          onClick={() => setActiveTab('model4')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'model4'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Model 4: Anomaly & Fraud</span>
        </button>

        <button
          onClick={() => setActiveTab('model5')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'model5'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <span>Model 5: Session Crowd</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pricing'
              ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-rose-300 border border-rose-500/40 shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-rose-400" />
          <span>Yield & Dynamic Pricing</span>
        </button>
      </div>

      {/* 4. Tab 1: MODEL 1 (Flagship: Delay Risk Prediction) */}
      {activeTab === 'model1' && delay && (
        <div className="space-y-6 animate-in fade-in">
          {/* Readiness Status Box */}
          <div
            className={`p-6 border rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl ${
              delay.riskLevel === 'CRITICAL' || delay.riskLevel === 'HIGH'
                ? 'bg-red-950/20 border-red-500/30'
                : delay.riskLevel === 'MEDIUM'
                ? 'bg-amber-950/20 border-amber-500/30'
                : 'bg-emerald-950/20 border-emerald-500/30'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-extrabold rounded-full uppercase tracking-wider ${
                    delay.riskLevel === 'CRITICAL' || delay.riskLevel === 'HIGH'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : delay.riskLevel === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {delay.riskLevel} Readiness Delay Risk
                </span>
                <span className="text-xs text-neutral-400">
                  Model Confidence: {(delay.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {delay.willMissDeadline
                  ? 'Event at Risk of Missing Go-Live Readiness Deadline'
                  : 'Event On-Track for Scheduled Launch'}
              </h3>
              <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                Predicted delay probability is{' '}
                <strong className="text-white font-mono">
                  {(delay.delayProbability * 100).toFixed(1)}%
                </strong>
                . Machine learning classifier evaluated execution friction across schedule progress,
                blockers, and overdue deliverables.
              </p>
            </div>

            <div className="text-center md:text-right p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl min-w-[180px]">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Delay Probability
              </span>
              <span
                className={`text-4xl font-extrabold font-mono ${
                  delay.delayProbability >= 0.5 ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {(delay.delayProbability * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Random Forest Output</span>
            </div>
          </div>

          {/* 2-Column: Risk Factors & Corrective Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: SHAP Contributing Risk Factors */}
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                <Sliders className="w-4 h-4 text-orange-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Top Contributing Risk Factors (SHAP Feature Importance)
                </h4>
              </div>

              <div className="space-y-3">
                {delay.riskFactors.map((rf, idx) => (
                  <div key={idx} className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{rf.factor}</span>
                      <span className="font-mono text-orange-400 text-[11px]">
                        Weight: {Math.round(rf.importance * 100)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">{rf.impact}</p>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full"
                        style={{ width: `${Math.round(rf.importance * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI & ML Recommended Corrective Actions */}
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Recommended Corrective Actions
                </h4>
              </div>

              <div className="space-y-2.5">
                {delay.correctiveActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-indigo-950/15 border border-indigo-500/20 rounded-xl flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-neutral-200 leading-relaxed">{action}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-neutral-400 space-y-1">
                <span className="font-bold text-neutral-300 block">Model Governance Note</span>
                <p>
                  {delay.trainingDataNote ||
                    'Trained on synthetic event lifecycle executions. Model compares with Logistic Regression baseline.'}
                </p>
                <span className="text-[10px] font-mono text-neutral-400 block">
                  {delay.baselineComparison}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: PROPOSAL & MILESTONES REVIEW STUDIO */}
      {activeTab === 'proposals' && (
        <div className="space-y-6 animate-in fade-in">
          {proposals.length === 0 ? (
            <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
              <FileText className="w-10 h-10 text-neutral-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Event Proposal Uploaded Yet</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Upload your event proposal document to extract deliverables, milestones, and
                dependencies via Gemini 1.5 Flash.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 mt-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Proposal Document</span>
              </button>
            </div>
          ) : (
            proposals.map((prop) => (
              <div
                key={prop.id}
                className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{prop.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                          prop.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">{prop.summary}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveMilestones(prop.id)}
                      disabled={isApproving}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isApproving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Approve Selected into Checklist ({selectedMilestoneIds.length})</span>
                    </button>
                  </div>
                </div>

                {/* Milestones Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 text-[10px] uppercase font-bold">
                        <th className="py-2.5 px-3">Approve</th>
                        <th className="py-2.5 px-3">Milestone Deliverable</th>
                        <th className="py-2.5 px-3">Target Date</th>
                        <th className="py-2.5 px-3">Weight</th>
                        <th className="py-2.5 px-3">Checklist Task Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {prop.milestones.map((m) => (
                        <tr key={m.id} className="hover:bg-neutral-800/20 transition-colors">
                          <td className="py-3 px-3">
                            <input
                              type="checkbox"
                              checked={selectedMilestoneIds.includes(m.id)}
                              onChange={() => toggleMilestone(m.id)}
                              className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-white block">{m.title}</span>
                            <span className="text-[11px] text-neutral-400 block mt-0.5">
                              {m.description || m.deliverables}
                            </span>
                            {m.dependencies && m.dependencies !== 'None' && (
                              <span className="text-[10px] text-orange-400/80 block mt-0.5">
                                Dependency: {m.dependencies}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-neutral-300 font-mono text-[11px]">
                            {m.targetDate ? new Date(m.targetDate).toLocaleDateString() : 'TBD'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-neutral-800 rounded font-mono font-bold text-neutral-300 text-[10px]">
                              {m.weight}x
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {m.matchedTaskTitle ? (
                              <span className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold flex items-center gap-1 w-fit">
                                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                                <span>{m.matchedTaskTitle}</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[10px]">
                                New Task (Will create on approval)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. Tab 3: MODEL 2 (Registration Forecasting) */}
      {activeTab === 'model2' && forecast && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                Current Registrations
              </span>
              <span className="text-2xl font-bold font-mono text-white">
                {forecast.currentRegistrations}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Confirmed tickets</span>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                Target Capacity
              </span>
              <span className="text-2xl font-bold font-mono text-indigo-400">
                {forecast.targetCapacity}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">Venue ceiling</span>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                Predicted Final Attendance
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {forecast.predictedFinalRegistrations}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">
                Random Forest Regressor
              </span>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                Daily Velocity
              </span>
              <span className="text-2xl font-bold font-mono text-purple-400">
                {forecast.registrationVelocityPerDay}/day
              </span>
              <span className="text-[10px] text-neutral-400 block mt-1">
                {forecast.daysRemaining} days remaining
              </span>
            </div>
          </div>

          <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Registration Trajectory & Uncertainty Interval
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Comparison between simple velocity baseline and non-linear Random Forest forecast
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Risk of Missing Target: {(forecast.riskOfMissingTarget * 100).toFixed(0)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-neutral-800 text-xs">
              <div className="p-3 bg-neutral-950 rounded-xl">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  10th Percentile (Conservative)
                </span>
                <span className="text-lg font-bold font-mono text-neutral-300">
                  {forecast.lowerBound} passes
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded-xl border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                  Expected Mean Forecast
                </span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {forecast.predictedFinalRegistrations} passes
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded-xl">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  90th Percentile (Optimistic)
                </span>
                <span className="text-lg font-bold font-mono text-neutral-300">
                  {forecast.upperBound} passes
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 italic">
              Linear Velocity Baseline projects {forecast.baselineLinearEstimate} passes. Random Forest
              factors in late-cycle registration acceleration curves.
            </p>
          </div>
        </div>
      )}

      {/* 7. Tab 4: MODEL 3 (Attendee No-Show Prediction) */}
      {activeTab === 'model3' && noshow && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                Expected Turnout Rate
              </span>
              <span className="text-3xl font-extrabold font-mono text-emerald-400">
                {((1.0 - noshow.averageNoShowProbability) * 100).toFixed(0)}%
              </span>
              <p className="text-xs text-neutral-400 mt-1">
                {noshow.expectedAttendees} expected live attendees
              </p>
            </div>

            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                Expected No-Shows
              </span>
              <span className="text-3xl font-extrabold font-mono text-amber-400">
                {noshow.expectedNoShows}
              </span>
              <p className="text-xs text-neutral-400 mt-1">
                Attrition rate: {(noshow.averageNoShowProbability * 100).toFixed(1)}%
              </p>
            </div>

            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                High-Risk Cohort Count
              </span>
              <span className="text-3xl font-extrabold font-mono text-red-400">
                {noshow.highRiskCount}
              </span>
              <p className="text-xs text-neutral-400 mt-1">Candidates for targeted reminders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Key Predictors of Attrition
              </h4>
              <ul className="space-y-2 text-xs text-neutral-300">
                {noshow.topFactors.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 bg-neutral-950 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BellRing className="w-3.5 h-3.5 text-purple-400" />
                <span>Smart Reminder Interventions</span>
              </h4>
              <div className="space-y-2 text-xs">
                {noshow.reminderStrategies.map((s, i) => (
                  <div key={i} className="p-2.5 bg-purple-950/20 border border-purple-500/20 rounded-xl text-purple-200">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-neutral-400">
            <strong>Safety & Compliance Notice:</strong> {noshow.safetyNotice}
          </div>
        </div>
      )}

      {/* 8. Tab 5: MODEL 4 (Fraud & Anomaly Detection) */}
      {activeTab === 'model4' && anomaly && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Isolation Forest Anomaly Telemetry</h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Evaluated {anomaly.totalTransactionsAnalyzed} registrations across velocity bursts, card
                retries, and coupon permutations
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-amber-400">
                {anomaly.flaggedAnomaliesCount} Flagged
              </span>
              <span className="text-[10px] text-neutral-400 block">
                Anomaly rate: {anomaly.overallAnomalyRate}%
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {anomaly.flaggedEvents.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-amber-950/15 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold font-mono text-[10px] rounded uppercase">
                      {item.type}
                    </span>
                    <span className="text-neutral-400 text-[10px]">{item.timestampOffset}</span>
                  </div>
                  <p className="text-white font-medium">{item.details}</p>
                  <p className="text-neutral-400 text-[11px]">{item.action}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Score: {item.anomalyScore}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-neutral-400">
            <strong>Security Boundary:</strong> {anomaly.securityDisclaimer}
          </div>
        </div>
      )}

      {/* 9. Tab 6: MODEL 5 (Session Crowd & Overcrowding) */}
      {activeTab === 'model5' && crowd && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Breakout Session Attendance Forecaster</h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Predicts turnout per stage track vs fire code room limits to prevent stage bottlenecking
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full ${
                crowd.overcrowdingAlertsCount > 0
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {crowd.overcrowdingAlertsCount} Overcrowding Alerts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {crowd.sessionForecasts.map((ses, idx) => (
              <div
                key={idx}
                className={`p-4 border rounded-2xl space-y-2.5 ${
                  ses.overcrowded
                    ? 'bg-red-950/20 border-red-500/40'
                    : 'bg-neutral-900 border-neutral-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-xs font-bold text-white">{ses.title}</h5>
                  {ses.overcrowded && (
                    <span className="px-2 py-0.5 bg-red-500/30 text-red-300 font-bold text-[9px] rounded uppercase shrink-0">
                      Cap Exceeded
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-neutral-400">
                    Predicted: <strong className="text-white font-mono">{ses.predictedCrowd}</strong>
                  </span>
                  <span className="text-neutral-400">
                    Capacity: <strong className="text-white font-mono">{ses.roomCapacity}</strong>
                  </span>
                </div>

                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      ses.overcrowded ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (ses.predictedCrowd / ses.roomCapacity) * 100)}%`,
                    }}
                  />
                </div>

                <p className="text-[11px] text-neutral-300">{ses.action}</p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] text-neutral-400">
            <strong>Safety Mandate:</strong> {crowd.venueSafetyNote}
          </div>
        </div>
      )}

      {/* 9. Tab 7: Dynamic Pricing & Yield Optimization */}
      {activeTab === 'pricing' && (
        <DynamicYieldSimulator eventId={eventId} />
      )}

      {/* Modal: Upload Event Proposal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Upload Event Proposal Document</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadProposal} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  Proposal Title
                </label>
                <input
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  placeholder="e.g. Bengaluru Tech Summit 2026 Scope & Logistics Proposal"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  Proposal Content / Scope of Work
                </label>
                <textarea
                  value={proposalContent}
                  onChange={(e) => setProposalContent(e.target.value)}
                  rows={8}
                  placeholder="Paste event execution proposal text, milestones, audio/visual staging specifications, and sponsor deliverables..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                  required
                />
              </div>

              <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl flex items-center gap-2 text-[11px] text-indigo-300">
                <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>
                  Gemini 1.5 Flash will automatically extract deadlines, task weights, and match
                  with existing checklist tasks.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting Milestones with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze Proposal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
