import React from 'react';
import { ScrollView, Platform, ToastAndroid, Alert } from 'react-native';
import { ImageGallery, TextDisplay } from '../components';
import { useAppStore } from '../store/AppStore';
import { HomeScreenStyles } from '../styles';
import { AppRouter } from '../router';

export default function ResultsScreen() {
  const {
    capturedImage,
    recognizedText,
    addScan,
    resetApp,
  } = useAppStore();

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

      AppRouter.resetToHome();
    }
  };

  const handleNewPhoto = () => {
    resetApp();
    AppRouter.resetToHome();
  };

  return (
    <ScrollView style={HomeScreenStyles.resultContainer}>
      <ImageGallery images={capturedImage || []} />
      <TextDisplay
        text={recognizedText?.text}
        onSave={handleSave}
        onNewPhoto={handleNewPhoto}
      />
    </ScrollView>
  );
}
