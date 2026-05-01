import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, StatusBar, TouchableOpacity,
  Animated, Easing, Dimensions, Image, ImageBackground
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Text, Card } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const { user, reports, getUnreadCount } = useAppStore();
  const unreadCount = getUnreadCount();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(20));
  
  // Staggered animations for content sections
  const [sectionAnims] = useState([
    new Animated.Value(0), // EcoPoints
    new Animated.Value(0), // Stats
    new Animated.Value(0), // Explorer
    new Animated.Value(0), // History
  ]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic)
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic)
      }),
      Animated.stagger(100, sectionAnims.map(anim => 
        Animated.timing(anim, {
          toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic)
        })
      ))
    ]).start();
  }, []);

  const getSectionStyle = (index: number) => ({
    opacity: sectionAnims[index],
    transform: [{ 
      translateY: sectionAnims[index].interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0]
      }) 
    }]
  });

  if (!user) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAF8" />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── App Logo Header ──────────── */}
        <Animated.View style={[styles.appLogoContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Image 
            source={require('../../../assets/logo-name(le nom wastemap juste en vert).png')} 
            style={styles.mainAppLogo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ── User Header ──────────── */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Image 
                source={require('../../../assets/user.png')} 
                style={{ width: '100%', height: '100%', borderRadius: 24 }} 
              />
            </View>
            <View>
              <Text variant="s" color={colors.textLight}>Bon retour,</Text>
              <Text variant="l" weight="bold" color={colors.textDark}>{user.name}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.notifButton} onPress={() => navigation.getParent()?.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color={colors.textDark} />
            {unreadCount > 0 && <View style={styles.notifBadge} />}
          </TouchableOpacity>
        </Animated.View>

        {/* ── Impact & EcoPoints ──────────── */}
        <Animated.View style={[styles.impactSection, getSectionStyle(0)]}>
          
          {/* Main EcoScore Card (DARK MODE - EXACTLY AS REQUESTED) */}
          <TouchableOpacity style={styles.ecoCardDark} onPress={() => navigation.navigate('Rewards')}>
            <View style={styles.ecoCardHeader}>
              <View style={styles.ecoIconWrapperDark}>
                <Ionicons name="star" size={16} color="#FFFFFF" />
              </View>
              <Image 
                source={require('../../../ressources/images/logo-orange.png')} 
                style={{ width: 90, height: 32 }} 
                resizeMode="contain" 
              />
            </View>
            
            <View style={styles.ecoCardBody}>
              <View>
                <Text variant="xs" weight="bold" color="#A0AEC0" style={{ letterSpacing: 1, marginBottom: 4 }}>
                  SOLDE ECOPOINTS
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
                  <Text variant="huge" weight="bold" color={colors.primary}>
                    {user.ecoPoints.toLocaleString()}
                  </Text>
                  <Ionicons name="leaf" size={28} color={colors.primary} style={{ marginBottom: 6 }} />
                </View>
              </View>
              <View style={styles.convertBtn}>
                <Text variant="xs" weight="bold" color="#FF7900">Échanger</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Stats Cards - Stacked vertically */}
          <Animated.View style={getSectionStyle(1)}>
            <TouchableOpacity style={[styles.statBgCard, { marginBottom: 16 }]} activeOpacity={0.9}>
              <ImageBackground source={require('../../../assets/illustrations/co2.png')} style={styles.bgImage} imageStyle={{ borderRadius: 20 }}>
                <View style={styles.bgOverlay} />
                <View style={[styles.bgContent, { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                  <View>
                    <Text variant="xl" color="#FFFFFF" style={{ fontWeight: '900', fontSize: 26, letterSpacing: -0.5 }}>{user.stats.co2SavedKg.toFixed(1)} kg</Text>
                    <Text variant="s" weight="bold" color="rgba(255,255,255,0.9)">CO₂ Évité</Text>
                  </View>
                  <LottieView
                    source={require('../../../assets/lotties/Carbon Calculator.json')}
                    autoPlay
                    loop
                    style={{ width: 80, height: 80, right: 10 }}
                  />
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statBgCard} activeOpacity={0.9}>
              <ImageBackground source={require('../../../assets/illustrations/dechets.png')} style={styles.bgImage} imageStyle={{ borderRadius: 20 }}>
                <View style={styles.bgOverlay} />
                <View style={[styles.bgContent, { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                  <View>
                    <Text variant="xl" color="#FFFFFF" style={{ fontWeight: '900', fontSize: 26, letterSpacing: -0.5 }}>{user.stats.wasteCollectedKg} kg</Text>
                    <Text variant="s" weight="bold" color="rgba(255,255,255,0.9)">Déchets</Text>
                  </View>
                  <LottieView
                    source={require('../../../assets/lotties/Recycle-Loader.json')}
                    autoPlay
                    loop
                    style={{ width: 70, height: 70, right: 10 }}
                  />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* ── Actions / Navigations (FULL IMAGE BACKGROUNDS) ──────────── */}
        <Animated.View style={[styles.actionsSection, getSectionStyle(2)]}>
          <View style={styles.sectionHeader}>
            <Text variant="l" weight="bold" color={colors.textDark}>Explorer</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
            
            <TouchableOpacity style={styles.actionBgCard} onPress={() => navigation.navigate('Radar')}>
              <ImageBackground source={require('../../../assets/illustrations/signalement-dechets.png')} style={styles.bgImage} imageStyle={{ borderRadius: 24 }}>
                <View style={styles.bgOverlay} />
                <View style={styles.bgContent}>
                  <Text variant="l" weight="bold" color="#FFFFFF">Signaler</Text>
                  <Text variant="xs" color="rgba(255,255,255,0.8)">Nettoyer la ville</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBgCard} onPress={() => navigation.getParent()?.navigate('Events')}>
              <ImageBackground source={require('../../../assets/illustrations/eco-event.png')} style={styles.bgImage} imageStyle={{ borderRadius: 24 }}>
                <View style={styles.bgOverlay} />
                <View style={styles.bgContent}>
                  <Text variant="l" weight="bold" color="#FFFFFF">Événements</Text>
                  <Text variant="xs" color="rgba(255,255,255,0.8)">Rejoindre la commu</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBgCard} onPress={() => navigation.navigate('Map')}>
              <ImageBackground source={require('../../../assets/illustrations/map.png')} style={styles.bgImage} imageStyle={{ borderRadius: 24 }}>
                <View style={styles.bgOverlay} />
                <View style={styles.bgContent}>
                  <Text variant="l" weight="bold" color="#FFFFFF">Carte</Text>
                  <Text variant="xs" color="rgba(255,255,255,0.8)">Explorer les zones</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBgCard} onPress={() => navigation.getParent()?.navigate('Leaderboard')}>
              <ImageBackground source={require('../../../assets/illustrations/winner-classement.png')} style={styles.bgImage} imageStyle={{ borderRadius: 24 }}>
                <View style={styles.bgOverlay} />
                <View style={styles.bgContent}>
                  <Text variant="l" weight="bold" color="#FFFFFF">Classement</Text>
                  <Text variant="xs" color="rgba(255,255,255,0.8)">Les meilleurs</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

          </ScrollView>
        </Animated.View>

        {/* ── Recent Activity (ORIGINAL STYLE) ──────────── */}
        <Animated.View style={[styles.recentSection, getSectionStyle(3)]}>
          <View style={styles.sectionHeader}>
            <Text variant="l" weight="bold" color={colors.textDark}>Activité récente</Text>
            <TouchableOpacity>
              <Text variant="s" weight="bold" color={colors.primary}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.recentListScroll} 
            nestedScrollEnabled={true} 
            showsVerticalScrollIndicator={false}
          >
            {reports.slice(0, 10).map((report) => (
              <View key={report.id} style={styles.activityOldCard}>
                <View style={styles.activityRow}>
                  <View style={styles.activityIconCircle}>
                    <Ionicons 
                      name={
                        report.status === 'cleaned' ? 'checkmark-circle' :
                        report.status === 'assigned' ? 'trash' :
                        report.status === 'confirmed' ? 'shield-checkmark' :
                        'time'
                      } 
                      size={32} 
                      color={
                        report.status === 'cleaned' ? '#2E7D32' :
                        report.status === 'assigned' ? '#F57F17' :
                        '#7B1FA2'
                      } 
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text variant="s" weight="medium" color={colors.textDark} numberOfLines={1}>
                      {report.location.quarter || report.location.address}
                    </Text>
                    <Text variant="xs" color={colors.textLight} style={{ marginTop: 2 }}>
                      {report.analysis.composition[0]?.label} • {report.analysis.estimatedVolumeM3} m³
                    </Text>
                  </View>
                  <View style={styles.activityPoints}>
                    <Text variant="s" weight="bold" color={colors.ecoPoint}>
                      +{report.ecoPointsEarned}
                    </Text>
                    <Text variant="xs" color={colors.textLight}>EP</Text>
                  </View>
                </View>
                {/* Status badge */}
                <View style={styles.statusBadgeRow}>
                  <View style={[
                    styles.statusBadge,
                    {
                      backgroundColor: 'transparent',
                      paddingHorizontal: 0, // Enlever le padding vu qu'il n'y a plus de fond
                    },
                  ]}>
                    <Text variant="xs" weight="bold" color={
                      report.status === 'cleaned' ? '#2E7D32' :
                      report.status === 'assigned' ? '#F57F17' :
                      '#7B1FA2'
                    }>
                      {report.status === 'cleaned' ? 'Nettoyé' :
                       report.status === 'assigned' ? 'Pris en charge' :
                       report.status === 'confirmed' ? 'Confirmé' :
                       'En attente'}
                    </Text>
                  </View>
                  <Text variant="xs" color={colors.textLight}>
                    {report.confirmationCount} confirmation{report.confirmationCount > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

      </ScrollView>

      {/* ── FAB Scan Rapide ──────────── */}
      <Animated.View style={[styles.fabContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.fab} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Radar')}
        >
          <View style={styles.fabInner}>
            <Ionicons name="scan" size={26} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  scrollContent: {
    paddingTop: 50,
    paddingBottom: 140, // Espace pour la bottom bar
  },
  appLogoContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  mainAppLogo: {
    width: 140,
    height: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    marginRight: 16,
  },
  notifButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 12,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  impactSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  ecoCardDark: {
    backgroundColor: '#000000',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  ecoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ecoIconWrapperDark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ecoCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  convertBtn: {
    backgroundColor: 'rgba(255, 121, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBgCard: {
    width: '100%',
    height: 120,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  statCard: {
    width: (width - 64) / 2, 
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  statImage: {
    width: 40,
    height: 40,
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  actionsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  actionsScroll: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  actionBgCard: {
    width: 150,
    height: 200,
    borderRadius: 24,
    marginRight: 16,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
  },
  bgContent: {
    padding: 16,
    zIndex: 2,
  },
  recentSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 5,
    marginTop: 8,
    backgroundColor: '#F1F5F9', // Légèrement assombri
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  recentListScroll: {
    maxHeight: 500,// Permet le scroll interne de la tuile
  },
  activityOldCard: {
    marginBottom: 6, // Plus serrées verticalement
    backgroundColor: '#FFFFFF', // Fond blanc sans bordure ni ombre
    borderRadius: 16,
    padding: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconCircle: {
    width: 32, // Rétréci l'empreinte globale
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  activityInfo: {
    flex: 1,
    paddingRight: 10,
  },
  activityPoints: {
    alignItems: 'flex-end',
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.borderRadius.round,
  },
  // FAB Styles
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 999,
  },
  fab: {
    backgroundColor: colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabInner: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
