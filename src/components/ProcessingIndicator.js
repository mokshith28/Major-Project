import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { TextDisplayStyles } from '../styles/TextDisplayStyles';

const ProcessingIndicator = ({ isProcessing }) => {
  if (!isProcessing) return null;

  return (
    <View style={TextDisplayStyles.processingContainer}>
      <ActivityIndicator size="large" color="#0066cc" />
      <Text style={TextDisplayStyles.processingText}>
        Processing image with cloud OCR...
      </Text>
    </View>
  );
};

export default ProcessingIndicator;
