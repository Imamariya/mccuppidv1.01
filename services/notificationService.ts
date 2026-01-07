
export interface Notification {
  id: string;
  user_id: string;
  type: 'match' | 'message' | 'verification' | 'pro' | 'admin';
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n_1',
    user_id: 'me_123',
    type: 'match',
    message: 'You have a new match with Sneha! ❤️',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'n_2',
    user_id: 'me_123',
    type: 'verification',
    message: 'Your profile has been verified. 🆔',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    return MOCK_NOTIFICATIONS;
  },

  async markAsRead(id: string): Promise<void> {
    const n = MOCK_NOTIFICATIONS.find(notif => notif.id === id);
    if (n) n.is_read = true;
  },

  async markAllAsRead(): Promise<void> {
    MOCK_NOTIFICATIONS.forEach(n => n.is_read = true);
  }
};
