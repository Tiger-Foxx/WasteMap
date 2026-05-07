import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, ScannerFAB } from '../../components';
import { colors } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';

export const ProfileScreen = () => {
  const { user, transactions, logout } = useAppStore();
  if (!user) return null;

  const trustPercent = Math.round((user.trustScore / 1000) * 100);
  const rewardTransactions = transactions.filter(tx => tx.type === 'reward_spent');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFCFA" />
      
      {/* ── Header ── */}
      <View style={styles.headerFlat}>
        <View>
          <Text variant="xl" weight="bold" color="#1A202C" style={{ fontSize: 28, letterSpacing: -0.5 }}>Profil</Text>
          <View style={styles.titleUnderline} />
        </View>
        <TouchableOpacity style={styles.settingsIcon}>
          <Ionicons name="settings-outline" size={22} color="#1A202C" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* ── Profile Info ── */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {/* Using herb motif behind the avatar based on the reference */}
            {/* <Image 
              source={require('../../../assets/illustrations/herb.png')} 
              style={styles.avatarBgLeaf} 
              resizeMode="contain"
            /> */}
            <View style={styles.avatarBorder}>
              <Image 
                source={require('../../../assets/user.png')} 
                style={styles.avatarImage} 
              />
            </View>
            <View style={styles.levelBadge}>
              <Text variant="xs" color={colors.white} style={{fontWeight: '700'}}>Niv {user.level}</Text>
            </View>
          </View>

          <Text variant="xxl" weight="bold" color="#1A202C" style={{ marginTop: 16 }}>
            {user.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="call-outline" size={14} color={colors.primary} style={{ marginRight: 6 }} />
            <Text variant="m" color="#718096">
              {user.phone}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* ── Stats Grid ── */}
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf" size={18} color={colors.primary} />
            <Text variant="l" weight="bold" color="#1A202C" style={{ marginLeft: 8 }}>
              Mes Statistiques
            </Text>
          </View>
          
          <View style={styles.statsGrid}>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="leaf" size={20} color={colors.primary} />
              </View>
              <View>
                <Text variant="xl" weight="bold" color={colors.primary}>{user.stats.totalReports}</Text>
                <Text variant="xs" color="#718096" style={{ marginTop: 2 }}>Signalements</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="sync" size={20} color={colors.primary} />
              </View>
              <View>
                <Text variant="xl" weight="bold" color={colors.primary}>{user.stats.totalCleanings}</Text>
                <Text variant="xs" color="#718096" style={{ marginTop: 2 }}>Nettoyages</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text variant="xl" weight="bold" color={colors.primary}>{trustPercent}%</Text>
                <Text variant="xs" color="#718096" style={{ marginTop: 2 }}>Trust Score</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="trophy" size={20} color={colors.primary} />
              </View>
              <View>
                <Text variant="xl" weight="bold" color={colors.primary}>#{user.stats.rank}</Text>
                <Text variant="xs" color="#718096" style={{ marginTop: 2 }}>Classement</Text>
              </View>
            </View>

          </View>

          {/* ── Historique des cadeaux ── */}
          <View style={[styles.sectionHeader, { justifyContent: 'space-between', marginTop: 8 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="gift" size={20} color="#1A202C" />
              <Text variant="l" weight="bold" color="#1A202C" style={{ marginLeft: 8 }}>
                Cadeaux récupérés
              </Text>
            </View>
            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text variant="xs" color={colors.primary}>Voir tout</Text>
              <Ionicons name="chevron-forward" size={12} color={colors.primary} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.historyContainer}>
            {rewardTransactions.length === 0 ? (
              <Text variant="s" color={colors.textMuted} style={{ textAlign: 'center', paddingVertical: 20 }}>
                Aucun cadeau récupéré pour le moment.
              </Text>
            ) : (
              rewardTransactions.map((tx) => (
                <View key={tx.id} style={styles.historyRow}>
                  <View style={styles.historyIconBlock}>
                    <Image 
                      source={require('../../../ressources/images/logo-orange.png')} 
                      style={{ width: 28, height: 28, resizeMode: 'contain' }} 
                    />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text variant="s" weight="bold" color="#1A202C" numberOfLines={1}>
                      {tx.description}
                    </Text>
                    <Text variant="xs" color="#A0AEC0" style={{ marginTop: 2 }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text variant="m" weight="bold" color="#FF7900" style={{ marginRight: 4 }}>
                      -{tx.amount}
                    </Text>
                    <Ionicons name="leaf" size={12} color="#FF7900" style={{ marginRight: 8 }} />
                    <Ionicons name="chevron-forward" size={14} color="#A0AEC0" />
                  </View>
                </View>
              ))
            )}
          </View>

          {/* ── Deconnexion ── */}
          <TouchableOpacity style={styles.logoutButtonFlat} onPress={logout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text variant="m" weight="bold" color={colors.error} style={{ marginLeft: 8 }}>
              Se déconnecter
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
      <ScannerFAB />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFCFA' },
  
  // ── Header ──
  headerFlat: {
    paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    backgroundColor: '#FAFCFA',
  },
  titleUnderline: {
    width: 24, height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 4,
  },
  settingsIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.05)', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },

  // ── Profile Section ──
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 140,
  },
  avatarBgLeaf: {
    position: 'absolute',
    width: 180,
    height: 180,
    opacity: 0.15,
  },
  avatarBorder: {
    width: 106, height: 106, borderRadius: 53,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(216, 233, 168, 0.4)',
  },
  avatarImage: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#F1F5F9',
  },
  levelBadge: {
    position: 'absolute', bottom: 16, right: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 2, borderColor: '#FFFFFF',
    shadowColor: 'rgba(56, 161, 105, 0.3)', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },

  // ── Content ──
  content: { paddingHorizontal: 24, paddingTop: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  
  // ── Flat Stats Grid ──
  statsGrid: { 
    flexDirection: 'row', flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 32,
  },
  statCard: { 
    width: '48%', 
    backgroundColor: '#FFFFFF',
    borderRadius: 20, 
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: 'rgba(56, 161, 105, 0.08)', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  statIconContainer: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(56, 161, 105, 0.1)',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10,
  },

  // ── History ──
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: 'rgba(56, 161, 105, 0.06)', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 2,
  },
  historyRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
  },
  historyIconBlock: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center', alignItems: 'center',
  },
  historyInfo: { flex: 1, marginLeft: 16, paddingRight: 8 },

  // ── Logout ──
  logoutButtonFlat: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 40, paddingVertical: 16,
    backgroundColor: '#FEF2F2', // Red light
    borderRadius: 20,
  },
});
