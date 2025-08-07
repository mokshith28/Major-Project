import React from 'react';
import { View, Text } from 'react-native';
import { AppStyles } from '../styles/AppStyles';

const Header = () => {
  return (
    <View style={AppStyles.header}>
      <Text style={AppStyles.title}>Handwritten Notes Converter</Text>
      <Text style={AppStyles.subtitle}>
        Capture or select an image to extract text using Google Vision API
      </Text>
    </View>
  );
};

export default Header;
