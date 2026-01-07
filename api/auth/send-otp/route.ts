import { NextResponse } from 'next/server';
import { otpStore, generateOTP, cleanupExpiredOTPs } from '../../../lib/otpStore';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Clean up expired OTPs
    cleanupExpiredOTPs();

    // Generate OTP
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore[email] = { otp, expires };

    // PRODUCTION NOTE: Integrate with email service like SendGrid, AWS SES, etc.
    console.log(`OTP for ${email}: ${otp}`); // For development only

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}