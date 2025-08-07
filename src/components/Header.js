import React from 'react';
import { View, Text } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

const Header = () => {
  return (
    <View style={AppStyles.header}>
      <Text style={AppStyles.title}>Handwritten Notes Converter</Text>
      <Text style={AppStyles.subtitle}>
        Extract text using Google Vision
      </Text>
    </View>
  );
};

export default Header;
