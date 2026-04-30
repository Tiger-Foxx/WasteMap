import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card } from '../../components';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';

export const ProfileScreen = () => {
  const { user, badges, transactions, logout } = useAppStore();
  if (!user) return null;

  const trustPercent = Math.round((user.trustScore / 1000) * 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header profil */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 36 }}>
              {user.name.charAt(0)}
            </Text>
          </View>
          <Text variant="xl" weight="bold" color={colors.white} style={{ marginTop: 12 }}>
            {user.name}
          </Text>
          <Text variant="s" color="rgba(255,255,255,0.7)">{user.phone}</Text>
          <View style={styles.levelBadge}>
            <Text variant="xs" weight="bold" color={colors.primary}>Niveau {user.level}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <Card variant="elevated" style={styles.statItem}>
              <Text variant="xxl" weight="bold" color={colors.primary}>{user.stats.totalReports}</Text>
              <Text variant="xs" color={colors.textMuted}>Signalements</Text>
            </Card>
            <Card variant="elevated" style={styles.statItem}>
              <Text variant="xxl" weight="bold" color={colors.primary}>{user.stats.totalCleanings}</Text>
              <Text variant="xs" color={colors.textMuted}>Nettoyages</Text>
            </Card>
            <Card variant="elevated" style={styles.statItem}>
              <Text variant="xxl" weight="bold" color={colors.primary}>{trustPercent}%</Text>
              <Text variant="xs" color={colors.textMuted}>Trust Score</Text>
            </Card>
            <Card variant="elevated" style={styles.statItem}>
              <Text variant="xxl" weight="bold" color={colors.primary}>#{user.stats.rank}</Text>
              <Text variant="xs" color={colors.textMuted}>Classement</Text>
            </Card>
          </View>

          {/* Historique des transactions */}
          <Text variant="l" weight="semiBold" color={colors.textDark} style={styles.sectionTitle}>
            Historique EcoPoints
          </Text>
          {transactions.slice(0, 5).map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={[styles.txDot, { backgroundColor: tx.amount > 0 ? colors.success : colors.error }]} />
              <View style={styles.txInfo}>
                <Text variant="s" weight="medium" color={colors.textDark} numberOfLines={1}>{tx.description}</Text>
                <Text variant="xs" color={colors.textLight}>
                  {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              <Text variant="m" weight="bold" color={tx.amount > 0 ? colors.success : colors.error}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </Text>
            </View>
          ))}

          {/* Deconnexion */}
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text variant="m" weight="medium" color={colors.error}>Se deconnecter</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary, paddingTop: 56, paddingBottom: 32,
    alignItems: 'center', borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  levelBadge: {
    marginTop: 10, backgroundColor: colors.white,
    paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20,
  },
  content: { paddingHorizontal: spacing.screenPadding, paddingTop: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statItem: { width: '47%', alignItems: 'center', paddingVertical: 18 },
  sectionTitle: { marginBottom: 16 },
  txRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  txDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  txInfo: { flex: 1 },
  logoutButton: {
    marginTop: 32, alignItems: 'center', paddingVertical: 16,
    borderWidth: 1, borderColor: colors.error, borderRadius: spacing.borderRadius.medium,
  },
});
