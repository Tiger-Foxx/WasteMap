import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, StatusBar } from 'react-native';
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
      // 1. Logo apparaît avec un scale + fade
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
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
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Cercle décoratif en arrière-plan */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Logo et titre */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Icône de recyclage stylisée */}
        <View style={styles.logoIcon}>
          <View style={styles.logoInner}>
            <Text variant="huge" weight="bold" color={colors.primary} align="center">
              ♻
            </Text>
          </View>
        </View>

        <Text variant="huge" weight="bold" color={colors.white} align="center" style={styles.title}>
          Waste
          <Text variant="huge" weight="bold" color="#A8E6CF">
            Map
          </Text>
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, { opacity: taglineFade }]}>
        <Text variant="m" color="rgba(255,255,255,0.8)" align="center">
          Signaler • Nettoyer • Valoriser
        </Text>
        <View style={styles.taglineLine} />
        <Text variant="s" color="rgba(255,255,255,0.6)" align="center" style={styles.taglineSub}>
          Ensemble pour des villes propres et durables
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.03)',
    top: -100,
    right: -100,
  },
  bgCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -50,
    left: -80,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    letterSpacing: 1,
  },
  taglineContainer: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  taglineLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    marginVertical: 12,
  },
  taglineSub: {
    lineHeight: 20,
  },
});
