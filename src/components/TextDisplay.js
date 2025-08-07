import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TextDisplayStyles } from '../styles/TextDisplayStyles';
import { copyToClipboard } from '../utils';

const TextDisplay = ({ recognizedText, isProcessing }) => {
  if (!recognizedText || isProcessing) return null;

  const handleCopyToClipboard = () => {
    copyToClipboard(recognizedText);
  };

  return (
    <View style={TextDisplayStyles.textContainer}>
      <View style={TextDisplayStyles.textHeader}>
        <Text style={TextDisplayStyles.sectionTitle}>Recognized Text:</Text>
        <TouchableOpacity
          style={TextDisplayStyles.copyButton}
          onPress={handleCopyToClipboard}
        >
          <Text style={TextDisplayStyles.copyButtonText}>📋 Copy</Text>
        </TouchableOpacity>
      </View>
      <View style={TextDisplayStyles.textBox}>
        <Text style={TextDisplayStyles.recognizedText}>{recognizedText}</Text>
      </View>
    </View>
  );
};

export default TextDisplay;
