
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function POST(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const { notificationId } = await request.json();
    const userId = auth.userId;

    // PRODUCTION: UPDATE notifications SET is_read = true WHERE id = :notificationId AND user_id = :userId
    console.log(`AUDIT: Notification ${notificationId} marked as read by ${userId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
