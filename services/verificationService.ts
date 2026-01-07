
import { profileService } from './profileService';

export const verificationService = {
  async checkStatus(): Promise<{ is_verified: boolean; status: 'pending' | 'approved' | 'rejected' }> {
    const profile = await profileService.getProfile();
    return {
      is_verified: profile.is_verified,
      status: profile.is_verified ? 'approved' : 'pending' 
    };
  }
};
