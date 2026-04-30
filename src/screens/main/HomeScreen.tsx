import React, { useRef, useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, StatusBar, TouchableOpacity,
  Animated, Easing, Dimensions,
} from 'react-native';
import { Text, Card } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const { user, reports, notifications, getUnreadCount } = useAppStore();
  const unreadCount = getUnreadCount();

  // Animations d'entrée
  const [headerAnim] = useState(new Animated.Value(0));
  const [cardsAnim] = useState(new Animated.Value(0));
  const [statsAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1, duration: 500, useNativeDriver: true, easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(cardsAnim, {
        toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(statsAnim, {
        toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, []);

  if (!user) return null;

  const trustPercent = Math.round((user.trustScore / 1000) * 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* ── Header vert avec infos principales ──────────── */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }),
              }],
            },
          ]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text variant="s" color="rgba(255,255,255,0.7)">Bonjour 👋</Text>
              <Text variant="xl" weight="bold" color={colors.white}>{user.name}</Text>
            </View>
            {/* Notification bell */}
            <TouchableOpacity style={styles.notifButton} onPress={() => navigation.getParent()?.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color={colors.white} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text variant="xs" weight="bold" color={colors.white}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* EcoPoints Card */}
          <View style={styles.ecoPointsCard}>
            <View style={styles.ecoPointsLeft}>
              <Text variant="xs" color="rgba(255,255,255,0.7)" style={styles.ecoLabel}>
                VOS ECOPOINTS
              </Text>
              <View style={styles.ecoPointsRow}>
                <Text variant="huge" weight="bold" color={colors.white}>
                  {user.ecoPoints.toLocaleString()}
                </Text>
                <Ionicons name="leaf" size={28} color={colors.white} style={{ marginLeft: 8 }} />
              </View>
              <Text variant="xs" color="rgba(255,255,255,0.6)">
                Niveau {user.level} • Rang #{user.stats.weeklyRank} cette semaine
              </Text>
            </View>
            <TouchableOpacity style={styles.convertButton} onPress={() => navigation.navigate('Rewards')}>
              <Text variant="xs" weight="semiBold" color={colors.primary}>
                Convertir
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Contenu principal ────────────────────────────── */}
        <View style={styles.mainContent}>

          {/* Trust Score + Stats rapides */}
          <Animated.View
            style={[
              styles.quickStatsRow,
              {
                opacity: cardsAnim,
                transform: [{
                  translateY: cardsAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
                }],
              },
            ]}
          >
            {/* Trust Score */}
            <Card variant="elevated" style={styles.trustScoreCard}>
              <View style={styles.trustScoreCircle}>
                <View style={styles.trustScoreInner}>
                  <Text variant="xl" weight="bold" color={colors.primary}>{trustPercent}%</Text>
                </View>
              </View>
              <Text variant="xs" weight="medium" color={colors.textDark} align="center" style={{ marginTop: 8 }}>
                Trust Score
              </Text>
              <Text variant="xs" color={colors.textLight} align="center">
                {user.trustScore} / 1000
              </Text>
            </Card>

            {/* Stats verticales */}
            <View style={styles.statsColumn}>
              <Card variant="elevated" style={styles.miniStatCard}>
                <Ionicons name="leaf-outline" size={28} color={colors.primary} />
                <View>
                  <Text variant="l" weight="bold" color={colors.textDark}>
                    {user.stats.co2SavedKg.toFixed(1)} kg
                  </Text>
                  <Text variant="xs" color={colors.textLight}>CO₂ économisé</Text>
                </View>
              </Card>
              <Card variant="elevated" style={styles.miniStatCard}>
                <Ionicons name="cube-outline" size={28} color={colors.orange} />
                <View>
                  <Text variant="l" weight="bold" color={colors.textDark}>
                    {user.stats.wasteCollectedKg} kg
                  </Text>
                  <Text variant="xs" color={colors.textLight}>Déchets traités</Text>
                </View>
              </Card>
            </View>
          </Animated.View>

          {/* Actions rapides */}
          <Animated.View
            style={{
              opacity: statsAnim,
              transform: [{
                translateY: statsAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
              }],
            }}
          >
            <Text variant="l" weight="semiBold" color={colors.textDark} style={styles.sectionTitle}>
              Actions rapides
            </Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Radar')}>
                <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="camera-outline" size={28} color="#2E7D32" />
                </View>
                <Text variant="xs" weight="medium" color={colors.textDark} align="center">
                  Signaler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.getParent()?.navigate('Events')}>
                <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="people-outline" size={28} color="#E65100" />
                </View>
                <Text variant="xs" weight="medium" color={colors.textDark} align="center">
                  Événements
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Map')}>
                <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="map-outline" size={28} color="#1565C0" />
                </View>
                <Text variant="xs" weight="medium" color={colors.textDark} align="center">
                  Carte
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.getParent()?.navigate('Leaderboard')}>
                <View style={[styles.actionIcon, { backgroundColor: '#FCE4EC' }]}>
                  <Ionicons name="trophy-outline" size={28} color="#C2185B" />
                </View>
                <Text variant="xs" weight="medium" color={colors.textDark} align="center">
                  Classement
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Activité récente */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text variant="l" weight="semiBold" color={colors.textDark}>
                Activité récente
              </Text>
              <TouchableOpacity>
                <Text variant="s" weight="medium" color={colors.primaryLight}>Tout voir</Text>
              </TouchableOpacity>
            </View>

            {reports.slice(0, 3).map((report) => (
              <Card key={report.id} variant="elevated" style={styles.activityCard}>
                <View style={styles.activityRow}>
                  <View style={[
                    styles.activityDot,
                    {
                      backgroundColor:
                        report.status === 'cleaned' ? colors.success :
                        report.status === 'assigned' ? colors.warning :
                        colors.primaryLight,
                    },
                  ]} />
                  <View style={styles.activityContent}>
                    <Text variant="s" weight="medium" color={colors.textDark}>
                      {report.location.quarter || report.location.address}
                    </Text>
                    <Text variant="xs" color={colors.textLight}>
                      {report.analysis.composition[0]?.label} •{' '}
                      {report.analysis.estimatedVolumeM3} m³
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
                      backgroundColor:
                        report.status === 'cleaned' ? '#E8F5E9' :
                        report.status === 'assigned' ? '#FFF8E1' :
                        '#F3E5F5',
                    },
                  ]}>
                    <Text variant="xs" weight="medium" color={
                      report.status === 'cleaned' ? '#2E7D32' :
                      report.status === 'assigned' ? '#F57F17' :
                      '#7B1FA2'
                    }>
                      {report.status === 'cleaned' ? '✅ Nettoyé' :
                       report.status === 'assigned' ? '🚛 Pris en charge' :
                       report.status === 'confirmed' ? '✓ Confirmé' :
                       '⏳ En attente'}
                    </Text>
                  </View>
                  <Text variant="xs" color={colors.textLight}>
                    {report.confirmationCount} confirmation{report.confirmationCount > 1 ? 's' : ''}
                  </Text>
                </View>
              </Card>
            ))}
          </View>

          {/* Badges débloqués */}
          <View style={styles.badgesSection}>
            <View style={styles.sectionHeader}>
              <Text variant="l" weight="semiBold" color={colors.textDark}>
                Mes badges
              </Text>
              <TouchableOpacity>
                <Text variant="s" weight="medium" color={colors.primaryLight}>Tous</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {user.badges.map((badge) => (
                <View key={badge.id} style={styles.badgeItem}>
                  <View style={styles.badgeIcon}>
                    <Ionicons name={
                      badge.category === 'signaling' ? 'eye-outline' :
                      badge.category === 'cleaning' ? 'sparkles-outline' :
                      badge.category === 'community' ? 'people-outline' :
                      badge.category === 'streak' ? 'flame-outline' : 'shield-checkmark-outline'
                    } size={28} color={colors.primary} />
                  </View>
                  <Text variant="xs" weight="medium" color={colors.textDark} align="center" numberOfLines={1}>
                    {badge.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Spacer pour le tab bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // ── Header vert ──
  headerSection: {
    backgroundColor: colors.primary,
    paddingTop: 56,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ── EcoPoints Card ──
  ecoPointsCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: spacing.borderRadius.large,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ecoPointsLeft: {},
  ecoLabel: {
    letterSpacing: 2,
    marginBottom: 4,
  },
  ecoPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leafIcon: {
    fontSize: 28,
    marginLeft: 8,
  },
  convertButton: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: spacing.borderRadius.round,
  },
  // ── Contenu ──
  mainContent: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: -4,
    paddingTop: 20,
  },
  // ── Quick Stats ──
  quickStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  trustScoreCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  trustScoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryLighter,
  },
  trustScoreInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsColumn: {
    flex: 1.2,
    gap: 12,
  },
  miniStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  statEmoji: {
    fontSize: 28,
  },
  // ── Actions rapides ──
  sectionTitle: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ── Activité récente ──
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityCard: {
    marginBottom: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
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
  // ── Badges ──
  badgesSection: {
    marginBottom: 16,
  },
  badgeItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
});
