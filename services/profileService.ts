
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

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
});

export const profileService = {
  async completeProfile(payload: CompleteProfilePayload): Promise<{ success: boolean }> {
    const response = await fetch('/api/profile/complete', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to complete profile');
    }

    return await response.json();
  },

  async getProfile(): Promise<any> {
    const response = await fetch('/api/user/profile', {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<{ success: boolean; profile: any }> {
    const response = await fetch('/api/user/profile/update', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return await response.json();
  }
};
