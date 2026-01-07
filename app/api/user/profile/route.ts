
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

export async function GET(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  try {
    // PRODUCTION: Fetch from DB using auth.userId
    // Mocking the stored profile data
    const mockProfile = {
      id: auth.userId,
      name: 'Rahul',
      age: 26,
      dob: '1998-05-15',
      gender: 'Male',
      relationship_type: 'Serious Relationship',
      looking_for: ['Women'],
      is_verified: true,
      plan: localStorage.getItem('mallucupid_plan') || 'free',
      profile_images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'],
      bio: 'Just a Mallu guy looking for someone to share kappa and fish curry with. 🍛'
    };

    return NextResponse.json(mockProfile);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
