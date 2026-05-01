import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, StatusBar, Image, TouchableOpacity } from 'react-native';
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
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Full screen background image */}
      <Image 
        source={require('../../assets/illustrations/environment-picture-recycle.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      {/* Content wrapper */}
      <View style={styles.content}>
        {/* App Title Logo */}
        <Animated.View style={[styles.titleContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Image 
            source={require('../../assets/logo-name(le nom wastemap juste en vert)-white.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineContainer, { opacity: taglineFade }]}>
          <Text variant="l" weight="semiBold" color="#FFFFFF" align="center" style={styles.taglineTitle}>
            Rendez votre ville plus propre
          </Text>
          <Text variant="s" color="#E2E8F0" align="center" style={styles.taglineSub}>
            Signalez les déchets, organisez des collectes et soyez récompensés pour votre impact écologique.
          </Text>

          {/* Sponsor Section */}
          <View style={styles.sponsorContainer}>
            <Text variant="xs" color="rgba(255,255,255,0.7)" style={styles.sponsorText}>
              Sponsored by
            </Text>
            <Image 
              source={require('../../assets/logo-orange.png')} 
              style={styles.sponsorLogo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </View>

      {/* CTA Button */}
      <Animated.View style={[styles.footer, { opacity: taglineFade }]}>
        <TouchableOpacity 
          style={styles.startBtn} 
          activeOpacity={0.8}
          onPress={() => onFinish()}
        >
          <Text variant="m" weight="bold" color={colors.textDark}>
            Commencer
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // Slightly darker overlay for better contrast
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  titleContainer: {
    marginBottom: 32,
  },
  logoImage: {
    width: 270,
    height: 180,
  },
  title: {
    fontSize: 48,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  taglineTitle: {
    marginBottom: 12,
    fontSize: 22,
    lineHeight: 28,
  },
  taglineSub: {
    lineHeight: 24,
    maxWidth: '90%',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    alignItems: 'center',
  },
  startBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  sponsorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  sponsorText: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 10,
  },
  sponsorLogo: {
    width: 24,
    height: 24,
  },
});
