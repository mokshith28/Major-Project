import React, { useState } from 'react';
import { Alert } from 'react-native';
import { usePermissions } from './src/hooks';
import { OCRService, ImageService } from './src/services';
import { MainScreen } from './src/screens';
import { CameraScreen, PermissionScreen } from './src/components';

// Expo Go compatible text recognition app
// This version now supports real OCR with Google Vision API
export default function App() {
  // Custom hooks and services
  const {
    cameraPermission,
    mediaLibraryPermission,
    permissionsLoading,
    requestAllPermissions,
    hasAllPermissions
  } = usePermissions();

  // State variables for managing app functionality
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Function to take a picture using the camera
  const takePicture = async () => {
    try {
      setIsProcessing(true);
      const result = await ImageService.takePicture(cameraRef);

      setCapturedImage(result.uri);
      setShowCamera(false);

      // Perform OCR on the captured image
      await performOCR(result.base64);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to select image from gallery
  const pickImageFromGallery = async () => {
    try {
      setIsProcessing(true);
      const result = await ImageService.pickImageFromGallery();

      setCapturedImage(result.uri);

      // Perform OCR on selected image
      await performOCR(result.base64);
    } catch (error) {
      // Alert.alert('Error', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // OCR processing function
  const performOCR = async (base64Image) => {
    try {
      setIsProcessing(true);
      setRecognizedText('Processing image...');
      const result = await OCRService.processImage(base64Image);
      setRecognizedText(result);
    } catch (error) {
      console.error('OCR Error:', error);
      setRecognizedText('Error: Could not process image for text recognition');
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to reset the app state
  const resetApp = () => {
    setCapturedImage(null);
    setRecognizedText('');
    setShowCamera(false);
  };

  // Handle permission states
  if (permissionsLoading) {
    return <PermissionScreen isLoading={true} />;
  }

  if (!hasAllPermissions()) {
    return (
      <PermissionScreen
        onRequestPermissions={requestAllPermissions}
        isLoading={false}
      />
    );
  }

  // Render camera view when taking a picture
  if (showCamera) {
    return (
      <CameraScreen
        cameraRef={(ref) => setCameraRef(ref)}
        onCancel={() => setShowCamera(false)}
        onCapture={takePicture}
        isProcessing={isProcessing}
      />
    );
  }

  // Main app interface
  return (
    <MainScreen
      capturedImage={capturedImage}
      recognizedText={recognizedText}
      isProcessing={isProcessing}
      onTakePhoto={() => setShowCamera(true)}
      onPickFromGallery={pickImageFromGallery}
      onReset={resetApp}
    />
  );
}


