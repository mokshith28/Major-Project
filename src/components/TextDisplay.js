import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TextDisplayStyles } from '../styles/TextDisplayStyles';
import { copyToClipboard } from '../utils';

const TextDisplay = ({ text, language, onSave, onNewPhoto }) => {
  if (!text) return null;

  const handleCopyToClipboard = () => {
    copyToClipboard(text);
  };

  return (
    <View style={TextDisplayStyles.textContainer}>
      <View style={TextDisplayStyles.textHeader}>
        <Text style={TextDisplayStyles.sectionTitle}>Recognized Text</Text>
        <TouchableOpacity
          style={TextDisplayStyles.copyButton}
          onPress={handleCopyToClipboard}
        >
          <Text style={TextDisplayStyles.copyButtonText}>📋</Text>
        </TouchableOpacity>
      </View>
      <View style={TextDisplayStyles.textBox}>
        <Text style={TextDisplayStyles.recognizedText}>{text}</Text>
      </View>
      <View style={TextDisplayStyles.actionButtons}>
        {onSave && (
          <TouchableOpacity
            style={[TextDisplayStyles.copyButton, TextDisplayStyles.saveButton]}
            onPress={onSave}
          >
            <Text style={TextDisplayStyles.copyButtonText}>💾</Text>
          </TouchableOpacity>
        )}
        {onNewPhoto && (
          <TouchableOpacity
            style={[TextDisplayStyles.copyButton, TextDisplayStyles.newPhotoButton]}
            onPress={onNewPhoto}
          >
            <Text style={TextDisplayStyles.copyButtonText}>🔄</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextDisplay;
