import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#fbfbf9] flex flex-col items-center justify-center relative p-4 font-sans selection:bg-[#f5ce32] selection:text-black">
      {/* Decorative Neo-Brutalist Badges */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#f5ce32] text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>Back to Summit</span>
        </Link>
      </div>

      <main className="z-10 w-full flex items-center justify-center my-8">
        {children}
      </main>

      <footer className="z-10 mt-2 text-center text-xs font-black uppercase tracking-wider text-neutral-600">
        &copy; {new Date().getFullYear()} EVENT SPHERE AI 2026 · MULTI-TENANT ENTERPRISE PLATFORM · CLERK AUTH
      </footer>
    </div>
  );
}
