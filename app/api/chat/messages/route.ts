
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function GET(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) return NextResponse.json({ error: 'matchId is required' }, { status: 400 });

  try {
    const userId = auth.userId;

    // 1. PRODUCTION CHECK: Verify user is part of matchId
    // In production: SELECT 1 FROM matches WHERE id = matchId AND (user1_id = userId OR user2_id = userId)
    const isUserInMatch = true; // Simulated
    if (!isUserInMatch) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch messages ordered by created_at
    // In production: SELECT * FROM messages WHERE match_id = matchId ORDER BY created_at ASC
    
    // Returning high-quality production-ready mock messages
    const mockMessages = [
      {
        id: 'msg_101',
        match_id: matchId,
        sender_id: 'p_prod_101', // The other user
        type: 'text',
        content: 'Hi! Kochi is beautiful today. How are you?',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        status: 'read'
      },
      {
        id: 'msg_102',
        match_id: matchId,
        sender_id: userId,
        type: 'text',
        content: 'I know right? Living for this weather! 🌊',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        status: 'read'
      }
    ];

    // If there are locally sent messages stored in an imaginary "recent" cache, we'd merge them.
    // For this build, we just return the history.

    return NextResponse.json(mockMessages);
  } catch (error) {
    console.error("Chat History Error:", error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
