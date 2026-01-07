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

const MOCK_USERS = [
  { email: 'user@user.com', password: 'User@123', role: 'user' as const },
  { email: 'admin@admin.com', password: 'Admin@123', role: 'admin' as const },
  { email: 'admin@mallucupid.com', password: 'admin123', role: 'admin' as const },
  { email: 'user@example.com', password: 'user123', role: 'user' as const }
];

export const authService = {
  /**
   * Simulated login logic for client-side environment.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

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
  },

  /**
   * Send OTP to email for verification.
   */
  async sendOTP(email: string): Promise<OTPResponse> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Valid email is required');
    }

    // Generate OTP
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore[email] = { otp, expires };

    // PRODUCTION NOTE: Integrate with email service like SendGrid, AWS SES, etc.
    console.log(`OTP for ${email}: ${otp}`); // For development only

    return {
      success: true,
      message: 'OTP sent to your email'
    };
  },

  /**
   * Verify OTP and complete registration.
   */
  async verifyOTPAndRegister(email: string, otp: string, name: string, password: string): Promise<RegisterResponse> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clean up expired OTPs
    cleanupExpiredOTPs();

    // Verify OTP
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

    // OTP verified successfully
    delete otpStore[email];

    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    // In production, this would save to database
    MOCK_USERS.push({
      email,
      password,
      role: 'user'
    });

    return { success: true };
  },

  /**
   * Simulated registration logic (kept for backward compatibility).
   */
  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (MOCK_USERS.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    return { success: true };
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
   * Request password reset via email
   * Sends reset link to user's email
   */
  async requestPasswordReset(email: string): Promise<OTPResponse> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user exists
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // For security, don't reveal if email exists
      return {
        success: true,
        message: "If this email exists, you'll receive a reset link shortly"
      };
    }

    // Generate a reset token (in production, this would be a unique secure token)
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store reset token with expiration (15 minutes)
    const resetData = {
      email,
      token: resetToken,
      expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
    };
    
    sessionStorage.setItem(`reset_${resetToken}`, JSON.stringify(resetData));

    // In production, send email with reset link
    console.log(`[MOCK] Sending reset link to ${email}:`);
    console.log(`Reset link: /reset-password?token=${resetToken}`);

    return {
      success: true,
      message: "Reset link sent to your email"
    };
  },

  /**
   * Reset password using reset token
   */
  async resetPassword(resetToken: string, newPassword: string): Promise<OTPResponse> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Verify reset token
    const resetDataStr = sessionStorage.getItem(`reset_${resetToken}`);
    
    if (!resetDataStr) {
      return {
        success: false,
        message: "Invalid or expired reset link"
      };
    }

    try {
      const resetData = JSON.parse(resetDataStr);

      // Check if token is expired
      if (Date.now() > resetData.expiresAt) {
        sessionStorage.removeItem(`reset_${resetToken}`);
        return {
          success: false,
          message: "Reset link has expired. Please request a new one."
        };
      }

      // In production, update user password in database
      const userIndex = MOCK_USERS.findIndex(
        u => u.email.toLowerCase() === resetData.email.toLowerCase()
      );

      if (userIndex !== -1) {
        MOCK_USERS[userIndex].password = newPassword;
        console.log(`[MOCK] Password updated for ${resetData.email}`);
      }

      // Clean up reset token
      sessionStorage.removeItem(`reset_${resetToken}`);

      return {
        success: true,
        message: "Password reset successfully"
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to reset password"
      };
    }
  }
};
