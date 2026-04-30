import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card } from '../../components';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';

export const RewardsScreen = () => {
  const { user, rewards } = useAppStore();
  if (!user) return null;

  const dataRewards = rewards.filter(r => r.type === 'data');
  const creditRewards = rewards.filter(r => r.type === 'credit');
  const specialRewards = rewards.filter(r => r.type === 'special_pass' || r.type === 'reduction');

  const renderReward = (reward: typeof rewards[0]) => {
    const canAfford = user.ecoPoints >= reward.cost;
    const meetsScore = !reward.isExclusive || (reward.minTrustScore && user.trustScore >= reward.minTrustScore);

    return (
      <Card key={reward.id} variant="elevated" style={styles.rewardCard}>
        <View style={styles.rewardRow}>
          <View style={[styles.rewardIcon, { backgroundColor: reward.type === 'special_pass' ? '#FFF3E0' : '#E8F5E9' }]}>
            <Text style={{ fontSize: 24 }}>
              {reward.type === 'data' ? '📶' : reward.type === 'credit' ? '📱' : reward.type === 'special_pass' ? '⭐' : '🏷️'}
            </Text>
          </View>
          <View style={styles.rewardInfo}>
            <Text variant="m" weight="semiBold" color={colors.textDark}>{reward.title}</Text>
            <Text variant="xs" color={colors.textLight} numberOfLines={2}>{reward.description}</Text>
          </View>
          <TouchableOpacity
            style={[styles.redeemButton, !canAfford && styles.redeemDisabled]}
            disabled={!canAfford || !meetsScore}
          >
            <Text variant="xs" weight="bold" color={canAfford ? colors.white : colors.textLight}>
              {reward.cost} EP
            </Text>
          </TouchableOpacity>
        </View>
        {reward.isExclusive && (
          <View style={styles.exclusiveBadge}>
            <Text variant="xs" weight="semiBold" color="#E65100">⭐ Exclusif</Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="xl" weight="bold" color={colors.textDark}>Boutique Orange</Text>
          <View style={styles.balanceChip}>
            <Text variant="s" weight="bold" color={colors.primary}>{user.ecoPoints.toLocaleString()} EP 🌿</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text variant="l" weight="semiBold" color={colors.textDark} style={styles.sectionTitle}>📶 Forfaits Data</Text>
          {dataRewards.map(renderReward)}
          <Text variant="l" weight="semiBold" color={colors.textDark} style={styles.sectionTitle}>📱 Credit</Text>
          {creditRewards.map(renderReward)}
          <Text variant="l" weight="semiBold" color={colors.textDark} style={styles.sectionTitle}>⭐ Offres speciales</Text>
          {specialRewards.map(renderReward)}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 56, paddingHorizontal: spacing.screenPadding, paddingBottom: 16,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  balanceChip: {
    backgroundColor: colors.primaryLighter, paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: spacing.borderRadius.round,
  },
  content: { paddingHorizontal: spacing.screenPadding, paddingTop: 20 },
  sectionTitle: { marginTop: 20, marginBottom: 12 },
  rewardCard: { marginBottom: 12 },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rewardIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  rewardInfo: { flex: 1 },
  redeemButton: {
    backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: spacing.borderRadius.round,
  },
  redeemDisabled: { backgroundColor: colors.border },
  exclusiveBadge: {
    marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border,
  },
});
