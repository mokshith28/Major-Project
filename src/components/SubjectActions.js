import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ToastAndroid
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SubjectActionsStyles } from '../styles/SubjectActionsStyles';
import { useAppStore } from '../store/AppStore';

const SubjectActions = ({ onSave, onNewPhoto }) => {
  const { subjects } = useAppStore();
  const [selectedSubject, setSelectedSubject] = useState('');

  // Helper function to show toast messages
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  // Set selected subject when subjects are loaded and no subject is selected
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0]);
    }
  }, [subjects, selectedSubject]);

  const handleSave = () => {
    if (!selectedSubject) {
      showToast('Please select a subject category');
      return;
    }
    if (onSave) {
      onSave(selectedSubject);
    }
  };

  return (
    <View>
      {/* Subject Selection */}
      <View style={SubjectActionsStyles.subjectContainer}>
        <View style={SubjectActionsStyles.subjectHeader}>
          <Text style={SubjectActionsStyles.subjectLabel}>Subject Category</Text>
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
            <Text style={SubjectActionsStyles.actionButtonText}>✖️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SubjectActions;
