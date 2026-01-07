
import React from 'react';

interface MatchLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'likes' | 'matches';
}

const MatchLimitModal: React.FC<MatchLimitModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 bg-yellow-500/10 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-lg shadow-yellow-900/20">
          ⭐
        </div>
        
        <div className="space-y-2">
          <h3 className="text-white text-2xl font-bold tracking-tight">Daily Limit Reached</h3>
          <p className="text-zinc-500 text-sm leading-relaxed px-2">
            Free users are limited to {type === 'likes' ? '50 likes' : '10 matches'} per day. Upgrade to Pro for unlimited connections!
          </p>
        </div>

        <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center text-left">
          <div>
            <p className="text-white font-bold">MalluCupid Pro</p>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Unlimited Forever</p>
          </div>
          <p className="text-emerald-400 font-black text-xl">₹99</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => window.location.hash = '#/pro/upgrade'}
            className="w-full py-4 bg-premium-green text-white font-bold rounded-xl tracking-[0.2em] shadow-xl shadow-emerald-500/10 active:scale-95 transition-all"
          >
            UPGRADE NOW
          </button>
          <button 
            onClick={onClose}
            className="w-full py-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchLimitModal;
