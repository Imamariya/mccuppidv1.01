
import React from 'react';
import { Notification } from '../../services/notificationService';

interface NotificationListProps {
  notifications: Notification[];
  onRead: (id: string) => void;
  onClose: () => void;
  // Added missing isOpen property required by UserDashboard
  isOpen: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onRead, onClose, isOpen }) => {
  // Do not render if the notification list is not intended to be visible
  if (!isOpen) return null;

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'match': return '❤️';
      case 'message': return '💬';
      case 'verification': return '🆔';
      case 'pro': return '⭐';
      default: return '📢';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] p-6 pt-24 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm mx-auto flex flex-col max-h-[70vh] shadow-2xl overflow-hidden">
        <header className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-white font-bold tracking-tight">Notifications</h3>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <button 
                key={n.id}
                onClick={() => onRead(n.id)}
                className={`w-full p-6 text-left flex items-start space-x-4 transition-colors ${n.is_read ? 'opacity-50' : 'bg-emerald-500/5 hover:bg-emerald-500/10'}`}
              >
                <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-xl shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-zinc-200 text-sm leading-relaxed">{n.message}</p>
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{getTimeAgo(n.created_at)}</span>
                </div>
                {!n.is_read && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0" />}
              </button>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-zinc-500 italic text-sm">No new notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
