import { Stack } from 'expo-router';

export default function ScansLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll handle our own headers
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[subject]" />
    </Stack>
  );
}
