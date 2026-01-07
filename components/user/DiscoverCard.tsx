
import React from 'react';
import { UserProfile } from '../../services/userService';
import VerifiedBadge from '../common/VerifiedBadge';

interface DiscoverCardProps {
  profile: UserProfile & { distance?: number };
  onLike: () => void;
  onReject: () => void;
  disabled?: boolean;
}

const DiscoverCard: React.FC<DiscoverCardProps> = ({ profile, onLike, onReject, disabled }) => {
  return (
    <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl bg-zinc-900 animate-fade-in group">
      <img 
        src={profile.profile_images[0]} 
        alt={profile.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent pointer-events-none" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-white text-3xl font-bold">{profile.name}, {profile.age}</h2>
            {profile.is_verified && <VerifiedBadge size="md" />}
          </div>
          <div className="flex items-center space-x-2">
             <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-widest">{profile.relationship_type}</span>
             {profile.distance !== undefined && (
               <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{profile.distance} km away</span>
             )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button 
            onClick={onReject}
            className="w-16 h-16 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-red-500 shadow-xl active:scale-90 transition-transform"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <button 
            onClick={onLike}
            disabled={disabled}
            className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 active:scale-90 transition-transform disabled:opacity-30"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverCard;
