import React, { useMemo } from 'react';
import { SafeAreaView, Alert, Platform, ToastAndroid } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScansListScreen } from '../../src/components';
import { useAppStore } from '../../src/store/AppStore';

export default function SubjectScans() {
  const { subject: subjectName } = useLocalSearchParams();
  const { savedScans, deleteScan } = useAppStore();
  const router = useRouter();

  // Decode the subject name from URL
  const decodedSubjectName = decodeURIComponent(subjectName);

  // Get scans for this subject
  const subjectScans = useMemo(() => {
    return savedScans.filter(scan => scan.subject === decodedSubjectName);
  }, [savedScans, decodedSubjectName]);

  // Create subject object
  const subjectObj = {
    name: decodedSubjectName,
    count: subjectScans.length,
    scans: subjectScans
  };

  const handleScanPress = (scan) => {
    Alert.alert(
      'Scan Details',
      `Text: ${scan.text}\n\nDate: ${scan.date}`,
      [{ text: 'OK' }]
    );
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleDeleteScan = async (scan) => {
    await deleteScan(scan);
    // Show success message
    if (Platform.OS === 'android') {
      ToastAndroid.show('Scan deleted successfully!', ToastAndroid.SHORT);
    } else {
      Alert.alert('✅ Success!', 'Scan deleted successfully!');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScansListScreen
        scans={subjectScans}
        subject={subjectObj}
        onScanPress={handleScanPress}
        onBackPress={handleBackPress}
        onDeleteScan={handleDeleteScan}
      />
    </SafeAreaView>
  );
}
