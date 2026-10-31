'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-6 font-mono">
        <div className="border-4 border-black bg-zinc-900 p-8 shadow-[8px_8px_0px_0px_#f5ce32] max-w-md w-full text-center">
          <h2 className="text-3xl font-black text-[#f5ce32] uppercase mb-4">Critical Error</h2>
          <p className="text-zinc-400 mb-6 text-sm">{error?.message || 'An unexpected application error occurred.'}</p>
          <button
            onClick={() => reset()}
            className="border-2 border-black bg-[#f5ce32] px-6 py-2 font-black text-black uppercase hover:bg-yellow-400 shadow-[4px_4px_0px_0px_#fff]"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
