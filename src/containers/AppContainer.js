import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActionButtons,
  AppLoadingIndicator,
  CameraScreen,
  PermissionScreen,
  ImageGallery,
  ProcessingIndicator,
  TextDisplay
} from '../components';
import { useAppStore } from '../store/AppStore';
import { ImageService, OCRService } from '../services';
import { HomeScreenStyles } from '../styles';
import { SCREEN_STATES } from '../constants';

export default function AppContainer() {
  const {
    screenState,
    capturedImage,
    recognizedText,
    isProcessing,
    setScreenState,
    setCapturedImage,
    setRecognizedText,
    setProcessing,
    addScan,
    setError,
    resetApp,
    requestPermissions,
  } = useAppStore();

  // Camera reference
  const [cameraRef, setCameraRef] = React.useState(null);
  const [capturedImages, setCapturedImages] = React.useState([]);

  const handleTakePhoto = () => {
    setScreenState(SCREEN_STATES.CAMERA);
  };

  const handleCapture = async () => {
    try {
      setProcessing(true);
      const result = await ImageService.takePicture(cameraRef);
      setCapturedImages([result]); // Store as array for consistency
      setCapturedImage(result.uri);
      setScreenState(SCREEN_STATES.PROCESSING);
      
      // Perform OCR
      const text = await OCRService.processImage(result.base64);
      setRecognizedText({ text, language: 'auto' });
      setScreenState(SCREEN_STATES.RESULTS);
    } catch (error) {
      Alert.alert('Error', error.message);
      setScreenState(SCREEN_STATES.HOME);
    } finally {
      setProcessing(false);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      setProcessing(true);
      const result = await ImageService.pickFromGallery();
      
      if (!result) {
        setProcessing(false);
        return; // User cancelled
      }

      // Handle single or multiple images
      if (Array.isArray(result)) {
        // Multiple images selected
        setCapturedImages(result); // Store all images
        setCapturedImage(result[0].uri); // Show first image
        setScreenState(SCREEN_STATES.PROCESSING);
        
        // Process all images and combine text
        const base64Images = result.map(img => img.base64);
        const combinedText = await OCRService.processMultipleImages(base64Images);
        setRecognizedText({ text: combinedText, language: 'auto' });
      } else {
        // Single image selected (backward compatibility)
        setCapturedImages([result]); // Store as array for consistency
        setCapturedImage(result.uri);
        setScreenState(SCREEN_STATES.PROCESSING);
        
        // Perform OCR on single image
        const text = await OCRService.processImage(result.base64);
        setRecognizedText({ text, language: 'auto' });
      }
      
      setScreenState(SCREEN_STATES.RESULTS);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = () => {
    if (recognizedText?.text) {
      const newScan = {
        text: recognizedText.text,
        language: recognizedText.language,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
      };
      addScan(newScan);
      Alert.alert('Success', 'Scan saved successfully!');
    }
  };

  const handleReset = () => {
    setCapturedImages([]);
    resetApp();
  };

  const renderContent = () => {
    switch (screenState) {
      case SCREEN_STATES.LOADING:
        return <AppLoadingIndicator />;

      case SCREEN_STATES.PERMISSIONS_REQUIRED:
        return <PermissionScreen onRequestPermissions={requestPermissions} />;

      case SCREEN_STATES.CAMERA:
        return (
          <CameraScreen
            cameraRef={setCameraRef}
            onCapture={handleCapture}
            onCancel={() => setScreenState(SCREEN_STATES.HOME)}
            isProcessing={isProcessing}
          />
        );

      case SCREEN_STATES.PROCESSING:
        return (
          <View style={HomeScreenStyles.centeredContainer}>
            <ImageGallery images={capturedImages} />
            <ProcessingIndicator />
          </View>
        );

      case SCREEN_STATES.RESULTS:
        return (
          <View style={HomeScreenStyles.resultContainer}>
            <ImageGallery images={capturedImages} />
            <TextDisplay
              text={recognizedText?.text}
              language={recognizedText?.language}
              onSave={handleSave}
              onNewPhoto={handleReset}
            />
          </View>
        );

      default: // HOME
        return (
          <ActionButtons
            onTakePhoto={handleTakePhoto}
            onPickFromGallery={handlePickFromGallery}
            isProcessing={isProcessing}
          />
        );
    }
  };

  return (
    <SafeAreaView style={HomeScreenStyles.container}>
      <ScrollView
        style={HomeScreenStyles.content}
        contentContainerStyle={HomeScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
