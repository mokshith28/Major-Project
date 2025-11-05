import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid
} from 'react-native';
import YourScansScreenStyles from '../styles/YourScansScreenStyles';
import { SubjectActionsStyles } from '../styles/SubjectActionsStyles';
import { useAppStore } from '../store/AppStore';
import SearchBar from './SearchBar';
import SyncStatusIndicator from './SyncStatusIndicator';
import { copyToClipboard } from '../utils';

const SubjectsScreen = ({ subjects, onSubjectPress }) => {
  const { addSubject, removeSubject, savedScans, deleteScan } = useAppStore();
  const [showManageModal, setShowManageModal] = useState(false);
  const [newSubjectText, setNewSubjectText] = useState('');
  const [searchText, setSearchText] = useState('');

  const hasAnyScans = subjects.some(subject => subject.count > 0);

  // Filter scans by search text
  const filteredScans = searchText.trim()
    ? savedScans.filter(scan =>
      scan.text && scan.text.toLowerCase().includes(searchText.trim().toLowerCase())
    )
    : [];

  // Helper function to show toast messages
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectText.trim()) {
      showToast('Please enter a subject name');
      return;
    }
    const newSubject = {
      name: newSubjectText.trim(),
      timestamp: Date.now(),
    };

    setNewSubjectText('');
    const result = await addSubject(newSubject);
    if (result.success) {
      showToast('Subject added successfully!');
    } else {
      showToast('Subject already exists or could not be added');
    }
  };

  const handleRemoveSubject = async (subjectToRemove) => {
    // Check if there are scans with this subject
    const scansWithSubject = savedScans.filter(scan => scan.subject === subjectToRemove);

    if (scansWithSubject.length > 0) {
      // Show warning about deleting scans
      Alert.alert(
        'Delete Subject?',
        `This will delete the subject "${subjectToRemove}" and ${scansWithSubject.length} scan${scansWithSubject.length === 1 ? '' : 's'}. This action cannot be undone.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete All',
            style: 'destructive',
            onPress: () => deleteSubjectAndScans(subjectToRemove),
          },
        ]
      );
    } else {
      // No scans, safe to delete
      proceedWithSubjectDeletion(subjectToRemove);
    }
  };

  const proceedWithSubjectDeletion = async (subjectToRemove) => {
    const result = await removeSubject(subjectToRemove);
    if (result.success) {
      showToast(`Subject "${subjectToRemove}" removed successfully!`);
    } else {
      showToast(result.error || 'Could not remove subject');
    }
  };

  const deleteSubjectAndScans = async (subjectToRemove) => {
    // Delete all scans with this subject
    const scansToDelete = savedScans.filter(scan => scan.subject === subjectToRemove);

    for (const scan of scansToDelete) {
      await deleteScan(scan);
    }

    // Now delete the subject
    await proceedWithSubjectDeletion(subjectToRemove);
    showToast(`Deleted subject and ${scansToDelete.length} scan${scansToDelete.length === 1 ? '' : 's'}`);
  };

  const handleExportSubject = async (item) => {
    await copyToClipboard(item.firebaseID);
  };

  const renderSubjectItem = ({ item }) => (
    <View style={YourScansScreenStyles.subjectItemContainer}>
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
      <TouchableOpacity
        style={YourScansScreenStyles.shareButton}
        onPress={() => handleExportSubject(item)}
      >
        <Text style={YourScansScreenStyles.deleteButtonText}>⬆️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={YourScansScreenStyles.container}>
      <View style={YourScansScreenStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={YourScansScreenStyles.headerTitle}>Your Subjects</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setShowManageModal(true)} style={{ marginLeft: 12, padding: 4 }}>
              <Text style={{ fontSize: 22 }}>✏️</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={YourScansScreenStyles.headerSubtitle}>
          {hasAnyScans
            ? `${subjects.filter(s => s.count > 0).length} subjects with scans`
            : "Organize your scans by subject"}
        </Text>
        <SyncStatusIndicator />
      </View>
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search all notes..."
      />
      {searchText.trim() ? (
        filteredScans.length === 0 ? (
          <View style={YourScansScreenStyles.emptyState}>
            <Text style={YourScansScreenStyles.emptyIcon}>🔍</Text>
            <Text style={YourScansScreenStyles.emptyTitle}>No results found</Text>
            <Text style={YourScansScreenStyles.emptyMessage}>
              No notes match your search.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredScans}
            renderItem={({ item, index }) => (
              <View style={YourScansScreenStyles.scanItemContainer}>
                <View style={YourScansScreenStyles.scanItem}>
                  <View style={YourScansScreenStyles.scanHeader}>
                    <Text style={YourScansScreenStyles.scanTitle}>Scan</Text>
                    <Text style={YourScansScreenStyles.scanDate}>{item.date}</Text>
                  </View>
                  {item.subject && (
                    <Text style={YourScansScreenStyles.scanSubject}>📚 {item.subject}</Text>
                  )}
                  <Text style={YourScansScreenStyles.scanPreview} numberOfLines={3}>
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item, idx) => item.timestamp?.toString() || idx.toString()}
            style={YourScansScreenStyles.scansList}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        subjects.length === 0 ? (
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
        )
      )}

      {/* Subject Management Modal */}
      <Modal
        visible={showManageModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowManageModal(false)}
      >
        <View style={SubjectActionsStyles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={SubjectActionsStyles.modalContent}
          >
            <Text style={SubjectActionsStyles.modalTitle}>Manage Subjects</Text>

            {/* Add New Subject */}
            <View style={SubjectActionsStyles.addSubjectContainer}>
              <TextInput
                style={SubjectActionsStyles.subjectInput}
                placeholder="Enter new subject name"
                value={newSubjectText}
                onChangeText={setNewSubjectText}
                onSubmitEditing={handleAddSubject}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={SubjectActionsStyles.addButton}
                onPress={handleAddSubject}
              >
                <Text style={SubjectActionsStyles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Subject List */}
            <ScrollView
              style={SubjectActionsStyles.subjectsList}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {subjects.map(subject => (
                <TouchableOpacity
                  key={subject.name}
                  style={SubjectActionsStyles.subjectItem}
                  activeOpacity={0.7}
                >
                  <Text style={SubjectActionsStyles.subjectItemText}>{subject.name}</Text>
                  <TouchableOpacity
                    style={SubjectActionsStyles.removeButton}
                    onPress={() => handleRemoveSubject(subject.name)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={SubjectActionsStyles.removeButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={SubjectActionsStyles.closeButton}
              onPress={() => setShowManageModal(false)}
            >
              <Text style={SubjectActionsStyles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

export default SubjectsScreen;
