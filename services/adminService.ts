
export interface AdminStats {
  totalUsers: number;
  pendingVerifications: number;
  verifiedUsers: number;
  reportedUsers: number;
}

export interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  relationship_type: string;
  profile_images: string[];
  verification_selfie_url: string;
}

export interface ModerationImage {
  id: string;
  userId: string;
  userName: string;
  url: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Banned';
  is_verified: boolean;
  joinedAt: string;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    return {
      totalUsers: 1240,
      pendingVerifications: 12,
      verifiedUsers: 890,
      reportedUsers: 3
    };
  },

  async getPendingVerifications(): Promise<VerificationRequest[]> {
    return [
      {
        id: 'u_1',
        name: 'Rahul',
        email: 'rahul@example.com',
        age: 26,
        gender: 'Male',
        relationship_type: 'Marriage',
        profile_images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
        verification_selfie_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
      }
    ];
  },

  async approveVerification(userId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
  },

  async rejectVerification(userId: string, reason: string): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
  },

  async getPendingImages(): Promise<ModerationImage[]> {
    return [];
  },

  // Fix: Added missing approveImage method to resolve type error in AdminDashboard
  async approveImage(imageId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
  },

  // Fix: Added missing rejectImage method to resolve type error in AdminDashboard
  async rejectImage(imageId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
  },

  async getUsers(): Promise<AdminUser[]> {
    return [
      { id: '1', name: 'User 1', email: 'u1@ex.com', status: 'Active', is_verified: true, joinedAt: '2023-01-01' }
    ];
  },

  async updateUserStatus(userId: string, action: string): Promise<void> {}
};
