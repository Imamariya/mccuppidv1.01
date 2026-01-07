
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
});

export const verificationService = {
  /**
   * Checks the latest verification status of the current user.
   */
  async checkStatus(): Promise<{ is_verified: boolean; status: 'pending' | 'approved' | 'rejected' }> {
    const res = await fetch('/api/user/profile', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to check verification status');
    const profile = await res.json();
    return {
      is_verified: profile.is_verified,
      status: profile.is_verified ? 'approved' : 'pending' 
    };
  }
};
