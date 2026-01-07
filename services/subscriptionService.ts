
export interface UpgradeResponse {
  status: 'active';
  expires_at: string;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
});

export const subscriptionService = {
  async upgradeToPro(): Promise<UpgradeResponse> {
    const res = await fetch('/api/subscription/upgrade', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        plan: 'pro',
        amount: 99,
        duration_days: 30
      })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Upgrade failed');
    }

    return res.json();
  },

  async getSubscriptionStatus() {
    // In a real app, this would be part of user profile or a separate call
    const res = await fetch('/api/user/status', { headers: getHeaders() });
    return res.json();
  }
};
