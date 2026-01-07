
import React, { useState, useMemo } from 'react';
import PasswordToggle from './PasswordToggle';
import ErrorMessage from './ErrorMessage';
import { authService } from '../services/authService';

const SignupForm: React.FC = () => {
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
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  }, [formData.password]);

  const strengthColor = [
    'bg-zinc-800',
    'bg-red-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-emerald-500'
  ][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validations
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.acceptedTerms) {
      setError("Please accept the Terms & Privacy Policy");
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(formData.name, formData.email, formData.password);
      // Redirect to login on success
      window.location.hash = '#/login';
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-1">
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Enter your name"
          className="w-full bg-zinc-950/50 border border-zinc-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-700 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-1">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="name@example.com"
          className="w-full bg-zinc-950/50 border border-zinc-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-700 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Min. 8 characters"
            className="w-full bg-zinc-950/50 border border-zinc-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-700 text-sm pr-12"
            required
          />
          <PasswordToggle 
            isVisible={showPassword} 
            toggle={() => setShowPassword(!showPassword)} 
          />
        </div>
        {/* Strength Indicator */}
        <div className="flex gap-1 pt-1 h-1 px-1">
          {[1,2,3,4].map((step) => (
            <div key={step} className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= step ? strengthColor : 'bg-zinc-800'}`} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-1">
          Confirm Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          placeholder="Repeat password"
          className="w-full bg-zinc-950/50 border border-zinc-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-700 text-sm"
          required
        />
      </div>

      <div className="flex items-start space-x-3 px-1">
        <div className="relative flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            checked={formData.acceptedTerms}
            onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})}
            className="w-4 h-4 bg-zinc-950 border border-zinc-800 rounded accent-emerald-500 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <label htmlFor="terms" className="text-[11px] text-zinc-500 leading-tight">
          I accept the <button type="button" className="text-emerald-500">Terms</button> & <button type="button" className="text-emerald-500">Privacy Policy</button>
        </label>
      </div>

      {error && <ErrorMessage message={error} />}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-xl bg-premium-green text-white font-bold tracking-widest shadow-lg shadow-emerald-950/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3 mt-4"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>CREATING...</span>
          </>
        ) : (
          "CREATE ACCOUNT"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
