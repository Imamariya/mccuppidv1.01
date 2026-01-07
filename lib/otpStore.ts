// Shared OTP store for development
export const otpStore: { [email: string]: { otp: string; expires: number } } = {};

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function cleanupExpiredOTPs() {
  const now = Date.now();
  Object.keys(otpStore).forEach(email => {
    if (otpStore[email].expires < now) {
      delete otpStore[email];
    }
  });
}