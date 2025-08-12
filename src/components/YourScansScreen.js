import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import YourScansScreenStyles from '../styles/YourScansScreenStyles';

const YourScansScreen = ({ scans, onScanPress }) => {
  const renderScanItem = ({ item, index }) => (
    <TouchableOpacity
      style={YourScansScreenStyles.scanItem}
      onPress={() => onScanPress(item)}
    >
      <View style={YourScansScreenStyles.scanHeader}>
        <Text style={YourScansScreenStyles.scanTitle}>Scan #{index + 1}</Text>
        <Text style={YourScansScreenStyles.scanDate}>{item.date}</Text>
      </View>
      <Text style={YourScansScreenStyles.scanPreview} numberOfLines={3}>
        {item.text}
      </Text>
      <Text style={YourScansScreenStyles.scanLanguage}>Language: {item.language}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={YourScansScreenStyles.container}>
      <View style={YourScansScreenStyles.header}>
        <Text style={YourScansScreenStyles.headerTitle}>Your Scans</Text>
        <Text style={YourScansScreenStyles.headerSubtitle}>
          {scans.length} {scans.length === 1 ? 'scan' : 'scans'} saved
        </Text>
      </View>

      {scans.length === 0 ? (
        <View style={YourScansScreenStyles.emptyState}>
          <Text style={YourScansScreenStyles.emptyIcon}>📄</Text>
          <Text style={YourScansScreenStyles.emptyTitle}>No scans yet</Text>
          <Text style={YourScansScreenStyles.emptyMessage}>
            Go to the Home tab to capture and recognize text
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


export default YourScansScreen;
