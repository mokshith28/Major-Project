import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../styles/Colors';

const YourScansScreen = ({ scans, onScanPress }) => {
  const renderScanItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.scanItem}
      onPress={() => onScanPress(item)}
    >
      <View style={styles.scanHeader}>
        <Text style={styles.scanTitle}>Scan #{index + 1}</Text>
        <Text style={styles.scanDate}>{item.date}</Text>
      </View>
      <Text style={styles.scanPreview} numberOfLines={3}>
        {item.text}
      </Text>
      <Text style={styles.scanLanguage}>Language: {item.language}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Scans</Text>
        <Text style={styles.headerSubtitle}>
          {scans.length} {scans.length === 1 ? 'scan' : 'scans'} saved
        </Text>
      </View>

      {scans.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyTitle}>No scans yet</Text>
          <Text style={styles.emptyMessage}>
            Go to the Home tab to capture and recognize text
          </Text>
        </View>
      ) : (
        <FlatList
          data={scans}
          renderItem={renderScanItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.scansList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  scansList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scanItem: {
    backgroundColor: Colors.surface,
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.25,
  },
  scanDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  scanPreview: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  scanLanguage: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
});

export default YourScansScreen;
