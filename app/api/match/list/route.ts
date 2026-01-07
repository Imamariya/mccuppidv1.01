
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

/**
 * GET /api/match/list
 * Returns a list of all mutual matches for the authenticated user.
 */
export async function GET(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const userId = auth.userId;

    // PRODUCTION LOGIC:
    // SELECT m.*, u.name, u.profile_images[0] as imageUrl, c.last_message, c.timestamp
    // FROM matches m
    // JOIN user_profiles u ON (m.user1_id = u.id OR m.user2_id = u.id)
    // LEFT JOIN conversations c ON m.id = c.match_id
    // WHERE (m.user1_id = :userId OR m.user2_id = :userId) AND u.id != :userId

    const mockMatches = [
      { 
        id: 'm_prod_1', 
        userId: 'p_prod_1',
        name: 'Kavya', 
        imageUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=100',
        lastMessage: 'Hey! Kochi is beautiful today.',
        timestamp: '10:30 AM'
      },
      { 
        id: 'm_prod_2', 
        userId: 'p_prod_2',
        name: 'Reshma', 
        imageUrl: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=100',
        lastMessage: 'Let\'s go for kappa and fish curry!',
        timestamp: 'YESTERDAY'
      }
    ];

    return NextResponse.json(mockMatches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}
