import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

const ActionButtons = ({ onTakePhoto, onPickFromGallery, isProcessing }) => {
  return (
    <View style={AppStyles.buttonContainer}>
      <TouchableOpacity
        style={[AppStyles.button, AppStyles.primaryButton]}
        onPress={onTakePhoto}
        disabled={isProcessing}
      >
        <Text style={AppStyles.buttonText}>📷 Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[AppStyles.button, AppStyles.secondaryButton]}
        onPress={onPickFromGallery}
        disabled={isProcessing}
      >
        <Text style={AppStyles.buttonText}>🖼️ Choose from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;
