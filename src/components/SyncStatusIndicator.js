import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '../store/AppStore';

const SyncStatusIndicator = () => {
  const { isFirebaseReady, isOffline } = useAppStore();

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
        <Text style={styles.text}>☁️ Synced</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.syncing]}>
      <Text style={styles.text}>🔄 Syncing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  offline: {
    backgroundColor: '#ffebee',
  },
  synced: {
    backgroundColor: '#e8f5e8',
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
