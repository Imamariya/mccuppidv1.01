
import React, { useState } from 'react';
import PasswordToggle from './PasswordToggle';
import ErrorMessage from './ErrorMessage';
import { authService } from '../services/authService';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.role === 'admin') {
        window.location.hash = '#/admin/dashboard';
      } else {
        window.location.hash = '#/user/dashboard';
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full bg-zinc-950/50 border border-zinc-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-600"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between pl-1">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Password
          </label>
          <a
            href="#/forgot-password"
            className="text-[10px] font-bold text-emerald-500/80 uppercase hover:text-emerald-400 transition-colors"
          >
            Forgot?
          </a>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-zinc-950/50 border border-zinc-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-600"
            required
          />
          <PasswordToggle 
            isVisible={showPassword} 
            toggle={() => setShowPassword(!showPassword)} 
          />
        </div>
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
            <span>AUTHENTICATING...</span>
          </>
        ) : (
          "LOGIN"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
