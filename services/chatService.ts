
export type MessageType = 'text' | 'image' | 'video';

export interface ChatMessage {
  id: string;
  match_id: string;
  sender_id: string;
  type: MessageType;
  content: string;
  created_at: string;
  status?: string;
}

const getHeaders = () => {
  const plan = localStorage.getItem('mallucupid_plan') || 'free';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`,
    'X-User-Plan': plan
  };
};

export const chatService = {
  async getChatList(): Promise<any[]> {
    const res = await fetch('/api/match/list', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch chat list');
    return res.json();
  },

  async getMessages(matchId: string): Promise<ChatMessage[]> {
    const res = await fetch(`/api/chat/messages?matchId=${matchId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async sendMessage(matchId: string, content: string, type: MessageType = 'text'): Promise<ChatMessage> {
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ matchId, content, type })
    });

    if (res.status === 403) {
      const data = await res.json();
      if (data.code === 'PRO_PLAN_REQUIRED') {
        throw new Error('PRO_PLAN_REQUIRED');
      }
      throw new Error(data.error || 'Access denied');
    }

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return res.json();
  },

  async uploadMedia(file: File, type: 'image' | 'video'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const endpoint = type === 'image' ? '/api/chat/upload-image' : '/api/chat/upload-video';
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
      },
      body: formData
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || `Failed to upload ${type}`);
    }

    return res.json();
  }
};
