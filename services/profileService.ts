
export interface CompleteProfilePayload {
  dob: string;
  gender: string;
  looking_for: string[];
  relationship_type: string;
  bio?: string;
  profile_images: string[];
  verification_selfie_url: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  relationship_type?: string;
  looking_for?: string[];
  profile_images?: string[];
}

const MOCK_PROFILE = {
  id: 'me_123',
  name: 'Rahul',
  age: 26,
  dob: '1998-05-15',
  gender: 'Male',
  relationship_type: 'Serious Relationship',
  looking_for: ['Women'],
  is_verified: true,
  profile_images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'],
  bio: 'Just a Mallu guy looking for someone to share kappa and fish curry with. 🍛'
};

export const profileService = {
  async completeProfile(payload: CompleteProfilePayload): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('mallucupid_profile', JSON.stringify(payload));
    return { success: true };
  },

  async getProfile(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const saved = localStorage.getItem('mallucupid_profile');
    const plan = localStorage.getItem('mallucupid_plan') || 'free';
    return saved ? { ...JSON.parse(saved), plan } : { ...MOCK_PROFILE, plan };
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<{ success: boolean; profile: any }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const current = await this.getProfile();
    const updated = { ...current, ...payload };
    localStorage.setItem('mallucupid_profile', JSON.stringify(updated));
    return { success: true, profile: updated };
  }
};
