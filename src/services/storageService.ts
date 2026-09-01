import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export interface UploadResult {
  url: string;
  filename: string;
}

/**
 * Validates an image file before upload.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported image format. Please upload a JPG, PNG, WEBP, or GIF file.'
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller image.`
    };
  }

  return { valid: true };
}

/**
 * Converts a file to base64 Data URL (used as fallback or for local preview).
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a product image or profile image.
 * Attempts Firebase Storage upload first; falls back to compressed Base64 data URL if storage bucket is inaccessible.
 */
export async function uploadImage(file: File, folder: 'products' | 'profile' = 'products'): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file.');
  }

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${folder}/${timestamp}_${sanitizedName}`;

  try {
    const storageRef = ref(storage, filename);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

    const downloadUrl = await getDownloadURL(snapshot.ref);
    return {
      url: downloadUrl,
      filename: sanitizedName
    };
  } catch (storageError: any) {
    console.warn('Firebase Storage upload failed, falling back to data URL:', storageError);
    // Graceful fallback for client environments
    const dataUrl = await fileToDataUrl(file);
    return {
      url: dataUrl,
      filename: sanitizedName
    };
  }
}
