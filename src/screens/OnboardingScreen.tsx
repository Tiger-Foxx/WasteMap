import React, { useState, useRef } from 'react';
import {
  View, StyleSheet, Dimensions, FlatList, Animated,
  StatusBar, TouchableOpacity,
} from 'react-native';
import { Text, Button } from '../components';
import { colors, spacing } from '../theme';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    id: '1',
    icon: '📸',
    title: 'Signalez en un clic',
    subtitle: 'Le Radar',
    description:
      'Photographiez un dépôt sauvage. Notre IA identifie le type de déchet, estime le volume et géolocalise l\'alerte automatiquement.',
    color: colors.primary,
  },
  {
    id: '2',
    icon: '🤖',
    title: 'L\'IA analyse tout',
    subtitle: 'Intelligence Artificielle',
    description:
      'Notre algorithme de vision par ordinateur classifie plastique, métal, organique et assigne un niveau de gravité en quelques secondes.',
    color: '#2E7D32',
  },
  {
    id: '3',
    icon: '🏆',
    title: 'Gagnez des EcoPoints',
    subtitle: 'Gamification',
    description:
      'Chaque signalement vous rapporte des EcoPoints proportionnels au volume détecté. Nettoyez pour un bonus massif !',
    color: '#1B5E20',
  },
  {
    id: '4',
    icon: '📱',
    title: 'Convertissez en Orange',
    subtitle: 'Récompenses exclusives',
    description:
      'Échangez vos EcoPoints contre du crédit, des forfaits Data ou le Pass WasteMap exclusif. Votre action a de la valeur !',
    color: '#E65100',
  },
];

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.color }]}>
        {/* Cercles décoratifs */}
        <View style={[styles.decorCircle, styles.decorCircle1]} />
        <View style={[styles.decorCircle, styles.decorCircle2]} />
        <View style={[styles.decorCircle, styles.decorCircle3]} />

        {/* Contenu */}
        <View style={styles.slideContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>

          <Text variant="s" weight="semiBold" color="rgba(255,255,255,0.7)" align="center" style={styles.subtitle}>
            {item.subtitle.toUpperCase()}
          </Text>

          <Text variant="xxxl" weight="bold" color={colors.white} align="center" style={styles.slideTitle}>
            {item.title}
          </Text>

          <Text variant="m" color="rgba(255,255,255,0.85)" align="center" style={styles.slideDescription}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Skip button */}
      {currentIndex < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text variant="s" weight="medium" color="rgba(255,255,255,0.7)">
            Passer
          </Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
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
      />

      {/* Bottom section */}
      <View style={[styles.bottomSection, { backgroundColor: SLIDES[currentIndex].color }]}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity: dotOpacity },
                ]}
              />
            );
          })}
        </View>

        {/* Next / Start button */}
        <Button
          title={currentIndex === SLIDES.length - 1 ? 'Commencer 🚀' : 'Suivant'}
          onPress={handleNext}
          variant="secondary"
          size="large"
          style={styles.nextButton}
          textStyle={{ color: SLIDES[currentIndex].color }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 55,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  decorCircle1: { width: 300, height: 300, top: -60, right: -80 },
  decorCircle2: { width: 200, height: 200, bottom: 200, left: -60 },
  decorCircle3: { width: 150, height: 150, top: 200, left: 50, backgroundColor: 'rgba(255,255,255,0.03)' },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: -80,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconText: {
    fontSize: 56,
  },
  subtitle: {
    letterSpacing: 3,
    marginBottom: 12,
  },
  slideTitle: {
    marginBottom: 20,
    lineHeight: 40,
  },
  slideDescription: {
    lineHeight: 26,
    maxWidth: 320,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingHorizontal: spacing.screenPadding,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: colors.white,
    width: '100%',
  },
});
