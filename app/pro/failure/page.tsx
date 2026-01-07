
import React from 'react';

const PaymentFailurePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-8 text-center animate-fade-in">
      <div className="w-full max-w-sm space-y-10">
        <div className="space-y-6">
          <div className="w-24 h-24 mx-auto bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center border border-red-500/20">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-white text-2xl font-bold tracking-tight">Payment Failed</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We couldn't process your transaction. This could be due to network issues or bank refusal.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => window.location.hash = '#/pro/upgrade'}
            className="w-full py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-zinc-800 active:scale-95 transition-all tracking-widest text-sm"
          >
            RETRY PAYMENT
          </button>
          <button 
            onClick={() => window.location.hash = '#/user/dashboard'}
            className="w-full py-4 text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="pt-8">
          <p className="text-zinc-700 text-[10px] font-medium leading-relaxed uppercase tracking-wider">
            If money was deducted from your account, it will be refunded automatically within 5-7 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
