
import { UserProfile } from './userService';

const MOCK_FEED: UserProfile[] = [
  {
    id: 'p_prod_101',
    name: 'Sneha',
    age: 24,
    gender: 'Female',
    relationship_type: 'Serious Relationship',
    is_verified: true,
    profile_images: ['https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=400'],
    bio: 'Artistic soul from Kochi. Looking for someone who appreciates Malayalam cinema and long drives.',
    plan: 'free',
    likes_remaining: 50,
    matches_remaining: 10
  },
  {
    id: 'p_prod_102',
    name: 'Aiswarya',
    age: 23,
    gender: 'Female',
    relationship_type: 'Casual Dating',
    is_verified: true,
    profile_images: ['https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400'],
    bio: 'Coffee, books, and deep conversations. ☕✨',
    plan: 'free',
    likes_remaining: 50,
    matches_remaining: 10
  }
];

export const matchService = {
  async getFeed(queryString: string = ''): Promise<UserProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_FEED;
  },

  async like(targetId: string): Promise<{ isMatch: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const isPro = localStorage.getItem('mallucupid_plan') === 'pro';
    // Logic for demo purposes
    return { isMatch: Math.random() > 0.5 };
  },

  async reject(targetId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  async getMatches(): Promise<any[]> {
    return [
      { 
        id: 'm_1', 
        name: 'Kavya', 
        imageUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=100',
        isVerified: true
      }
    ];
  }
};
