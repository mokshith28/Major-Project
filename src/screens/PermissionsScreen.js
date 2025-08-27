import React from 'react';
import { PermissionScreen } from '../components';
import { useAppStore } from '../store/AppStore';

export default function PermissionsScreen() {
  const { requestPermissions, hasPermissions } = useAppStore();

  const handleRequestPermissions = async () => {
    await requestPermissions();
    // After permissions are granted, navigate back to home;
    AppRouter.resetToHome();
  };

  return (
    <PermissionScreen onRequestPermissions={handleRequestPermissions} />
  );
}
