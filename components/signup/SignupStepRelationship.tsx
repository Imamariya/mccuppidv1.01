
import React, { useState } from 'react';
import ErrorMessage from '../ErrorMessage';

interface SignupStepRelationshipProps {
  onNext: (data: { relationship_type: string; bio: string }) => void;
}

const SignupStepRelationship: React.FC<SignupStepRelationshipProps> = ({ onNext }) => {
  const [type, setType] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!type) {
      setError("Please select a relationship type"); return;
    }
    onNext({ relationship_type: type, bio });
  };

  const types = ['Serious Relationship', 'Casual Dating', 'Friendship', 'Marriage'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">What are you looking for?</label>
        <div className="space-y-2">
          {types.map(t => (
            <button 
              key={t}
              onClick={() => setType(t)}
              className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${type === t ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
            >
              <span className="text-sm font-medium">{t}</span>
              {type === t && <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_theme(colors.emerald.500)]" />}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Bio (Optional)</label>
        <textarea 
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Tell them a bit about yourself..."
          className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 rounded-xl focus:border-emerald-500 outline-none min-h-[120px] resize-none text-sm placeholder:text-zinc-700"
          maxLength={300}
        />
        <div className="text-[10px] text-right text-zinc-600 font-bold uppercase tracking-widest">{bio.length}/300</div>
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

export default SignupStepRelationship;
