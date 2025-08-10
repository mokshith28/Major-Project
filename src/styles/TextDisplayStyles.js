import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const TextDisplayStyles = StyleSheet.create({
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 10,
  },
  capturedImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  processingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.mutedText,
  },
  textContainer: {
    marginBottom: 20,
  },
  textHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: Colors.info,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  textBox: {
    backgroundColor: Colors.secondaryBackground,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.mutedText,
    minHeight: 100,
  },
  recognizedText: {
    fontSize: 16,
    color: Colors.primaryText,
    lineHeight: 24,
  },
});
