import React, { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import { authService } from '../services/authService';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

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
        setSuccess(true);
        setEmail('');
        // Show success message for 5 seconds then redirect
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 5000);
      } else {
        setError(response.message || "Failed to send reset link");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process request");
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
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
              <p className="text-green-100 text-sm font-medium text-center">
                ✓ Check your email for the reset link. Redirecting to login...
              </p>
            </div>
          )}

          {/* Error Message */}
          <ErrorMessage message={error} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
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

        {/* Footer */}
        <p className="text-center text-zinc-500 text-xs mt-6">
          Don't have an account?{' '}
          <a
            href="#/signup"
            className="text-pink-500 hover:text-pink-400 font-semibold transition"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
