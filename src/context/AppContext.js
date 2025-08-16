import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { usePermissions } from '../hooks';
import { OCRService, ImageService } from '../services';

const AppContext = createContext({});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Saved scans state
  const [savedScans, setSavedScans] = useState([]);

  // Camera and OCR state
  const [capturedImage, setCapturedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  // Permissions
  const {
    cameraPermission,
    mediaLibraryPermission,
    permissionsLoading,
    requestAllPermissions,
    hasAllPermissions
  } = usePermissions();

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
      const result = await OCRService.processImage(base64Image);
      setRecognizedText({
        text: result,
        language: 'auto' // You can detect language later if needed
      });
    } catch (error) {
      console.error('OCR Error:', error);
      setRecognizedText({
        text: 'Error: Could not process image for text recognition',
        language: 'en'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to save scan result
  const saveResult = () => {
    if (recognizedText && recognizedText.text) {
      const newScan = {
        text: recognizedText.text,
        language: recognizedText.language,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
      };
      setSavedScans(prev => [newScan, ...prev]);
      Alert.alert('Success', 'Scan saved successfully!');
    }
  };

  // Function to reset the app state
  const resetApp = () => {
    setCapturedImage(null);
    setRecognizedText(null);
    setShowCamera(false);
  };

  // Function to handle scan item press
  const handleScanPress = (scan) => {
    Alert.alert(
      'Scan Details',
      `Text: ${scan.text}\n\nLanguage: ${scan.language}\nDate: ${scan.date}`,
      [{ text: 'OK' }]
    );
  };

  const value = {
    // State
    savedScans,
    capturedImage,
    recognizedText,
    isProcessing,
    showCamera,
    cameraRef,

    // Permissions
    hasAllPermissions: permissionsLoading ? null : hasAllPermissions(),
    requestPermission: requestAllPermissions,

    // Actions
    takePicture,
    pickImageFromGallery,
    saveResult,
    resetApp,
    handleScanPress,
    setShowCamera,
    setCameraRef,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
