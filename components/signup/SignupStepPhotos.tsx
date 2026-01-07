import React, { useState, useRef } from 'react';
import ErrorMessage from '../ErrorMessage';
import { storageService } from '../../services/storageService';

interface SignupStepPhotosProps {
  onNext: (images: string[]) => void;
}

const SignupStepPhotos: React.FC<SignupStepPhotosProps> = ({ onNext }) => {
  const [images, setImages] = useState<string[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setError("Max 5 photos allowed");
      return;
    }

    setError(null);
    // Fix: Explicitly type the files array as File[] to avoid 'unknown' type in map
    const filesArray = Array.from(files) as File[];
    setUploadingCount(prev => prev + filesArray.length);

    try {
      const uploadPromises = filesArray.map(async (file) => {
        try {
          const { url } = await storageService.uploadProfileImage(file);
          return url;
        } catch (err) {
          throw new Error(`Failed to upload ${file.name}`);
        } finally {
          setUploadingCount(prev => prev - 1);
        }
      });

      const newUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...newUrls]);
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));

  const setAsProfile = (idx: number) => {
    const newImgs = [...images];
    const [selected] = newImgs.splice(idx, 1);
    newImgs.unshift(selected);
    setImages(newImgs);
  };

  const handleContinue = () => {
    if (images.length < 2) {
      setError("Please add at least 2 photos to continue");
      return;
    }
    onNext(images);
  };

  const isUploading = uploadingCount > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-white text-lg font-bold">Add your best photos</h3>
        <p className="text-zinc-500 text-xs">Upload your real photos. No blob URLs allowed.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {images.map((url, idx) => (
          <div key={url} className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all ${idx === 0 ? 'border-emerald-500 shadow-lg shadow-emerald-950/20' : 'border-zinc-800'}`}>
            <img src={url} alt="Profile" className="w-full h-full object-cover" />
            <button 
              onClick={() => removeImage(idx)}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs"
            >✕</button>
            {idx !== 0 && (
              <button 
                onClick={() => setAsProfile(idx)}
                className="absolute bottom-2 left-2 right-2 bg-emerald-600/80 backdrop-blur-sm text-white py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
              >Set Profile</button>
            )}
            {idx === 0 && (
              <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Main</div>
            )}
          </div>
        ))}
        
        {/* Placeholder for images currently uploading */}
        {Array.from({ length: uploadingCount }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl border-2 border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center gap-2">
             <div className="w-6 h-6 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
             <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Uploading...</span>
          </div>
        ))}

        {images.length + uploadingCount < 5 && (
          <button 
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center gap-2 hover:border-zinc-700 transition-all text-zinc-600 active:scale-95 disabled:opacity-50"
          >
            <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500">+</div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Add Photo</span>
          </button>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/jpeg,image/png" multiple />

      {error && <ErrorMessage message={error} />}
      
      <button 
        onClick={handleContinue}
        disabled={isUploading || images.length < 2}
        className="w-full py-4 bg-premium-green rounded-xl font-bold text-white tracking-widest active:scale-[0.98] transition-all disabled:opacity-40"
      >
        {isUploading ? "UPLOADING..." : "CONTINUE"}
      </button>
    </div>
  );
};

export default SignupStepPhotos;