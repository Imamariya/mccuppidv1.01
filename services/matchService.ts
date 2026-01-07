
import { UserProfile } from './userService';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
});

export const matchService = {
  /**
   * Fetches the matchmaking feed with support for filters.
   */
  async getFeed(queryString: string = ''): Promise<UserProfile[]> {
    const url = `/api/match/feed${queryString ? '?' + queryString : ''}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch feed');
    return res.json();
  },

  /**
   * Sends a like to a profile and checks for mutual match.
   */
  async like(targetId: string): Promise<{ isMatch: boolean }> {
    const res = await fetch('/api/match/like', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetId })
    });

    if (res.status === 403) {
      throw new Error('PRO_PLAN_REQUIRED');
    }

    if (!res.ok) throw new Error('Like processing failed');
    return res.json();
  },

  /**
   * Rejects a profile to exclude it from future feed requests.
   */
  async reject(targetId: string): Promise<void> {
    const res = await fetch('/api/match/reject', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetId })
    });
    
    if (!res.ok) console.warn("Rejection storage failed");
  },

  /**
   * Fetches the current user's list of mutual matches.
   */
  async getMatches(): Promise<any[]> {
    const res = await fetch('/api/match/list', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch match list');
    return res.json();
  }
};
