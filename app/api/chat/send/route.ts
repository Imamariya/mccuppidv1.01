
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function POST(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const { matchId, content, type } = await request.json();
    const userId = auth.userId;

    // 1. PRODUCTION CHECK: Verify sender and recipient verification status
    // SELECT is_verified FROM user_profiles WHERE id = senderId
    // SELECT is_verified FROM user_profiles WHERE id = recipientId (found via matchId)
    
    const senderVerified = true; // Simulated: Real app fetches from DB
    const recipientVerified = true; // Simulated

    if (!senderVerified || !recipientVerified) {
      return NextResponse.json({ 
        error: 'Verification required: Both users must have a verified profile to exchange messages.',
        code: 'VERIFICATION_REQUIRED'
      }, { status: 403 });
    }

    // 2. PLAN ENFORCEMENT
    const plan = request.headers.get('X-User-Plan') || 'free';
    const isPro = plan === 'pro';
    const messageCount = 2; // Simulated

    if (!isPro && messageCount >= 3) {
      return NextResponse.json({ 
        error: 'Pro plan required for unlimited chat.',
        code: 'PRO_PLAN_REQUIRED'
      }, { status: 403 });
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      match_id: matchId,
      sender_id: userId,
      type: type || 'text',
      content,
      created_at: new Date().toISOString()
    };

    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: 'Message delivery failed' }, { status: 500 });
  }
}
