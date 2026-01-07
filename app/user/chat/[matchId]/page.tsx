
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import UpgradeBlocker from '@/components/chat/UpgradeBlocker';
import ProUpgradeModal from '@/components/user/ProUpgradeModal';
import { chatService, ChatMessage as MessageType, MessageType as MsgKind } from '@/services/chatService';
import { userService, UserProfile } from '@/services/userService';

interface ChatPageProps {
  matchId: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ matchId }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [me, setMe] = useState<UserProfile | null>(null);
  const [them, setThem] = useState<{ is_verified: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const [profile, msgs] = await Promise.all([
        userService.getProfile(),
        chatService.getMessages(matchId)
      ]);
      setMe(profile);
      setMessages(msgs);
      // PRODUCTION: Fetch partner's minimal profile to check verification
      setThem({ is_verified: true }); // Simulated
    } catch (err) {
      console.error("Chat Init Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const poll = setInterval(async () => {
      try {
        const msgs = await chatService.getMessages(matchId);
        if (msgs.length !== messages.length) setMessages(msgs);
      } catch {}
    }, 5000);
    return () => clearInterval(poll);
  }, [matchId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string, type: MsgKind) => {
    try {
      const sentMsg = await chatService.sendMessage(matchId, content, type);
      setMessages(prev => [...prev, sentMsg]);
    } catch (err: any) {
      if (err.message === 'PRO_PLAN_REQUIRED') setShowUpgradeModal(true);
      else alert(err.message);
    }
  };

  if (isLoading) return (
    <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-zinc-900 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  const myMessagesCount = messages.filter(m => m.sender_id === me?.id).length;
  const isLimitReached = me?.plan === 'free' && myMessagesCount >= 3;
  const isChatLocked = !me?.is_verified || !them?.is_verified;

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <header className="px-6 pt-12 pb-4 border-b border-zinc-900 flex items-center bg-zinc-950/80 backdrop-blur-md z-10">
        <button onClick={() => window.location.hash = '#/user/dashboard'} className="mr-4 text-zinc-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 className="text-white text-[11px] font-bold uppercase tracking-widest">Secure Chat</h2>
          <p className="text-emerald-500 text-[9px] font-black uppercase">Encrypted Connection</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isMe={msg.sender_id === me?.id} />
        ))}
        {isLimitReached && <UpgradeBlocker onUpgrade={() => setShowUpgradeModal(true)} />}
        <div ref={scrollRef} />
      </main>

      {isChatLocked && (
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 text-center animate-fade-in">
          <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            {!me?.is_verified 
              ? "Chat Unlocked After Your Profile is Verified" 
              : "Waiting for Match to Complete Verification"}
          </p>
        </div>
      )}

      <ChatInput 
        onSend={handleSend}
        disabled={isChatLocked}
        isLimitReached={isLimitReached}
        onUpgradeNeeded={() => setShowUpgradeModal(true)}
      />

      <ProUpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        reason="messaging"
        onSuccess={() => { setShowUpgradeModal(false); fetchData(); }}
      />
    </div>
  );
};

export default ChatPage;
