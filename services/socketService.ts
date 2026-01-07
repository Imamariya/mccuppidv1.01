
import { socket } from '../lib/socket';

export const socketService = {
  /**
   * Initializes the socket with JWT authentication.
   */
  connect(userId: string) {
    const token = localStorage.getItem('mallucupid_token');
    socket.emit('authenticate', { token, userId });
    
    // Join private user room for notifications
    socket.emit('join_room', `user_${userId}`);
    console.log(`SOCKET: User ${userId} connected to real-time events.`);
  },

  /**
   * Joins a specific match room for live chat updates.
   */
  joinChat(matchId: string) {
    socket.emit('join_room', `match_${matchId}`);
  },

  /**
   * Listeners for real-time events.
   */
  onNewMessage(callback: (msg: any) => void) {
    socket.on('new_message', callback);
  },

  onNewMatch(callback: (match: any) => void) {
    socket.on('new_match', callback);
  },

  onNotification(callback: (notif: any) => void) {
    socket.on('notification_update', callback);
  },

  onVerified(callback: () => void) {
    socket.on('profile_verified', callback);
  }
};
