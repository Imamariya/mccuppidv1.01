
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

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    match_id: 'm_1',
    sender_id: 'p_them',
    type: 'text',
    content: 'Hi! Kochi is beautiful today. How are you?',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    status: 'read'
  }
];

export const chatService = {
  async getChatList(): Promise<any[]> {
    return [
      { 
        id: 'm_1', 
        name: 'Kavya', 
        imageUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=100',
        lastMessage: 'Hey! Kochi is beautiful today.',
        timestamp: '10:30 AM',
        unreadCount: 1,
        isVerified: true
      }
    ];
  },

  async getMessages(matchId: string): Promise<ChatMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_MESSAGES;
  },

  async sendMessage(matchId: string, content: string, type: MessageType = 'text'): Promise<ChatMessage> {
    const isPro = localStorage.getItem('mallucupid_plan') === 'pro';
    if (!isPro && MOCK_MESSAGES.length >= 3) {
       const err = new Error('PRO_PLAN_REQUIRED');
       (err as any).code = 'PRO_PLAN_REQUIRED';
       throw err;
    }

    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      match_id: matchId,
      sender_id: 'me_123',
      type,
      content,
      created_at: new Date().toISOString(),
      status: 'sent'
    };
    MOCK_MESSAGES.push(msg);
    return msg;
  },

  async uploadMedia(file: File, type: 'image' | 'video'): Promise<{ url: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { url: URL.createObjectURL(file) };
  }
};
