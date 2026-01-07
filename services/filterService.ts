
export interface SearchFilters {
  ageRange: [number, number];
  distance: number;
  gender: string;
  lookingFor: string[];
  relationshipType: string[];
  verifiedOnly: boolean;
}

const DEFAULT_FILTERS: SearchFilters = {
  ageRange: [18, 50],
  distance: 50,
  gender: 'Everyone',
  lookingFor: ['Women'],
  relationshipType: [],
  verifiedOnly: false
};

export const filterService = {
  getFilters(): SearchFilters {
    const saved = localStorage.getItem('mallucupid_filters');
    return saved ? JSON.parse(saved) : DEFAULT_FILTERS;
  },

  saveFilters(filters: SearchFilters) {
    localStorage.setItem('mallucupid_filters', JSON.stringify(filters));
  },

  /**
   * Converts filter object to URL query parameters.
   */
  toQueryParams(filters: SearchFilters): string {
    const params = new URLSearchParams();
    params.set('minAge', filters.ageRange[0].toString());
    params.set('maxAge', filters.ageRange[1].toString());
    params.set('distance', filters.distance.toString());
    params.set('verified', filters.verifiedOnly.toString());
    
    if (filters.lookingFor.length > 0) {
      params.set('lookingFor', filters.lookingFor.join(','));
    }
    
    return params.toString();
  }
};
