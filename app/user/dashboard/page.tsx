
import React, { useState, useEffect } from 'react';
import BottomNav from '@/components/user/BottomNav';
import VerificationBanner from '@/components/user/VerificationBanner';
import DiscoverCard from '@/components/user/DiscoverCard';
import MatchListItem from '@/components/user/MatchListItem';
import ProUpgradeModal from '@/components/user/ProUpgradeModal';
import NotificationBell from '@/components/notifications/NotificationBell';
import NotificationList from '@/components/notifications/NotificationList';
import FilterModal from '@/components/user/FilterModal';
import { userService, UserProfile } from '@/services/userService';
import { matchService } from '@/services/matchService';
import { chatService } from '@/services/chatService';
import { locationService } from '@/services/locationService';
import { verificationService } from '@/services/verificationService';
import { notificationService, Notification } from '@/services/notificationService';
import { socketService } from '@/services/socketService';
import { filterService, SearchFilters } from '@/services/filterService';

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [feed, setFeed] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(filterService.getFilters());
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<'likes' | 'matches' | 'messaging' | null>(null);

  const fetchFeedData = async (currentFilters: SearchFilters) => {
    try {
      const query = filterService.toQueryParams(currentFilters);
      const f = await matchService.getFeed(query);
      setFeed(f);
    } catch (err) {
      console.error("Feed Load Error:", err);
    }
  };

  const fetchData = async () => {
    try {
      const [p, n] = await Promise.all([
        userService.getProfile(),
        notificationService.getNotifications()
      ]);
      setProfile(p);
      setNotifications(n);
      await fetchFeedData(filters);
      
      // Initialize Socket
      socketService.connect(p.id);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Setup Socket Listeners
    socketService.onNotification((newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    socketService.onVerified(() => {
      setProfile(prev => prev ? { ...prev, is_verified: true } : null);
    });

    // Location & Verification Sync
    const syncLocation = async () => {
      try {
        const pos = await locationService.getCurrentPosition();
        const geo = await locationService.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        await locationService.updateLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          ...geo
        });
      } catch {}
    };
    syncLocation();

    return () => {
      // Disconnect socket on unmount if needed
    };
  }, []);

  useEffect(() => {
    const refreshTabData = async () => {
      if (activeTab === 1) setMatches(await matchService.getMatches());
      if (activeTab === 2) setChats(await chatService.getChatList());
    };
    refreshTabData();
  }, [activeTab]);

  const handleLike = async (id: string) => {
    try {
      await matchService.like(id);
      setFeed(feed.filter(p => p.id !== id));
    } catch (err: any) {
      if (err.message === 'PRO_PLAN_REQUIRED') setUpgradeReason('likes');
    }
  };

  const handleReject = async (id: string) => {
    setFeed(feed.filter(p => p.id !== id));
    await matchService.reject(id);
  };

  const handleReadNotification = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const handleApplyFilters = async (newFilters: SearchFilters) => {
    setFilters(newFilters);
    filterService.saveFilters(newFilters);
    setIsFilterOpen(false);
    setIsLoading(true);
    await fetchFeedData(newFilters);
    setIsLoading(false);
  };

  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

  const renderTab = () => {
    if (isLoading) return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Warming up hearts...</span>
      </div>
    );

    switch(activeTab) {
      case 0: // Discover
        return (
          <div className="flex-1 flex flex-col px-6 py-4">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-white text-xl font-bold tracking-tight">For You</h2>
               <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 text-zinc-400 active:scale-95 transition-all"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                 <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
               </button>
            </div>
            {feed.length > 0 ? (
              <DiscoverCard 
                profile={feed[0]} 
                onLike={() => handleLike(feed[0].id)} 
                onReject={() => handleReject(feed[0].id)}
                disabled={!profile?.is_verified}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-bold">No one found</h3>
                <p className="text-zinc-500 text-xs">Try adjusting your filters.</p>
                <button onClick={() => setIsFilterOpen(true)} className="text-emerald-500 text-xs font-bold uppercase underline">Reset Filters</button>
              </div>
            )}
          </div>
        );
      case 1: // Matches
        return (
          <div className="flex-1 overflow-y-auto">
             <div className="px-6 py-4 border-b border-zinc-900/50">
               <h2 className="text-white text-xl font-bold">New Matches</h2>
             </div>
             {matches.length > 0 ? (
               matches.map(m => (
                 <MatchListItem 
                   key={m.id} 
                   id={m.id} 
                   name={m.name} 
                   imageUrl={m.imageUrl} 
                   onClick={() => window.location.hash = `#/user/chat/${m.id}`}
                 />
               ))
             ) : (
               <div className="p-12 text-center text-zinc-600 italic">No matches yet. Keep discovering!</div>
             )}
          </div>
        );
      case 2: // Inbox
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 border-b border-zinc-900/50">
               <h2 className="text-white text-xl font-bold">Conversations</h2>
             </div>
             {chats.length > 0 ? (
               chats.map(c => (
                 <MatchListItem 
                   key={c.id} 
                   id={c.id} 
                   name={c.name} 
                   imageUrl={c.imageUrl} 
                   lastMessage={c.lastMessage}
                   timestamp={c.timestamp}
                   unreadCount={c.unreadCount}
                   onClick={() => window.location.hash = `#/user/chat/${c.id}`}
                 />
               ))
             ) : (
               <div className="p-12 text-center text-zinc-600 italic">No active messages.</div>
             )}
          </div>
        );
      case 3: // Profile
        return (
          <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
             <div className="flex flex-col items-center text-center space-y-4 pb-8 border-b border-zinc-900">
               <div className="relative">
                 <img src={profile?.profile_images[0]} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-zinc-900 shadow-2xl" alt="Me" />
                 {profile?.is_verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white border-4 border-zinc-950">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                    </div>
                 )}
               </div>
               <div>
                 <div className="flex items-center justify-center gap-2">
                   <h2 className="text-white text-2xl font-bold">{profile?.name}, {profile?.age}</h2>
                 </div>
                 <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">{profile?.relationship_type}</p>
               </div>
             </div>
             <div className="space-y-4 pt-8">
               <button onClick={() => window.location.hash = '#/user/profile/edit'} className="w-full p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-left flex justify-between group">
                 <span className="text-white text-sm font-bold uppercase tracking-widest">Edit Profile</span>
                 <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
               </button>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden">
      <header className="px-6 pt-12 pb-4 flex justify-between items-center z-10">
        <h1 className="text-white text-2xl font-brand italic">MalluCupid</h1>
        <div className="flex items-center space-x-3">
          {profile?.plan === 'pro' && <span className="text-[8px] text-yellow-500 font-black border border-yellow-500/30 px-2 py-1.5 rounded-lg tracking-widest">PRO ACTIVE</span>}
          <NotificationBell unreadCount={unreadNotifCount} onClick={() => setIsNotifOpen(true)} />
        </div>
      </header>

      {profile && !profile.is_verified && <VerificationBanner />}

      <main className="flex-1 flex flex-col overflow-hidden pb-16">
        {renderTab()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} hasUnread={chats.some(c => c.unreadCount > 0)} />

      <ProUpgradeModal 
        isOpen={upgradeReason !== null} 
        onClose={() => setUpgradeReason(null)} 
        reason={upgradeReason || 'messaging'}
        onSuccess={() => { setUpgradeReason(null); fetchData(); }}
      />

      <NotificationList 
        notifications={notifications} 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)}
        onRead={handleReadNotification}
      />

      <FilterModal 
        isOpen={isFilterOpen}
        filters={filters}
        onClose={() => setIsFilterOpen(false)}
        onSave={handleApplyFilters}
      />
    </div>
  );
};

export default UserDashboard;
