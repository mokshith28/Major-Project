import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  TextInput, 
  Modal, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ToastAndroid
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SubjectActionsStyles } from '../styles/SubjectActionsStyles';
import { useAppStore } from '../store/AppStore';

const SubjectActions = ({ onSave, onNewPhoto }) => {
  const { subjects, addSubject, removeSubject, savedScans, deleteScan, addScan } = useAppStore();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showManageModal, setShowManageModal] = useState(false);
  const [newSubjectText, setNewSubjectText] = useState('');

  // Helper function to show toast messages
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // For iOS, you could use a library like react-native-toast-message
      // For now, we'll use Alert as fallback
      Alert.alert('Info', message);
    }
  };

  useEffect(() => {
    // Remove loadSubjects since subjects come from global state
  }, []);

  // Set selected subject when subjects are loaded and no subject is selected
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0]);
    }
  }, [subjects, selectedSubject]);

  const loadSubjects = async () => {
    // No longer needed - subjects come from global state
  };

  const handleSave = () => {
    if (!selectedSubject) {
      showToast('Please select a subject category');
      return;
    }
    if (onSave) {
      onSave(selectedSubject);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectText.trim()) {
      showToast('Please enter a subject name');
      return;
    }

    const result = await addSubject(newSubjectText.trim());
    if (result.success) {
      setSelectedSubject(newSubjectText.trim());
      setNewSubjectText('');
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
      if (selectedSubject === subjectToRemove) {
        // Set to first available subject
        setSelectedSubject(subjects.length > 1 ? subjects.find(s => s !== subjectToRemove) : '');
      }
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

  return (
    <View>
      {/* Subject Selection */}
      <View style={SubjectActionsStyles.subjectContainer}>
        <View style={SubjectActionsStyles.subjectHeader}>
          <Text style={SubjectActionsStyles.subjectLabel}>Subject Category</Text>
          <TouchableOpacity
            style={SubjectActionsStyles.manageButton}
            onPress={() => setShowManageModal(true)}
          >
            <Text style={SubjectActionsStyles.manageButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={setSelectedSubject}
          style={SubjectActionsStyles.subjectPicker}
        >
          {subjects.map(subject => (
            <Picker.Item key={subject} label={subject} value={subject} />
          ))}
        </Picker>
      </View>

      {/* Action Buttons */}
      <View style={SubjectActionsStyles.actionButtons}>
        {onSave && (
          <TouchableOpacity
            style={[SubjectActionsStyles.actionButton, SubjectActionsStyles.saveButton]}
            onPress={handleSave}
          >
            <Text style={SubjectActionsStyles.actionButtonText}>💾</Text>
          </TouchableOpacity>
        )}
        {onNewPhoto && (
          <TouchableOpacity
            style={[SubjectActionsStyles.actionButton, SubjectActionsStyles.newPhotoButton]}
            onPress={onNewPhoto}
          >
            <Text style={SubjectActionsStyles.actionButtonText}>🔄</Text>
          </TouchableOpacity>
        )}
      </View>

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
                  key={subject} 
                  style={SubjectActionsStyles.subjectItem}
                  activeOpacity={0.7}
                >
                  <Text style={SubjectActionsStyles.subjectItemText}>{subject}</Text>
                  <TouchableOpacity
                    style={SubjectActionsStyles.removeButton}
                    onPress={() => handleRemoveSubject(subject)}
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

export default SubjectActions;
