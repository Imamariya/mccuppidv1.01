
import React from 'react';
import VerifiedBadge from '../common/VerifiedBadge';

interface MatchListItemProps {
  id: string;
  name: string;
  imageUrl: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isVerified?: boolean;
  onClick: () => void;
}

const MatchListItem: React.FC<MatchListItemProps> = ({ name, imageUrl, lastMessage, timestamp, unreadCount, isVerified, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center space-x-4 p-4 hover:bg-zinc-900/50 transition-colors border-b border-zinc-900/50"
    >
      <div className="relative shrink-0">
        <img src={imageUrl} alt={name} className="w-16 h-16 rounded-2xl object-cover border border-zinc-800" />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-4 border-zinc-950 rounded-full" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center space-x-2">
          <h3 className="text-white font-bold text-base">{name}</h3>
          {isVerified && <VerifiedBadge size="sm" />}
          {timestamp && <span className="text-[10px] text-zinc-600 font-bold ml-auto uppercase tracking-wider">{timestamp}</span>}
        </div>
        <p className="text-zinc-500 text-sm line-clamp-1 mt-0.5 font-medium">
          {lastMessage || "You matched! Say hi 👋"}
        </p>
      </div>
      {unreadCount ? (
        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">
          {unreadCount}
        </div>
      ) : null}
    </button>
  );
};

export default MatchListItem;
