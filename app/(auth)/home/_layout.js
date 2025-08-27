import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="results" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
