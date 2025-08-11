import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YourScansScreen } from '../src/components';
import { useAppContext } from '../src/context';

export default function ScansScreen() {
  const { savedScans, handleScanPress } = useAppContext();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YourScansScreen
        scans={savedScans}
        onScanPress={handleScanPress}
      />
    </SafeAreaView>
  );
}
