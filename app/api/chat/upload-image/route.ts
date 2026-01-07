
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function POST(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Valid image file required' }, { status: 400 });
    }

    // PRODUCTION: Upload to S3/Cloudinary/etc.
    // For now, simulate storage delay and return a permanent URL.
    await new Promise(r => setTimeout(r, 800));
    
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const url = `https://cdn.mallucupid.com/chats/images/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
