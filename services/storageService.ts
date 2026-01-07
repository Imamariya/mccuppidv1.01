
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
      }
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to upload verification selfie');
    }

    return await response.json();
  },

  /**
   * Deletes a profile image from storage.
   */
  async deleteProfileImage(imageUrl: string): Promise<void> {
    const response = await fetch('/api/storage/delete-profile-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('mallucupid_token')}`
      },
      body: JSON.stringify({ imageUrl })
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  }
};
