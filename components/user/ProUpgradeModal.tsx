
import React, { useState } from 'react';
import { subscriptionService } from '../../services/subscriptionService';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'messaging' | 'likes' | 'matches';
  onSuccess: () => void;
}

const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ isOpen, onClose, reason, onSuccess }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await subscriptionService.upgradeToPro();
      onSuccess();
    } catch (err) {
      alert("Payment simulation failed. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const getReasonText = () => {
    switch(reason) {
      case 'messaging': return "You've used your 3 free messages for this match.";
      case 'likes': return "You've reached your limit of 50 likes for today.";
      case 'matches': return "You've reached your limit of 10 matches for today.";
      default: return "Unlock premium features to continue.";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-[2.5rem] sm:rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-8 pb-12 sm:pb-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-orange-900/20">
            ⭐
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight">Upgrade to MalluCupid Pro</h2>
          <p className="text-zinc-400 text-sm leading-relaxed px-4">
            {getReasonText()} Upgrade now for unlimited connections.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-white font-bold">Pro Plan</p>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">30 Days Unlimited</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 font-bold text-xl">₹99</p>
              <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Incl. GST</p>
            </div>
          </div>

          <ul className="space-y-2 px-2">
            {['Unlimited Messaging', 'Unlimited Daily Likes', 'Priority Matching', 'Global Discovery'].map(feature => (
              <li key={feature} className="flex items-center text-zinc-300 text-xs">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="w-full py-4 bg-premium-green rounded-xl text-white font-bold tracking-widest active:scale-95 transition-all shadow-xl shadow-emerald-950/20 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isUpgrading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : "UPGRADE NOW"}
        </button>
        
        <button 
          onClick={onClose}
          className="w-full text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-zinc-400"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default ProUpgradeModal;
