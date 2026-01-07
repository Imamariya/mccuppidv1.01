
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function POST(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const { orderId, paymentId, signature } = await request.json();

    // PRODUCTION SECURITY:
    // 1. Verify signature using gateway secret key
    // 2. Check if orderId exists and matches amount
    // 3. Prevent double-spend / replay attacks

    if (signature !== 'valid_mock_signature') {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Success: Upgrade User
    // In production, update the DB record
    console.log(`Payment Verified for User ${auth.userId}. Upgrading to PRO.`);

    return NextResponse.json({
      success: true,
      tier: 'pro',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
