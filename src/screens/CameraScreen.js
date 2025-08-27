import React from 'react';
import { Alert } from 'react-native';
import { CameraScreen } from '../components';
import { useAppStore } from '../store/AppStore';
import { ImageService, OCRService } from '../services';
import { AppRouter } from '../router';

export default function CameraScreenPage() {
  const {
    isProcessing,
    setProcessing,
    setCapturedImage,
    setRecognizedText,
    setError,
  } = useAppStore();

  const [cameraRef, setCameraRef] = React.useState(null);

  const handleCapture = async () => {
    try {
      setProcessing(true);
      const imageResult = await ImageService.takePicture(cameraRef);
      setCapturedImage([imageResult]);

      // Navigate to processing screen
      AppRouter.navigateToProcessing();

      // Perform OCR
      const text = await OCRService.processImage(imageResult.base64);
      setRecognizedText({ text });

      // Navigate to results
      AppRouter.navigateToResults();
    } catch (error) {
      setError(error.message);
      Alert.alert('Error', error.message);
      AppRouter.goBack();
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    AppRouter.goBack();
  };

  return (
    <CameraScreen
      cameraRef={setCameraRef}
      onCapture={handleCapture}
      onCancel={handleCancel}
      isProcessing={isProcessing}
    />
  );
}
