import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mutedText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.primaryButton,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButton: {
    backgroundColor: Colors.primaryButton,
  },
  secondaryButton: {
    backgroundColor: Colors.secondaryButton,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: Colors.secondaryBackground,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.mutedText,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  resetButton: {
    backgroundColor: Colors.error,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centeredLoadingContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
