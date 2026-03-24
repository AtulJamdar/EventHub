export const normalizeImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/default-event-image.png';
  }

  const fallback = '/default-event-image.svg';

  // If image is already a full URL, use it directly
  try {
    const url = new URL(imagePath);
    return url.href;
  } catch (e) {
    // not a full URL
  }

  // If image path is relative for backend files
  if (imagePath.startsWith('/uploads')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const baseUrl = apiBase.replace(/\/api$/, '');
    return `${baseUrl}${imagePath}`;
  }

  // If existing placeholder or invalid host, fallback to local default
  if (imagePath.includes('via.placeholder.com') || imagePath.includes('bing.com')) {
    return fallback;
  }

  // Assume path is direct path from backend
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  return imagePath;
};