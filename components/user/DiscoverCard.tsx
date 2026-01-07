
import React from 'react';
import { UserProfile } from '../../services/userService';

interface DiscoverCardProps {
  profile: UserProfile;
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
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-white text-3xl font-bold">{profile.name}, {profile.age}</h2>
            {profile.is_verified && (
              <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-widest">{profile.gender}</span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] text-white font-bold uppercase tracking-widest">{profile.relationship_type}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2">
          <button 
            onClick={onReject}
            disabled={disabled}
            className="w-16 h-16 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-red-500 shadow-xl active:scale-90 transition-transform disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button 
            onClick={onLike}
            disabled={disabled}
            className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 active:scale-90 transition-transform disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoverCard;
