// Configuration constants
export const API_CONFIG = {
  HUGGINGFACE_TOKEN: process.env.EXPO_PUBLIC_HUGGINGFACE_TOKEN,
  GOOGLE_VISION_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY,
  GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
  GOOGLE_VISION_URL: 'https://vision.googleapis.com/v1/images:annotate',
  GOOGLE_TRANSLATE_URL: 'https://translation.googleapis.com/language/translate/v2',
};

export const APP_CONFIG = {
  IMAGE_QUALITY: 0.8,
  SUPPORTED_LANGUAGES: ['en', 'hi', 'kn'], // English, Hindi, Kannada
  TRANSLATE_LANGUAGES: [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  ],
  MAX_SCANS_DISPLAY: 100,
};

export const PERMISSIONS = {
  CAMERA: 'camera',
  MEDIA_LIBRARY: 'media-library',
};
