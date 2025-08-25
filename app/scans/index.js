import React, { useMemo } from 'react';
import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SubjectsScreen } from '../../src/components';
import { useAppStore } from '../../src/store/AppStore';
import { YourScansScreenStyles } from '../../src/styles';

export default function ScansIndex() {
  const { savedScans, subjects } = useAppStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Group scans by subject
  const groupedScans = useMemo(() => {
    const groups = {};
    savedScans.forEach(scan => {
      const subject = scan.subject || (subjects.length > 0 ? subjects[0] : 'Mathematics');
      if (!groups[subject]) {
        groups[subject] = [];
      }
      groups[subject].push(scan);
    });
    return groups;
  }, [savedScans, subjects]);

  // Create subjects array with scan counts
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

  const handleSubjectPress = (subject) => {
    // Navigate to the subject's scans using Expo Router
    router.push(`/scans/${encodeURIComponent(subject.name)}`);
  };

  return (
    <View style={[YourScansScreenStyles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={YourScansScreenStyles.statusBar.backgroundColor} />
      <SubjectsScreen
        subjects={subjectsWithCounts}
        onSubjectPress={handleSubjectPress}
      />
    </View>
  );
}
