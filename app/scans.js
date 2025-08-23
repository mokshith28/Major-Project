import React from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { YourScansScreen } from '../src/components';
import { useAppStore } from '../src/store/AppStore';

export default function ScansScreen() {
  const { savedScans } = useAppStore();

  const handleScanPress = (scan) => {
    Alert.alert(
      'Scan Details',
      `Text: ${scan.text}\n\nLanguage: ${scan.language}\nDate: ${scan.date}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YourScansScreen
        scans={savedScans}
        onScanPress={handleScanPress}
      />
    </SafeAreaView>
  );
}
