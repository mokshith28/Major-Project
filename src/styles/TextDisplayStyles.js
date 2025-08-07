import { StyleSheet } from 'react-native';

export const TextDisplayStyles = StyleSheet.create({
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#666',
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
    backgroundColor: '#17a2b8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  textBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 100,
  },
  recognizedText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
