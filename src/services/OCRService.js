import { OCR_CONFIG } from '../../config';

class OCRService {
  // Google Vision API OCR function
  static async googleVisionOCR(base64Image) {
    try {
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${OCR_CONFIG.GOOGLE_VISION_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.responses && result.responses[0] && result.responses[0].textAnnotations) {
        const detectedText = result.responses[0].textAnnotations[0].description;
        return detectedText || 'No text found in the image';
      } else {
        return 'No text found in the image';
      }
    } catch (error) {
      console.error('Google Vision API Error:', error);
      throw new Error(`API Error: ${error.message}\n\nPlease check your API key and network connection.`);
    }
  }

  // Main OCR processing function
  static async processImage(base64Image) {
    try {
      // Use real Google Vision API
      return await this.googleVisionOCR(base64Image);
    } catch (error) {
      console.error('OCR Error:', error);
      throw error;
    }
  }
}

export default OCRService;
