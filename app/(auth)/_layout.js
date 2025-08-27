import { Redirect, Tabs } from 'expo-router';
import { useAppStore } from '../../src/store/AppStore';
import { Colors, TabBarStyles } from '../../src/styles';
import { TabIcon } from '../../src/components';
import { LoadingScreen } from '../../src/screens';
import AppRouter from '../../src/router';

export default function AuthLayout() {
  const { isAuthenticated, isLoading, hasPermissions } = useAppStore();

  // Show loading screen while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    AppRouter.navigateToLogin();
  }

  // **** NEED TO UPDATE LATER ****
  // // If authenticated but no permissions, redirect to permissions screen
  // if (!hasPermissions) {
  //   AppRouter.navigateToPermissions();
  // }

  // If authenticated and has permissions, show the protected content with tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: TabBarStyles.tabBar,
        tabBarLabelStyle: TabBarStyles.tabBarLabel,
        tabBarItemStyle: TabBarStyles.tabBarItem,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
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
