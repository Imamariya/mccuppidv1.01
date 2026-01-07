
import React, { useState, useEffect } from 'react';
import { trackLandingClick } from '../services/trackingService';

const LandingPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await trackLandingClick();
      // Use hash instead of pushState for better compatibility
      window.location.hash = '#/login';
    } catch (error) {
      console.error("CTA Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`relative h-screen w-full overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516589174184-c6858b16ecb0?auto=format&fit=crop&q=80&w=1200" 
          alt="MalluCupid Romantic Background" 
          className="w-full h-full object-cover scale-110 blur-[2px]"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />
      </div>

      <main className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center">
        <section className="space-y-6 animate-fade-in animate-delay-1">
          <h1 className="text-white text-5xl md:text-6xl font-brand italic tracking-tight drop-shadow-2xl">
            MalluCupid
          </h1>
          <p className="text-zinc-200 text-lg md:text-xl font-light tracking-wide max-w-xs mx-auto opacity-90">
            Real connections. <br />
            <span className="font-semibold text-emerald-400">Real Mallu hearts.</span>
          </p>
        </section>

        <div className="fixed bottom-0 left-0 right-0 p-8 pb-safe animate-fade-in animate-delay-2">
          <div className="max-w-md mx-auto w-full flex flex-col items-center space-y-8">
            <button
              onClick={handleGetStarted}
              disabled={isProcessing}
              className="group relative w-full py-4 px-6 rounded-full bg-premium-green text-white font-bold text-lg tracking-wider shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 transform active:scale-95 disabled:opacity-70 flex items-center justify-center"
            >
              {isProcessing ? (
                 <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>PREPARING...</span>
                </div>
              ) : "GET STARTED"}
            </button>
            <footer className="flex items-center justify-center space-x-6 text-[10px] md:text-xs text-zinc-400 font-medium uppercase tracking-[0.2em]">
              <button className="hover:text-white transition-colors">Terms & Conditions</button>
              <div className="w-1 h-1 bg-zinc-700 rounded-full" />
              <button className="hover:text-white transition-colors">Privacy Policy</button>
            </footer>
          </div>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
    </div>
  );
};

export default LandingPage;
