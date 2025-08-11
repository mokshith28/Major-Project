import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Header,
  ActionButtons,
  CameraScreen,
  PermissionScreen,
  ImageDisplay,
  ProcessingIndicator,
  TextDisplay
} from '../src/components';
import { useAppContext } from '../src/context';
import { HomeScreenStyles } from '../src/styles';

export default function HomeScreen() {
  const {
    hasAllPermissions,
    requestPermission,
    showCamera,
    capturedImage,
    isProcessing,
    recognizedText,
    takePicture,
    pickImageFromGallery,
    resetApp,
    saveResult,
    setShowCamera,
    setCameraRef,
  } = useAppContext();

  if (hasAllPermissions === null) {
    return <SafeAreaView style={HomeScreenStyles.container} />;
  }

  if (hasAllPermissions === false) {
    return (
      <SafeAreaView style={HomeScreenStyles.container}>
        <Header />
        <ScrollView
          style={HomeScreenStyles.content}
          contentContainerStyle={HomeScreenStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <PermissionScreen onRequestPermission={requestPermission} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={HomeScreenStyles.container}>
      <ScrollView
        style={HomeScreenStyles.content}
        contentContainerStyle={HomeScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {showCamera ? (
          <CameraScreen
            cameraRef={(ref) => setCameraRef(ref)}
            onCapture={takePicture}
            onCancel={() => setShowCamera(false)}
            isProcessing={isProcessing}
          />
        ) : (
          <View style={HomeScreenStyles.content}>
            {!capturedImage ? (
              <ActionButtons
                onTakePhoto={() => setShowCamera(true)}
                onPickFromGallery={pickImageFromGallery}
                isProcessing={isProcessing}
              />
            ) : (
              <View style={HomeScreenStyles.resultContainer}>
                <ImageDisplay imageUri={capturedImage} />
                {isProcessing ? (
                  <ProcessingIndicator />
                ) : (
                  recognizedText && (
                    <TextDisplay
                      text={recognizedText.text}
                      language={recognizedText.language}
                      onSave={saveResult}
                      onNewPhoto={resetApp}
                    />
                  )
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
