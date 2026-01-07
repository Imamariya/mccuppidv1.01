
import React from 'react';
import { ModerationImage } from '../../services/adminService';

interface ImageModerationProps {
  images: ModerationImage[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ImageModeration: React.FC<ImageModerationProps> = ({ images, onApprove, onReject }) => {
  if (images.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-2xl text-center">
        <p className="text-zinc-500 italic">All images are moderated.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img) => (
        <div key={img.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group">
          <div className="aspect-[3/4] relative">
            <img src={img.url} className="w-full h-full object-cover" alt="User upload" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black p-3 translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">{img.userName}</p>
            </div>
          </div>
          <div className="flex border-t border-zinc-800">
            <button 
              onClick={() => onApprove(img.id)}
              className="flex-1 p-3 text-emerald-500 hover:bg-emerald-500/10 transition-colors"
              title="Approve"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </button>
            <button 
              onClick={() => onReject(img.id)}
              className="flex-1 p-3 text-red-500 hover:bg-red-500/10 transition-colors border-l border-zinc-800"
              title="Reject"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageModeration;
