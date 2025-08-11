import React from 'react';
import { View, Text, Image } from 'react-native';
import { TextDisplayStyles } from '../styles/TextDisplayStyles';

const ImageDisplay = ({ imageUri }) => {
  if (!imageUri) return null;

  return (
    <View style={TextDisplayStyles.imageContainer}>
      <Text style={TextDisplayStyles.sectionTitle}>📷 Captured Image</Text>
      <Image source={{ uri: imageUri }} style={TextDisplayStyles.capturedImage} />
    </View>
  );
};

export default ImageDisplay;
