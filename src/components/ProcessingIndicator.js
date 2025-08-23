import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { TextDisplayStyles } from '../styles/TextDisplayStyles';
import { Colors } from '../styles/Colors';

const ProcessingIndicator = () => {
  return (
    <View style={TextDisplayStyles.processingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={TextDisplayStyles.processingText}>
        🔍 Extracting text from image...
      </Text>
    </View>
  );
};

export default ProcessingIndicator;
