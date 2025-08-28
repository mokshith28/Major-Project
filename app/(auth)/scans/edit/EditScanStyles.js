import { StyleSheet } from 'react-native';
import { Colors } from '../../../../src/styles/Colors';

const EditScanStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statusBar: {
    backgroundColor: Colors.background,
    barStyle: 'dark-content',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 15,
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '600',
  },
  textContainer: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  textHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.25,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modifiedIndicator: {
    color: '#FF6B6B',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  copyButton: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    padding: 8,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    fontSize: 16,
  },
  textInput: {
    minHeight: 200,
    textAlignVertical: 'top',
    fontSize: 16,
    padding: 16,
    color: Colors.text,
    lineHeight: 24,
    backgroundColor: 'transparent',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  saveButtonEnabled: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  notFoundButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  notFoundButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  summerizerButtonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  summerizeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.primary
  },
  summerizeButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
});

export default EditScanStyles;
