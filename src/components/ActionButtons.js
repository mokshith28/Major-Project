import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

const ActionButtons = ({ onTakePhoto, onPickFromGallery, isProcessing }) => {
  return (
    <View style={AppStyles.buttonContainer}>
      <TouchableOpacity
        style={[AppStyles.button, AppStyles.photoBtn]}
        onPress={onTakePhoto}
        disabled={isProcessing}
      >
        <Text style={{ fontSize: 48, marginBottom: 12 }}>📷</Text>
        <Text style={AppStyles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[AppStyles.button, AppStyles.galleryBtn]}
        onPress={onPickFromGallery}
        disabled={isProcessing}
      >
        <Text style={{ fontSize: 48, marginBottom: 12 }}>🖼️</Text>
        <Text style={AppStyles.buttonText}>Choose from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;
