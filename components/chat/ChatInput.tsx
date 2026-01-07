
import React, { useState, useRef } from 'react';
import MediaPreview from './MediaPreview';
import { chatService, MessageType } from '../../services/chatService';

interface ChatInputProps {
  onSend: (content: string, type: MessageType) => Promise<void>;
  disabled?: boolean;
  isLimitReached: boolean;
  onUpgradeNeeded: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, isLimitReached, onUpgradeNeeded }) => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ file: File; type: 'image' | 'video' } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith('video/') ? 'video' : 'image';
    if (type === 'video' && file.size > 15 * 1024 * 1024) {
      alert("Video size limit exceeded (Max 15MB)");
      return;
    }

    setSelectedFile({ file, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      onUpgradeNeeded();
      return;
    }

    if (selectedFile) {
      setIsUploading(true);
      try {
        const { url } = await chatService.uploadMedia(selectedFile.file, selectedFile.type);
        await onSend(url, selectedFile.type);
        setSelectedFile(null);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Media upload failed");
      } finally {
        setIsUploading(false);
      }
    } else if (text.trim()) {
      await onSend(text.trim(), 'text');
      setText('');
    }
  };

  return (
    <footer className="p-6 pb-12 relative">
      {selectedFile && (
        <MediaPreview 
          file={selectedFile.file} 
          type={selectedFile.type} 
          onRemove={() => setSelectedFile(null)}
          isUploading={isUploading}
        />
      )}

      <form onSubmit={handleSubmit} className="relative flex items-center space-x-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled || isLimitReached || !!selectedFile}
            placeholder={isLimitReached ? "Upgrade to continue..." : (selectedFile ? "File ready to send" : "Message...")}
            className="w-full bg-zinc-900 border border-zinc-800 text-white pl-6 pr-14 py-4 rounded-[2rem] focus:border-emerald-500 outline-none transition-all placeholder:text-zinc-700 font-medium disabled:opacity-50"
          />
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLimitReached || isUploading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-emerald-500 transition-colors disabled:opacity-30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        <button 
          type="submit"
          disabled={(!text.trim() && !selectedFile) || disabled || isUploading}
          className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform disabled:opacity-30 flex-shrink-0"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
        </button>
      </form>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept="image/*,video/*" 
        className="hidden" 
      />
    </footer>
  );
};

export default ChatInput;
