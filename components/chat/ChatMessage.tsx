
import React from 'react';
import { ChatMessage as MessageType } from '../../services/chatService';

interface ChatMessageProps {
  message: MessageType;
  isMe: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMe }) => {
  const timestamp = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative group overflow-hidden rounded-2xl">
            <img 
              src={message.content} 
              alt="Shared photo" 
              className="max-w-full rounded-2xl border border-zinc-800 shadow-lg object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                 View Full
               </span>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-lg bg-black aspect-video flex items-center justify-center">
            <video 
              src={message.content} 
              controls 
              className="max-w-full max-h-64 rounded-2xl"
              poster={`${message.content}#t=0.5`}
              preload="metadata"
            />
          </div>
        );
      default:
        return <p className="text-sm font-medium leading-relaxed tracking-tight">{message.content}</p>;
    }
  };

  return (
    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1.5 mb-6 animate-fade-in`}>
      <div className={`relative px-4 py-3 rounded-[1.75rem] transition-all ${
        isMe 
          ? 'bg-emerald-600 text-white rounded-tr-sm shadow-xl shadow-emerald-950/20' 
          : 'bg-zinc-900 text-zinc-200 rounded-tl-sm border border-zinc-800/50'
      } ${message.type !== 'text' ? 'p-1.5' : ''} max-w-[85%]`}>
        {renderContent()}
      </div>
      
      <div className="flex items-center space-x-2 px-2">
        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{timestamp}</span>
        {isMe && (
          <div className="flex items-center">
            <svg className={`w-3 h-3 ${message.status === 'read' ? 'text-emerald-500' : 'text-zinc-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <svg className={`w-3 h-3 -ml-1.5 ${message.status === 'read' ? 'text-emerald-500' : 'text-zinc-600'}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest ml-1">
              {message.status === 'read' ? 'Seen' : 'Sent'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
