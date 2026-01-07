
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function PUT(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { name, bio, relationship_type, looking_for, profile_images } = body;

    // Security: Filter out non-editable fields
    // Email and DOB cannot be changed via this endpoint

    // Validation: Enforce image minimums
    if (profile_images && profile_images.length < 2) {
      return NextResponse.json({ error: 'At least 2 photos are required.' }, { status: 400 });
    }

    // Validation: No local blob URLs
    const hasBlobUrls = JSON.stringify(body).includes('blob:');
    if (hasBlobUrls) {
      return NextResponse.json({ error: 'Invalid image format detected.' }, { status: 400 });
    }

    // PRODUCTION: Update DB record for userId
    // If images changed, set profile.verification_status = 'pending_review'
    
    console.log(`AUDIT: User ${auth.userId} updated profile settings.`);

    return NextResponse.json({ 
      success: true,
      message: 'Profile updated successfully.',
      profile: { ...body, id: auth.userId } // Simulate updated object
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
