// Configuration constants
export const API_CONFIG = {
  GOOGLE_VISION_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY,s
};

export const APP_CONFIG = {
  IMAGE_QUALITY: 0.8,
  SUPPORTED_LANGUAGES: ['en', 'hi', 'kn'], // English, Hindi, Kannada
  MAX_SCANS_DISPLAY: 100,
};

export const PERMISSIONS = {
  CAMERA: 'camera',
  MEDIA_LIBRARY: 'media-library',
};
