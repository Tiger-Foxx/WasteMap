import React, { useState, useRef, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { useAppStore } from '../hooks/useAppStore';

// Screens
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PhoneScreen } from '../screens/auth/PhoneScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { HomeScreen } from '../screens/main/HomeScreen';
import { MapScreen } from '../screens/main/MapScreen';
import { RadarScreen } from '../screens/main/RadarScreen';
import { RewardsScreen } from '../screens/main/RewardsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { LeaderboardScreen } from '../screens/main/LeaderboardScreen';
import { EventsScreen } from '../screens/main/EventsScreen';
import { ScanResultScreen } from '../screens/main/ScanResultScreen';
import { NotificationsScreen } from '../screens/main/NotificationsScreen';

// ─── Types de navigation ────────────────────────────────────

export type AuthStackParamList = {
  Phone: undefined;
  Otp: { phone: string };
};

export type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Radar: undefined;
  Rewards: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Leaderboard: undefined;
  Events: undefined;
  Radar: undefined;
  ScanResult: undefined;
  Notifications: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const TAB_BAR_HEIGHT = 68;
const TAB_ICON_SIZE = 44;

// ─── Tab Icons ──────────────────────────────────────────────

const TAB_BAR_COLOR = '#000000ff'; // Exact same as EcoPoints card

const TabIcon = ({ iconName, focused, activeColor = colors.primary }: { iconName: keyof typeof Ionicons.glyphMap; focused: boolean; activeColor?: string }) => {
  const animValue = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: focused ? 1 : 0,
      friction: 6,
      tension: 60,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', activeColor],
  });

  return (
    <Animated.View style={[
      tabStyles.pill, 
      { transform: [{ scale }, { translateY }], backgroundColor }
    ]}>
      <Ionicons name={iconName} size={24} color={focused ? '#FFFFFF' : '#64748B'} />
    </Animated.View>
  );
};

const tabStyles = StyleSheet.create({
  pill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Auth Navigator ─────────────────────────────────────────

const AuthNavigator = () => {
  const { login } = useAppStore();

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Phone">
        {({ navigation }) => (
          <PhoneScreen
            onSendOtp={(phone) => {
              navigation.navigate('Otp', { phone });
            }}
          />
        )}
      </AuthStack.Screen>
      <AuthStack.Screen name="Otp">
        {({ navigation, route }) => (
          <OtpScreen
            phone={(route.params as { phone: string }).phone}
            onVerify={async () => {
              await login((route.params as { phone: string }).phone);
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
};

// ─── Main Tab Navigator ─────────────────────────────────────

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: Math.max(insets.bottom, 20),
          height: 64,
          backgroundColor: TAB_BAR_COLOR,
          borderRadius: 32,
          borderTopWidth: 0,
          elevation: 0,
          paddingHorizontal: 0,
          paddingVertical: 0,
          marginHorizontal: 20,
        },
        tabBarItemStyle: {
          flex: 1,
          height: 64,
          padding: 0,
          marginVertical: 12,
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon iconName={focused ? 'home' : 'home-outline'} focused={focused} /> }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon iconName={focused ? 'map' : 'map-outline'} focused={focused} /> }}
    />
    <Tab.Screen
      name="RadarTab"
      component={HomeScreen}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.navigate('Radar');
        },
      })}
      options={{
        tabBarIcon: ({ focused }) => <TabIcon iconName={focused ? 'scan' : 'scan-outline'} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Rewards"
      component={RewardsScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon iconName={focused ? 'gift' : 'gift-outline'} focused={focused} activeColor="#FF7900" /> }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon iconName={focused ? 'person' : 'person-outline'} focused={focused} /> }}
    />
    </Tab.Navigator>
  );
};

// ─── Root Stack (Main + Modals) ─────────────────────────────

const MainNavigator = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="MainTabs" component={MainTabs} />
    <RootStack.Group screenOptions={{ presentation: 'modal' }}>
      <RootStack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <RootStack.Screen name="Events" component={EventsScreen} />
      <RootStack.Screen name="Notifications" component={NotificationsScreen} />
    </RootStack.Group>
    <RootStack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
      <RootStack.Screen name="Radar" component={RadarScreen} />
      <RootStack.Screen name="ScanResult">
        {({ navigation }) => (
          <ScanResultScreen
            onClose={() => navigation.goBack()}
            onConfirm={() => navigation.goBack()}
          />
        )}
      </RootStack.Screen>
    </RootStack.Group>
  </RootStack.Navigator>
);

// ─── Root App Navigator ─────────────────────────────────────

export const AppNavigator = () => {
  const { isAuthenticated, isOnboarded, completeOnboarding } = useAppStore();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
