// Configuration constants
export const API_CONFIG = {
  HUGGINGFACE_TOKEN: process.env.EXPO_PUBLIC_HUGGINGFACE_TOKEN,
  GOOGLE_VISION_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY,
  GOOGLE_VISION_URL: 'https://vision.googleapis.com/v1/images:annotate',
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
