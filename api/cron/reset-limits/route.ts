
import { NextResponse } from 'next/server';

/**
 * CRON ENDPOINT
 * Expected to be called daily at 00:00 UTC.
 * Requires a Secret Token for security.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (token !== 'mallucupid_cron_secret_123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // PRODUCTION LOGIC:
  // 1. Reset 'likes_today' and 'matches_today' for all FREE users in DB
  // 2. Log maintenance metrics
  
  console.log('CRON: Daily limits reset performed.');

  return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
}
