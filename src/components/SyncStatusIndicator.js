import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/AppStore';

const SyncStatusIndicator = () => {
  const { isFirebaseReady, isOffline, isSyncing } = useAppStore();

  if (isSyncing) {
    return (
      <View style={[styles.container, styles.syncing]}>
        <Text style={styles.text}>🔄 Syncing...</Text>
      </View>
    );
  }

  if (!isFirebaseReady && isOffline) {
    return (
      <View style={[styles.container, styles.offline]}>
        <Text style={styles.text}>📱 Offline</Text>
      </View>
    );
  }

  if (isFirebaseReady && !isOffline) {
    return (
      <View style={[styles.container, styles.synced]}>
        <Text style={styles.text}>🔄 Synced</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.syncing]}>
      <Text style={styles.text}>🔄 Sync Failed</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginVertical: 4,
    borderWidth: 1
  },
  offline: {
    backgroundColor: '#ffebee',
  },
  synced: {
    backgroundColor: '#d6fdd6ff',
  },
  syncing: {
    backgroundColor: '#fff3e0',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SyncStatusIndicator;
