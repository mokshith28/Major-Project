import React from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { YourScansScreen } from '../components';
import { useAppStore } from '../store/AppStore';

export default function ScansContainer() {
  const { savedScans } = useAppStore();

  const handleScanPress = (scan) => {
    Alert.alert(
      'Scan Details',
      `Text: ${scan.text}\n\nDate: ${scan.date}`,
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
