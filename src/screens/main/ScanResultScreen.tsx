import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, Animated, Easing, StatusBar,
  TouchableOpacity, Dimensions, ScrollView, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components';
import { colors } from '../../theme';
import { WasteAnalysis } from '../../models';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

interface ScanResultScreenProps {
  onClose: () => void;
  onConfirm: (analysis: WasteAnalysis) => void;
  onCleanNow?: (analysis: WasteAnalysis) => void;
}

// Résultat simulé
const MOCK_RESULT: WasteAnalysis = {
  composition: [
    { type: 'plastic', percentage: 72, label: 'Plastique PET' },
    { type: 'metal', percentage: 12, label: 'Métal aluminium' },
    { type: 'organic', percentage: 16, label: 'Organique' },
  ],
  estimatedVolumeM3: 2.4,
  estimatedWeightKg: 35,
  gravity: 'high',
  confidence: 0.92,
};

export const ScanResultScreen = ({ onClose, onConfirm, onCleanNow }: ScanResultScreenProps) => {
  const [phase, setPhase] = useState<'results' | 'success'>('results');

  // Animations
  const fadeIn = useRef(new Animated.Value(0)).current;
  const barAnims = useRef(MOCK_RESULT.composition.map(() => new Animated.Value(0))).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1, duration: 400, useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();

    Animated.stagger(100,
      barAnims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: MOCK_RESULT.composition[i].percentage,
          duration: 600,
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        })
      )
    ).start();
  }, []);

  const handleConfirm = () => {
    setPhase('success');

    const targetPoints = Math.floor(MOCK_RESULT.estimatedVolumeM3 * 50);

    Animated.timing(successOpacity, {
      toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.ease)
    }).start(() => {
      // Animate the points counter
      let start = 0;
      const duration = 1500;
      const intervalTime = 30;
      const steps = duration / intervalTime;
      const increment = targetPoints / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= targetPoints) {
          setDisplayPoints(targetPoints);
          clearInterval(timer);
        } else {
          setDisplayPoints(Math.floor(start));
        }
      }, intervalTime);

      setTimeout(() => {
        // We will show buttons instead of auto-exiting
        setShowActions(true);
      }, 3000);
    });
  };

  const [showActions, setShowActions] = useState(false);

  // ════════════════════════════════════════════════════════════
  // PHASE: SUCCESS (Ultra minimal + Lottie)
  // ════════════════════════════════════════════════════════════
  if (phase === 'success') {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }]}>
        <StatusBar barStyle="dark-content" />
        <Animated.View style={[styles.successContainer, { opacity: successOpacity }]}>
          
          {/* Main Trophy Animation */}
          <LottieView
            source={require('../../../assets/lotties/Trophy-animated.json')}
            autoPlay
            loop={false}
            style={{ width: 250, height: 250, alignSelf: 'center' }}
          />

          <Text variant="xl" weight="bold" color={colors.textDark} align="center" style={{ marginTop: 16 }}>
            Signalement Validé
          </Text>
          <Text variant="m" color={colors.textMuted} align="center" style={{ marginTop: 8, lineHeight: 24, paddingHorizontal: 40 }}>
            Bravo ! Votre contribution aide à préserver notre écosystème.
          </Text>
          
          {/* Animated EcoPoints with large plant Lottie breaking out */}
          <View style={[styles.pointsEarnedFlat, { marginTop: 40, overflow: 'visible', position: 'relative' }]}>
            <LottieView
              source={require('../../../assets/lotties/Hand holding plant seedling.json')}
              autoPlay
              loop
              style={{ position: 'absolute', left: -25, top: -35, width: 90, height: 90, zIndex: 10 }}
            />
            <Text variant="xxxl" weight="bold" color={colors.primary} style={{ marginLeft: 40 }}>
              +{displayPoints}
            </Text>
            <Text variant="m" weight="semiBold" color={colors.primary} style={{ marginLeft: 8 }}>EcoPoints</Text>
          </View>

          {showActions && (
            <Animated.View style={{ marginTop: 40, width: '100%', paddingHorizontal: 24, opacity: 1 }}>
              <TouchableOpacity 
                style={[styles.btnPrimaryFlat, { marginBottom: 24 }]} 
                onPress={() => onConfirm(MOCK_RESULT)}
                activeOpacity={0.9}
              >
                <Text variant="m" weight="bold" color="#FFFFFF">
                  Retour à la carte
                </Text>
              </TouchableOpacity>
              
              <Text variant="s" color={colors.textMuted} align="center" style={{ marginBottom: 12 }}>
                Optionnel : Vous êtes sur place ?
              </Text>
              <TouchableOpacity 
                style={[styles.btnSecondaryFlat, { height: 48, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' }]} 
                onPress={() => onCleanNow ? onCleanNow(MOCK_RESULT) : onConfirm(MOCK_RESULT)}
                activeOpacity={0.7}
              >
                <Text variant="m" weight="bold" color={colors.textDark}>
                  Nettoyer immédiatement
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </Animated.View>
      </View>
    );
  }

  // ════════════════════════════════════════════════════════════
  // PHASE: RESULTS (Flat Design, Monochrome + Primary Color)
  // ════════════════════════════════════════════════════════════
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.View style={[styles.resultsContainer, { opacity: fadeIn }]}>
        
        {/* Header - Flat */}
        <View style={styles.headerFlat}>
          <TouchableOpacity style={styles.backBtnFlat} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text variant="l" weight="bold" color={colors.textDark}>Analyse IA</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {/* AI Confidence / Gravity (Strictly flat, no background blocks, just text/icons) */}
          <View style={styles.metaHeader}>
            <LottieView
              source={require('../../../assets/lotties/Location Lottie Animation.json')}
              autoPlay
              loop
              style={{ width: 60, height: 60, marginLeft: -10 }}
            />
            <View>
              <Text variant="xl" weight="bold" color={colors.textDark}>
                Gravité Élevée
              </Text>
              <Text variant="s" color={colors.textMuted} style={{ marginTop: 2 }}>
                Fiabilité IA : {Math.round(MOCK_RESULT.confidence * 100)}%
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Estimations (Flat grid) */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text variant="s" color={colors.textMuted}>Volume</Text>
              <Text variant="xl" weight="bold" color={colors.textDark} style={{ marginTop: 4 }}>
                {MOCK_RESULT.estimatedVolumeM3} <Text variant="m" color={colors.textMuted}>m³</Text>
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text variant="s" color={colors.textMuted}>Poids</Text>
              <Text variant="xl" weight="bold" color={colors.textDark} style={{ marginTop: 4 }}>
                {MOCK_RESULT.estimatedWeightKg} <Text variant="m" color={colors.textMuted}>kg</Text>
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text variant="s" color={colors.textMuted}>Gain</Text>
              <Text variant="xl" weight="bold" color={colors.primary} style={{ marginTop: 4 }}>
                +{Math.floor(MOCK_RESULT.estimatedVolumeM3 * 50)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Composition (Flat bars, monochrome fill) */}
          <View style={styles.compositionSection}>
            <Image 
              source={require('../../../assets/illustrations/dechets-tas.png')} 
              style={{ width: 140, height: 120, alignSelf: 'center', marginBottom: 16 }} 
              resizeMode="contain" 
            />
            
            <Text variant="m" weight="bold" color={colors.textDark} style={{ marginBottom: 24 }}>
              Composition détaillée
            </Text>
            
            {MOCK_RESULT.composition.map((comp, i) => (
              <View key={comp.type} style={styles.flatBarRow}>
                <View style={styles.flatBarLabelContainer}>
                  <Text variant="s" weight="semiBold" color={colors.textDark}>
                    {comp.label}
                  </Text>
                  <Text variant="s" weight="bold" color={colors.textDark}>
                    {comp.percentage}%
                  </Text>
                </View>
                
                <View style={styles.flatBarTrack}>
                  <Animated.View style={[
                    styles.flatBarFill,
                    {
                      width: barAnims[i].interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                      // Strict minimalism: Use primary color for the highest percentage, else neutral grey.
                      backgroundColor: i === 0 ? colors.textDark : '#E2E8F0',
                    },
                  ]} />
                </View>
              </View>
            ))}
          </View>

        </ScrollView>

        {/* Actions Bottom (Flat, full width buttons) */}
        <View style={styles.actionsFlat}>
          <TouchableOpacity style={styles.btnPrimaryFlat} onPress={handleConfirm} activeOpacity={0.9}>
            <Text variant="m" weight="bold" color="#FFFFFF">
              Confirmer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondaryFlat} onPress={onClose} activeOpacity={0.7}>
            <Text variant="m" weight="semiBold" color={colors.textDark}>
              Annuler
            </Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  // ── Results Phase ──
  resultsContainer: { flex: 1 },
  headerFlat: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  backBtnFlat: {
    width: 44, height: 44,
    justifyContent: 'center', alignItems: 'flex-start',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  metaHeader: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 10, marginBottom: 10,
  },
  divider: {
    height: 1, backgroundColor: '#F1F5F9',
    marginVertical: 24,
  },
  metricsGrid: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
  },
  compositionSection: {
    marginBottom: 20,
  },
  flatBarRow: {
    marginBottom: 24,
  },
  flatBarLabelContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 8,
  },
  flatBarTrack: {
    width: '100%', height: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 3, overflow: 'hidden',
  },
  flatBarFill: {
    height: '100%', borderRadius: 3,
  },

  actionsFlat: {
    paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#F8FAFC',
  },
  btnPrimaryFlat: {
    width: '100%', height: 56,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 28,
  },
  btnSecondaryFlat: {
    width: '100%', height: 56,
    backgroundColor: 'transparent',
    justifyContent: 'center', alignItems: 'center',
    marginTop: 8,
    borderRadius: 28,
  },

  // ── Success Phase ──
  successContainer: {
    alignItems: 'center', width: '100%',
  },
  pointsEarnedFlat: {
    flexDirection: 'row', alignItems: 'baseline',
    marginTop: 40, paddingVertical: 12, paddingHorizontal: 24,
    backgroundColor: 'rgba(52, 168, 83, 0.08)',
    borderRadius: 100,
  },
});
