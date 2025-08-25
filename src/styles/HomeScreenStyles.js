import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const HomeScreenStyles = StyleSheet.create({
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

export default HomeScreenStyles;
