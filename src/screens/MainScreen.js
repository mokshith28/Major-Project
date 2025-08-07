import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppStyles } from '../styles/AppStyles';
import {
  Header,
  ActionButtons,
  ImageDisplay,
  ProcessingIndicator,
  TextDisplay
} from '../components';

const MainScreen = ({
  capturedImage,
  recognizedText,
  isProcessing,
  onTakePhoto,
  onPickFromGallery,
  onReset
}) => {
  const showResetButton = (capturedImage || recognizedText) && !isProcessing;

  return (
    <ScrollView style={AppStyles.container} contentContainerStyle={AppStyles.scrollContent}>
      <StatusBar style="dark" />

      <Header />

      <ActionButtons
        onTakePhoto={onTakePhoto}
        onPickFromGallery={onPickFromGallery}
        isProcessing={isProcessing}
      />

      <ImageDisplay imageUri={capturedImage} />

      <ProcessingIndicator isProcessing={isProcessing} />

      <TextDisplay
        recognizedText={recognizedText}
        isProcessing={isProcessing}
      />

      {showResetButton && (
        <TouchableOpacity style={AppStyles.resetButton} onPress={onReset}>
          <Text style={AppStyles.resetButtonText}>🔄 Start Over</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default MainScreen;
