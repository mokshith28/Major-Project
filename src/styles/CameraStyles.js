import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const CameraStyles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  cameraButtonContainer: {
    backgroundColor: Colors.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 60,
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
  },
  cancelButtonText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  captureButton: {
    backgroundColor: Colors.white,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  rotateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateButtonText: {
    color: Colors.white,
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: -12,
    marginLeft: -2
  },
  captureButtonText: {
    fontSize: 30,
  },
});
