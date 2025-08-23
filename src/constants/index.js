// Application constants and enums
export const SCREEN_STATES = {
  LOADING: 'loading',
  PERMISSIONS_REQUIRED: 'permissions_required',
  HOME: 'home',
  CAMERA: 'camera',
  PROCESSING: 'processing',
  RESULTS: 'results',
};

export const PERMISSION_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  UNDETERMINED: 'undetermined',
};

export const IMAGE_SOURCES = {
  CAMERA: 'camera',
  GALLERY: 'gallery',
};

export const APP_ERRORS = {
  CAMERA_UNAVAILABLE: 'Camera is not available',
  PERMISSION_DENIED: 'Permission denied',
  OCR_FAILED: 'Text recognition failed',
  NETWORK_ERROR: 'Network connection error',
  UNKNOWN_ERROR: 'An unknown error occurred',
};
