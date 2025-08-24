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
import { getStoredSubjects, addNewSubject, removeSubject } from '../utils';

const SubjectActions = ({ onSave, onNewPhoto }) => {
  const [selectedSubject, setSelectedSubject] = useState('General Notes');
  const [subjects, setSubjects] = useState([]);
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
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const storedSubjects = await getStoredSubjects();
    setSubjects(storedSubjects);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(selectedSubject);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectText.trim()) {
      showToast('Please enter a subject name');
      return;
    }

    const result = await addNewSubject(newSubjectText, subjects);
    if (result.success) {
      setSubjects(result.subjects);
      setSelectedSubject(newSubjectText.trim());
      setNewSubjectText('');
      showToast('Subject added successfully!');
    } else {
      showToast('Subject already exists or could not be added');
    }
  };

  const handleRemoveSubject = async (subjectToRemove) => {
    const result = await removeSubject(subjectToRemove, subjects);
    if (result.success) {
      setSubjects(result.subjects);
      if (selectedSubject === subjectToRemove) {
        setSelectedSubject('General Notes');
      }
      showToast(`Subject "${subjectToRemove}" removed successfully!`);
    } else {
      showToast(result.error || 'Could not remove subject');
    }
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
