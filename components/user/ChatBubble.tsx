
import React from 'react';

interface ChatBubbleProps {
  text: string;
  isMe: boolean;
  timestamp: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isMe, timestamp }) => {
  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 mb-4 animate-fade-in`}>
      <div className={`max-w-[80%] px-4 py-3 rounded-3xl ${isMe ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-zinc-900 text-zinc-200 rounded-tl-sm'}`}>
        <p className="text-sm font-medium leading-relaxed">{text}</p>
      </div>
      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-2">{timestamp}</span>
    </div>
  );
};

export default ChatBubble;
