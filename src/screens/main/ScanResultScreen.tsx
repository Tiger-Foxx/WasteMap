import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, Animated, Easing, StatusBar,
  TouchableOpacity, Dimensions,
} from 'react-native';
import { Text, Card, Button } from '../../components';
import { colors, spacing } from '../../theme';
import { WasteAnalysis } from '../../models';

const { width } = Dimensions.get('window');

interface ScanResultScreenProps {
  onClose: () => void;
  onConfirm: (analysis: WasteAnalysis) => void;
}

// Résultat simulé
const MOCK_RESULT: WasteAnalysis = {
  composition: [
    { type: 'plastic', percentage: 72, label: 'Plastique PET (bouteilles, sachets)' },
    { type: 'metal', percentage: 12, label: 'Métal aluminium (canettes)' },
    { type: 'organic', percentage: 16, label: 'Déchets organiques' },
  ],
  estimatedVolumeM3: 2.4,
  estimatedWeightKg: 35,
  gravity: 'high',
  confidence: 0.92,
};

export const ScanResultScreen = ({ onClose, onConfirm }: ScanResultScreenProps) => {
  // ── State ──
  const [phase, setPhase] = useState<'scanning' | 'results' | 'success'>('scanning');
  const [scanProgress, setScanProgress] = useState(0);

  // ── Animations ──
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const barAnims = useRef(MOCK_RESULT.composition.map(() => new Animated.Value(0))).current;
  const volumeAnim = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  // ── Phase 1: Scanning ──
  useEffect(() => {
    // Ligne de scan qui monte/descend
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    scanLoop.start();

    // Pulse sur le cadre
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05, duration: 800, useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, duration: 800, useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Progression du scan
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          scanLoop.stop();
          pulseLoop.stop();
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => {
      clearInterval(progressInterval);
      scanLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  // Quand le scan atteint 100%, passer à la phase résultats
  useEffect(() => {
    if (scanProgress >= 100 && phase === 'scanning') {
      setTimeout(() => {
        setPhase('results');
        animateResults();
      }, 400);
    }
  }, [scanProgress, phase]);

  // ── Phase 2: Résultats animés ──
  const animateResults = () => {
    // Fade in des résultats
    Animated.timing(fadeIn, {
      toValue: 1, duration: 400, useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Barres de composition avec stagger
    Animated.stagger(200,
      barAnims.map((anim, i) =>
        Animated.timing(anim, {
          toValue: MOCK_RESULT.composition[i].percentage,
          duration: 800,
          useNativeDriver: false,
          easing: Easing.out(Easing.cubic),
        })
      )
    ).start();

    // Volume animé
    Animated.timing(volumeAnim, {
      toValue: MOCK_RESULT.estimatedVolumeM3,
      duration: 1000, useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  // ── Phase 3: Succès ──
  const handleConfirm = () => {
    setPhase('success');

    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1, friction: 4, tension: 40, useNativeDriver: true,
      }),
      Animated.timing(confettiAnim, {
        toValue: 1, duration: 800, useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => onConfirm(MOCK_RESULT), 1500);
    });
  };

  // ── Render: Phase Scanning ──
  if (phase === 'scanning') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.scanContainer}>
          {/* Header */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text variant="l" color={colors.white}>✕</Text>
          </TouchableOpacity>

          <Text variant="l" weight="bold" color={colors.white} align="center" style={{ marginTop: 60 }}>
            🤖 Analyse IA en cours...
          </Text>

          {/* Image placeholder avec scan */}
          <Animated.View style={[styles.scanFrame, { transform: [{ scale: pulseAnim }] }]}>
            {/* Corners */}
            <View style={[styles.scanCorner, styles.cTL]} />
            <View style={[styles.scanCorner, styles.cTR]} />
            <View style={[styles.scanCorner, styles.cBL]} />
            <View style={[styles.scanCorner, styles.cBR]} />

            {/* Ligne de scan animée */}
            <Animated.View style={[
              styles.scanLine,
              {
                transform: [{
                  translateY: scanLineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 200],
                  }),
                }],
              },
            ]} />

            <Text style={{ fontSize: 64 }}>📸</Text>
          </Animated.View>

          {/* Barre de progression */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${scanProgress}%` }]} />
            </View>
            <Text variant="s" weight="semiBold" color={colors.white} align="center" style={{ marginTop: 8 }}>
              {scanProgress}%
            </Text>
            <Text variant="xs" color="rgba(255,255,255,0.6)" align="center" style={{ marginTop: 4 }}>
              {scanProgress < 30 ? 'Détection des contours...' :
               scanProgress < 60 ? 'Classification des matériaux...' :
               scanProgress < 85 ? 'Estimation du volume...' :
               'Calcul de la gravité...'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Render: Phase Success ──
  if (phase === 'success') {
    return (
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={[styles.successContainer, { transform: [{ scale: successScale }] }]}>
          <View style={styles.successCircle}>
            <Text style={{ fontSize: 56 }}>🎉</Text>
          </View>
          <Text variant="xxl" weight="bold" color={colors.white} align="center" style={{ marginTop: 24 }}>
            Signalement envoyé !
          </Text>
          <Text variant="m" color="rgba(255,255,255,0.8)" align="center" style={{ marginTop: 12, lineHeight: 24 }}>
            Votre signalement a été ajouté à la carte.{'\n'}Merci pour votre contribution !
          </Text>
          <View style={styles.pointsEarned}>
            <Text variant="xxxl" weight="bold" color={colors.white}>
              +{Math.floor(MOCK_RESULT.estimatedVolumeM3 * 50)}
            </Text>
            <Text variant="m" color="rgba(255,255,255,0.7)"> EcoPoints 🌿</Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  // ── Render: Phase Results ──
  const gravityConfig = {
    low: { label: 'Faible', color: '#4CAF50', bg: '#E8F5E9' },
    medium: { label: 'Moyen', color: '#FF9800', bg: '#FFF3E0' },
    high: { label: 'Élevé', color: '#F44336', bg: '#FFEBEE' },
    critical: { label: 'Critique', color: '#9C27B0', bg: '#F3E5F5' },
  };
  const gc = gravityConfig[MOCK_RESULT.gravity];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.View style={[styles.resultsContainer, { opacity: fadeIn }]}>
        {/* Header */}
        <View style={styles.resultsHeader}>
          <TouchableOpacity style={styles.closeBtnDark} onPress={onClose}>
            <Text variant="l" color={colors.textDark}>←</Text>
          </TouchableOpacity>
          <Text variant="l" weight="bold" color={colors.textDark}>Résultat de l'analyse</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Gravity badge */}
        <View style={[styles.gravityBadge, { backgroundColor: gc.bg }]}>
          <View style={[styles.gravityDot, { backgroundColor: gc.color }]} />
          <Text variant="s" weight="semiBold" color={gc.color}>
            Gravité : {gc.label}
          </Text>
          <Text variant="xs" color={gc.color} style={{ marginLeft: 8 }}>
            ({Math.round(MOCK_RESULT.confidence * 100)}% confiance)
          </Text>
        </View>

        {/* Composition avec barres animées */}
        <Card variant="elevated" style={styles.compositionCard}>
          <Text variant="m" weight="semiBold" color={colors.textDark} style={{ marginBottom: 16 }}>
            🔬 Composition détectée
          </Text>
          {MOCK_RESULT.composition.map((comp, i) => (
            <View key={comp.type} style={styles.barRow}>
              <View style={styles.barLabel}>
                <Text style={{ fontSize: 16 }}>
                  {comp.type === 'plastic' ? '🧴' : comp.type === 'metal' ? '🥫' : '🍂'}
                </Text>
                <Text variant="s" weight="medium" color={colors.textDark} style={{ marginLeft: 8 }}>
                  {comp.label.split('(')[0].trim()}
                </Text>
              </View>
              <View style={styles.barTrack}>
                <Animated.View style={[
                  styles.barFill,
                  {
                    width: barAnims[i].interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: i === 0 ? '#2196F3' : i === 1 ? '#FF9800' : '#4CAF50',
                  },
                ]} />
              </View>
              <Animated.Text style={styles.barPercent}>
                {comp.percentage}%
              </Animated.Text>
            </View>
          ))}
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Card variant="elevated" style={styles.statBox}>
            <Text style={{ fontSize: 24 }}>📦</Text>
            <Text variant="l" weight="bold" color={colors.textDark} style={{ marginTop: 4 }}>
              {MOCK_RESULT.estimatedVolumeM3} m³
            </Text>
            <Text variant="xs" color={colors.textLight}>Volume estimé</Text>
          </Card>
          <Card variant="elevated" style={styles.statBox}>
            <Text style={{ fontSize: 24 }}>⚖️</Text>
            <Text variant="l" weight="bold" color={colors.textDark} style={{ marginTop: 4 }}>
              {MOCK_RESULT.estimatedWeightKg} kg
            </Text>
            <Text variant="xs" color={colors.textLight}>Poids estimé</Text>
          </Card>
          <Card variant="elevated" style={styles.statBox}>
            <Text style={{ fontSize: 24 }}>🌿</Text>
            <Text variant="l" weight="bold" color={colors.ecoPoint} style={{ marginTop: 4 }}>
              +{Math.floor(MOCK_RESULT.estimatedVolumeM3 * 50)}
            </Text>
            <Text variant="xs" color={colors.textLight}>EcoPoints</Text>
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Confirmer le signalement 📍"
            onPress={handleConfirm}
            size="large"
          />
          <Button
            title="Reprendre la photo"
            onPress={onClose}
            variant="ghost"
            size="medium"
            style={{ marginTop: 8 }}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },

  // ── Scanning phase ──
  scanContainer: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.screenPadding },
  closeBtn: {
    position: 'absolute', top: 56, right: spacing.screenPadding,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  scanFrame: {
    width: 260, height: 260, marginTop: 40,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(78,159,61,0.3)',
    borderRadius: spacing.borderRadius.medium,
    overflow: 'hidden',
  },
  scanCorner: {
    position: 'absolute', width: 30, height: 30,
    borderColor: colors.primaryLight, borderWidth: 3,
  },
  cTL: { top: -1, left: -1, borderRightWidth: 0, borderBottomWidth: 0 },
  cTR: { top: -1, right: -1, borderLeftWidth: 0, borderBottomWidth: 0 },
  cBL: { bottom: -1, left: -1, borderRightWidth: 0, borderTopWidth: 0 },
  cBR: { bottom: -1, right: -1, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    position: 'absolute', left: 10, right: 10, height: 2,
    backgroundColor: colors.primaryLight, top: 20,
    shadowColor: colors.primaryLight, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 8,
  },
  progressContainer: { marginTop: 40, width: '100%', paddingHorizontal: 20 },
  progressBar: {
    width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: colors.primaryLight, borderRadius: 3,
  },

  // ── Results phase ──
  resultsContainer: {
    flex: 1, backgroundColor: colors.background,
    paddingHorizontal: spacing.screenPadding,
  },
  resultsHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 16,
  },
  closeBtnDark: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  gravityBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: spacing.borderRadius.medium, marginBottom: 16,
  },
  gravityDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  compositionCard: { marginBottom: 16 },
  barRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 14,
  },
  barLabel: { flexDirection: 'row', alignItems: 'center', width: 140 },
  barTrack: {
    flex: 1, height: 10, backgroundColor: colors.border,
    borderRadius: 5, overflow: 'hidden', marginHorizontal: 10,
  },
  barFill: { height: '100%', borderRadius: 5 },
  barPercent: {
    width: 40, textAlign: 'right', fontSize: 14,
    fontWeight: '700', color: colors.textDark,
  },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  actionsContainer: { marginTop: 'auto', paddingBottom: 40 },

  // ── Success phase ──
  successContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 40,
  },
  successCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  pointsEarned: {
    flexDirection: 'row', alignItems: 'baseline',
    marginTop: 32, paddingVertical: 16, paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: spacing.borderRadius.large,
  },
});
