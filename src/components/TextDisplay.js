import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { TextDisplayStyles } from '../styles/TextDisplayStyles';
import { copyToClipboard } from '../utils';
import SubjectActions from './SubjectActions';

const TextDisplay = ({ text, onSave, onNewPhoto }) => {
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

      <SubjectActions onSave={onSave} onNewPhoto={onNewPhoto} />
    </View>
  );
};

export default TextDisplay;
