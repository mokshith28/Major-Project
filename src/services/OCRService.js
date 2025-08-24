import { API_CONFIG, APP_CONFIG } from '../config';
import { APP_ERRORS } from '../constants';

class OCRService {
  static async processImage(base64Image) {
    if (!base64Image) {
      throw new Error(APP_ERRORS.UNKNOWN_ERROR);
    }

    // Check if API key is available
    if (!API_CONFIG.GOOGLE_VISION_API_KEY) {
      throw new Error('Google Vision API key is not configured. Please check your .env file and ensure EXPO_PUBLIC_GOOGLE_VISION_API_KEY is set.');
    }

    try {
      const response = await fetch(`${API_CONFIG.GOOGLE_VISION_URL}?key=${API_CONFIG.GOOGLE_VISION_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
            imageContext: { languageHints: APP_CONFIG.SUPPORTED_LANGUAGES }
          }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const textAnnotations = result.responses?.[0]?.textAnnotations;
      if (textAnnotations && textAnnotations.length > 0) {
        return textAnnotations[0].description || 'No text found in the image';
      }

      return 'No text found in the image';
    } catch (error) {
      if (error.message.includes('fetch') || error.message.includes('Network')) {
        throw new Error(APP_ERRORS.NETWORK_ERROR);
      }
      
      throw new Error(`${APP_ERRORS.OCR_FAILED}: ${error.message}`);
    }
  }

  static async processMultipleImages(base64Images) {
    if (!base64Images || !Array.isArray(base64Images) || base64Images.length === 0) {
      throw new Error(APP_ERRORS.UNKNOWN_ERROR);
    }

    try {
      const textResults = [];
      
      // Process each image and collect the text
      for (let i = 0; i < base64Images.length; i++) {
        const text = await this.processImage(base64Images[i]);
        textResults.push(`${text}`);
      }

      // Combine all text results
      return textResults.join('\n\n');
    } catch (error) {
      throw new Error(`Failed to process multiple images: ${error.message}`);
    }
  }
}

export default OCRService;
