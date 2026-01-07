
import React, { useEffect } from 'react';

const PaymentSuccessPage: React.FC = () => {
  const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-8 text-center animate-fade-in">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-10">
        <div className="space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-emerald-500 blur-[30px] opacity-40 animate-pulse" />
            <div className="relative w-full h-full bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-white text-3xl font-bold tracking-tight italic font-brand">MalluCupid Pro</h2>
            <h3 className="text-emerald-400 text-xl font-bold">You're officially Pro! 🎉</h3>
            <p className="text-zinc-500 text-sm leading-relaxed px-4">
              Your premium benefits are now active. Unlimited matches and messages await.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-2">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Subscription Valid Until</p>
          <p className="text-white font-bold text-lg tracking-tight">{expiryDate}</p>
        </div>

        <button 
          onClick={() => window.location.hash = '#/user/dashboard'}
          className="w-full py-4 bg-premium-green text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all tracking-widest text-sm"
        >
          GO TO DASHBOARD
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
