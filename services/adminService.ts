
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

export interface UserReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  timestamp: string;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
});

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getPendingVerifications(): Promise<VerificationRequest[]> {
    const res = await fetch('/api/admin/verifications/pending', { headers: getHeaders() });
    return res.json();
  },

  async approveVerification(userId: string): Promise<void> {
    await fetch('/api/admin/verifications/approve', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId })
    });
  },

  async rejectVerification(userId: string, reason: string): Promise<void> {
    await fetch('/api/admin/verifications/reject', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, reason })
    });
  },

  async getPendingImages(): Promise<ModerationImage[]> {
    const res = await fetch('/api/admin/images/pending', { headers: getHeaders() });
    return res.json();
  },

  async approveImage(imageId: string): Promise<void> {
    await fetch('/api/admin/images/approve', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ imageId })
    });
  },

  async rejectImage(imageId: string): Promise<void> {
    await fetch('/api/admin/images/reject', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ imageId })
    });
  },

  async getUsers(search: string = '', status: string = ''): Promise<AdminUser[]> {
    const res = await fetch(`/api/admin/users?search=${search}&status=${status}`, { headers: getHeaders() });
    return res.json();
  },

  async updateUserStatus(userId: string, action: 'suspend' | 'ban' | 'reinstate'): Promise<void> {
    await fetch(`/api/admin/users/${action}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId })
    });
  },

  async getReports(): Promise<UserReport[]> {
    const res = await fetch('/api/admin/reports', { headers: getHeaders() });
    return res.json();
  },

  async takeReportAction(reportId: string, action: 'warn' | 'suspend' | 'ban'): Promise<void> {
    await fetch('/api/admin/reports/action', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reportId, action })
    });
  }
};
