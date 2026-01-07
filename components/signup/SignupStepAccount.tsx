
import React, { useState, useMemo } from 'react';
import PasswordToggle from '../PasswordToggle';
import ErrorMessage from '../ErrorMessage';
import { authService } from '../../services/authService';

interface SignupStepAccountProps {
  onSuccess: (data: { email: string; password: string; name: string }) => void;
}

const SignupStepAccount: React.FC<SignupStepAccountProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!formData.password) return 0;
    let s = 0;
    if (formData.password.length >= 8) s++;
    if (/[A-Z]/.test(formData.password)) s++;
    if (/[0-9]/.test(formData.password)) s++;
    if (/[^A-Za-z0-9]/.test(formData.password)) s++;
    return s;
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Fill in all fields"); return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Enter a valid email"); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match"); return;
    }
    if (!formData.acceptedTerms) {
      setError("Accept terms to continue"); return;
    }

    setIsLoading(true);
    try {
      await authService.sendOTP(formData.email);
      onSuccess({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:border-emerald-500 outline-none transition-all"
          placeholder="Enter your full name"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</label>
        <input 
          type="email" 
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:border-emerald-500 outline-none transition-all"
          placeholder="email@example.com"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:border-emerald-500 outline-none transition-all pr-12"
            placeholder="Min 8 characters"
          />
          <PasswordToggle isVisible={showPassword} toggle={() => setShowPassword(!showPassword)} />
        </div>
        <div className="flex gap-1 h-1 mt-1">
          {[1,2,3,4].map(i => <div key={i} className={`flex-1 rounded-full ${passwordStrength >= i ? 'bg-emerald-500' : 'bg-zinc-800'}`} />)}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Confirm Password</label>
        <input 
          type={showPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl focus:border-emerald-500 outline-none transition-all"
        />
      </div>
      <div className="flex items-start gap-3 py-2">
        <input 
          type="checkbox" 
          id="terms"
          checked={formData.acceptedTerms}
          onChange={e => setFormData({...formData, acceptedTerms: e.target.checked})}
          className="mt-1 accent-emerald-500"
        />
        <label htmlFor="terms" className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed cursor-pointer">
          I accept the <span className="text-emerald-500">Terms of Service</span> and <span className="text-emerald-500">Privacy Policy</span>.
        </label>
      </div>
      {error && <ErrorMessage message={error} />}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-4 bg-premium-green rounded-xl font-bold text-white tracking-widest shadow-lg shadow-emerald-950/20 active:scale-[0.98] disabled:opacity-50 transition-all flex justify-center items-center gap-2"
      >
        {isLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
        CONTINUE
      </button>
    </form>
  );
};

export default SignupStepAccount;
