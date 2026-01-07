
import { NextResponse } from 'next/server';
import { securityService } from '../../../services/securityService';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  const auth = await securityService.authorize(request, 'user');
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const minAge = parseInt(searchParams.get('minAge') || '18');
  const maxAge = parseInt(searchParams.get('maxAge') || '100');
  const maxDist = parseInt(searchParams.get('distance') || '100');
  const verifiedOnly = searchParams.get('verified') === 'true';

  try {
    const userId = auth.userId;
    const userLat = 9.9312;
    const userLon = 76.2673;

    const allProfiles = [
      {
        id: 'p_prod_101',
        name: 'Sneha',
        age: 24,
        is_verified: true,
        latitude: 9.9400,
        longitude: 76.3200,
        country: 'India',
        profile_images: ['https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=400'],
        bio: 'Artistic soul from Kochi.',
        relationship_type: 'Serious Relationship'
      },
      {
        id: 'p_prod_102',
        name: 'Anjali',
        age: 22,
        is_verified: true,
        latitude: 10.0100,
        longitude: 76.3500,
        country: 'India',
        profile_images: ['https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400'],
        bio: 'Coffee and books.',
        relationship_type: 'Marriage'
      },
      {
        id: 'p_prod_104',
        name: 'Meera',
        age: 29,
        is_verified: false,
        latitude: 9.9200,
        longitude: 76.2500,
        country: 'India',
        profile_images: ['https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=400'],
        bio: 'Foodie!',
        relationship_type: 'Casual Dating'
      }
    ];

    const feed = allProfiles.filter(p => {
      if (verifiedOnly && !p.is_verified) return false;
      if (p.age < minAge || p.age > maxAge) return false;
      const dist = calculateDistance(userLat, userLon, p.latitude, p.longitude);
      if (dist > maxDist) return false;
      return true;
    }).map(p => ({
      ...p,
      distance: Math.round(calculateDistance(userLat, userLon, p.latitude, p.longitude))
    }));

    return NextResponse.json(feed);
  } catch (error) {
    return NextResponse.json({ error: 'Feed generation failed' }, { status: 500 });
  }
}
