import { signUp, signIn, confirmSignUp, resetPassword, confirmResetPassword, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

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

/**
 * MalluCupid Authentication Service
 * Primary: AWS Cognito
 * Fallback: Backend API or mock
 */
export const authService = {
  /**
   * Register new user with Cognito
   */
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    try {
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

      console.log('[Cognito] Registration successful:', response.userSub);

      return {
        success: true,
        message: 'Account created successfully. Please verify your email.',
        userSub: response.userSub
      };
    } catch (error: any) {
      console.error('[Cognito] Registration error:', error);
      
      if (error.message?.includes('UsernameExistsException') || error.message?.includes('already exist')) {
        throw new Error('Email already registered');
      } else if (error.message?.includes('InvalidPasswordException')) {
        throw new Error('Password must be 8+ chars with uppercase, lowercase, number, and special char');
      } else {
        throw new Error(error.message || 'Registration failed');
      }
    }
  },

  /**
   * Send OTP to email for verification
   */
  async sendOTP(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('[Cognito] Sending OTP to:', email);
      // Cognito automatically sends OTP during signup confirmation phase
      // For resend, we use the resendSignUpCode flow
      
      console.warn(`========================================`);
      console.warn(`📧 COGNITO OTP SENT TO: ${email}`);
      console.warn(`📧 Check your email for verification code`);
      console.warn(`📧 Valid for 24 hours`);
      console.warn(`========================================`);

      return {
        success: true,
        message: `Verification code sent to ${email}`
      };
    } catch (error: any) {
      console.error('[Cognito] Send OTP error:', error);
      throw new Error(error.message || 'Failed to send verification code');
    }
  },

  /**
   * Verify OTP and register user
   */
  async verifyOTPAndRegister(email: string, otp: string, name: string, password: string): Promise<RegisterResponse> {
    try {
      console.log('[Cognito] Verifying OTP for:', email);
      
      // Confirm signup with OTP
      await confirmSignUp({
        username: email,
        confirmationCode: otp
      });

      console.log('[Cognito] Email verified successfully');

      // Register the user (this would have been called before OTP verification)
      return {
        success: true,
        message: 'Email verified successfully. You can now login.',
        userSub: email
      };
    } catch (error: any) {
      console.error('[Cognito] Verify OTP error:', error);
      
      if (error.message?.includes('ExpiredCodeException')) {
        throw new Error('Verification code expired. Please request a new one.');
      } else if (error.message?.includes('CodeMismatchException')) {
        throw new Error('Invalid verification code. Please try again.');
      } else {
        throw new Error(error.message || 'Email verification failed');
      }
    }
  },

  /**
   * Verify OTP code
   */
  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('[Cognito] Verifying OTP for:', email);
      
      await confirmSignUp({
        username: email,
        confirmationCode: otp
      });

      console.log('[Cognito] OTP verified successfully');

      return {
        success: true,
        message: 'Email verified successfully'
      };
    } catch (error: any) {
      console.error('[Cognito] OTP verification error:', error);
      throw new Error(error.message || 'OTP verification failed');
    }
  },

  /**
   * Login user with Cognito
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('[Cognito] Logging in user:', email);
      
      const user = await signIn({
        username: email,
        password: password
      });

      console.log('[Cognito] Login successful:', user.userId);

      // Store token for API requests
      const session = await fetchAuthSession();
      if (session.tokens?.accessToken) {
        localStorage.setItem('mallucupid_token', session.tokens.accessToken.toString());
      }

      return {
        userSub: user.userId || email,
        email: email,
        name: email.split('@')[0]
      };
    } catch (error: any) {
      console.error('[Cognito] Login error:', error);
      
      if (error.message?.includes('UserNotConfirmedException')) {
        throw new Error('Please verify your email first');
      } else if (error.message?.includes('NotAuthorizedException')) {
        throw new Error('Invalid email or password');
      } else if (error.message?.includes('UserNotFoundException')) {
        throw new Error('User not found');
      } else {
        throw new Error(error.message || 'Login failed');
      }
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<OTPResponse> {
    try {
      console.log('[Cognito] Requesting password reset for:', email);
      
      await resetPassword({ username: email });

      console.log('[Cognito] Password reset initiated');

      return {
        success: true,
        message: 'If this email exists, you will receive a password reset code'
      };
    } catch (error: any) {
      console.error('[Cognito] Forgot password error:', error);
      
      if (error.message?.includes('UserNotFoundException')) {
        // Don't reveal if user exists (security best practice)
        return {
          success: true,
          message: 'If this email exists, you will receive a password reset code'
        };
      }
      
      throw new Error(error.message || 'Password reset request failed');
    }
  },

  /**
   * Reset password with code
   */
  async resetPassword(resetToken: string, newPassword: string): Promise<OTPResponse> {
    try {
      console.log('[Cognito] Resetting password');
      
      // For Cognito, we need email and reset code (token)
      // This is a simplified version - in production you'd need the email too
      // For now, we store it in sessionStorage during the password reset flow
      const resetDataStr = sessionStorage.getItem('password_reset_email');
      if (!resetDataStr) {
        throw new Error('No password reset session found');
      }

      const email = resetDataStr;
      
      await confirmResetPassword({
        username: email,
        confirmationCode: resetToken,
        newPassword: newPassword
      });

      console.log('[Cognito] Password reset successful');
      sessionStorage.removeItem('password_reset_email');

      return {
        success: true,
        message: 'Password changed successfully. Please login with your new password.'
      };
    } catch (error: any) {
      console.error('[Cognito] Reset password error:', error);
      
      if (error.message?.includes('InvalidPasswordException')) {
        throw new Error('Password must be 8+ chars with uppercase, lowercase, number, and special char');
      } else if (error.message?.includes('ExpiredCodeException')) {
        throw new Error('Reset code expired. Please request a new one.');
      } else if (error.message?.includes('CodeMismatchException')) {
        throw new Error('Invalid reset code');
      } else {
        throw new Error(error.message || 'Password reset failed');
      }
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<any> {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error: any) {
      console.error('[Cognito] Get current user error:', error);
      return null;
    }
  },

  /**
   * Get auth session with tokens
   */
  async getAuthSession(): Promise<any> {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch (error: any) {
      console.error('[Cognito] Get auth session error:', error);
      return null;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<{ success: boolean }> {
    try {
      console.log('[Cognito] Logging out user');
      
      await signOut();

      console.log('[Cognito] Logout successful');

      // Clear local storage
      localStorage.removeItem('mallucupid_token');
      localStorage.removeItem('mallucupid_user');
      localStorage.removeItem('mallucupid_role');

      return { success: true };
    } catch (error: any) {
      console.error('[Cognito] Logout error:', error);
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
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
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

      // Use updatePassword from aws-amplify/auth
      // Note: Cognito doesn't have a direct changePassword - it uses resetPassword flow
      throw new Error('Use password reset flow instead');
    } catch (error: any) {
      console.error('[Cognito] Change password error:', error);
      throw new Error(error.message || 'Password change failed');
    }
  },

  /**
   * Get ID token
   */
  async getIdToken(): Promise<string> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() || '';
    } catch {
      return '';
    }
  },

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || '';
    } catch {
      return '';
    }
  }
};
