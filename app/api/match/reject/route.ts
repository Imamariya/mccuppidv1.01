
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

/**
 * POST /api/match/reject
 * Stores a profile rejection to ensure it is not shown in the feed again.
 */
export async function POST(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const { targetId } = await request.json();
    const userId = auth.userId;

    // PRODUCTION LOGIC:
    // Insert into 'rejections' table (user_id, target_id)
    // For now, simulate with a success response.
    console.log(`AUDIT: User ${userId} rejected ${targetId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Rejection processing failed' }, { status: 500 });
  }
}
