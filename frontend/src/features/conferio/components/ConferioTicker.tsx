'use client';

import React from 'react';

export const ConferioTicker: React.FC = () => {
  const tickerText =
    'EVENT SPHERE AI 2026  ★  ENTERPRISE MULTI-TENANT INTELLIGENCE  ★  PREDICTIVE TURNSTILES & MONTE CARLO YIELD  ★  INNOVATORS CONNECT LIVE  ★  RAG VECTOR KNOWLEDGE BASE  ★  GEMINI 1.5 DEPLOYED  ★  ';

  return (
    <div className="w-full bg-black text-white overflow-hidden py-2 border-b-2 border-black select-none z-30 relative">
      <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-black tracking-widest uppercase flex items-center">
        <span>{tickerText}</span>
        <span>{tickerText}</span>
        <span>{tickerText}</span>
        <span>{tickerText}</span>
      </div>
    </div>
  );
};
