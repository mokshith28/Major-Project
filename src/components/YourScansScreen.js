import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import YourScansScreenStyles from '../styles/YourScansScreenStyles';

const YourScansScreen = ({ 
  scans, 
  subjects, 
  selectedSubject, 
  onScanPress, 
  onSubjectPress, 
  onBackPress, 
  showSubjects 
}) => {
  const renderSubjectItem = ({ item }) => (
    <TouchableOpacity
      style={YourScansScreenStyles.subjectItem}
      onPress={() => onSubjectPress(item)}
    >
      <View style={YourScansScreenStyles.subjectHeader}>
        <Text style={YourScansScreenStyles.subjectTitle}>📚 {item.name}</Text>
        <Text style={YourScansScreenStyles.subjectCount}>
          {item.count} {item.count === 1 ? 'scan' : 'scans'}
        </Text>
      </View>
      <Text style={YourScansScreenStyles.subjectArrow}>›</Text>
    </TouchableOpacity>
  );

  const renderScanItem = ({ item, index }) => (
    <TouchableOpacity
      style={YourScansScreenStyles.scanItem}
      onPress={() => onScanPress(item)}
    >
      <View style={YourScansScreenStyles.scanHeader}>
        <Text style={YourScansScreenStyles.scanTitle}>Scan #{index + 1}</Text>
        <Text style={YourScansScreenStyles.scanDate}>{item.date}</Text>
      </View>
      {item.subject && (
        <Text style={YourScansScreenStyles.scanSubject}>📚 {item.subject}</Text>
      )}
      <Text style={YourScansScreenStyles.scanPreview} numberOfLines={3}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={YourScansScreenStyles.container}>
      <View style={YourScansScreenStyles.header}>
        {selectedSubject && (
          <TouchableOpacity 
            style={YourScansScreenStyles.backButton}
            onPress={onBackPress}
          >
            <Text style={YourScansScreenStyles.backButtonText}>‹ Back</Text>
          </TouchableOpacity>
        )}
        <Text style={YourScansScreenStyles.headerTitle}>
          {showSubjects ? 'Your Subjects' : selectedSubject?.name}
        </Text>
        <Text style={YourScansScreenStyles.headerSubtitle}>
          {showSubjects 
            ? `${subjects.length} ${subjects.length === 1 ? 'subject' : 'subjects'}`
            : `${scans.length} ${scans.length === 1 ? 'scan' : 'scans'}`
          }
        </Text>
      </View>

      {showSubjects ? (
        // Show subjects view
        subjects.length === 0 ? (
          <View style={YourScansScreenStyles.emptyState}>
            <Text style={YourScansScreenStyles.emptyIcon}>�</Text>
            <Text style={YourScansScreenStyles.emptyTitle}>No subjects yet</Text>
            <Text style={YourScansScreenStyles.emptyMessage}>
              Go to the Home tab to capture and organize your scans
            </Text>
          </View>
        ) : (
          <FlatList
            data={subjects}
            renderItem={renderSubjectItem}
            keyExtractor={(item) => item.name}
            style={YourScansScreenStyles.subjectsList}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        // Show scans view for selected subject
        scans.length === 0 ? (
          <View style={YourScansScreenStyles.emptyState}>
            <Text style={YourScansScreenStyles.emptyIcon}>📄</Text>
            <Text style={YourScansScreenStyles.emptyTitle}>No scans in this subject</Text>
            <Text style={YourScansScreenStyles.emptyMessage}>
              This subject doesn't have any scans yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={scans}
            renderItem={renderScanItem}
            keyExtractor={(item, index) => index.toString()}
            style={YourScansScreenStyles.scansList}
            showsVerticalScrollIndicator={false}
          />
        )
      )}
    </View>
  );
};

export default YourScansScreen;
