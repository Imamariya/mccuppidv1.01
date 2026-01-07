
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const isPro = false;
    const likesToday = 50;

    if (!isPro && likesToday >= 50) {
      return NextResponse.json({ 
        error: 'Like limit reached',
        code: 'LIMIT_REACHED'
      }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Like processing failed' }, { status: 500 });
  }
}
