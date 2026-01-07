
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
          src="https://res.cloudinary.com/dsamz0zji/image/upload/v1767811295/WhatsApp_Image_2026-01-01_at_20.43.08_uymbzb.jpg" 
          alt="MalluCupid Romantic Background" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/30" />
        {/* Subtle vignette for high-end photography feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <main className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center">
        <section className="space-y-6 animate-fade-in animate-delay-1">
          <h1 className="text-white text-6xl md:text-7xl font-brand italic tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            MalluCupid
          </h1>
          <p className="text-white text-xl md:text-2xl font-light tracking-wide max-w-xs mx-auto drop-shadow-md">
            Real connections. <br />
            <span className="font-bold text-emerald-400">Real Mallu hearts.</span>
          </p>
        </section>

        <div className="fixed bottom-0 left-0 right-0 p-8 pb-safe animate-fade-in animate-delay-2">
          <div className="max-w-md mx-auto w-full flex flex-col items-center space-y-8">
            <button
              onClick={handleGetStarted}
              disabled={isProcessing}
              className="group relative w-full py-5 px-6 rounded-2xl bg-premium-green text-white font-black text-lg tracking-[0.2em] shadow-[0_12px_40px_rgba(5,150,105,0.3)] transition-all duration-300 transform active:scale-95 disabled:opacity-70 flex items-center justify-center border border-white/10"
            >
              {isProcessing ? (
                 <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>PREPARING...</span>
                </div>
              ) : "GET STARTED"}
            </button>
            <footer className="flex items-center justify-center space-x-6 text-[10px] md:text-xs text-zinc-300 font-bold uppercase tracking-[0.2em] opacity-80">
              <button className="hover:text-white transition-colors">Terms & Conditions</button>
              <div className="w-1 h-1 bg-zinc-500 rounded-full" />
              <button className="hover:text-white transition-colors">Privacy Policy</button>
            </footer>
          </div>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </div>
  );
};

export default LandingPage;
