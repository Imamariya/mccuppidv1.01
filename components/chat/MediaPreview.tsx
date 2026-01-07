
import React from 'react';

interface MediaPreviewProps {
  file: File;
  type: 'image' | 'video';
  onRemove: () => void;
  isUploading: boolean;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ file, type, onRemove, isUploading }) => {
  const url = URL.createObjectURL(file);

  return (
    <div className="absolute bottom-full left-0 right-0 p-4 animate-fade-in">
      <div className="relative w-32 aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-2xl bg-zinc-900">
        {type === 'image' ? (
          <img src={url} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <video src={url} className="w-full h-full object-cover" />
        )}
        
        {isUploading ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <button 
            onClick={onRemove}
            className="absolute top-1 right-1 w-6 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs"
          >
            ✕
          </button>
        )}
        
        <div className="absolute bottom-0 inset-x-0 bg-emerald-500 py-1 text-center">
          <span className="text-[8px] font-black text-white uppercase tracking-widest">
            {type} Ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default MediaPreview;
