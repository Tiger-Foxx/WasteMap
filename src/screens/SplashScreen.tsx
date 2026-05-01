import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import { Text } from '../components';
import { colors } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.7));
  const [taglineFade] = useState(new Animated.Value(0));

  useEffect(() => {
    // Séquence d'animation d'entrée
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      // 2. Tagline apparaît
      Animated.timing(taglineFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      // 3. Pause
      Animated.delay(1200),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Lottie Animation */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <LottieView
          source={require('../../assets/lotties/Recycle-Loader.json')}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, { opacity: taglineFade }]}>
        <Text variant="xl" weight="bold" color={colors.textDark} align="center">
          WasteMap
        </Text>
        <View style={styles.taglineLine} />
        <Text variant="m" color={colors.textMuted} align="center" style={styles.taglineSub}>
          Ensemble pour des villes propres et durables
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    letterSpacing: 1,
  },
  taglineContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  taglineLine: {
    width: 40,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
    marginVertical: 12,
  },
  taglineSub: {
    lineHeight: 20,
  },
});
