
import React, { useState, useRef, useEffect } from 'react';
import ErrorMessage from '../ErrorMessage';
import { storageService } from '../../services/storageService';

interface SignupStepSelfieProps {
  onComplete: (selfieUrl: string) => void;
}

const SignupStepSelfie: React.FC<SignupStepSelfieProps> = ({ onComplete }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 640 }, 
        audio: false 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      setError("Camera access denied. Face verification is mandatory for security.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    
    canvasRef.current.toBlob(blob => {
      if (blob) {
        setCapturedBlob(blob);
        // Create a local preview for immediate feedback
        const localUrl = URL.createObjectURL(blob);
        setPreviewUrl(localUrl);
        // Stop camera tracks
        stream?.getTracks().forEach(t => t.stop());
        setStream(null);
      }
    }, 'image/jpeg', 0.85);
  };

  const retake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setCapturedBlob(null);
    setPreviewUrl(null);
    startCamera();
  };

  const handleSubmit = async () => {
    if (!capturedBlob) return;
    setIsUploading(true);
    setError(null);
    try {
      const { url } = await storageService.uploadVerificationSelfie(capturedBlob);
      // Success! Pass the permanent secure URL back up
      onComplete(url);
    } catch (err: any) {
      setError("Selfie verification upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h3 className="text-white text-lg font-bold">Face Verification</h3>
        <p className="text-zinc-500 text-xs">A live selfie helps us keep MalluCupid safe. This is never public.</p>
      </div>

      <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-full overflow-hidden border-4 border-zinc-800 shadow-2xl bg-zinc-950">
        {!previewUrl ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <img src={previewUrl} className="w-full h-full object-cover scale-x-[-1]" alt="Preview" />
        )}
        
        {!previewUrl && (
          <div className="absolute inset-0 border-[30px] border-emerald-500/10 rounded-full pointer-events-none" />
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-zinc-700 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Securing Selfie...</span>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {error && <ErrorMessage message={error} />}

      <div className="space-y-3">
        {!previewUrl ? (
          <button 
            onClick={capture}
            disabled={!stream}
            className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl active:scale-95 transition-all tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
          >
            CAPTURE SELFIE
          </button>
        ) : (
          <>
            <button 
              onClick={handleSubmit}
              disabled={isUploading}
              className="w-full py-4 bg-premium-green text-white font-bold rounded-xl active:scale-95 transition-all tracking-widest flex items-center justify-center gap-2"
            >
              FINISH & SUBMIT
            </button>
            <button 
              onClick={retake}
              disabled={isUploading}
              className="w-full py-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-zinc-400"
            >
              Retake Photo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupStepSelfie;
