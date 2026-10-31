'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Zap,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { intelligenceService } from '../services/intelligence.service';
import { DynamicPricingData, PriceSimulationPoint } from '../types/intelligence.types';

interface DynamicYieldSimulatorProps {
  eventId: string;
}

export const DynamicYieldSimulator: React.FC<DynamicYieldSimulatorProps> = ({ eventId }) => {
  const [data, setData] = useState<DynamicPricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulatedPrice, setSimulatedPrice] = useState<number>(1499);
  const [isApplying, setIsApplying] = useState(false);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const res = await intelligenceService.getDynamicPricing(eventId);
      if (res) {
        setData(res);
        setSimulatedPrice(res.optimalPrice || res.currentPrice);
      }
    } catch (err) {
      console.error('Failed to fetch dynamic pricing', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, [eventId]);

  const handleApplyOptimal = async () => {
    if (!data) return;
    setIsApplying(true);
    try {
      await intelligenceService.applyDynamicPrice(eventId, data.optimalPrice);
      toast.success(`Dynamic price of ₹${Math.round(data.optimalPrice).toLocaleString('en-IN')} applied to ticket gateway!`);
      await fetchPricing();
    } catch {
      toast.error('Failed to update ticket price');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[300px] space-y-3 bg-white dark:bg-neutral-900 rounded-3xl border border-[#EEEDF2] dark:border-neutral-800">
        <Loader2 className="w-8 h-8 text-[#F05537] animate-spin" />
        <p className="text-xs text-[#6F7287] dark:text-neutral-400 font-semibold">
          Calculating Demand Elasticity & Optimal Revenue Curve...
        </p>
      </div>
    );
  }

  if (!data) return null;

  // Find simulation metrics for currently selected slider price
  const closestPoint: PriceSimulationPoint = data.simulationCurve?.reduce((prev, curr) => {
    return Math.abs(curr.price - simulatedPrice) < Math.abs(prev.price - simulatedPrice) ? curr : prev;
  }, data.simulationCurve[0]) || {
    price: simulatedPrice,
    projectedSales: data.expectedTotalSales,
    projectedRevenue: data.projectedGrossRevenue,
    selloutProbability: 0.9,
  };

  const revenueDelta = closestPoint.projectedRevenue - data.currentProjectedRevenue;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Recommendation */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E0A3C] via-[#2D1055] to-[#F05537] text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Algorithmic Yield Optimization</span>
            </span>
            <span className="text-xs text-purple-200 font-medium">
              Elasticity Model: {data.algorithm}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {data.recommendedAction === 'SURGE_INCREASE' && 'Surge Demand Detected: Increase Ticket Price'}
            {data.recommendedAction === 'DISCOUNT_STIMULATE' && 'Pacing Lag: Stimulate Sales with Yield Floor'}
            {data.recommendedAction === 'HOLD_CURRENT' && 'Equilibrium Reached: Hold Current Price'}
          </h3>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            {data.rationale}
          </p>
        </div>

        {/* 1-Click Action Card */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex flex-col items-center justify-center gap-3 shrink-0 text-center min-w-[240px]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block">
              Optimal Ticket Price
            </span>
            <span className="text-3xl font-black text-white">
              ₹{Math.round(data.optimalPrice).toLocaleString('en-IN')}
            </span>
            <span className={`text-[11px] font-bold block mt-0.5 ${data.priceDifferencePct >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
              {data.priceDifferencePct >= 0 ? `+${data.priceDifferencePct}%` : `${data.priceDifferencePct}%`} vs Current (₹{Math.round(data.currentPrice).toLocaleString('en-IN')})
            </span>
          </div>

          <button
            onClick={handleApplyOptimal}
            disabled={isApplying}
            className="w-full py-2.5 px-4 bg-white text-[#1E0A3C] hover:bg-orange-50 rounded-xl text-xs font-black shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            {isApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F05537]" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            <span>Apply to Gateway</span>
          </button>
        </div>
      </div>

      {/* 2. Key Yield Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-[#EEEDF2] dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F7287] dark:text-neutral-400 block mb-1">
            Projected Revenue Uplift
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
            +₹{Math.round(data.projectedRevenueUplift).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#6F7287] dark:text-neutral-500 block mt-0.5">
            Additional revenue captured
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-[#EEEDF2] dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F7287] dark:text-neutral-400 block mb-1">
            Price Elasticity (ε)
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#1E0A3C] dark:text-white">
            {data.elasticityCoefficient}
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block mt-0.5">
            {Math.abs(data.elasticityCoefficient) < 1.0 ? 'Inelastic (Strong Absorption)' : 'Elastic (Price Sensitive)'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-[#EEEDF2] dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F7287] dark:text-neutral-400 block mb-1">
            Demand Surge Multiplier
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#F05537]">
            {data.demandSurgeFactor}x
          </span>
          <span className="text-[11px] text-[#6F7287] dark:text-neutral-500 block mt-0.5">
            vs baseline registration pace
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-[#EEEDF2] dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F7287] dark:text-neutral-400 block mb-1">
            Expected Final Sales
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#1E0A3C] dark:text-white">
            {data.expectedTotalSales} / {data.targetCapacity}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
            {Math.round((data.expectedTotalSales / data.targetCapacity) * 100)}% Target Capacity
          </span>
        </div>
      </div>

      {/* 3. Interactive "What-If" Revenue Simulator */}
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-[#EEEDF2] dark:border-neutral-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EEEDF2] dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#F05537]" />
              <h4 className="text-base font-bold text-[#1E0A3C] dark:text-white">
                Interactive &ldquo;What-If&rdquo; Yield & Price Simulator
              </h4>
            </div>
            <p className="text-xs text-[#6F7287] dark:text-neutral-400 mt-1">
              Drag the price slider to simulate buyer willingness-to-pay, projected attendance volume, and total gross ticket revenue.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6F7287] dark:text-neutral-400">
              Safe Bounds: ₹{Math.round(data.priceFloor)} — ₹{Math.round(data.priceCeiling)}
            </span>
          </div>
        </div>

        {/* The Slider Control */}
        <div className="space-y-4 max-w-3xl mx-auto py-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#6F7287] dark:text-neutral-400">
            <span>Floor: ₹{Math.round(data.priceFloor).toLocaleString('en-IN')}</span>
            <span className="text-base sm:text-lg font-black text-[#F05537] bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
              Simulated Price: ₹{Math.round(simulatedPrice).toLocaleString('en-IN')}
            </span>
            <span>Ceiling: ₹{Math.round(data.priceCeiling).toLocaleString('en-IN')}</span>
          </div>

          <input
            type="range"
            min={data.priceFloor}
            max={data.priceCeiling}
            step={25}
            value={simulatedPrice}
            onChange={(e) => setSimulatedPrice(parseFloat(e.target.value))}
            className="w-full h-3 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#F05537]"
          />
        </div>

        {/* Live Simulation Outcome Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
          <div className="p-4 rounded-2xl bg-[#F8F7FA] dark:bg-neutral-800/50 border border-gray-200/80 dark:border-neutral-700">
            <span className="text-[10px] font-bold uppercase text-[#6F7287] dark:text-neutral-400 block mb-1">
              Simulated Ticket Volume
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#1E0A3C] dark:text-white">
                {closestPoint.projectedSales} Passes
              </span>
              <span className="text-xs font-semibold text-gray-500">
                ({Math.round((closestPoint.projectedSales / data.targetCapacity) * 100)}% capacity)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7FA] dark:bg-neutral-800/50 border border-gray-200/80 dark:border-neutral-700">
            <span className="text-[10px] font-bold uppercase text-[#6F7287] dark:text-neutral-400 block mb-1">
              Projected Gross Revenue
            </span>
            <span className="text-xl font-black text-[#1E0A3C] dark:text-white">
              ₹{Math.round(closestPoint.projectedRevenue).toLocaleString('en-IN')}
            </span>
            <span className={`text-[11px] font-bold block mt-0.5 ${revenueDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {revenueDelta >= 0 ? `+₹${Math.round(revenueDelta).toLocaleString('en-IN')} vs baseline` : `-₹${Math.round(Math.abs(revenueDelta)).toLocaleString('en-IN')} vs baseline`}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F7FA] dark:bg-neutral-800/50 border border-gray-200/80 dark:border-neutral-700">
            <span className="text-[10px] font-bold uppercase text-[#6F7287] dark:text-neutral-400 block mb-1">
              Sellout Probability
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                {Math.round(closestPoint.selloutProbability * 100)}%
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, closestPoint.selloutProbability * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Simulated Discrete Yield Curve Cards */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-[#1E0A3C] dark:text-white block">
            Discrete Yield Spectrum (15 Simulated Price Increments):
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
            {data.simulationCurve?.slice(0, 5).map((pt, idx) => (
              <button
                key={idx}
                onClick={() => setSimulatedPrice(pt.price)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  Math.abs(pt.price - simulatedPrice) < 30
                    ? 'bg-[#F05537] text-white border-[#F05537] shadow-sm'
                    : 'bg-gray-50 dark:bg-neutral-800/60 border-gray-200 dark:border-neutral-700 text-[#1E0A3C] dark:text-white hover:border-[#F05537]'
                }`}
              >
                <span className="block text-[11px] font-bold">₹{Math.round(pt.price)}</span>
                <span className="block text-[9px] opacity-80 mt-0.5">₹{(pt.projectedRevenue / 100000).toFixed(1)}L rev</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
