
import React from 'react';

interface PaymentStatusProps {
  status: 'initializing' | 'waiting' | 'verifying';
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status }) => {
  const messages = {
    initializing: "Initializing Secure Connection...",
    waiting: "Waiting for Payment Completion...",
    verifying: "Verifying Transaction with Bank..."
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-zinc-900 border-t-emerald-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-white font-bold tracking-tight">{messages[status]}</h3>
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Please do not refresh or close this window</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
