import React, { useMemo } from 'react';
import { View, Alert, Platform, ToastAndroid, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScansListScreen } from '../../src/components';
import { useAppStore } from '../../src/store/AppStore';
import { YourScansScreenStyles } from '../../src/styles';

export default function SubjectScans() {
  const { subject: subjectName } = useLocalSearchParams();
  const { savedScans, deleteScan } = useAppStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
    // Navigate to edit scan page using scan timestamp as ID
    router.push(`/scans/edit/${scan.timestamp}`);
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
    <View style={[YourScansScreenStyles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={YourScansScreenStyles.statusBar.backgroundColor} />
      <ScansListScreen
        scans={subjectScans}
        subject={subjectObj}
        onScanPress={handleScanPress}
        onBackPress={handleBackPress}
        onDeleteScan={handleDeleteScan}
      />
    </View>
  );
}
