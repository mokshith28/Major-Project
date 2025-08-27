import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ToastAndroid,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../../../src/store/AppStore';
import { copyToClipboard } from '../../../../src/utils';
import EditScanStyles from './EditScanStyles';

export default function EditScan() {
  const { scanId } = useLocalSearchParams();
  const { savedScans, updateScan } = useAppStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Find the scan by timestamp (using as ID)
  const scan = savedScans.find(s => s.timestamp.toString() === scanId);

  const [editedText, setEditedText] = useState(scan?.text || '');
  const [isModified, setIsModified] = useState(false);

  // Update edited text when scan changes (in case it gets updated)
  useEffect(() => {
    if (scan && scan.text !== editedText && !isModified) {
      setEditedText(scan.text);
    }
  }, [scan?.text, editedText, isModified]);

  if (!scan) {
    return (
      <View style={[EditScanStyles.notFoundContainer, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={EditScanStyles.statusBar.backgroundColor} />
        <Text style={EditScanStyles.notFoundText}>Scan not found</Text>
        <TouchableOpacity
          style={EditScanStyles.notFoundButton}
          onPress={() => router.back()}
        >
          <Text style={EditScanStyles.notFoundButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTextChange = (text) => {
    setEditedText(text);
    setIsModified(text !== scan.text);
  };

  const handleCopy = () => {
    copyToClipboard(editedText);
  };

  const handleSave = async () => {
    if (!editedText.trim()) {
      Alert.alert('Error', 'Text cannot be empty');
      return;
    }

    // Create updated scan object
    const updatedScan = {
      ...scan,
      text: editedText.trim(),
      date: new Date().toLocaleDateString(), // Update date to show it was modified
    };

    // Update scan in place to avoid "scan not found" flash
    await updateScan(scan, updatedScan);

    // Show success message
    if (Platform.OS === 'android') {
      ToastAndroid.show('Scan updated successfully!', ToastAndroid.SHORT);
    } else {
      Alert.alert('✅ Success!', 'Scan updated successfully!');
    }

    router.back();
  };

  const handleDiscard = () => {
    if (isModified) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back()
          }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={[EditScanStyles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar style={EditScanStyles.statusBar} />
      <ScrollView
        style={EditScanStyles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={EditScanStyles.header}>
          <TouchableOpacity
            style={EditScanStyles.backButton}
            onPress={handleDiscard}
            activeOpacity={0.8}
          >
            <Text style={EditScanStyles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={EditScanStyles.headerTitle}>Edit Scan</Text>
          <Text style={EditScanStyles.headerSubtitle}>
            📚 {scan.subject} • {scan.date}
          </Text>
        </View>

        {/* Edit Text Area */}
        <View style={EditScanStyles.textContainer}>
          <View style={EditScanStyles.textHeader}>
            <Text style={EditScanStyles.sectionTitle}>Scan Text</Text>
            <View style={EditScanStyles.headerActions}>
              {isModified && (
                <Text style={EditScanStyles.modifiedIndicator}>
                  Modified
                </Text>
              )}
              <TouchableOpacity
                style={EditScanStyles.copyButton}
                onPress={handleCopy}
              >
                <Text style={EditScanStyles.copyButtonText}>📋</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={EditScanStyles.textInput}
            value={editedText}
            onChangeText={handleTextChange}
            multiline
            placeholder="Enter scan text..."
            scrollEnabled
          />
        </View>

        {/* Action Buttons */}
        <View style={EditScanStyles.actionButtonsContainer}>
          <TouchableOpacity
            style={EditScanStyles.cancelButton}
            onPress={handleDiscard}
            activeOpacity={0.8}
          >
            <Text style={EditScanStyles.cancelButtonText}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              EditScanStyles.saveButton,
              isModified ? EditScanStyles.saveButtonEnabled : EditScanStyles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!isModified}
            activeOpacity={0.8}
          >
            <Text style={EditScanStyles.saveButtonText}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
