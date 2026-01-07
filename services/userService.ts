
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  relationship_type: string;
  is_verified: boolean;
  plan: 'free' | 'pro';
  likes_remaining: number;
  matches_remaining: number;
  profile_images: string[];
  bio?: string;
}

const MOCK_PROFILE: UserProfile = {
  id: 'me_123',
  name: 'Rahul',
  age: 26,
  gender: 'Male',
  relationship_type: 'Serious Relationship',
  is_verified: true,
  plan: 'free',
  likes_remaining: 50,
  matches_remaining: 10,
  profile_images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'],
  bio: 'Just a Mallu guy looking for someone to share kappa and fish curry with. 🍛'
};

export const userService = {
  async getProfile(): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Check local storage for simulated plan persistence
    const savedPlan = localStorage.getItem('mallucupid_plan') as 'free' | 'pro' || 'free';
    return { ...MOCK_PROFILE, plan: savedPlan };
  }
};
