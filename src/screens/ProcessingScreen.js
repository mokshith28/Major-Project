import React from 'react';
import { View } from 'react-native';
import { ImageGallery, ProcessingIndicator } from '../components';
import { useAppStore } from '../store/AppStore';
import { HomeScreenStyles } from '../styles';

export default function ProcessingScreen() {
  const { capturedImage } = useAppStore();

  return (
    <View style={HomeScreenStyles.centeredContainer}>
      <ImageGallery images={capturedImage || []} />
      <ProcessingIndicator />
    </View>
  );
}
