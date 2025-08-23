import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { APP_CONFIG } from '../config';
import { APP_ERRORS } from '../constants';

class ImageService {
  static async takePicture(cameraRef) {
    if (!cameraRef) {
      throw new Error(APP_ERRORS.CAMERA_UNAVAILABLE);
    }

    try {
      const photo = await cameraRef.takePictureAsync({
        quality: APP_CONFIG.IMAGE_QUALITY,
        base64: true,
        exif: false,
      });

      // Save to media library
      await MediaLibrary.createAssetAsync(photo.uri);

      return {
        uri: photo.uri,
        base64: photo.base64
      };
    } catch (error) {
      console.error('Camera Error:', error);
      throw new Error(`${APP_ERRORS.CAMERA_UNAVAILABLE}: ${error.message}`);
    }
  }

  static async pickFromGallery() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: APP_CONFIG.IMAGE_QUALITY,
        base64: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        return null; // User cancelled
      }

      const image = result.assets[0];
      return {
        uri: image.uri,
        base64: image.base64
      };
    } catch (error) {
      console.error('Gallery Error:', error);
      throw new Error(`Failed to pick image: ${error.message}`);
    }
  }
}

export default ImageService;
