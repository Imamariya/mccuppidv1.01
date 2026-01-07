
export const storageService = {
  async uploadProfileImage(file: File): Promise<{ url: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulate a CDN URL
    return { url: URL.createObjectURL(file) };
  },

  async uploadVerificationSelfie(blob: Blob): Promise<{ url: string }> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { url: URL.createObjectURL(blob) };
  },

  async deleteProfileImage(imageUrl: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};
