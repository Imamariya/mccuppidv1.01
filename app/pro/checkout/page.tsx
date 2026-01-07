
import React, { useState, useEffect } from 'react';
import PaymentSummary from '../../../components/pro/PaymentSummary';
import PaymentStatus from '../../../components/pro/PaymentStatus';
import { paymentService } from '../../../services/paymentService';

const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState<'summary' | 'processing'>('summary');
  const [status, setStatus] = useState<'initializing' | 'waiting' | 'verifying'>('initializing');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Prevent back navigation during processing
    const handlePopState = (e: PopStateEvent) => {
      if (isProcessing) {
        window.history.pushState(null, '', window.location.href);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isProcessing]);

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep('processing');
    
    // Simulate gateway flow steps
    setStatus('initializing');
    await new Promise(r => setTimeout(r, 1200));
    
    setStatus('waiting');
    // Call our actual service which simulates the verification
    const success = await paymentService.startUpgradeFlow('razorpay');
    
    if (success) {
      setStatus('verifying');
      await new Promise(r => setTimeout(r, 1500));
      localStorage.setItem('mallucupid_plan', 'pro');
      window.location.hash = '#/pro/success';
    } else {
      window.location.hash = '#/pro/failure';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col animate-fade-in">
      <header className="px-8 pt-12 pb-4 border-b border-zinc-900">
        <h2 className="text-white text-xl font-bold tracking-tight">Secure Checkout</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Order #MC-{Date.now().toString().slice(-6)}</p>
      </header>

      <main className="flex-1 px-8 py-10 max-w-md mx-auto w-full space-y-10">
        {step === 'summary' ? (
          <>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-zinc-900 border border-zinc-800 rounded-3xl">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-xl">⭐</div>
                <div>
                  <h3 className="text-white font-bold">MalluCupid Pro</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Premium Membership</p>
                </div>
              </div>
              
              <PaymentSummary />
            </div>

            <div className="space-y-4">
              <button 
                onClick={handlePayment}
                className="w-full py-4 bg-premium-green text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all tracking-widest text-sm flex items-center justify-center gap-3"
              >
                PROCEED TO PAY ₹99
              </button>
              <div className="flex items-center justify-center gap-4 text-zinc-600 grayscale opacity-40">
                <span className="text-[10px] font-bold italic">Razorpay</span>
                <span className="text-[10px] font-bold italic">Visa/Mastercard</span>
                <span className="text-[10px] font-bold italic">UPI</span>
              </div>
            </div>
          </>
        ) : (
          <PaymentStatus status={status} />
        )}
      </main>

      <footer className="px-8 pb-12 flex items-center justify-center gap-2 text-zinc-700">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">100% Encrypted Transactions</span>
      </footer>
    </div>
  );
};

export default CheckoutPage;
