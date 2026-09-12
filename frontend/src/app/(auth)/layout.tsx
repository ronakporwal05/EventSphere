import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <main className="z-10 w-full flex items-center justify-center">
        {children}
      </main>

      <footer className="z-10 mt-8 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} EventSphere AI Platform. All rights reserved.
      </footer>
    </div>
  );
}
