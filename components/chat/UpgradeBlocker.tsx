
import React from 'react';

interface UpgradeBlockerProps {
  onUpgrade: () => void;
}

const UpgradeBlocker: React.FC<UpgradeBlockerProps> = ({ onUpgrade }) => {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-6 rounded-3xl text-center space-y-4 animate-fade-in shadow-2xl mx-6 mb-4">
      <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl mx-auto flex items-center justify-center text-2xl">
        ⭐
      </div>
      <div className="space-y-1">
        <h4 className="text-white text-sm font-bold tracking-tight">Free Message Limit Reached</h4>
        <p className="text-zinc-500 text-[11px] leading-relaxed">
          Upgrade to MalluCupid Pro to unlock unlimited conversations with all your matches.
        </p>
      </div>
      <button 
        onClick={onUpgrade}
        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-lg shadow-orange-500/10"
      >
        GET PRO FOR ₹99
      </button>
    </div>
  );
};

export default UpgradeBlocker;
