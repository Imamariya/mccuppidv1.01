import { NextResponse } from 'next/server';

/**
 * POST /api/auth/forgot-password
 * Request password reset via email
 * 
 * Body: { email: string }
 * Response: { success: boolean; message: string }
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // PRODUCTION NOTE: This would:
    // 1. Check if user exists with this email
    // 2. Generate a secure reset token
    // 3. Store token in database with expiration (15 minutes)
    // 4. Send email with reset link via SendGrid

    // Mock implementation
    const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`[MOCK] Password reset requested for: ${email}`);
    console.log(`[MOCK] Reset token: ${resetToken}`);
    console.log(`[MOCK] Reset link: https://yourdomain.com/reset-password?token=${resetToken}`);

    return NextResponse.json({
      success: true,
      message: 'If this email exists, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
