import React from 'react';
import { View, ScrollView, Platform, ToastAndroid, Alert, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActionButtons,
  AppLoadingIndicator,
  CameraScreen,
  PermissionScreen,
  ImageGallery,
  ProcessingIndicator,
  TextDisplay,
  SubjectActions
} from '../components';
import { useAppStore } from '../store/AppStore';
import { ImageService, OCRService } from '../services';
import { HomeScreenStyles } from '../styles';
import { SCREEN_STATES } from '../constants';

export default function AppContainer() {
  const insets = useSafeAreaInsets();
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
      const imageResult = await ImageService.takePicture(cameraRef);
      setCapturedImages([imageResult]); // Store as array for consistency
      setCapturedImage(imageResult.uri);
      setScreenState(SCREEN_STATES.PROCESSING);
      
      // Perform OCR
      const text = await OCRService.processImage(imageResult.base64);
      setRecognizedText({ text });
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
      const galleryResult = await ImageService.pickFromGallery();
      
      if (!galleryResult) {
        setProcessing(false);
        return; // User cancelled
      }

      // Handle single or multiple images
      if (Array.isArray(galleryResult)) {
        // Multiple images selected
        setCapturedImages(galleryResult); // Store all images
        setCapturedImage(galleryResult[0].uri); // Show first image
        setScreenState(SCREEN_STATES.PROCESSING);
        
        // Process all images and combine text
        const base64Images = galleryResult.map(img => img.base64);
        const combinedText = await OCRService.processMultipleImages(base64Images);
        setRecognizedText({ text: combinedText });
      } else {
        // Single image selected (backward compatibility)
        setCapturedImages([galleryResult]); // Store as array for consistency
        setCapturedImage(galleryResult.uri);
        setScreenState(SCREEN_STATES.PROCESSING);
        
        // Perform OCR on single image
        const text = await OCRService.processImage(galleryResult.base64);
        setRecognizedText({ text });
      }
      
      setScreenState(SCREEN_STATES.RESULTS);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async (subject) => {
    if (recognizedText?.text && subject) {
      const newScan = {
        text: recognizedText.text,
        subject: subject,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
      };
      await addScan(newScan);
    
      if (Platform.OS === 'android') {
        ToastAndroid.show('Scan saved successfully!', ToastAndroid.SHORT);
      } else {
        Alert.alert('✅ Success!', 'Scan saved successfully!');
      }
      setScreenState(SCREEN_STATES.HOME);
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
    <View style={[HomeScreenStyles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={HomeScreenStyles.statusBar.backgroundColor} />
      <ScrollView
        style={HomeScreenStyles.content}
        contentContainerStyle={HomeScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}
