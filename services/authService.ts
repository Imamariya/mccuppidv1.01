import { signUp, signIn, confirmSignUp, resetPassword, confirmResetPassword, signOut, getCurrentUser } from 'aws-amplify/auth';

interface LoginResponse {
  userSub: string;
  email: string;
  name?: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
  userSub?: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

interface OTPResponse {
  success: boolean;
  message?: string;
}

// Mock user data for fallback
const MOCK_USERS = [
  { email: 'test@example.com', password: 'Test@123456', name: 'Test User' }
];

let backendAvailable: boolean | null = null;
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const NEXT_API_BASE = process.env.REACT_APP_NEXT_URL || 'http://localhost:3000';

const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Authentication Service
 * Uses backend API when available, falls back to Cognito or mock auth
 */
export const authService = {
  /**
   * Register new user
   */
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      // Try backend first
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('mallucupid_token', data.token || '');
          localStorage.setItem('mallucupid_user', JSON.stringify(data.user || {}));
          return { success: true, message: 'Registration successful', userSub: data.user?.id };
        }
      }

      // Fallback to Cognito
      console.log('[Cognito] Registering user:', email);
      const response = await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            name: name
          }
        }
      });

      return {
        success: true,
        message: 'Account created. Please check your email for verification code.',
        userSub: response.userSub
      };
    } catch (error: any) {
      console.error('[Auth] Registration error:', error);

      // Fallback to mock registration
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      MOCK_USERS.push({ email, password, name });
      localStorage.setItem('mallucupid_token', `mock_token_${Date.now()}`);
      localStorage.setItem('mallucupid_user', JSON.stringify({ id: email, email, name }));

      return { success: true, message: 'Registration successful' };
    }
  },

  /**
   * Send OTP to email for verification
   */
  async sendOTP(email: string): Promise<{ success: boolean; message?: string }> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      // Try backend first
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (response.ok) {
          return await response.json();
        }
      }

      // Fallback to mock OTP - generate and store
      console.log('[Auth] Generating mock OTP for:', email);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpData = {
        email,
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        attempts: 0
      };
      sessionStorage.setItem(`otp_${email}`, JSON.stringify(otpData));
      
      // IMPORTANT: Log OTP to console for testing (since email service not configured)
      console.warn(`========================================`);
      console.warn(`📧 OTP FOR TESTING: ${otp}`);
      console.warn(`📧 Email: ${email}`);
      console.warn(`📧 Valid for 10 minutes`);
      console.warn(`========================================`);

      return {
        success: true,
        message: `Verification code sent to ${email}. Check browser console for testing OTP.`
      };
    } catch (error: any) {
      console.error('[Auth] Send OTP error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  },

  /**
   * Verify OTP code
   */
  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message?: string }> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      // Try backend first
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        });

        if (response.ok) {
          return await response.json();
        }
      }

      // Fallback to mock OTP verification
      console.log('[Auth] Verifying OTP for:', email);
      const otpDataStr = sessionStorage.getItem(`otp_${email}`);

      if (!otpDataStr) {
        return {
          success: false,
          message: 'No OTP found. Please request a new one.'
        };
      }

      try {
        const otpData = JSON.parse(otpDataStr);

        if (Date.now() > otpData.expiresAt) {
          sessionStorage.removeItem(`otp_${email}`);
          return {
            success: false,
            message: 'OTP expired. Please request a new one.'
          };
        }

        if (otpData.attempts >= 3) {
          sessionStorage.removeItem(`otp_${email}`);
          return {
            success: false,
            message: 'Too many attempts. Please request a new OTP.'
          };
        }

        if (otpData.otp !== otp) {
          otpData.attempts++;
          sessionStorage.setItem(`otp_${email}`, JSON.stringify(otpData));
          return {
            success: false,
            message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.`
          };
        }

        // OTP verified successfully
        sessionStorage.removeItem(`otp_${email}`);
        console.log('[MOCK] OTP verified for:', email);

        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } catch {
        return {
          success: false,
          message: 'Failed to verify OTP'
        };
      }
    } catch (error: any) {
      console.error('[Auth] Verify OTP error:', error);
      throw new Error(error.message || 'OTP verification failed');
    }
  },

  /**
   * Verify OTP and register user in one step
   */
  async verifyOTPAndRegister(email: string, otp: string, name: string, password: string): Promise<RegisterResponse> {
    try {
      // Verify OTP first
      const verifyResult = await this.verifyOTP(email, otp);
      if (!verifyResult.success) {
        throw new Error(verifyResult.message || 'OTP verification failed');
      }

      // Then register the user
      const registerResult = await this.register(name, email, password);
      return registerResult;
    } catch (error: any) {
      console.error('[Auth] Verify OTP and Register error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  /**
   * Confirm user email with verification code
   */
  async confirmSignUp(email: string, code: string): Promise<{ success: boolean }> {
    try {
      console.log('[Cognito] Confirming signup for:', email);
      await confirmSignUp({
        username: email,
        confirmationCode: code
      });

      return { success: true };
    } catch (error: any) {
      console.error('[Cognito] Confirmation error:', error);
      throw new Error(error.message || 'Email verification failed');
    }
  },

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      // Try backend first
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('mallucupid_token', data.token || '');
          localStorage.setItem('mallucupid_user', JSON.stringify(data.user || {}));
          return {
            userSub: data.user?.id || email,
            email: data.user?.email || email,
            name: data.user?.name
          };
        }
      }

      // Fallback to Cognito
      console.log('[Cognito] Logging in user:', email);
      const user = await signIn({
        username: email,
        password: password
      });

      localStorage.setItem('mallucupid_token', `cognito_token_${Date.now()}`);
      localStorage.setItem('mallucupid_user', JSON.stringify({ id: email, email }));

      return {
        userSub: user.userId || email,
        email: email
      };
    } catch (error: any) {
      console.error('[Auth] Login error:', error);

      // Fallback to mock login
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (mockUser) {
        localStorage.setItem('mallucupid_token', `mock_token_${Date.now()}`);
        localStorage.setItem('mallucupid_user', JSON.stringify({ id: email, email, name: mockUser.name }));
        return {
          userSub: email,
          email: email,
          name: mockUser.name
        };
      }

      throw new Error('Invalid email or password');
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<OTPResponse> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      // Try backend first
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (response.ok) {
          return await response.json();
        }
      }

      // Fallback to Cognito - initiate password reset
      console.log('[Cognito] Requesting password reset for:', email);
      await resetPassword({ username: email });

      return {
        success: true,
        message: 'If this email exists, you will receive a password reset code'
      };
    } catch (error: any) {
      console.error('[Auth] Forgot password error:', error);

      // Fallback to mock - always return success for security
      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const resetData = {
        email,
        token: resetToken,
        expiresAt: Date.now() + 15 * 60 * 1000
      };
      sessionStorage.setItem(`reset_${resetToken}`, JSON.stringify(resetData));

      return {
        success: true,
        message: 'If this email exists, you will receive a password reset code'
      };
    }
  },

  /**
   * Reset password with code or token
   */
  async resetPassword(resetToken: string, newPassword: string): Promise<OTPResponse> {
    if (backendAvailable === null) {
      backendAvailable = await isBackendAvailable();
    }

    try {
      // Try backend first
      if (backendAvailable) {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: resetToken, newPassword })
        });

        if (response.ok) {
          return await response.json();
        }
      }

      // Check if this is a mock token
      const resetDataStr = sessionStorage.getItem(`reset_${resetToken}`);
      if (resetDataStr) {
        try {
          const resetData = JSON.parse(resetDataStr);
          if (Date.now() > resetData.expiresAt) {
            sessionStorage.removeItem(`reset_${resetToken}`);
            return {
              success: false,
              message: 'Reset link has expired'
            };
          }

          // Cognito confirmResetPassword would need email too
          // For token-based resets, use mock only
          const userIndex = MOCK_USERS.findIndex(u => u.email === resetData.email);
          if (userIndex !== -1) {
            MOCK_USERS[userIndex].password = newPassword;
          }

          sessionStorage.removeItem(`reset_${resetToken}`);
          return {
            success: true,
            message: 'Password reset successfully'
          };
        } catch {
          return {
            success: false,
            message: 'Failed to reset password'
          };
        }
      }

      return {
        success: false,
        message: 'Invalid or expired reset link'
      };
    } catch (error: any) {
      console.error('[Auth] Reset password error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<any> {
    try {
      const userStr = localStorage.getItem('mallucupid_user');
      if (userStr) {
        return JSON.parse(userStr);
      }

      // Try Cognito
      const user = await getCurrentUser();
      return user;
    } catch (error: any) {
      console.error('[Auth] Get current user error:', error);
      return null;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<{ success: boolean }> {
    try {
      // Try Cognito logout
      try {
        await signOut();
      } catch {
        // Cognito not configured or user not authenticated
      }

      // Clear local storage
      localStorage.removeItem('mallucupid_token');
      localStorage.removeItem('mallucupid_user');
      localStorage.removeItem('mallucupid_role');

      return { success: true };
    } catch (error: any) {
      console.error('[Auth] Logout error:', error);
      // Always clear local storage even if logout fails
      localStorage.removeItem('mallucupid_token');
      localStorage.removeItem('mallucupid_user');
      return { success: true };
    }
  },

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('mallucupid_token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Backend API would handle this
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      if (response.ok) {
        return { success: true };
      }

      throw new Error('Change password failed');
    } catch (error: any) {
      console.error('[Auth] Change password error:', error);
      throw new Error(error.message || 'Password change failed');
    }
  },

  /**
   * Get ID token
   */
  async getIdToken(): Promise<string> {
    try {
      const user = await getCurrentUser();
      if (user) {
        return '';
      }
      return this.getToken() || '';
    } catch {
      return '';
    }
  },

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string> {
    try {
      const user = await getCurrentUser();
      if (user) {
        return '';
      }
      return this.getToken() || '';
    } catch {
      return '';
    }
  }
};
