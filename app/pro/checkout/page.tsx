
import React, { useState, useEffect } from 'react';
import PaymentSummary from '../../../components/pro/PaymentSummary';
import PaymentStatus from '../../../components/pro/PaymentStatus';
import RazorpayButton from '../../../components/pro/RazorpayButton';
import { paymentService } from '../../../services/paymentService';

const CheckoutPage: React.FC = () => {
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'summary' | 'processing'>('summary');

  useEffect(() => {
    const initCheckout = async () => {
      try {
        const data = await paymentService.createOrder();
        setOrderData(data);
      } catch (err: any) {
        setError(err.message || "Failed to initialize checkout session.");
      } finally {
        setIsLoadingOrder(false);
      }
    };

    initCheckout();
  }, []);

  const handleSuccess = () => {
    setStep('processing');
    localStorage.setItem('mallucupid_plan', 'pro');
    window.location.hash = '#/pro/success';
  };

  const handleFailure = (msg: string) => {
    console.error("Payment Failure:", msg);
    window.location.hash = '#/pro/failure';
  };

  if (isLoadingOrder) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-zinc-900 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Securing Payment Order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="text-white text-xl font-bold">{error}</h3>
        <button 
          onClick={() => window.location.hash = '#/pro/upgrade'}
          className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm tracking-widest"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col animate-fade-in">
      <header className="px-8 pt-12 pb-4 border-b border-zinc-900">
        <h2 className="text-white text-xl font-bold tracking-tight">Secure Checkout</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Order #{orderData?.orderId}</p>
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
              <RazorpayButton 
                orderData={orderData}
                onSuccess={handleSuccess}
                onFailure={handleFailure}
              />
              <div className="flex flex-col items-center justify-center gap-4 pt-4 opacity-40 grayscale">
                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Supported Payment Methods</p>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-bold italic">UPI</span>
                  <span className="text-[10px] font-bold italic">NetBanking</span>
                  <span className="text-[10px] font-bold italic">Cards</span>
                  <span className="text-[10px] font-bold italic">Wallets</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <PaymentStatus status="verifying" />
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
