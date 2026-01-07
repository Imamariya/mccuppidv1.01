
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function GET(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const userId = auth.userId;

    // PRODUCTION: SELECT * FROM notifications WHERE user_id = :userId ORDER BY created_at DESC
    const mockNotifications = [
      {
        id: 'n_1',
        user_id: userId,
        type: 'match',
        message: 'You have a new match with Sneha! ❤️',
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'n_2',
        user_id: userId,
        type: 'verification',
        message: 'Your profile has been verified by the MalluCupid team. 🆔',
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    return NextResponse.json(mockNotifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
