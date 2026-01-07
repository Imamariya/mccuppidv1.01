
import React from 'react';

const ProPlanCard: React.FC = () => {
  const benefits = [
    "Unlimited Messages with any match",
    "Unlimited Daily Likes (no 50 limit)",
    "Unlimited Matches (no 10 limit)",
    "Priority Profile Visibility",
    "Advanced Discovery Filters",
    "Pro Badge on Profile"
  ];

  return (
    <div className="relative overflow-hidden bg-zinc-900 border border-yellow-500/20 rounded-[2.5rem] p-8 shadow-2xl">
      {/* Decorative background element */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-500/10 blur-[60px] rounded-full" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-yellow-500/20 mb-2">
              Best Value
            </span>
            <h3 className="text-white text-3xl font-bold">Pro Plan</h3>
          </div>
          <div className="text-right">
            <p className="text-white text-3xl font-bold">₹99</p>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">/ 30 Days</p>
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        <ul className="space-y-4">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start space-x-3 text-zinc-300 text-sm">
              <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProPlanCard;
