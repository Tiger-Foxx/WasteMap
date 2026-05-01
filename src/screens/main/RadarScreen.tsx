import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, StatusBar, TouchableOpacity, Image,
  Animated, Easing, Dimensions, ScrollView, FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Text } from '../../components';
import { colors } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../../hooks/useAppStore';

const { width } = Dimensions.get('window');

type Phase = 'intro' | 'preview' | 'analyzing';

export const RadarScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { reports } = useAppStore();
  
  // Si on vient d'un autre écran (ex: raccourci scan) qui a déjà pris la photo, on a photoUri en param
  const initialPhotoUri = route?.params?.photoUri || null;
  const initialPhase = initialPhotoUri ? 'preview' : 'intro';

  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [photoUri, setPhotoUri] = useState<string | null>(initialPhotoUri);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // React Navigation hooks to react to params changes
  useEffect(() => {
    if (route?.params?.photoUri) {
      setPhotoUri(route.params.photoUri);
      setPhase('preview');
      // On retire le paramètre pour qu'une sortie normale ne revienne pas en boucle
      navigation.setParams({ photoUri: undefined });
    }
  }, [route?.params?.photoUri]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  // ── Take photo via system camera (works on all devices/emulators) ──
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setPhase('preview');
    }
  };

  // ── Launch AI analysis ──
  const handleAnalyze = () => {
    setPhase('analyzing');
    progressAnim.setValue(0);

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

    Animated.timing(progressAnim, {
      toValue: 1, duration: 3500, useNativeDriver: false, easing: Easing.out(Easing.cubic),
    }).start(() => {
      scanLoop.stop();
      navigation.navigate('ScanResult');
      setTimeout(() => {
        setPhase('intro');
        setPhotoUri(null);
        progressAnim.setValue(0);
        scanLineAnim.setValue(0);
      }, 500);
    });
  };

  const handleGoBack = () => {
    if (phase === 'intro') {
      navigation.goBack();
    } else {
      setPhase('intro');
      setPhotoUri(null);
    }
  };

  // ════════════════════════════════════════════════════════════
  // PHASE 1: INTRO — White screen, Lottie, CTA + History
  // ════════════════════════════════════════════════════════════
  if (phase === 'intro') {
    const gravityColors: Record<string, string> = {
      low: '#10B981', medium: '#F59E0B', high: '#EF4444', critical: '#6366F1',
    };

    return (
      <View style={styles.introContainer}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.introHeader}>
          <TouchableOpacity style={styles.backBtnFlat} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textDark} />
          </TouchableOpacity>
          <Text variant="l" weight="bold" color={colors.textDark}>Le Radar</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          
          {/* Hero section */}
          <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <LottieView
              source={require('../../../assets/lotties/polution-animation.json')}
              autoPlay
              loop
              style={{ width: 220, height: 200 }}
            />
            <Text variant="xl" weight="bold" color={colors.textDark} align="center" style={{ marginTop: 8 }}>
              Signaler un dépôt sauvage
            </Text>
            <Text variant="s" color={colors.textMuted} align="center" style={{ marginTop: 8, lineHeight: 22, paddingHorizontal: 20 }}>
              Prenez en photo les déchets. Notre IA analysera automatiquement leur composition.
            </Text>
          </Animated.View>

          {/* Steps (flat, minimal) */}
          <View style={styles.stepsContainer}>
            {[
              { icon: 'camera-outline', label: 'Prenez une photo des déchets' },
              { icon: 'scan-outline', label: 'L\'IA analyse la composition' },
              { icon: 'leaf-outline', label: 'Gagnez des EcoPoints' },
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text variant="xs" weight="bold" color={colors.textDark}>{i + 1}</Text>
                </View>
                <Text variant="s" color={colors.textDark} style={{ marginLeft: 14, flex: 1 }}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>

          {/* History section */}
          {reports.length > 0 && (
            <View style={styles.historySection}>
              <View style={styles.historySectionHeader}>
                <Text variant="m" weight="bold" color={colors.textDark}>
                  Signalements précédents
                </Text>
                <Text variant="xs" color={colors.textMuted}>{reports.length} au total</Text>
              </View>

              {reports.slice(0, 5).map((report, i) => (
                <View key={report.id} style={styles.historyItem}>
                  {/* Thumbnail placeholder */}
                  <View style={[styles.historyThumb, { backgroundColor: (gravityColors[report.analysis.gravity] || '#999') + '15' }]}>
                    <Ionicons name="image-outline" size={20} color={gravityColors[report.analysis.gravity] || '#999'} />
                  </View>
                  
                  <View style={styles.historyInfo}>
                    <Text variant="s" weight="semiBold" color={colors.textDark} numberOfLines={1}>
                      {report.location.quarter || report.location.address}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <View style={[styles.gravityDotSmall, { backgroundColor: gravityColors[report.analysis.gravity] }]} />
                      <Text variant="xs" color={colors.textMuted}>
                        {report.analysis.estimatedVolumeM3} m³  •  +{report.ecoPointsEarned} pts
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.statusChip, report.status === 'cleaned' ? styles.statusChipDone : null]}>
                    <Text variant="xs" weight="semiBold" color={report.status === 'cleaned' ? colors.primary : colors.textMuted}>
                      {report.status === 'pending' ? 'En attente' : 'Traité'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Floating CTA */}
        <View style={styles.floatingCta}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleTakePhoto} activeOpacity={0.85}>
            <Ionicons name="camera" size={22} color="#FFFFFF" />
            <Text variant="m" weight="bold" color="#FFFFFF" style={{ marginLeft: 10 }}>
              Prendre une photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ════════════════════════════════════════════════════════════
  // PHASE 2: PREVIEW — Photo taken, ready to analyze
  // ════════════════════════════════════════════════════════════
  if (phase === 'preview') {
    return (
      <View style={styles.darkContainer}>
        <StatusBar barStyle="light-content" />

        {/* Photo */}
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.fullImage} resizeMode="cover" />
        ) : (
          <View style={[styles.fullImage, { backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="image" size={56} color="rgba(255,255,255,0.15)" />
          </View>
        )}

        {/* Overlays */}
        <View style={styles.overlayTop} />
        <View style={styles.overlayBottom} />

        {/* Header */}
        <View style={styles.previewHeader}>
          <TouchableOpacity style={styles.roundBtnDark} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text variant="m" weight="bold" color="#FFFFFF">Aperçu</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Bottom actions */}
        <View style={styles.previewBottom}>
          <View style={styles.previewBadge}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text variant="s" color="#FFFFFF" style={{ marginLeft: 8 }}>Photo capturée</Text>
          </View>

          <TouchableOpacity style={styles.analyzeBtnGreen} onPress={handleAnalyze} activeOpacity={0.85}>
            <Ionicons name="scan" size={22} color="#FFFFFF" />
            <Text variant="m" weight="bold" color="#FFFFFF" style={{ marginLeft: 10 }}>
              Lancer l'analyse IA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.ghostBtn} onPress={handleGoBack}>
            <Ionicons name="camera-reverse-outline" size={18} color="rgba(255,255,255,0.7)" />
            <Text variant="s" color="rgba(255,255,255,0.7)" style={{ marginLeft: 8 }}>
              Reprendre la photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ════════════════════════════════════════════════════════════
  // PHASE 3: ANALYZING — AI scan animation
  // ════════════════════════════════════════════════════════════
  return (
    <View style={styles.darkContainer}>
      <StatusBar barStyle="light-content" />

      {/* Blurred bg */}
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={[styles.fullImage, { opacity: 0.2 }]} resizeMode="cover" blurRadius={12} />
      ) : (
        <View style={[styles.fullImage, { backgroundColor: '#0A0A0A' }]} />
      )}

      <View style={styles.analyzingCenter}>
        {/* Scan frame */}
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cTL]} />
          <View style={[styles.corner, styles.cTR]} />
          <View style={[styles.corner, styles.cBL]} />
          <View style={[styles.corner, styles.cBR]} />

          <Animated.View style={[
            styles.scanLine,
            {
              transform: [{
                translateY: scanLineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 180],
                }),
              }],
            },
          ]} />

          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.scanThumb} resizeMode="cover" />
          ) : (
            <View style={[styles.scanThumb, { backgroundColor: '#222' }]} />
          )}
        </View>

        {/* Lottie loader */}
        <LottieView
          source={require('../../../assets/lotties/Recycle-Loader.json')}
          autoPlay
          loop
          style={{ width: 70, height: 70, marginTop: 20 }}
        />

        <Text variant="l" weight="bold" color="#FFFFFF" align="center" style={{ marginTop: 12 }}>
          Analyse IA en cours
        </Text>

        {/* Progress bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <Animated.View style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]} />
          </View>
        </View>

        {/* Steps checklist */}
        <View style={styles.analyzeSteps}>
          {[
            { label: 'Détection des contours' },
            { label: 'Classification matériaux' },
            { label: 'Estimation du volume' },
            { label: 'Évaluation de gravité' },
          ].map((step, i) => (
            <View key={i} style={styles.analyzeStepRow}>
              <View style={[styles.analyzeStepDot, i < 2 && { backgroundColor: colors.primary }]}>
                <Ionicons
                  name={i < 2 ? 'checkmark' : 'ellipse'}
                  size={i < 2 ? 12 : 6}
                  color={i < 2 ? '#FFF' : 'rgba(255,255,255,0.25)'}
                />
              </View>
              <Text variant="xs" color={i < 2 ? '#FFF' : 'rgba(255,255,255,0.3)'} style={{ marginLeft: 10 }}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════
const styles = StyleSheet.create({

  // ── Intro (white) ──
  introContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  introHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 12, paddingHorizontal: 20,
  },
  backBtnFlat: {
    width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start',
  },
  heroSection: {
    alignItems: 'center', paddingHorizontal: 24, paddingTop: 10,
  },
  stepsContainer: {
    paddingHorizontal: 28, marginTop: 24,
  },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16,
  },
  stepNumber: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },

  // History
  historySection: {
    paddingHorizontal: 24, marginTop: 32,
  },
  historySectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
  },
  historyThumb: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  historyInfo: {
    flex: 1, marginLeft: 14,
  },
  gravityDotSmall: {
    width: 6, height: 6, borderRadius: 3, marginRight: 6,
  },
  statusChip: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  statusChipDone: {
    backgroundColor: 'rgba(52, 168, 83, 0.08)',
  },

  // Floating CTA
  floatingCta: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#F8FAFC',
  },
  primaryBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.primary,
    height: 56, borderRadius: 28,
  },

  // ── Dark phases (preview, analyzing) ──
  darkContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  fullImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  overlayTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 130,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 260,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  previewHeader: {
    position: 'absolute', top: 56, left: 20, right: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  roundBtnDark: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
  },
  previewBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingBottom: 44, paddingTop: 16,
  },
  previewBadge: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
  },
  analyzeBtnGreen: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.primary, height: 56, borderRadius: 28,
    marginBottom: 10,
  },
  ghostBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // ── Analyzing ──
  analyzingCenter: {
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30,
  },
  scanFrame: {
    width: 200, height: 200,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden', borderRadius: 16,
  },
  scanThumb: { width: 180, height: 180, borderRadius: 12, opacity: 0.5 },
  corner: {
    position: 'absolute', width: 28, height: 28,
    borderColor: colors.primary, borderWidth: 3, zIndex: 2,
  },
  cTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 16 },
  cTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 16 },
  cBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 16 },
  cBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 16 },
  scanLine: {
    position: 'absolute', left: 8, right: 8, height: 2,
    backgroundColor: colors.primary, top: 10, zIndex: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 10,
  },
  progressWrap: { width: '100%', marginTop: 24 },
  progressTrack: {
    width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  analyzeSteps: { marginTop: 28, alignSelf: 'flex-start', paddingLeft: 10 },
  analyzeStepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  analyzeStepDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
});
