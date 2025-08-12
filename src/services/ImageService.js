import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

class ImageService {
  // Function to take a picture using the camera
  static async takePicture(cameraRef) {
    if (!cameraRef) {
      throw new Error('Camera reference is not available');
    }

    try {
      // Capture photo with high quality settings
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: true, // We need base64 for cloud OCR APIs
        exif: false,
      });

      // Save the photo to device's media library
      await MediaLibrary.createAssetAsync(photo.uri);

      return {
        uri: photo.uri,
        base64: photo.base64
      };
    } catch (error) {
      console.error('Error taking picture:', error);
      throw new Error('Failed to take picture: ' + error.message);
    }
  }

  // Function to select image from gallery
  static async pickImageFromGallery() {
    try {
      // Launch image picker with specific options
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true, // We need base64 for cloud OCR APIs
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        return {
          uri: image.uri,
          base64: image.base64
        };
      } else {
        throw new Error('No image selected');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      throw new Error('Failed to pick image from gallery: ' + error.message);
    }
  }
}

export default ImageService;
