import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

export const copyToClipboard = async (text) => {
  try {
    await Clipboard.setStringAsync(text);
    // Alert.alert('Success', 'Text copied to clipboard!');
  } catch (error) {
    // Alert.alert('Error', 'Failed to copy text to clipboard');
  }
};
