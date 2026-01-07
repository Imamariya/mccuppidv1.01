
import React, { useState } from 'react';
import ErrorMessage from '../ErrorMessage';

interface SignupStepBasicProps {
  onNext: (data: { dob: string; gender: string; looking_for: string[] }) => void;
}

const SignupStepBasic: React.FC<SignupStepBasicProps> = ({ onNext }) => {
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (val: string) => {
    if (lookingFor.includes(val)) setLookingFor(lookingFor.filter(i => i !== val));
    else setLookingFor([...lookingFor, val]);
  };

  const handleContinue = () => {
    if (!dob || !gender || lookingFor.length === 0) {
      setError("Please fill in all details"); return;
    }
    const age = Math.floor((new Date().getTime() - new Date(dob).getTime()) / 31557600000);
    if (age < 18) {
      setError("Must be 18 or older to join MalluCupid"); return;
    }
    onNext({ dob, gender, looking_for: lookingFor });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date of Birth</label>
        <input 
          type="date" 
          value={dob}
          onChange={e => setDob(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:border-emerald-500 outline-none appearance-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gender</label>
        <div className="grid grid-cols-2 gap-2">
          {['Male', 'Female', 'Transgender', 'Non-binary'].map(g => (
            <button 
              key={g} 
              onClick={() => setGender(g)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${gender === g ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Looking For</label>
        <div className="flex flex-wrap gap-2">
          {['Men', 'Women', 'Everyone'].map(i => (
            <button 
              key={i} 
              onClick={() => toggleInterest(i)}
              className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${lookingFor.includes(i) ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
      <button 
        onClick={handleContinue}
        className="w-full py-4 bg-premium-green rounded-xl font-bold text-white tracking-widest active:scale-[0.98] transition-all"
      >
        CONTINUE
      </button>
    </div>
  );
};

export default SignupStepBasic;
