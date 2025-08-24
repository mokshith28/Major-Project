import React, { useMemo } from 'react';
import { SafeAreaView, Alert, Platform, ToastAndroid } from 'react-native';
import { ScansNavigator } from '../components';
import { useAppStore } from '../store/AppStore';

export default function ScansContainer() {
  const { savedScans, subjects, deleteScan } = useAppStore();

  // Remove the local state and useEffect since subjects are now in global state

  // Group scans by subject
  const groupedScans = useMemo(() => {
    const groups = {};
    savedScans.forEach(scan => {
      const subject = scan.subject || (availableSubjects.length > 0 ? availableSubjects[0] : 'Mathematics');
      if (!groups[subject]) {
        groups[subject] = [];
      }
      groups[subject].push(scan);
    });
    return groups;
  }, [savedScans]);

  // Create subjects array with scan counts (including subjects with 0 scans)
  const subjectsWithCounts = useMemo(() => {
    const subjectList = [];
    
    // Add all available subjects with their scan counts
    subjects.forEach(subject => {
      subjectList.push({
        name: subject,
        count: groupedScans[subject] ? groupedScans[subject].length : 0,
        scans: groupedScans[subject] || []
      });
    });

    // Add any additional subjects that exist in scans but not in available subjects
    Object.keys(groupedScans).forEach(subject => {
      if (!subjects.includes(subject)) {
        subjectList.push({
          name: subject,
          count: groupedScans[subject].length,
          scans: groupedScans[subject]
        });
      }
    });

    return subjectList.sort((a, b) => a.name.localeCompare(b.name));
  }, [groupedScans, subjects]);

  const handleScanPress = (scan) => {
    Alert.alert(
      'Scan Details',
      `Text: ${scan.text}\n\nDate: ${scan.date}`,
      [{ text: 'OK' }]
    );
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
      <ScansNavigator
        key={`scans-${savedScans.length}`} // Force re-render when scan count changes
        subjects={subjectsWithCounts}
        onScanPress={handleScanPress}
        onDeleteScan={handleDeleteScan}
      />
    </SafeAreaView>
  );
}
