
import React from 'react';
import VerifiedBadge from '../common/VerifiedBadge';

interface ProfilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    name: string;
    age: number;
    bio: string;
    relationship_type: string;
    profile_images: string[];
    is_verified?: boolean;
  };
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800">
        <img 
          src={data.profile_images[0] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400'} 
          alt="Preview" 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10"
        >
          ✕
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-white text-3xl font-bold">{data.name || 'Your Name'}, {data.age || '??'}</h2>
              {data.is_verified && <VerifiedBadge size="md" />}
            </div>
            <div className="flex items-center space-x-2">
               <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] text-white font-black uppercase tracking-widest">
                 {data.relationship_type || 'Seeking Relationship'}
               </span>
               <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">0 km away</span>
            </div>
          </div>
          
          <p className="text-zinc-300 text-sm line-clamp-3 leading-relaxed">
            {data.bio || 'Add a bio to show your personality!'}
          </p>

          <div className="pt-4 border-t border-white/10 flex items-center justify-center">
             <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">Profile Preview Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
