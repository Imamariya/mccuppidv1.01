
import React from 'react';

interface SignupProgressProps {
  step: number;
  totalSteps: number;
}

const SignupProgress: React.FC<SignupProgressProps> = ({ step, totalSteps }) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end px-1">
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Step {step} of {totalSteps}
        </span>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default SignupProgress;
