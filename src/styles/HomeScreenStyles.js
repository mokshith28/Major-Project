import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  resultContainer: {
    flex: 1,
  },
});
