
export interface UpgradeResponse {
  status: 'active';
  expires_at: string;
}

export const subscriptionService = {
  async upgradeToPro(): Promise<UpgradeResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem('mallucupid_plan', 'pro');
    return {
      status: 'active',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
};
