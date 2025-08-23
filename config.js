// Legacy config file - kept for backward compatibility
// New config is in src/config/index.js
export { API_CONFIG as OCR_CONFIG } from './src/config';
export default { 
  GOOGLE_VISION_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY 
};
