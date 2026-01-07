
import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from '../../../../components/user/ChatBubble';
import { chatService, ChatMessage } from '../../../../services/chatService';
import { userService, UserProfile } from '../../../../services/userService';

interface ChatPageProps {
  matchId: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ matchId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [me, setMe] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        setMe(await userService.getProfile());
        setMessages(await chatService.getMessages(matchId));
      } catch (err) {
        console.error("Chat Init Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [matchId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !me || !me.is_verified) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      senderId: me.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInput('');
    try {
      await chatService.sendMessage(matchId, input);
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <header className="px-6 pt-12 pb-4 border-b border-zinc-900 flex items-center bg-zinc-950/80 backdrop-blur-md z-10">
        <button onClick={() => window.location.hash = '#/user/dashboard'} className="mr-4 text-zinc-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
             <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="User" />
          </div>
          <div>
            <h2 className="text-white text-sm font-bold uppercase tracking-widest">Match Details</h2>
            <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em]">Online</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-2">
        {messages.map((msg) => (
          <ChatBubble 
            key={msg.id} 
            text={msg.text} 
            isMe={msg.senderId === me?.id} 
            timestamp={msg.timestamp} 
          />
        ))}
        <div ref={scrollRef} />
      </main>

      {!me?.is_verified && (
        <div className="px-6 py-3 bg-red-500/10 border-t border-red-500/20 text-center">
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Verify profile to start chatting</p>
        </div>
      )}

      <footer className="p-6 pb-12">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!me?.is_verified}
            placeholder={me?.is_verified ? "Message..." : "Verification pending..."}
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-6 pr-14 py-4 rounded-full focus:border-emerald-500 outline-none transition-all placeholder:text-zinc-700 font-medium disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || !me?.is_verified}
            className="absolute right-2 top-2 bottom-2 w-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
