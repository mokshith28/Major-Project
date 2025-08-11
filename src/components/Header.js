import React from 'react';
import { View, Text } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

const Header = () => {
  return (
    <View style={AppStyles.header}>
      <Text style={AppStyles.title}>📝 Notes Converter</Text>
      <Text style={AppStyles.subtitle}>
        AI-powered text extraction from handwritten notes
      </Text>
    </View>
  );
};

export default Header;
