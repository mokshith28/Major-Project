import React from 'react';
import { View, ScrollView, Platform, ToastAndroid, Alert, StatusBar, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButtons } from '../components';
import { useAppStore } from '../store/AppStore';
import { ImageService, OCRService } from '../services';
import { HomeScreenStyles } from '../styles';
import { AppRouter } from '../router';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    isProcessing,
    setProcessing,
    setCapturedImage,
    setRecognizedText,
    setError,
    signOut,
    resetApp,
  } = useAppStore();

  const handleTakePhoto = () => {
    AppRouter.navigateToCamera();
  };

  const handlePickFromGallery = async () => {
    try {
      setProcessing(true);
      const galleryResult = await ImageService.pickFromGallery();

      if (!galleryResult) {
        setProcessing(false);
        return; // User cancelled
      }

      // Handle single or multiple images
      if (Array.isArray(galleryResult)) {
        // Multiple images selected
        setCapturedImage(galleryResult);

        // Navigate to processing screen
        AppRouter.navigateToProcessing();

        // Process all images and combine text
        const base64Images = galleryResult.map(img => img.base64);
        const combinedText = await OCRService.processMultipleImages(base64Images);
        setRecognizedText({ text: combinedText });

        // Navigate to results
        AppRouter.navigateToResults();
      } else {
        // Single image selected (backward compatibility)
        setCapturedImage([galleryResult]);

        // Navigate to processing screen
        AppRouter.navigateToProcessing();

        // Perform OCR on single image
        const text = await OCRService.processImage(galleryResult.base64);
        setRecognizedText({ text });

        // Navigate to results
        AppRouter.navigateToResults();
      }
    } catch (error) {
      setError(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = () => {
    signOut();
    resetApp();
    AppRouter.resetToLogin();
  };

  return (
    <View style={[HomeScreenStyles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={HomeScreenStyles.statusBar.backgroundColor} />

      {/* Logout Button - only show when authenticated */}
      {isAuthenticated && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: insets.top + 10,
            right: 20,
            zIndex: 1000,
            backgroundColor: '#ffaaaaff',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#000'
          }}
          onPress={handleLogout}
        >
          <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        style={HomeScreenStyles.content}
        contentContainerStyle={HomeScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ActionButtons
          onTakePhoto={handleTakePhoto}
          onPickFromGallery={handlePickFromGallery}
          isProcessing={isProcessing}
        />
      </ScrollView>
    </View>
  );
}
