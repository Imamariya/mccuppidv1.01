
export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

const MOCK_CHATS = [
  { 
    id: 'm1', 
    name: 'Anjali', 
    imageUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=100',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '10:30 AM',
    unreadCount: 1
  },
  { 
    id: 'm2', 
    name: 'Meera', 
    imageUrl: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=100',
    lastMessage: 'That sounds like a plan! See you there.',
    timestamp: 'YESTERDAY',
    unreadCount: 0
  }
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'm1': [
    { id: '1', text: 'Hi Anjali!', senderId: 'me_123', timestamp: '10:00 AM' },
    { id: '2', text: 'Hey! How are you doing?', senderId: 'm1', timestamp: '10:30 AM' }
  ],
  'm2': [
    { id: '3', text: 'Want to grab some coffee this weekend?', senderId: 'me_123', timestamp: 'Yesterday' },
    { id: '4', text: 'That sounds like a plan! See you there.', senderId: 'm2', timestamp: 'Yesterday' }
  ]
};

export const chatService = {
  async getChatList(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_CHATS];
  },

  async getMessages(matchId: string): Promise<ChatMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_MESSAGES[matchId] || [];
  },

  async sendMessage(matchId: string, text: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Sent message to ${matchId}: ${text}`);
  }
};
