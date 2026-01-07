
export interface UserLimits {
  likes_today: number;
  matches_today: number;
  last_reset_date: string;
}

export const limitService = {
  /**
   * Checks and resets daily limits if the day has changed.
   * Returns true if the limit is respected, false if exceeded.
   */
  async checkAndEnforceLimit(userId: string, type: 'likes' | 'matches'): Promise<boolean> {
    const isPro = localStorage.getItem('mallucupid_plan') === 'pro';
    if (isPro) return true;

    const storageKey = `limits_${userId}`;
    const rawData = localStorage.getItem(storageKey);
    const today = new Date().toISOString().split('T')[0];

    let limits: UserLimits = rawData ? JSON.parse(rawData) : {
      likes_today: 0,
      matches_today: 0,
      last_reset_date: today
    };

    // Daily Reset Logic
    if (limits.last_reset_date !== today) {
      limits = { likes_today: 0, matches_today: 0, last_reset_date: today };
    }

    const MAX_LIKES = 50;
    const MAX_MATCHES = 10;

    if (type === 'likes') {
      if (limits.likes_today >= MAX_LIKES) return false;
      limits.likes_today++;
    } else if (type === 'matches') {
      if (limits.matches_today >= MAX_MATCHES) return false;
      limits.matches_today++;
    }

    localStorage.setItem(storageKey, JSON.stringify(limits));
    return true;
  }
};
