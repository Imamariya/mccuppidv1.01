import React, { useState, useEffect } from 'react';
import PasswordToggle from './PasswordToggle';
import ErrorMessage from './ErrorMessage';
import { authService } from '../services/authService';

interface ResetPasswordFormProps {
  email?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email: initialEmail = '' }) => {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<'email' | 'code'>('email');

  useEffect(() => {
    // Get email from URL query params if not provided as prop
    if (!email) {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get('email');
      if (urlEmail) {
        setEmail(urlEmail);
      }
    }
  }, [email]);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain a number";
    if (!/[!@#$%^&*]/.test(pwd)) return "Password must contain a special character (!@#$%^&*)";
    return null;
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.requestPasswordReset(email);
      
      if (response.success) {
        setStage('code');
        setError(null);
      } else {
        setError(response.message || "Failed to send reset code");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!code) {
      setError("Please enter the verification code");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(email, code, password);
      
      if (response.success) {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
        setCode('');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 3000);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The code may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-orange-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-zinc-400 text-sm">
              {stage === 'email'
                ? 'Enter your email to receive a reset code'
                : 'Enter the code and your new password'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
              <p className="text-green-100 text-sm font-medium text-center">
                ✓ Password reset successful. Redirecting to login...
              </p>
            </div>
          )}

          {/* Error Message */}
          <ErrorMessage message={error} />

          {/* Email Stage */}
          {stage === 'email' && (
            <form onSubmit={handleSubmitEmail} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-bold rounded-lg transition duration-300"
              >
                {isLoading ? 'Sending...' : 'Send Reset Code'}
              </button>

              <div className="text-center">
                <a
                  href="#/login"
                  className="text-zinc-400 hover:text-pink-400 text-sm transition"
                >
                  Back to Login
                </a>
              </div>
            </form>
          )}

          {/* Code & Password Stage */}
          {stage === 'code' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* Verification Code */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
                  disabled={isLoading}
                />
                <p className="text-xs text-zinc-400">Check your email for the code</p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition pr-12"
                    disabled={isLoading}
                  />
                  <PasswordToggle
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition pr-12"
                    disabled={isLoading}
                  />
                  <PasswordToggle
                    showPassword={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-bold rounded-lg transition duration-300"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStage('email');
                    setError(null);
                  }}
                  className="text-zinc-400 hover:text-pink-400 text-sm transition"
                >
                  Use different email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <PasswordToggle
                  showPassword={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </div>
              <p className="text-xs text-zinc-500 pl-1">
                Min 8 chars, uppercase, lowercase, number, special char (!@#$%^&*)
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <PasswordToggle
                  showPassword={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => (window.location.hash = '#/login')}
              className="w-full py-2 text-zinc-400 hover:text-white font-medium transition"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
