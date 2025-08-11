import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const TabBarStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    height: 80,
    paddingBottom: 16,
    paddingTop: 16,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
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
    paddingVertical: 4,
  },
});
