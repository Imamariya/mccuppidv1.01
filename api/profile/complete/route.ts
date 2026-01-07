
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validation: Ensure no blob URLs leaked into the final payload
    const hasBlobUrls = JSON.stringify(body).includes('blob:');
    if (hasBlobUrls) {
      return NextResponse.json({ 
        error: 'Security Error: Local blob URLs are not permitted in profile completion.' 
      }, { status: 400 });
    }

    // PRODUCTION LOGIC:
    // 1. Save profile to DB
    // 2. Set user status to 'pending_verification'
    // 3. Notify admin for selfie review

    console.log('Final Profile Payload Received:', body);

    return NextResponse.json({ 
      success: true,
      message: 'Profile submitted successfully for verification.'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
