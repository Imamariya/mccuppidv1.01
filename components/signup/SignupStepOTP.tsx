import React, { useState, useEffect } from 'react';
import ErrorMessage from '../ErrorMessage';

interface SignupStepOTPProps {
  email: string;
  name: string;
  password: string;
  onSuccess: () => void;
  onBack: () => void;
}

const SignupStepOTP: React.FC<SignupStepOTPProps> = ({
  email,
  name,
  password,
  onSuccess,
  onBack
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const { authService } = await import('../../services/authService');
      await authService.verifyOTPAndRegister(email, otp, name, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError(null);
    setCanResend(false);
    setResendTimer(60);

    try {
      const { authService } = await import('../../services/authService');
      await authService.sendOTP(email);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
      setCanResend(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Verify Your Email</h2>
        <p className="text-zinc-400 text-sm">
          We've sent a 6-digit code to <span className="text-emerald-500">{email}</span>
        </p>
        <p className="text-zinc-500 text-xs mt-3 px-4 py-2 bg-zinc-900 rounded-lg">
          💡 <strong>Testing:</strong> Open browser console (F12) to see your verification code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center block">
            Enter Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(value);
            }}
            className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 rounded-xl focus:border-emerald-500 outline-none transition-all text-center text-2xl font-mono tracking-widest"
            placeholder="000000"
            maxLength={6}
          />
        </div>

        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full py-4 bg-premium-green rounded-xl font-bold text-white tracking-widest shadow-lg shadow-emerald-950/20 active:scale-[0.98] disabled:opacity-50 transition-all flex justify-center items-center gap-2"
        >
          {isLoading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
          VERIFY & CONTINUE
        </button>
      </form>

      <div className="text-center space-y-2">
        <p className="text-zinc-500 text-sm">
          Didn't receive the code?
        </p>
        {canResend ? (
          <button
            onClick={handleResendOTP}
            className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors"
          >
            Resend Code
          </button>
        ) : (
          <p className="text-zinc-600 text-sm">
            Resend in {resendTimer}s
          </p>
        )}
      </div>

      <button
        onClick={onBack}
        className="w-full py-3 bg-zinc-800 rounded-xl font-medium text-zinc-300 hover:bg-zinc-700 transition-all"
      >
        ← Back to Account Setup
      </button>
    </div>
  );
};

export default SignupStepOTP;