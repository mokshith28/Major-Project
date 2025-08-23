import { useState, useEffect, useCallback } from 'react';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export const usePermissions = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  // Check permissions on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setPermissionsLoading(true);

        // Check media library permission
        const mediaLibraryStatus = await MediaLibrary.getPermissionsAsync();
        setMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
      } catch (error) {
        console.error('Error checking media library permissions:', error);
        setMediaLibraryPermission(false);
      } finally {
        setPermissionsLoading(false);
      }
    };

    checkPermissions();
  }, []);

  // Update loading state when camera permission changes
  useEffect(() => {
    if (cameraPermission !== null) {
      setPermissionsLoading(false);
    }
  }, [cameraPermission]);

  const requestAllPermissions = useCallback(async () => {
    try {
      setPermissionsLoading(true);
      
      // Request camera permission
      const cameraResult = await requestCameraPermission();
      
      // Request media library permission
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
      
      // Show alert if permissions denied
      if (!cameraResult.granted || mediaLibraryStatus.status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Camera and Media Library permissions are required for this app to work properly. Please grant them in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    } finally {
      setPermissionsLoading(false);
    }
  }, [requestCameraPermission]);

  const hasAllPermissions = useCallback(() => {
    const result = cameraPermission?.granted === true && mediaLibraryPermission === true;
    return result;
  }, [cameraPermission?.granted, mediaLibraryPermission]);

  return {
    cameraPermission,
    mediaLibraryPermission,
    permissionsLoading,
    requestAllPermissions,
    hasAllPermissions,
  };
};
