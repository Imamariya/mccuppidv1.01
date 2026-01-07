
export interface UserLocation {
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
});

export const locationService = {
  /**
   * Fetches current coordinates from the browser.
   */
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  },

  /**
   * Persists user location to the backend.
   */
  async saveLocation(location: UserLocation): Promise<void> {
    const res = await fetch('/api/user/location', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(location)
    });
    if (!res.ok) throw new Error('Failed to save location');
  },

  /**
   * Updates existing user location.
   */
  async updateLocation(location: Partial<UserLocation>): Promise<void> {
    const res = await fetch('/api/user/location/update', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(location)
    });
    if (!res.ok) throw new Error('Failed to update location');
  },

  /**
   * Reverse geocoding (Mock for demonstration).
   * In production, this calls Google Maps or Mapbox API.
   */
  async reverseGeocode(lat: number, lng: number): Promise<{ country: string; state: string; city: string }> {
    // Mocking API call to a geocoding service
    await new Promise(r => setTimeout(r, 500));
    return {
      country: "India",
      state: "Kerala",
      city: "Kochi"
    };
  }
};
