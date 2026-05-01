import React, { useState, useRef } from 'react';
import {
  View, StyleSheet, Dimensions, FlatList, Animated,
  StatusBar, TouchableOpacity, Image
} from 'react-native';
import { Text } from '../components';
import { colors, spacing } from '../theme';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: '1',
    image: require('../../assets/illustrations/illustration-signalement-onboardning.png'),
    title: 'Signalez & Agissez',
    description: 'Prenez en photo un dépôt sauvage. Notre plateforme alerte instantanément les services compétents.',
  },
  {
    id: '2',
    image: require('../../assets/illustrations/illustration-scan-ia.png'),
    title: 'L\'IA analyse pour vous',
    description: 'Plastique, métal, organique... La gravité et le volume sont estimés en temps réel avec précision.',
  },
  {
    id: '3',
    image: require('../../assets/illustrations/illustration-orange.png'),
    title: 'Récompenses exclusives',
    description: 'Vos actions écologiques génèrent des EcoPoints, convertibles en crédit ou forfaits Data Orange.',
  }
];

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      onComplete();
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Logo */}
      <View style={styles.topLogoContainer}>
        <Image 
          source={require('../../assets/logo-name(le nom wastemap juste en vert).png')} 
          style={styles.topLogo}
          resizeMode="contain"
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => {
          return (
            <View style={styles.slide}>
              {/* Illustration Section */}
              <View style={styles.imageWrapper}>
                {/* Subtle minimalist background element behind flat illustrations */}
                <View style={styles.backdropCircle} />
                <Image
                  source={item.image}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              {/* Typography Section */}
              <View style={styles.textWrapper}>
                <Text variant="xxl" weight="bold" color={colors.textDark} style={styles.title} align="center">
                  {item.title}
                </Text>
                <Text variant="m" color="#718096" align="center" style={styles.description}>
                  {item.description}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Minimalist Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={onComplete} style={styles.navButton}>
          <Text variant="s" weight="medium" color="#A0AEC0">
            Skip
          </Text>
        </TouchableOpacity>

        <View style={styles.pagination}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { opacity: dotOpacity, transform: [{ scale }] },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.navButtonAlignRight}>
          <Text variant="s" weight="bold" color={colors.textDark}>
            {currentIndex === SLIDES.length - 1 ? 'Start' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topLogoContainer: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  topLogo: {
    width: 120,
    height: 36,
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    paddingTop: height * 0.18, 
  },
  imageWrapper: {
    width: width * 0.85,
    height: height * 0.40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  backdropCircle: {
    position: 'absolute',
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: '#F7FAFC', // Ultra subtle gray circle to ground the flat illustrations
    bottom: '10%',
  },
  image: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  textWrapper: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: spacing.screenPadding,
    right: spacing.screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  navButtonAlignRight: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textDark,
    marginHorizontal: 5,
  },
});
