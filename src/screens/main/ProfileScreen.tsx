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
      <StatusBar barStyle="dark-content" />
      
      {/* ── Header ── */}
      <View style={styles.headerFlat}>
        <Text variant="xl" weight="bold" color={colors.textDark}>Profil</Text>
        <TouchableOpacity style={styles.settingsIcon}>
          <Ionicons name="settings-outline" size={24} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* ── Profile Info ── */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../../assets/user.png')} 
              style={styles.avatarImage} 
            />
            <View style={styles.levelBadge}>
              <Text variant="xs" weight="bold" color={colors.white}>Niv {user.level}</Text>
            </View>
          </View>

          <Text variant="xxl" weight="bold" color={colors.textDark} style={{ marginTop: 16 }}>
            {user.name}
          </Text>
          <Text variant="m" color={colors.textMuted} style={{ marginTop: 4 }}>
            {user.phone}
          </Text>
        </View>

        <View style={styles.content}>
          {/* ── Flat Stats Grid ── */}
          <Text variant="l" weight="bold" color={colors.textDark} style={styles.sectionTitle}>
            Mes Statistiques
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statFlat}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text variant="xl" weight="bold" color={colors.primary}>{user.stats.totalReports}</Text>
                <Ionicons name="leaf" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
              </View>
              <Text variant="xs" weight="semiBold" color={colors.textMuted} style={{ marginTop: 4 }}>Signalements</Text>
            </View>
            <View style={styles.statFlat}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text variant="xl" weight="bold" color={colors.primary}>{user.stats.totalCleanings}</Text>
                <Ionicons name="sync" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
              </View>
              <Text variant="xs" weight="semiBold" color={colors.textMuted} style={{ marginTop: 4 }}>Nettoyages</Text>
            </View>
            <View style={styles.statFlat}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text variant="xl" weight="bold" color={colors.primary}>{trustPercent}%</Text>
                <Ionicons name="shield-checkmark" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
              </View>
              <Text variant="xs" weight="semiBold" color={colors.textMuted} style={{ marginTop: 4 }}>Trust Score</Text>
            </View>
            <View style={styles.statFlat}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text variant="xl" weight="bold" color={colors.primary}>#{user.stats.rank}</Text>
                <Ionicons name="trophy" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
              </View>
              <Text variant="xs" weight="semiBold" color={colors.textMuted} style={{ marginTop: 4 }}>Classement</Text>
            </View>
          </View>

          {/* ── Historique des cadeaux ── */}
          <View style={styles.historyHeader}>
            <Ionicons name="gift" size={20} color={colors.textDark} />
            <Text variant="l" weight="bold" color={colors.textDark} style={{ marginLeft: 8 }}>
              Cadeaux récupérés
            </Text>
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
                      source={require('../../../assets/logo-orange.png')} 
                      style={{ width: 20, height: 20, resizeMode: 'contain' }} 
                    />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text variant="m" weight="semiBold" color={colors.textDark} numberOfLines={1}>
                      {tx.description}
                    </Text>
                    <Text variant="s" color={colors.textMuted} style={{ marginTop: 2 }}>
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  <Text variant="m" weight="bold" color="#FF7900">
                    {tx.amount} pts
                  </Text>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  // ── Header ──
  headerFlat: {
    paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  settingsIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center', alignItems: 'center',
  },

  // ── Profile Section ──
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#F1F5F9',
  },
  levelBadge: {
    position: 'absolute', bottom: -4, right: -4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 2, borderColor: '#FFFFFF',
  },

  // ── Content ──
  content: { paddingHorizontal: 24, paddingTop: 16 },
  sectionTitle: { marginBottom: 16 },
  
  // ── Flat Stats Grid ──
  statsGrid: { 
    flexDirection: 'row', flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 32,
  },
  statFlat: { 
    width: '48%', 
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#F1F5F9',
    borderRadius: 16, 
    paddingVertical: 12, paddingHorizontal: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  // ── History ──
  historyHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16,
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
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
