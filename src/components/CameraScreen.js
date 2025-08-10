import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CameraView } from 'expo-camera';
import { AppStyles } from '../styles/AppStyles';
import { CameraStyles } from '../styles/CameraStyles';

const CameraScreen = ({ cameraRef, onCancel, onCapture, isProcessing }) => {
  const [facing, setFacing] = useState('back');

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };
  return (
    <View style={CameraStyles.cameraContainer}>
      <StatusBar style="light" />
      <CameraView
        style={CameraStyles.camera}
        facing={facing}
        ref={cameraRef}
      />
      <View style={CameraStyles.cameraButtonContainer}>
        <TouchableOpacity
          style={CameraStyles.cancelButton}
          onPress={onCancel}
        >
          <Text style={CameraStyles.cancelButtonText}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[CameraStyles.captureButton, isProcessing && AppStyles.disabledButton]}
          onPress={onCapture}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="large" color="#333" />
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          style={CameraStyles.rotateButton}
          onPress={toggleCameraFacing}
        >
          <Text style={CameraStyles.rotateButtonText}>↻</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraScreen;
