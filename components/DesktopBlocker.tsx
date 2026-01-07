
import React from 'react';

const DesktopBlocker: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-white text-3xl font-brand italic mb-4">MalluCupid</h1>
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
          <div className="mb-4 flex justify-center">
            <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Available on Mobile & Tablet Only</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            MalluCupid is designed for intimate, on-the-go connections. Please open this link on your mobile device to get started.
          </p>
        </div>
        <div className="text-zinc-500 text-xs font-medium uppercase tracking-widest pt-4">
          mallucupid.com
        </div>
      </div>
    </div>
  );
};

export default DesktopBlocker;
