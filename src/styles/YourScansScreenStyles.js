import { StyleSheet } from 'react-native';
import { Colors } from '../styles/Colors';

const YourScansScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
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
  scansList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scanItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanItem: {
    backgroundColor: Colors.surface,
    padding: 20,
    flex: 1,
    borderRadius: 20,
    borderWidth: 1
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.25,
  },
  scanDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  scanPreview: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  scanSubject: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  
  // Subject-related styles
  subjectsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subjectItem: {
    backgroundColor: Colors.surface,
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectHeader: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.25,
  },
  subjectCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  subjectArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
  emptySubjectItem: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
    borderStyle: 'dashed',
    borderColor: '#ddd',
  },
  emptySubjectTitle: {
    color: '#888',
    fontStyle: 'italic',
  },
  emptySubjectCount: {
    color: '#aaa',
  },
  emptySubjectArrow: {
    color: '#ccc',
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
  deleteButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.shadow,
    borderRadius: 15,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
    height: 185,
  },
  deleteButtonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default YourScansScreenStyles;
