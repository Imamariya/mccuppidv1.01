
export interface UserLocation {
  country: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
}

export const locationService = {
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

  async saveLocation(location: UserLocation): Promise<void> {
    localStorage.setItem('mallucupid_location', JSON.stringify(location));
  },

  async updateLocation(location: Partial<UserLocation>): Promise<void> {
    const current = JSON.parse(localStorage.getItem('mallucupid_location') || '{}');
    localStorage.setItem('mallucupid_location', JSON.stringify({ ...current, ...location }));
  },

  async reverseGeocode(lat: number, lng: number): Promise<{ country: string; state: string; city: string }> {
    await new Promise(r => setTimeout(r, 500));
    return {
      country: "India",
      state: "Kerala",
      city: "Kochi"
    };
  }
};
