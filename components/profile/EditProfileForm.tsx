
import React from 'react';

interface EditProfileFormProps {
  data: any;
  setData: (data: any) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ data, setData }) => {
  const relationshipTypes = ['Serious Relationship', 'Casual Dating', 'Friendship', 'Marriage'];
  const lookingForOptions = ['Men', 'Women', 'Everyone'];

  const toggleLookingFor = (val: string) => {
    const current = data.looking_for || [];
    if (current.includes(val)) {
      setData({ ...data, looking_for: current.filter((v: string) => v !== val) });
    } else {
      setData({ ...data, looking_for: [...current, val] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Display Name</label>
        <input 
          type="text" 
          value={data.name || ''}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-emerald-500 outline-none transition-all font-medium"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Bio</label>
        <textarea 
          value={data.bio || ''}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl focus:border-emerald-500 outline-none transition-all min-h-[120px] resize-none text-sm placeholder:text-zinc-700"
          placeholder="Tell them about yourself..."
          maxLength={300}
        />
        <div className="flex justify-end pr-1">
          <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">{(data.bio || '').length}/300</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Relationship Type</label>
        <div className="grid grid-cols-2 gap-2">
          {relationshipTypes.map(t => (
            <button 
              key={t}
              onClick={() => setData({ ...data, relationship_type: t })}
              className={`p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                data.relationship_type === t 
                  ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Looking For</label>
        <div className="flex flex-wrap gap-2">
          {lookingForOptions.map(o => (
            <button 
              key={o}
              onClick={() => toggleLookingFor(o)}
              className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                (data.looking_for || []).includes(o)
                  ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/40 p-4 rounded-2xl border border-dashed border-zinc-800">
        <div className="flex items-center space-x-3 opacity-40 grayscale">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">🔒</div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Restricted Fields</p>
            <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest">Email & DOB cannot be changed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
