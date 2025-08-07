import { StyleSheet } from 'react-native';

export const CameraStyles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 50,
    paddingHorizontal: 30,
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 10,
  },
  captureButton: {
    backgroundColor: '#0066cc',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 30,
  },
});
