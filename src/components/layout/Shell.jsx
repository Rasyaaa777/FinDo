import React from 'react';

export default function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#F6F4EE] flex flex-col font-body text-black">
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      <footer className="mt-auto border-t-3 border-black bg-white py-6">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-sm tracking-tight">FinDo</span>
            <span>&bull;</span>
            <span className="text-zinc-600">Hourly Time-Blocking & Cashflow Tracker</span>
          </div>
          <div className="text-zinc-600 flex items-center gap-4">
            <span>Neo-Brutalism Design System</span>
            <span>&bull;</span>
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
