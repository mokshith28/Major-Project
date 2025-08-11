import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, TabBarStyles } from '../src/styles';
import { TabIcon } from '../src/components';
import { AppProvider, useAppContext } from '../src/context';

function TabsLayout() {
  const { showCamera } = useAppContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: showCamera ? TabBarStyles.tabBarHidden : TabBarStyles.tabBar,
        tabBarLabelStyle: TabBarStyles.tabBarLabel,
        tabBarItemStyle: TabBarStyles.tabBarItem,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="scans"
        options={{
          title: 'Scans',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="scans" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <TabsLayout />
      </AppProvider>
    </SafeAreaProvider>
  );
}
