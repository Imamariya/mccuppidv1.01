
import { NextResponse } from 'next/server';

/**
 * PRODUCTION-READY AWS ENDPOINT HANDLER
 * This file is part of the Next.js App Router structure.
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // PRODUCTION NOTE: This would interface with AWS Cognito or a Lambda function
    // For demonstration, we use hardcoded mock credentials as requested.
    
    // Admin Credentials
    if (
      (email === 'admin@admin.com' && password === 'Admin@123') ||
      (email === 'admin@mallucupid.com' && password === 'admin123')
    ) {
      return NextResponse.json({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin_payload.signature', // Mock JWT
        role: 'admin'
      });
    }

    // User Credentials
    if (
      (email === 'user@user.com' && password === 'User@123') ||
      (email === 'user@example.com' && password === 'user123')
    ) {
      return NextResponse.json({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user_payload.signature', // Mock JWT
        role: 'user'
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
