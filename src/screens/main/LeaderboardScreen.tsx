import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';

type TabType = 'users' | 'quarters';

export const LeaderboardScreen = ({ navigation }: any) => {
  const { leaderboard, quarterRankings, user } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('users');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text variant="l" color={colors.white}>←</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="trophy" size={24} color={colors.white} />
          <Text variant="xl" weight="bold" color={colors.white}>Classement</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Onglets */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.tabActive]}
          onPress={() => setActiveTab('users')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="people" size={16} color={activeTab === 'users' ? colors.primary : colors.textMuted} />
            <Text
              variant="s" weight={activeTab === 'users' ? 'semiBold' : 'regular'}
              color={activeTab === 'users' ? colors.primary : colors.textMuted}
            >
              Citoyens
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quarters' && styles.tabActive]}
          onPress={() => setActiveTab('quarters')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="business" size={16} color={activeTab === 'quarters' ? colors.primary : colors.textMuted} />
            <Text
              variant="s" weight={activeTab === 'quarters' ? 'semiBold' : 'regular'}
              color={activeTab === 'quarters' ? colors.primary : colors.textMuted}
            >
              Quartiers
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'users' ? (
          <>
            {/* Podium Top 3 */}
            <View style={styles.podium}>
              {/* 2ème place */}
              <View style={styles.podiumItem}>
                  <Ionicons name="medal" size={24} color="#C0C0C0" />
                <Text variant="xs" weight="semiBold" color={colors.textDark} numberOfLines={1}>
                  {leaderboard[1]?.userName.split(' ')[0]}
                </Text>
                <Text variant="xs" weight="bold" color={colors.ecoPoint}>
                  {leaderboard[1]?.ecoPoints.toLocaleString()}
                </Text>
                <View style={[styles.podiumBar, { height: 60, backgroundColor: '#C0C0C0' }]} />
              </View>

              {/* 1ère place */}
              <View style={styles.podiumItem}>
                  <Ionicons name="medal" size={32} color="#FFD700" />
                <Text variant="xs" weight="semiBold" color={colors.textDark} numberOfLines={1}>
                  {leaderboard[0]?.userName.split(' ')[0]}
                </Text>
                <Text variant="xs" weight="bold" color={colors.ecoPoint}>
                  {leaderboard[0]?.ecoPoints.toLocaleString()}
                </Text>
                <View style={[styles.podiumBar, { height: 80, backgroundColor: '#FFD700' }]} />
              </View>

              {/* 3ème place */}
              <View style={styles.podiumItem}>
                  <Ionicons name="medal" size={24} color="#CD7F32" />
                <Text variant="xs" weight="semiBold" color={colors.textDark} numberOfLines={1}>
                  {leaderboard[2]?.userName.split(' ')[0]}
                </Text>
                <Text variant="xs" weight="bold" color={colors.ecoPoint}>
                  {leaderboard[2]?.ecoPoints.toLocaleString()}
                </Text>
                <View style={[styles.podiumBar, { height: 45, backgroundColor: '#CD7F32' }]} />
              </View>
            </View>

            {/* Liste des autres rangs */}
            {leaderboard.slice(3).map((entry) => (
              <Card
                key={entry.userId}
                variant={entry.isCurrentUser ? 'elevated' : 'default'}
                style={[
                  styles.rankCard,
                  entry.isCurrentUser && styles.rankCardCurrent,
                ]}
              >
                <View style={styles.rankRow}>
                  <Text variant="m" weight="bold" color={colors.textLight} style={styles.rankNumber}>
                    #{entry.rank}
                  </Text>
                  <View style={styles.rankAvatar}>
                    <Ionicons name={entry.isCurrentUser ? "person" : "person-outline"} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.rankInfo}>
                    <Text variant="s" weight={entry.isCurrentUser ? 'bold' : 'medium'} color={colors.textDark}>
                      {entry.userName} {entry.isCurrentUser ? '(vous)' : ''}
                    </Text>
                    <Text variant="xs" color={colors.textLight}>
                      {entry.reportsCount} signalements • {entry.cleaningsCount} nettoyages
                    </Text>
                  </View>
                  <Text variant="m" weight="bold" color={colors.ecoPoint}>
                    {entry.ecoPoints.toLocaleString()}
                  </Text>
                </View>
              </Card>
            ))}
          </>
        ) : (
          <>
            {/* Classement par quartier */}
            {quarterRankings.map((q) => (
              <Card key={q.quarterName} variant="elevated" style={styles.quarterCard}>
                <View style={styles.quarterRow}>
                  <View style={styles.quarterRank}>
                    <Text variant="l" weight="bold" color={
                      q.rank === 1 ? '#FFD700' : q.rank === 2 ? '#C0C0C0' : q.rank === 3 ? '#CD7F32' : colors.textLight
                    }>
                      #{q.rank}
                    </Text>
                  </View>
                  <View style={styles.quarterInfo}>
                    <Text variant="m" weight="semiBold" color={colors.textDark}>
                      {q.quarterName}
                    </Text>
                    <Text variant="xs" color={colors.textLight}>
                      {q.city} • {q.totalReports} signalements
                    </Text>
                  </View>
                  <View style={styles.scoreContainer}>
                    <View style={styles.scoreBar}>
                      <View style={[
                        styles.scoreFill,
                        {
                          width: `${q.cleanlinessScore}%`,
                          backgroundColor: q.cleanlinessScore > 70 ? colors.success :
                            q.cleanlinessScore > 50 ? colors.warning : colors.error,
                        },
                      ]} />
                    </View>
                    <Text variant="xs" weight="bold" color={colors.textDark}>
                      {q.cleanlinessScore}%
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary, paddingTop: 56, paddingBottom: 20,
    paddingHorizontal: spacing.screenPadding,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  closeButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.white,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tab: {
    flex: 1, paddingVertical: 14, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  content: { paddingHorizontal: spacing.screenPadding, paddingTop: 20 },

  // Podium
  podium: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'flex-end', marginBottom: 28, gap: 16,
  },
  podiumItem: { alignItems: 'center', width: 90 },
  podiumAvatar: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  podiumGold: { backgroundColor: '#FFF8E1' },
  podiumSilver: { backgroundColor: '#F5F5F5' },
  podiumBronze: { backgroundColor: '#FBE9E7' },
  podiumBar: {
    width: 60, borderTopLeftRadius: 8, borderTopRightRadius: 8, marginTop: 6,
  },

  // Rank cards
  rankCard: { marginBottom: 8 },
  rankCardCurrent: { borderWidth: 1.5, borderColor: colors.primaryLight },
  rankRow: { flexDirection: 'row', alignItems: 'center' },
  rankNumber: { width: 36 },
  rankAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primaryLighter,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  rankInfo: { flex: 1 },

  // Quarter cards
  quarterCard: { marginBottom: 12 },
  quarterRow: { flexDirection: 'row', alignItems: 'center' },
  quarterRank: { width: 44, alignItems: 'center' },
  quarterInfo: { flex: 1, marginRight: 12 },
  scoreContainer: { alignItems: 'flex-end', width: 80 },
  scoreBar: {
    width: 80, height: 6, backgroundColor: colors.border,
    borderRadius: 3, marginBottom: 4, overflow: 'hidden',
  },
  scoreFill: { height: '100%', borderRadius: 3 },
});
