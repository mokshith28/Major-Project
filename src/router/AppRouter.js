import { router } from 'expo-router';

/**
 * Router utilities for the Text Recognition App
 */
export class AppRouter {
  // Navigation routes
  static ROUTES = {
    LOGIN: '/login',
    HOME: '/(auth)/home',
    CAMERA: '/(auth)/home/camera',
    PROCESSING: '/(auth)/home/processing',
    RESULTS: '/(auth)/home/results',
    PERMISSIONS: '/(auth)/home/permissions',
    SCANS: '/(auth)/scans',
  };

  // Navigation methods
  static navigateToLogin() {
    router.replace(this.ROUTES.LOGIN);
  }

  static navigateToHome() {
    router.replace(this.ROUTES.HOME);
  }

  static navigateToCamera() {
    router.push(this.ROUTES.CAMERA);
  }

  static navigateToProcessing() {
    router.replace(this.ROUTES.PROCESSING);
  }

  static navigateToResults() {
    router.replace(this.ROUTES.RESULTS);
  }

  static navigateToPermissions() {
    router.replace(this.ROUTES.PERMISSIONS);
  }

  static navigateToScans() {
    router.replace(this.ROUTES.SCANS);
  }

  static goBack() {
    router.back();
  }

  // Utility methods
  static resetToHome() {
    router.replace(this.ROUTES.HOME);
  }

  static resetToLogin() {
    router.replace(this.ROUTES.LOGIN);
  }
}

export default AppRouter;
