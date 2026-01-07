
export interface Notification {
  id: string;
  user_id: string;
  type: 'match' | 'message' | 'verification' | 'pro' | 'admin';
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
});

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const res = await fetch('/api/notifications', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markAsRead(id: string): Promise<void> {
    const res = await fetch('/api/notifications/read', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notificationId: id })
    });
    if (!res.ok) throw new Error('Failed to mark notification as read');
  },

  async markAllAsRead(): Promise<void> {
    await fetch('/api/notifications/read-all', {
      method: 'POST',
      headers: getHeaders()
    });
  }
};
