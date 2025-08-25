import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { SubjectsScreen } from '../../src/components';
import { useAppStore } from '../../src/store/AppStore';

export default function ScansIndex() {
  const { savedScans, subjects } = useAppStore();
  const router = useRouter();

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
    <SafeAreaView style={{ flex: 1 }}>
      <SubjectsScreen
        subjects={subjectsWithCounts}
        onSubjectPress={handleSubjectPress}
      />
    </SafeAreaView>
  );
}
