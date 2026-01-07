import { NextResponse } from 'next/server';
import { otpStore, cleanupExpiredOTPs } from '../../../lib/otpStore';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Clean up expired OTPs
    cleanupExpiredOTPs();

    const storedOTP = otpStore[email];

    if (!storedOTP) {
      return NextResponse.json(
        { error: 'No OTP found for this email' },
        { status: 400 }
      );
    }

    if (Date.now() > storedOTP.expires) {
      delete otpStore[email];
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    if (storedOTP.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // OTP verified successfully
    delete otpStore[email];

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}