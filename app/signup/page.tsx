
import React, { useState, useEffect } from 'react';
import SignupProgress from '../../components/signup/SignupProgress';
import SignupStepAccount from '../../components/signup/SignupStepAccount';
import SignupStepBasic from '../../components/signup/SignupStepBasic';
import SignupStepRelationship from '../../components/signup/SignupStepRelationship';
import SignupStepPhotos from '../../components/signup/SignupStepPhotos';
import SignupStepSelfie from '../../components/signup/SignupStepSelfie';
import { profileService, CompleteProfilePayload } from '../../services/profileService';

const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profileData, setProfileData] = useState<Partial<CompleteProfilePayload>>({});

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const nextStep = () => setStep(s => s + 1);

  const handleStepComplete = (data: Partial<CompleteProfilePayload>) => {
    setProfileData(prev => ({ ...prev, ...data }));
    nextStep();
  };

  const handleFinalSubmit = async (selfieUrl: string) => {
    const finalPayload: CompleteProfilePayload = {
      ...profileData,
      verification_selfie_url: selfieUrl,
    } as CompleteProfilePayload;

    try {
      await profileService.completeProfile(finalPayload);
      setIsSubmitted(true);
    } catch (err) {
      alert("Verification submission failed. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-white text-3xl font-brand italic mb-4">MalluCupid</h2>
        <div className="space-y-4 max-w-xs">
          <p className="text-zinc-300 text-lg font-semibold">Profile submitted for verification!</p>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Our team is reviewing your selfie. Your journey to finding a real Mallu heart begins soon.
          </p>
          <button 
            onClick={() => window.location.hash = '#/login'}
            className="w-full py-4 mt-8 bg-premium-green rounded-xl text-white font-bold tracking-widest"
          >
            RETURN TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1: return <SignupStepAccount onSuccess={nextStep} />;
      case 2: return <SignupStepBasic onNext={handleStepComplete} />;
      case 3: return <SignupStepRelationship onNext={handleStepComplete} />;
      case 4: return <SignupStepPhotos onNext={urls => handleStepComplete({ profile_images: urls })} />;
      case 5: return <SignupStepSelfie onComplete={handleFinalSubmit} />;
      default: return null;
    }
  };

  const stepTitles = [
    "Create Account",
    "Basic Details",
    "Relationships",
    "Profile Photos",
    "Verification"
  ];

  return (
    <div className={`relative min-h-screen w-full flex flex-col bg-zinc-950 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 px-8 pt-10 pb-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 
            className="text-white text-2xl font-brand italic cursor-pointer"
            onClick={() => window.location.hash = '#/'}
          >
            MalluCupid
          </h1>
          {step > 1 && (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-white"
            >Back</button>
          )}
        </div>
        
        <div className="space-y-1">
          <h2 className="text-white text-xl font-bold tracking-tight">{stepTitles[step-1]}</h2>
          <SignupProgress step={step} totalSteps={5} />
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col px-8 pb-12 pt-4">
        <div className="w-full max-w-sm mx-auto">
          {renderStep()}
          
          {step === 1 && (
             <footer className="text-center pt-8">
              <p className="text-zinc-500 text-xs">
                Already have an account?{' '}
                <button 
                  onClick={() => window.location.hash = '#/login'}
                  className="text-emerald-400 font-bold"
                >Login</button>
              </p>
            </footer>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
    </div>
  );
};

export default SignupPage;
