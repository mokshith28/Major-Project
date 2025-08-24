import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const TextDisplayStyles = StyleSheet.create({
  imageContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: -0.25,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: Colors.surfaceVariant,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  textContainer: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 28,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1
  },
  textHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  copyButton: {
    backgroundColor: Colors.info,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  copyButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.25,
    textAlign: "center"
  },
  textBox: {
    backgroundColor: Colors.background,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 120,
  },
  recognizedText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  languageText: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginTop: 12,
    marginBottom: 20,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: Colors.success,
    flex: 1,
    maxWidth: 140,
    borderWidth: 1,
  },
  newPhotoButton: {
    backgroundColor: Colors.primary,
    flex: 1,
    maxWidth: 140,
    borderWidth: 1,
  },
  // Image Gallery Styles
  galleryCounter: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    fontWeight: '500',
  },
  pagerView: {
    height: 590,
    width: '90%',
  },
  imagePageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    backgroundColor: Colors.border,
  },
});
