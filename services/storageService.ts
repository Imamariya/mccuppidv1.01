
export const storageService = {
  /**
   * Uploads a profile image to the public storage bucket.
   */
  async uploadProfileImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'public_profile');

    const response = await fetch('/api/storage/upload', {
      method: 'POST',
      body: formData,
      // Note: Authorization header should be added here in a real app
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return await response.json();
  },

  /**
   * Uploads the verification selfie to a private/secure bucket.
   */
  async uploadVerificationSelfie(blob: Blob): Promise<{ url: string }> {
    const file = new File([blob], 'verification_selfie.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'private_verification');

    const response = await fetch('/api/storage/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload verification selfie');
    }

    return await response.json();
  }
};
