
import React, { useState, useRef } from 'react';
import { storageService } from '../../services/storageService';
import ErrorMessage from '../ErrorMessage';

interface ProfileImageManagerProps {
  images: string[];
  onChange: (newImages: string[]) => void;
}

const ProfileImageManager: React.FC<ProfileImageManagerProps> = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 5) {
      setError("Max 5 photos allowed");
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const { url } = await storageService.uploadProfileImage(file);
      onChange([...images, url]);
    } catch (err: any) {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = async (url: string) => {
    if (images.length <= 2) {
      setError("You must have at least 2 profile photos");
      return;
    }
    setError(null);
    try {
      // In production we delete from storage too
      // await storageService.deleteProfileImage(url);
      onChange(images.filter(img => img !== url));
    } catch (err) {
      setError("Failed to remove image");
    }
  };

  const setAsMain = (url: string) => {
    const filtered = images.filter(img => img !== url);
    onChange([url, ...filtered]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end pl-1">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Profile Photos</label>
        <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">{images.length}/5</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map((url, idx) => (
          <div key={url} className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 group transition-all ${idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-zinc-800'}`}>
            <img src={url} className="w-full h-full object-cover" alt={`Photo ${idx + 1}`} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
              <button 
                onClick={() => removeImage(url)}
                className="self-end w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
              >✕</button>
              {idx !== 0 && (
                <button 
                  onClick={() => setAsMain(url)}
                  className="bg-emerald-500 text-white text-[8px] font-black py-1 px-2 rounded-lg uppercase tracking-widest"
                >Main</button>
              )}
            </div>
            {idx === 0 && (
              <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Main</div>
            )}
          </div>
        ))}

        {images.length < 5 && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-[3/4] rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 hover:border-zinc-700 transition-colors active:scale-95 disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
            ) : (
              <>
                <div className="text-xl mb-1">+</div>
                <span className="text-[8px] font-black uppercase tracking-widest">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleUpload} 
      />

      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default ProfileImageManager;
