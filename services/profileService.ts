
export interface CompleteProfilePayload {
  dob: string;
  gender: string;
  looking_for: string[];
  relationship_type: string;
  bio?: string;
  profile_images: string[];
  verification_selfie_url: string;
}

export const profileService = {
  async completeProfile(payload: CompleteProfilePayload): Promise<{ success: boolean }> {
    const response = await fetch('/api/profile/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to complete profile');
    }

    return await response.json();
  }
};
