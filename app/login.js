import React from 'react';
import { Redirect } from 'expo-router';
import { EmailSignIn } from '../src/components';
import { useAppStore } from '../src/store/AppStore';

export default function LoginScreen() {
  const { isAuthenticated, signIn } = useAppStore();

  // If already authenticated, redirect to main app
  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  const handleSignInSuccess = (user) => {
    console.log('Sign-in successful, redirecting to main app');
    signIn(user);
    // Expo Router will automatically handle the redirect via the auth layout
  };

  return <EmailSignIn onSignInSuccess={handleSignInSuccess} />;
}
