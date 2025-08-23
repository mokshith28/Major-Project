import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActionButtons,
  AppLoadingIndicator,
  CameraScreen,
  PermissionScreen,
  ImageDisplay,
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

  const handleTakePhoto = () => {
    setScreenState(SCREEN_STATES.CAMERA);
  };

  const handleCapture = async () => {
    try {
      setProcessing(true);
      const result = await ImageService.takePicture(cameraRef);
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

      setCapturedImage(result.uri);
      setScreenState(SCREEN_STATES.PROCESSING);
      
      // Perform OCR
      const text = await OCRService.processImage(result.base64);
      setRecognizedText({ text, language: 'auto' });
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
            <ImageDisplay imageUri={capturedImage} />
            <ProcessingIndicator />
          </View>
        );

      case SCREEN_STATES.RESULTS:
        return (
          <View style={HomeScreenStyles.resultContainer}>
            <ImageDisplay imageUri={capturedImage} />
            <TextDisplay
              text={recognizedText?.text}
              language={recognizedText?.language}
              onSave={handleSave}
              onNewPhoto={resetApp}
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
