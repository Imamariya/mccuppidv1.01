
import React from 'react';

interface BottomNavProps {
  activeTab: number;
  setActiveTab: (idx: number) => void;
  hasUnread?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, hasUnread }) => {
  const tabs = [
    { label: 'Discover', icon: <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196 7.5 7.5 0 0016.242 16.242z" /> },
    { label: 'Matches', icon: <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /> },
    { label: 'Inbox', icon: <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /> },
    { label: 'Profile', icon: <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-900 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors ${activeTab === idx ? 'text-emerald-500' : 'text-zinc-600'}`}
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                {tab.icon}
              </svg>
              {idx === 2 && hasUnread && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
