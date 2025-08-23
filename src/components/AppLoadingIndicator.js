import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AppStyles } from '../styles/AppStyles';
import { Colors } from '../styles/Colors';

const AppLoadingIndicator = () => {
  return (
    <View style={AppStyles.centeredLoadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={AppStyles.loadingText}>Loading...</Text>
    </View>
  );
};

export default AppLoadingIndicator;
