
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';
import { limitService } from '../../../services/limitService';

export async function POST(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const { targetId } = await request.json();
    const userId = auth.userId;

    // 1. Check Daily Like Limit
    const canLike = await limitService.checkAndEnforceLimit(userId, 'likes');
    if (!canLike) {
      return NextResponse.json({ 
        error: 'Pro plan required: Daily like limit reached',
        code: 'PRO_PLAN_REQUIRED'
      }, { status: 403 });
    }

    // 2. Mutual Match Logic
    // In production, query the 'likes' table for (targetId -> userId)
    const isMutualInterest = Math.random() > 0.7; // Simulating 30% match rate for demo

    if (isMutualInterest) {
      // Check Match Limit
      const canMatch = await limitService.checkAndEnforceLimit(userId, 'matches');
      if (!canMatch) {
        return NextResponse.json({ 
          error: 'Pro plan required: Daily match limit reached',
          code: 'PRO_PLAN_REQUIRED'
        }, { status: 403 });
      }

      console.log(`IT'S A MATCH! User ${userId} <-> ${targetId}`);
      return NextResponse.json({ success: true, isMatch: true });
    }

    return NextResponse.json({ success: true, isMatch: false });
  } catch (error) {
    return NextResponse.json({ error: 'Like processing failed' }, { status: 500 });
  }
}
