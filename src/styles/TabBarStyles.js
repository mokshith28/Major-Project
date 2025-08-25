import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const TabBarStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 10,
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabBarHidden: {
    display: 'none',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  tabBarItem: {
    borderRadius: 16,
    marginHorizontal: 8,
  },
});
