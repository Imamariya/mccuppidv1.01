
import { UserProfile } from './userService';

const MOCK_FEED: UserProfile[] = [
  {
    id: 'p1',
    name: 'Anjali',
    age: 24,
    gender: 'Female',
    relationship_type: 'Serious Relationship',
    is_verified: true,
    plan: 'free',
    likes_remaining: 50,
    matches_remaining: 10,
    profile_images: ['https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400'],
    bio: 'Software engineer from Kochi. Love traveling and classical music.'
  },
  {
    id: 'p2',
    name: 'Meera',
    age: 23,
    gender: 'Female',
    relationship_type: 'Casual Dating',
    is_verified: true,
    plan: 'free',
    likes_remaining: 50,
    matches_remaining: 10,
    profile_images: ['https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=400'],
    bio: 'Avid reader and coffee lover. Let\'s explore the city together!'
  },
  {
    id: 'p3',
    name: 'Sneha',
    age: 25,
    gender: 'Female',
    relationship_type: 'Marriage',
    is_verified: false,
    plan: 'free',
    likes_remaining: 50,
    matches_remaining: 10,
    profile_images: ['https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=400']
  }
];

export const matchService = {
  async getFeed(): Promise<UserProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...MOCK_FEED];
  },

  async like(targetId: string): Promise<void> {
    const res = await fetch('/api/match/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
      },
      body: JSON.stringify({ targetId })
    });

    if (res.status === 403) {
      throw new Error('PRO_PLAN_REQUIRED');
    }

    if (!res.ok) {
      throw new Error('Like failed');
    }
  },

  async reject(targetId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Rejected user: ${targetId}`);
  },

  async getMatches(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      { id: 'm1', name: 'Anjali', imageUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=100' },
      { id: 'm2', name: 'Meera', imageUrl: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=100' }
    ];
  }
};
