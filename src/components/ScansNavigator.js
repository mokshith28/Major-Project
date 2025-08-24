import React, { useState } from 'react';
import { View } from 'react-native';
import SubjectsScreen from './SubjectsScreen';
import ScansListScreen from './ScansListScreen';

const ScansNavigator = ({ subjects, onScanPress, onDeleteScan }) => {
  const [currentScreen, setCurrentScreen] = useState('subjects');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleSubjectPress = (subject) => {
    setSelectedSubject(subject);
    setCurrentScreen('scans');
  };

  const handleBackPress = () => {
    setSelectedSubject(null);
    setCurrentScreen('subjects');
  };

  const handleDeleteScan = async (scan) => {
    if (onDeleteScan) {
      await onDeleteScan(scan);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'subjects':
        return (
          <SubjectsScreen
            subjects={subjects}
            onSubjectPress={handleSubjectPress}
          />
        );
      case 'scans':
        // Get fresh subject data from subjects prop
        const currentSubject = subjects.find(s => s.name === selectedSubject?.name) || selectedSubject;
        return (
          <ScansListScreen
            scans={currentSubject?.scans || []}
            subject={currentSubject}
            onScanPress={onScanPress}
            onBackPress={handleBackPress}
            onDeleteScan={handleDeleteScan}
          />
        );
      default:
        return (
          <SubjectsScreen
            subjects={subjects}
            onSubjectPress={handleSubjectPress}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
    </View>
  );
};

export default ScansNavigator;
