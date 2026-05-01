import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Easing, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components';
import { colors } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../hooks/useAppStore';
import LottieView from 'lottie-react-native';

export const CleaningResultScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { mediaAvant, mediaPendant, mediaApres } = route.params || {};
  const { user } = useAppStore();

  const [showSuccessModal, setShowSuccessModal] = React.useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const modalOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Hide modal after 3.5 seconds
    setTimeout(() => {
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSuccessModal(false);
        // Start other animations after modal hides
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();

        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      });
    }, 3500);
  }, []);

  const reductionWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '92%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {showSuccessModal && (
        <Animated.View style={[StyleSheet.absoluteFill, styles.modalOverlay, { opacity: modalOpacity, zIndex: 100 }]}>
          <LottieView
            source={require('../../../assets/lotties/Trophy-animated.json')}
            autoPlay
            loop={false}
            style={{ width: 300, height: 300 }}
          />
          <Text variant="xxxl" weight="bold" color="#FFFFFF" style={{ marginTop: 24, textAlign: 'center' }}>
            Félicitations !
          </Text>
          <Text variant="m" color="rgba(255,255,255,0.8)" style={{ marginTop: 8, textAlign: 'center', paddingHorizontal: 40 }}>
            Votre action citoyenne a été validée. Merci pour la planète 🌍
          </Text>
        </Animated.View>
      )}

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text variant="m" weight="bold" color={colors.textDark}>Détails de l'action</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <Animated.View style={{ opacity: fadeAnim, paddingHorizontal: 20 }}>
          
          {/* ── Lieu ── */}
          <Text variant="m" weight="bold" color={colors.textDark} style={styles.sectionTitle}>Lieu</Text>
          <View style={styles.locationCard}>
            <View style={{ flex: 1 }}>
              <Text variant="m" color={colors.textDark}>Yaoundé, Mvog-Ada</Text>
              <Text variant="s" color={colors.textMuted} style={{ marginTop: 4 }}>3.8667° N, 11.5167° E</Text>
            </View>
            <View style={styles.miniMapPlaceholder}>
              <Ionicons name="location" size={24} color={colors.primary} />
            </View>
          </View>

          {/* ── Vidéos soumises ── */}
          <Text variant="m" weight="bold" color={colors.textDark} style={[styles.sectionTitle, { marginTop: 24 }]}>
            Vidéos soumises
          </Text>
          <View style={styles.videosRow}>
            {/* Avant */}
            <View style={styles.videoBox}>
              <View style={[styles.videoBadge, { backgroundColor: '#EF4444' }]}>
                <Text variant="xs" weight="bold" color="#FFFFFF">Avant</Text>
              </View>
              {mediaAvant ? (
                <Image source={{ uri: mediaAvant }} style={styles.videoThumb} />
              ) : (
                <View style={styles.videoPlaceholder} />
              )}
            </View>

            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} style={{ marginHorizontal: 4 }} />

            {/* Pendant */}
            <View style={styles.videoBox}>
              <View style={[styles.videoBadge, { backgroundColor: '#F59E0B' }]}>
                <Text variant="xs" weight="bold" color="#FFFFFF">Pendant</Text>
              </View>
              {mediaPendant ? (
                <Image source={{ uri: mediaPendant }} style={styles.videoThumb} />
              ) : (
                <View style={styles.videoPlaceholder} />
              )}
            </View>

            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} style={{ marginHorizontal: 4 }} />

            {/* Après */}
            <View style={styles.videoBox}>
              <View style={[styles.videoBadge, { backgroundColor: colors.primary }]}>
                <Text variant="xs" weight="bold" color="#FFFFFF">Après</Text>
              </View>
              {mediaApres ? (
                <Image source={{ uri: mediaApres }} style={styles.videoThumb} />
              ) : (
                <View style={styles.videoPlaceholder} />
              )}
            </View>
          </View>

          {/* ── Analyse IA ── */}
          <Text variant="m" weight="bold" color={colors.textDark} style={[styles.sectionTitle, { marginTop: 32 }]}>
            Analyse IA
          </Text>
          <View style={styles.flatCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Ionicons name="checkmark-circle" size={32} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text variant="m" weight="bold" color={colors.primary}>Nettoyage validé</Text>
                <Text variant="s" color={colors.textMuted}>Réduction des déchets : 92%</Text>
              </View>
            </View>
            <View style={styles.progressBarTrack}>
              <Animated.View style={[styles.progressBarFill, { width: reductionWidth }]} />
            </View>
          </View>

          {/* ── Trust Score ── */}
          <View style={[styles.flatCard, { marginTop: 16, flexDirection: 'row', alignItems: 'center' }]}>
            <View style={styles.trustIconBlock}>
              <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="m" weight="bold" color={colors.textDark}>Trust Score</Text>
              <Text variant="s" color={colors.textMuted}>Niveau actuel</Text>
              <Text variant="s" color={colors.textMuted}>680 / 1000</Text>
            </View>
            <View style={styles.circleProgressFake}>
              <Text variant="m" weight="bold" color={colors.textDark}>68%</Text>
            </View>
          </View>

          {/* ── EcoPoints ── */}
          <View style={styles.ecoPointsRow}>
            <Text variant="m" weight="bold" color={colors.textDark}>EcoPoints gagnés</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text variant="xl" weight="bold" color={colors.primary}>+250</Text>
              <Ionicons name="leaf" size={20} color={colors.primary} style={{ marginLeft: 4 }} />
            </View>
          </View>

        </Animated.View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('MainTabs')} activeOpacity={0.8}>
          <Text variant="m" weight="bold" color="#FFFFFF">TERMINER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  modalOverlay: {
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
  },
  backBtn: { padding: 8 },
  moreBtn: { padding: 8 },
  
  sectionTitle: { marginBottom: 12 },
  
  locationCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  miniMapPlaceholder: {
    width: 64, height: 64, borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },

  videosRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  videoBox: {
    flex: 1, aspectRatio: 1, borderRadius: 12,
    overflow: 'hidden', position: 'relative',
    backgroundColor: '#1E293B',
  },
  videoThumb: { width: '100%', height: '100%' },
  videoPlaceholder: { width: '100%', height: '100%', backgroundColor: '#334155' },
  videoBadge: {
    position: 'absolute', top: 8, left: 8, zIndex: 2,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  playIconOverlay: {
    position: 'absolute', top: '50%', left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },

  flatCard: {
    borderWidth: 1, borderColor: '#F1F5F9',
    borderRadius: 20, padding: 16,
    backgroundColor: '#FFFFFF',
  },
  progressBarTrack: {
    height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', backgroundColor: colors.primary, borderRadius: 3,
  },

  trustIconBlock: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center', alignItems: 'center',
  },
  circleProgressFake: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 4, borderColor: colors.primary,
    borderLeftColor: '#F1F5F9', // Simulate 68% roughly
    justifyContent: 'center', alignItems: 'center',
  },

  ecoPointsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 32, marginBottom: 16,
  },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    paddingTop: 16, paddingHorizontal: 20,
    borderTopWidth: 1, borderTopColor: '#F8FAFC',
  },
  primaryBtn: {
    backgroundColor: '#3F8B35', // Match the concept green
    paddingVertical: 16, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
});
