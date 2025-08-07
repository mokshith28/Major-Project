import { useState, useEffect } from 'react';
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export const usePermissions = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  // Request media library permissions on component mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        setPermissionsLoading(true);

        // Request media library permission
        const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
        setMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
      } catch (error) {
        console.error('Error requesting media library permissions:', error);
        Alert.alert('Error', 'Failed to request media library permissions');
        setMediaLibraryPermission(false);
      } finally {
        setPermissionsLoading(false);
      }
    };

    requestPermissions();
  }, []);

  const requestAllPermissions = async () => {
    try {
      await requestCameraPermission();
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    } catch (error) {
      console.error('Error re-requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const hasAllPermissions = () => {
    return cameraPermission?.granted && mediaLibraryPermission === true;
  };

  return {
    cameraPermission,
    mediaLibraryPermission,
    permissionsLoading,
    requestAllPermissions,
    hasAllPermissions,
  };
};
