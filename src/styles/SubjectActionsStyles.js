import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const SubjectActionsStyles = StyleSheet.create({
  // Subject Selection Styles
  subjectContainer: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectLabel: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  manageButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  manageButtonText: {
    fontSize: 14,
  },
  subjectPicker: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginTop: 8,
  },

  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: Colors.info,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    maxWidth: 140,
  },
  saveButton: {
    backgroundColor: Colors.surfaceVariant,
  },
  newPhotoButton: {
    backgroundColor: Colors.surfaceVariant,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.25,
    textAlign: "center"
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Add Subject Styles
  addSubjectContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  subjectInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    fontSize: 16,
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  addButtonText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 16,
  },

  // Subject List Styles
  subjectsList: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: 300,
    marginBottom: 20,
  },
  subjectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subjectItemText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: Colors.surfaceVariant,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  closeButtonText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
});
