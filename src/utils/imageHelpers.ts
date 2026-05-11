/**
 * Image Helper Utilities
 * Functions to help with image validation and fallback handling
 */

/**
 * Check if an image source is valid
 * @param src - Image source string
 * @returns boolean indicating if the source is valid
 */
export function isValidImageSource(src: string | null | undefined): boolean {
  if (!src) return false;
  if (typeof src !== 'string') return false;
  if (src.trim() === '') return false;
  if (src.includes('undefined')) return false;
  if (src.includes('null')) return false;
  return true;
}

/**
 * Filter an array of image sources to only valid ones
 * @param images - Array of image source strings
 * @returns Filtered array containing only valid image sources
 */
export function filterValidImages(images: (string | null | undefined)[]): string[] {
  return images.filter((img): img is string => isValidImageSource(img));
}

/**
 * Get the first valid image from an array
 * @param images - Array of image source strings
 * @returns First valid image source or null
 */
export function getFirstValidImage(images: (string | null | undefined)[]): string | null {
  const validImages = filterValidImages(images);
  return validImages.length > 0 ? validImages[0] : null;
}

/**
 * Transform image path for Next.js
 * Removes 'public/' prefix and ensures path starts with '/'
 * @param src - Image source path
 * @returns Transformed path
 */
export function transformImagePath(src: string): string {
  let transformed = src;

  // Remove 'public/' prefix
  if (transformed.startsWith('public/')) {
    transformed = transformed.replace('public/', '/');
  }

  // Ensure absolute path for local images
  if (
    !transformed.startsWith('/') &&
    !transformed.startsWith('http') &&
    !transformed.startsWith('data:')
  ) {
    transformed = '/' + transformed;
  }

  return transformed;
}

/**
 * Generate initials from product name for placeholder
 * @param name - Product name
 * @param maxLength - Maximum number of initials (default: 3)
 * @returns Uppercase initials
 */
export function getProductInitials(name: string, maxLength: number = 3): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
}

/**
 * Generate consistent color scheme based on string
 * @param str - Input string (e.g., product name)
 * @returns Color scheme object with background and icon colors
 */
export function getColorSchemeFromString(str: string): {
  bg: string;
  icon: string;
} {
  const colorSchemes = [
    { bg: 'from-blue-900 to-blue-700', icon: 'text-blue-300' },
    { bg: 'from-purple-900 to-purple-700', icon: 'text-purple-300' },
    { bg: 'from-green-900 to-green-700', icon: 'text-green-300' },
    { bg: 'from-orange-900 to-orange-700', icon: 'text-orange-300' },
    { bg: 'from-teal-900 to-teal-700', icon: 'text-teal-300' },
    { bg: 'from-indigo-900 to-indigo-700', icon: 'text-indigo-300' },
    { bg: 'from-rose-900 to-rose-700', icon: 'text-rose-300' },
    { bg: 'from-cyan-900 to-cyan-700', icon: 'text-cyan-300' },
  ];

  // Generate hash from string
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colorSchemes[hash % colorSchemes.length];
}

/**
 * Check if file exists (client-side check via fetch)
 * Note: This is an async check and should be used carefully
 * @param url - Image URL to check
 * @returns Promise<boolean> indicating if file exists
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get image dimensions from URL
 * @param url - Image URL
 * @returns Promise with width and height, or null if failed
 */
export async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}
