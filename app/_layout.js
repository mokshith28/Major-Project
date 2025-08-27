import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/store/AppStore';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Slot />
      </AppProvider>
    </SafeAreaProvider>
  );
}
