import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, TabBarStyles } from '../src/styles';
import { TabIcon } from '../src/components';
import { AppProvider } from '../src/store/AppStore';
import { useAppStore } from '../src/store/AppStore';
import { SCREEN_STATES } from '../src/constants';

function TabsLayout() {
  const { screenState } = useAppStore();
  const hideTabBar = screenState === SCREEN_STATES.CAMERA;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: hideTabBar ? TabBarStyles.tabBarHidden : TabBarStyles.tabBar,
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
