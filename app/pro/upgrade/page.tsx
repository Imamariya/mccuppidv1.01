
import React, { useState, useEffect } from 'react';
import ProPlanCard from '../../../components/pro/ProPlanCard';

const UpgradePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleUpgrade = () => {
    window.location.hash = '#/pro/checkout';
  };

  const handleCancel = () => {
    window.location.hash = '#/user/dashboard';
  };

  return (
    <div className={`relative min-h-screen bg-zinc-950 flex flex-col transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-[60%] bg-emerald-900/10 blur-[120px] rounded-full transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-yellow-500/5 blur-[120px] rounded-full transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <header className="relative z-10 px-8 pt-12 flex justify-between items-center">
        <h1 className="text-white text-2xl font-brand italic">MalluCupid</h1>
        <button onClick={handleCancel} className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Close</button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col px-8 py-10 space-y-10 max-w-lg mx-auto w-full">
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-white text-4xl font-bold tracking-tight">Level Up Your Heart</h2>
          <p className="text-zinc-500 text-sm">Join our premium community for real connections without limits.</p>
        </div>

        <div className="animate-fade-in animate-delay-1">
          <ProPlanCard />
        </div>

        <div className="space-y-4 animate-fade-in animate-delay-2">
          <button 
            onClick={handleUpgrade}
            className="w-full py-4 bg-premium-green text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all tracking-[0.2em] text-sm"
          >
            UPGRADE NOW
          </button>
          <button 
            onClick={handleCancel}
            className="w-full py-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors"
          >
            Not now, I'll stay Free
          </button>
        </div>
      </main>

      <footer className="relative z-10 px-8 pb-12 text-center">
        <p className="text-zinc-600 text-[9px] font-medium uppercase tracking-widest leading-relaxed">
          Secure payment via SSL. <br />
          Subscription active for 30 days from purchase.
        </p>
      </footer>
    </div>
  );
};

export default UpgradePage;
