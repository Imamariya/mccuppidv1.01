
import React, { useState, useEffect } from 'react';
import EditProfileForm from '@/components/profile/EditProfileForm';
import ProfileImageManager from '@/components/profile/ProfileImageManager';
import ProfilePreview from '@/components/profile/ProfilePreview';
import { profileService } from '@/services/profileService';

const EditProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfileData(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      const response = await profileService.updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        relationship_type: profileData.relationship_type,
        looking_for: profileData.looking_for,
        profile_images: profileData.profile_images
      });
      
      if (response.success) {
        setSaveStatus('success');
        setTimeout(() => {
          window.location.hash = '#/user/dashboard';
        }, 1500);
      }
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-zinc-900 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Loading Settings...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col animate-fade-in">
      <header className="px-6 pt-12 pb-6 border-b border-zinc-900 flex justify-between items-center sticky top-0 bg-zinc-950/80 backdrop-blur-md z-30">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.location.hash = '#/user/dashboard'}
            className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white text-xl font-bold tracking-tight">Edit Profile</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2.5 bg-zinc-900 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-zinc-800 active:scale-95 transition-all"
          >
            Preview
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-premium-green text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-emerald-500/10 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? "SAVING..." : "SAVE"}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 space-y-10 max-w-md mx-auto w-full pb-24">
        {saveStatus === 'success' && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-emerald-400 text-[11px] font-black uppercase tracking-widest text-center animate-fade-in">
            Changes saved instantly! Returning to dashboard...
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-400 text-[11px] font-black uppercase tracking-widest text-center animate-fade-in">
            Update failed. Please check minimum requirements.
          </div>
        )}

        <ProfileImageManager 
          images={profileData.profile_images} 
          onChange={(newImgs) => setProfileData({ ...profileData, profile_images: newImgs })} 
        />

        <div className="h-px bg-zinc-900" />

        <EditProfileForm 
          data={profileData} 
          setData={setProfileData} 
        />
      </main>

      <ProfilePreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        data={profileData}
      />

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    </div>
  );
};

export default EditProfilePage;
