import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../components';
import { colors } from '../theme';
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
  ScanResult: undefined;
  Notifications: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

// ─── Tab Icons ──────────────────────────────────────────────

const TabIcon = ({ label, iconName, focused }: { label: string; iconName: keyof typeof Ionicons.glyphMap; focused: boolean }) => (
  <View style={tabStyles.iconContainer}>
    <Ionicons name={iconName} size={focused ? 26 : 22} color={focused ? colors.primary : colors.textLight} />
    <Text
      variant="xs"
      weight={focused ? 'semiBold' : 'regular'}
      color={focused ? colors.primary : colors.textLight}
      style={{ marginTop: 2 }}
    >
      {label}
    </Text>
  </View>
);

const tabStyles = StyleSheet.create({
  iconContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 6 },
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

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        height: 80,
        paddingBottom: 16,
        paddingTop: 8,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon iconName={focused ? "home" : "home-outline"} label="Accueil" focused={focused} /> }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon iconName={focused ? "map" : "map-outline"} label="Carte" focused={focused} /> }}
    />
    <Tab.Screen
      name="Radar"
      component={RadarScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <View style={{
            width: 56, height: 56, borderRadius: 28,
            backgroundColor: colors.primary, justifyContent: 'center',
            alignItems: 'center', marginTop: -20,
            shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
          }}>
            <Ionicons name="camera" size={28} color={colors.white} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Rewards"
      component={RewardsScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon iconName={focused ? "gift" : "gift-outline"} label="Boutique" focused={focused} /> }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon iconName={focused ? "person" : "person-outline"} label="Profil" focused={focused} /> }}
    />
  </Tab.Navigator>
);

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
