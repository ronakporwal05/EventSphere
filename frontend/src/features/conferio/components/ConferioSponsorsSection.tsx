'use client';

import React from 'react';

export const ConferioSponsorsSection: React.FC = () => {
  const sponsors = [
    { name: 'Google Cloud', tier: 'ALPHA PARTNER', desc: 'Enterprise AI & Vertex' },
    { name: 'Razorpay', tier: 'PAYMENT ENGINE', desc: 'Zero-Loss Checkout Gateway' },
    { name: 'Qdrant Vector DB', tier: 'RAG ENGINE', desc: 'Hybrid Vector Similarity' },
    { name: 'Redis', tier: 'CACHE & LOCKS', desc: 'Distributed Locking & Streams' },
    { name: 'AWS Cloud', tier: 'INFRASTRUCTURE', desc: 'Global Cloud Deployment' },
    { name: 'OpenAI', tier: 'RESEARCH PARTNER', desc: 'Generative Intelligence' },
    { name: 'Docker', tier: 'CONTAINERIZATION', desc: 'Microservice Virtualization' },
    { name: 'Spring Boot', tier: 'BACKEND CORE', desc: 'Multi-Tenant Java 21' },
  ];

  return (
    <section className="w-full bg-[#fbfbf9] py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-black">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#ede9fe] border-2 border-black rounded-3xl p-8 sm:p-12 shadow-[6px_6px_0px_#000] text-center">
          <span className="inline-block px-3.5 py-1 bg-black text-[#ede9fe] text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
            ECOSYSTEM PARTNERS & SPONSORS
          </span>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black mb-8 select-none">
            SUPPORTED BY WORLD-CLASS INNOVATION LEADERS
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sponsors.map((sp, idx) => (
              <div
                key={idx}
                className="p-5 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] transition-all flex flex-col items-center justify-center text-center"
              >
                <span className="text-sm sm:text-base font-black text-black tracking-tight">{sp.name}</span>
                <span className="text-[9px] font-black uppercase tracking-wider text-indigo-600 mt-1 block">
                  {sp.tier}
                </span>
                <span className="text-[10px] font-medium text-neutral-500 mt-0.5">{sp.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
