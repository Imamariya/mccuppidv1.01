
import React from 'react';

const VerificationBanner: React.FC = () => {
  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-6 py-3 flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-yellow-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <h4 className="text-yellow-500 text-[11px] font-bold uppercase tracking-wider">Account Under Verification</h4>
        <p className="text-zinc-400 text-[10px] leading-tight mt-0.5">Some features are restricted until your selfie is approved by our team.</p>
      </div>
    </div>
  );
};

export default VerificationBanner;
