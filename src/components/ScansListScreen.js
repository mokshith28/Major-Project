import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import ExportButton from './ExportButton';
import YourScansScreenStyles from '../styles/YourScansScreenStyles';
import SyncStatusIndicator from './SyncStatusIndicator';

const ScansListScreen = ({ scans, subject, onScanPress, onBackPress, onDeleteScan }) => {
  const handleDeleteScan = (scan, index) => {
    Alert.alert(
      'Delete Scan',
      `Are you sure you want to delete Scan #${index + 1}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteScan(scan),
        },
      ]
    );
  };

  const renderScanItem = ({ item, index }) => (
    <View style={YourScansScreenStyles.scanItemContainer}>
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
      <View style={YourScansScreenStyles.scanActionButtons}>
        {onDeleteScan && (
          <TouchableOpacity
            style={YourScansScreenStyles.deleteButton}
            onPress={() => handleDeleteScan(item, index)}
          >
            <Text style={YourScansScreenStyles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        )}
        <ExportButton
          scan={item}
          index={index}
          onExportComplete={() => {
            // Optional: Add any success handling here
          }}
          onExportError={(error) => {
            // Optional: Add any error handling here
            console.error('Export failed:', error);
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={YourScansScreenStyles.container}>
      <View style={YourScansScreenStyles.header}>
        <TouchableOpacity
          style={YourScansScreenStyles.backButton}
          onPress={onBackPress}
        >
          <Text style={YourScansScreenStyles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={YourScansScreenStyles.headerTitle}>{subject.name}</Text>
        <Text style={YourScansScreenStyles.headerSubtitle}>
          {scans.length} {scans.length === 1 ? 'scan' : 'scans'}
        </Text>
        <SyncStatusIndicator />
      </View>

      {scans.length === 0 ? (
        <View style={YourScansScreenStyles.emptyState}>
          <Text style={YourScansScreenStyles.emptyIcon}>📄</Text>
          <Text style={YourScansScreenStyles.emptyTitle}>No scans in this subject</Text>
          <Text style={YourScansScreenStyles.emptyMessage}>
            Go to the Home tab to capture new scans and organize them in this subject
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
      )}
    </View>
  );
};

export default ScansListScreen;
