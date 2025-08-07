// Configuration file for OCR services
// Add your API keys here

export const OCR_CONFIG = {
  // Google Vision API Configuration
  GOOGLE_VISION_API_KEY: 'AIzaSyB405QJtmmyjg2eDXkJdcGMeQvY-dcwxfI',

  // Alternative OCR Services (for future use)
  AWS_ACCESS_KEY_ID: 'YOUR_AWS_ACCESS_KEY',
  AWS_SECRET_ACCESS_KEY: 'YOUR_AWS_SECRET_KEY',
  AWS_REGION: 'us-east-1',

  // OCR.space API (free alternative)
  OCR_SPACE_API_KEY: 'YOUR_OCR_SPACE_API_KEY',

  // Azure Computer Vision
  AZURE_SUBSCRIPTION_KEY: 'YOUR_AZURE_KEY',
  AZURE_ENDPOINT: 'YOUR_AZURE_ENDPOINT',
};

// Instructions:
// 1. Replace 'YOUR_GOOGLE_VISION_API_KEY_HERE' with your actual Google Vision API key
// 2. To get a Google Vision API key:
//    - Go to https://console.cloud.google.com/
//    - Create a new project or select existing
//    - Enable Cloud Vision API
//    - Go to Credentials and create an API key
//    - Copy the key and replace the placeholder above

export default OCR_CONFIG;
