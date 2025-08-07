import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView } from 'expo-camera';
import { AppStyles } from '../styles/AppStyles';
import { CameraStyles } from '../styles/CameraStyles';

const CameraScreen = ({ cameraRef, onCancel, onCapture, isProcessing }) => {
  return (
    <View style={AppStyles.container}>
      <StatusBar style="light" />
      <CameraView
        style={CameraStyles.camera}
        facing="back"
        ref={cameraRef}
      >
        <View style={CameraStyles.cameraButtonContainer}>
          <TouchableOpacity
            style={CameraStyles.cancelButton}
            onPress={onCancel}
          >
            <Text style={AppStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[CameraStyles.captureButton, isProcessing && AppStyles.disabledButton]}
            onPress={onCapture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={CameraStyles.captureButtonText}>📷</Text>
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default CameraScreen;
