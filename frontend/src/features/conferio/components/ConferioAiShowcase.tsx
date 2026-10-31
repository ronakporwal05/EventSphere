'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, AlertTriangle, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export const ConferioAiShowcase: React.FC = () => {
  const models = [
    {
      title: 'Dynamic Pricing & Yield Optimizer',
      desc: 'Predicts microeconomic price elasticity of demand to maximize gross revenue without leaving empty seats.',
      icon: TrendingUp,
      color: 'bg-[#fef08a]',
      tag: 'MODEL 6 • QUANT YIELD',
    },
    {
      title: 'Milestone Progress & Delay Predictor',
      desc: 'Compares approved proposals with execution checklists to alert organizers of launch risks.',
      icon: AlertTriangle,
      color: 'bg-[#ede9fe]',
      tag: 'MODEL 1 • RANDOM FOREST',
    },
    {
      title: 'Attendee No-Show Classifier',
      desc: 'Estimates non-attendance probabilities to optimize catering orders and automated reminder campaigns.',
      icon: Users,
      color: 'bg-[#e0f2fe]',
      tag: 'MODEL 3 • LOGISTIC CLASSIFIER',
    },
    {
      title: 'Ticket Fraud & Anomaly Detector',
      desc: 'Isolation Forest flags suspicious payment sequences, rapid bot velocity, and coupon abuse.',
      icon: ShieldCheck,
      color: 'bg-[#d1fae5]',
      tag: 'MODEL 4 • ISOLATION FOREST',
    },
  ];

  return (
    <section className="w-full bg-[#111111] text-white py-24 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-block transform -rotate-3 hover:rotate-0 transition-transform mb-4">
              <span className="px-3.5 py-1.5 bg-[#f5ce32] text-black font-black text-xs uppercase tracking-wider border-2 border-black rounded-sm shadow-[3px_3px_0px_#fff]">
                POWERED BY EVENT SPHERE AI INTELLIGENCE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight select-none">
              PREDICTIVE AI ENGINE<br />
              <span className="text-neutral-500">BEHIND EVERY SUCCESSFUL EVENT.</span>
            </h2>
          </div>

          <Link
            href="/ai-studio"
            className="flex items-center space-x-2 px-6 py-3.5 bg-[#f5ce32] text-black hover:bg-yellow-400 border-2 border-white rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_#fff] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all shrink-0 w-fit"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Interactive AI Studio</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-neutral-900 border-2 border-neutral-700 rounded-2xl shadow-[4px_4px_0px_#333] hover:border-[#f5ce32] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 ${m.color} text-black rounded-xl border border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_#fff]`}>
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#f5ce32] block mb-1">
                    {m.tag}
                  </span>
                  <h4 className="text-base font-black text-white mb-2 leading-snug">{m.title}</h4>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
