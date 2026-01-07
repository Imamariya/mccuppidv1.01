
import React from 'react';

interface MatchActionsProps {
  onLike: () => void;
  onReject: () => void;
  disabled?: boolean;
}

const MatchActions: React.FC<MatchActionsProps> = ({ onLike, onReject, disabled }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-[240px] mx-auto pt-4 relative z-20">
      <button 
        onClick={onReject}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-red-500 shadow-xl active:scale-90 transition-all disabled:opacity-30 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 group-active:rotate-12 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <button 
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 active:scale-110 transition-all disabled:opacity-30 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 group-active:scale-125 transition-transform">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </button>
    </div>
  );
};

export default MatchActions;
