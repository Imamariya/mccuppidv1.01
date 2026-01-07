
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function POST(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || !file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Valid video file required' }, { status: 400 });
    }

    // Size limit check (15MB)
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'Video too large (Max 15MB)' }, { status: 400 });
    }

    // PRODUCTION: Upload to S3/Cloudinary/etc.
    await new Promise(r => setTimeout(r, 1500));
    
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const url = `https://cdn.mallucupid.com/chats/videos/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Video upload failed' }, { status: 500 });
  }
}
