import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

const PermissionScreen = ({ onRequestPermissions, isLoading }) => {
  if (isLoading) {
    return (
      <View style={AppStyles.centeredLoadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={AppStyles.loadingText}>Requesting permissions...</Text>
      </View>
    );
  }

  return (
    <View style={AppStyles.centeredContainer}>
      <Text style={AppStyles.errorText}>
        Camera and Media Library permissions are required to use this app.
      </Text>
      <TouchableOpacity
        style={AppStyles.button}
        onPress={onRequestPermissions}
      >
        <Text style={AppStyles.buttonText}>Grant Permissions</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PermissionScreen;
