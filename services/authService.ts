import { otpStore, generateOTP, cleanupExpiredOTPs } from '../lib/otpStore';

interface LoginResponse {
  token: string;
  role: 'user' | 'admin';
}

interface RegisterResponse {
  success: boolean;
  message?: string;
}

interface OTPResponse {
  success: boolean;
  message?: string;
}

// Get API base URL from environment or use default
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:5000';

// Fallback to Next.js API routes if backend not available
const NEXT_API_BASE = '';

// Test credentials for mock mode (when backend not available)
const MOCK_USERS = [
  { email: 'user@user.com', password: 'User@123', role: 'user' as const },
  { email: 'admin@admin.com', password: 'Admin@123', role: 'admin' as const },
  { email: 'admin@mallucupid.com', password: 'admin123', role: 'admin' as const },
  { email: 'user@example.com', password: 'user123', role: 'user' as const }
];

/**
 * Check if backend server is available
 */
async function isBackendAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

let backendAvailable: boolean | null = null;

export const authService = {
  /**
   * Login with email and password
   * Tries Express backend first, falls back to Next.js API, then mock
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Check backend availability on first call
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
      console.log(`[Auth] Express backend available: ${backendAvailable}`);
    }

    try {
      // Try Express backend first
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('mallucupid_token', data.token);
          localStorage.setItem('mallucupid_role', data.role || 'user');
          return data;
        } else if (response.status === 401) {
          throw new Error('Invalid email or password');
        } else {
          throw new Error('Backend login failed');
        }
      }

      // Fallback to Next.js API route
      const nextResponse = await fetch(`${NEXT_API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (nextResponse.ok) {
        const data = await nextResponse.json();
        localStorage.setItem('mallucupid_token', data.token);
        localStorage.setItem('mallucupid_role', data.role || 'user');
        return data;
      }

      // Fallback to mock
      throw new Error('');
    } catch (error) {
      // Use mock data
      console.log('[Auth] Using mock authentication (backend not connected)');
      await new Promise(resolve => setTimeout(resolve, 800));

      const user = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const response: LoginResponse = {
        token: `mock_jwt_${user.role}_${Date.now()}`,
        role: user.role
      };

      localStorage.setItem('mallucupid_token', response.token);
      localStorage.setItem('mallucupid_role', response.role);

      return response;
    }
  },

  /**
   * Send OTP to email for verification
   */
  async sendOTP(email: string): Promise<OTPResponse> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (response.ok) {
          return await response.json();
        }
        throw new Error('Backend OTP send failed');
      }

      // Fallback to Next.js
      const nextResponse = await fetch(`${NEXT_API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (nextResponse.ok) {
        return await nextResponse.json();
      }
      throw new Error('');
    } catch (error) {
      // Fallback to mock
      console.log('[Auth] Using mock OTP');
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Valid email is required');
      }

      const otp = generateOTP();
      const expires = Date.now() + 10 * 60 * 1000;
      otpStore[email] = { otp, expires };

      console.log(`[MOCK] OTP for ${email}: ${otp}`);

      return {
        success: true,
        message: 'OTP sent to your email'
      };
    }
  },

  /**
   * Verify OTP and register user
   */
  async verifyOTPAndRegister(
    email: string,
    otp: string,
    name: string,
    password: string
  ): Promise<RegisterResponse> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, name, password })
        });

        if (response.ok) {
          return await response.json();
        }
        throw new Error('Backend OTP verification failed');
      }

      // Fallback to Next.js
      const nextResponse = await fetch(`${NEXT_API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, name, password })
      });

      if (nextResponse.ok) {
        return await nextResponse.json();
      }
      throw new Error('');
    } catch (error) {
      // Fallback to mock
      console.log('[Auth] Using mock OTP verification');
      await new Promise(resolve => setTimeout(resolve, 500));

      cleanupExpiredOTPs();

      const storedOTP = otpStore[email];
      if (!storedOTP) {
        throw new Error('No OTP found for this email');
      }

      if (Date.now() > storedOTP.expires) {
        delete otpStore[email];
        throw new Error('OTP has expired');
      }

      if (storedOTP.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      delete otpStore[email];

      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already exists');
      }

      MOCK_USERS.push({ email, password, role: 'user' });

      return { success: true };
    }
  },

  /**
   * Register new user
   */
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
          return await response.json();
        }
        throw new Error('Backend registration failed');
      }

      const nextResponse = await fetch(`${NEXT_API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (nextResponse.ok) {
        return await nextResponse.json();
      }
      throw new Error('');
    } catch (error) {
      console.log('[Auth] Using mock registration');
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already exists');
      }

      return { success: true };
    }
  },

  logout() {
    localStorage.removeItem('mallucupid_token');
    localStorage.removeItem('mallucupid_role');
    window.location.hash = '#/login';
  },

  getToken() {
    return localStorage.getItem('mallucupid_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<OTPResponse> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        return await response.json();
      }

      const nextResponse = await fetch(`${NEXT_API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (nextResponse.ok) {
        return await nextResponse.json();
      }
      throw new Error('');
    } catch (error) {
      console.log('[Auth] Using mock password reset request');
      await new Promise(resolve => setTimeout(resolve, 800));

      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return {
          success: true,
          message: "If this email exists, you'll receive a reset link shortly"
        };
      }

      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const resetData = {
        email,
        token: resetToken,
        expiresAt: Date.now() + 15 * 60 * 1000
      };

      sessionStorage.setItem(`reset_${resetToken}`, JSON.stringify(resetData));

      console.log(`[MOCK] Sending reset link to ${email}:`);
      console.log(`Reset link: /reset-password?token=${resetToken}`);

      return {
        success: true,
        message: 'Reset link sent to your email'
      };
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(resetToken: string, newPassword: string): Promise<OTPResponse> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: resetToken, newPassword })
        });

        return await response.json();
      }

      const nextResponse = await fetch(`${NEXT_API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: newPassword })
      });

      if (nextResponse.ok) {
        return await nextResponse.json();
      }
      throw new Error('');
    } catch (error) {
      console.log('[Auth] Using mock password reset');
      await new Promise(resolve => setTimeout(resolve, 800));

      const resetDataStr = sessionStorage.getItem(`reset_${resetToken}`);

      if (!resetDataStr) {
        return {
          success: false,
          message: 'Invalid or expired reset link'
        };
      }

      try {
        const resetData = JSON.parse(resetDataStr);

        if (Date.now() > resetData.expiresAt) {
          sessionStorage.removeItem(`reset_${resetToken}`);
          return {
            success: false,
            message: 'Reset link has expired. Please request a new one.'
          };
        }

        const userIndex = MOCK_USERS.findIndex(
          u => u.email.toLowerCase() === resetData.email.toLowerCase()
        );

        if (userIndex !== -1) {
          MOCK_USERS[userIndex].password = newPassword;
          console.log(`[MOCK] Password updated for ${resetData.email}`);
        }

        sessionStorage.removeItem(`reset_${resetToken}`);

        return {
          success: true,
          message: 'Password reset successfully'
        };
      } catch (parseError) {
        return {
          success: false,
          message: 'Failed to reset password'
        };
      }
    }
  },
};
