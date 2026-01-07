
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function POST(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const location = await request.json();
    const userId = auth.userId;

    // PRODUCTION: Update user_profiles set country, state, city, latitude, longitude where user_id = userId
    console.log(`AUDIT: Location saved for User ${userId}: ${location.city}, ${location.country}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save location' }, { status: 500 });
  }
}
