import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../styles/Colors';

export const TabIcon = ({ name, color, size = 20, focused }) => {
  // Using basic symbols that should work on all devices
  const icons = {
    home: '🏠',
    scans: '📄',
  };

  const iconText = icons[name] || '▲';

  return (
    <View style={{
      backgroundColor: focused ? Colors.primaryLight : 'transparent',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 32,
      minHeight: 32,
    }}>
      <Text style={{
        fontSize: size,
        color: focused ? Colors.primary : (color || Colors.textTertiary),
        fontWeight: 'bold',
        lineHeight: size,
      }}>
        {iconText}
      </Text>
    </View>
  );
};
