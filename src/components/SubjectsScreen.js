import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import YourScansScreenStyles from '../styles/YourScansScreenStyles';

const SubjectsScreen = ({ subjects, onSubjectPress }) => {
  const hasAnyScans = subjects.some(subject => subject.count > 0);

  const renderSubjectItem = ({ item }) => (
    <TouchableOpacity
      style={[
        YourScansScreenStyles.subjectItem,
        item.count === 0 && YourScansScreenStyles.emptySubjectItem
      ]}
      onPress={() => onSubjectPress(item)}
    >
      <View style={YourScansScreenStyles.subjectHeader}>
        <Text style={[
          YourScansScreenStyles.subjectTitle,
          item.count === 0 && YourScansScreenStyles.emptySubjectTitle
        ]}>
          📚 {item.name}
        </Text>
        <Text style={[
          YourScansScreenStyles.subjectCount,
          item.count === 0 && YourScansScreenStyles.emptySubjectCount
        ]}>
          {item.count} {item.count === 1 ? 'scan' : 'scans'}
        </Text>
      </View>
      <Text style={[
        YourScansScreenStyles.subjectArrow,
        item.count === 0 && YourScansScreenStyles.emptySubjectArrow
      ]}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={YourScansScreenStyles.container}>
      <View style={YourScansScreenStyles.header}>
        <Text style={YourScansScreenStyles.headerTitle}>Your Subjects</Text>
        <Text style={YourScansScreenStyles.headerSubtitle}>
          {hasAnyScans 
            ? `${subjects.filter(s => s.count > 0).length} subjects with scans`
            : "Organize your scans by subject"}
        </Text>
      </View>

      {subjects.length === 0 ? (
        <View style={YourScansScreenStyles.emptyState}>
          <Text style={YourScansScreenStyles.emptyIcon}>📚</Text>
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
      )}
    </View>
  );
};

export default SubjectsScreen;
