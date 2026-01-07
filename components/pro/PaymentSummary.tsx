
import React from 'react';

const PaymentSummary: React.FC = () => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-4">
      <h4 className="text-white text-xs font-bold uppercase tracking-widest border-b border-zinc-800 pb-3">Payment Summary</h4>
      
      <div className="space-y-3">
        <div className="flex justify-between text-zinc-400 text-sm">
          <span>Pro Subscription (30 Days)</span>
          <span className="text-white font-medium">₹83.90</span>
        </div>
        <div className="flex justify-between text-zinc-400 text-sm">
          <span>GST (18%)</span>
          <span className="text-white font-medium">₹15.10</span>
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      <div className="flex justify-between items-center pt-1">
        <span className="text-white font-bold">Total Payable</span>
        <span className="text-emerald-400 text-xl font-black">₹99.00</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
