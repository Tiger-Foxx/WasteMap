import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabType = 'users' | 'quarters';

export const LeaderboardScreen = ({ navigation }: any) => {
  const { leaderboard, quarterRankings } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const insets = useSafeAreaInsets();

  const getAvatarUrl = (userId: string, isCurrentUser: boolean) => {
    if (isCurrentUser) return require('../../../assets/user.png');
    return { uri: `https://i.pravatar.cc/150?u=${userId}` };
  };

  const getQuarterImage = (quarterName: string) => {
    return { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(quarterName)}&background=E2E8F0&color=475569&size=150` };
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} bounces={false}>
        
        {/* Full Hero Section with Image Cover */}
        <View style={styles.heroWrapper}>
          <Image 
            source={require('../../../assets/illustrations/winner-classement.png')} 
            style={styles.heroCoverImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          
          <View style={[styles.heroHeader, { paddingTop: Math.max(insets.top, 20) }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.heroTextContainer}>
            <Text variant="xxl" weight="bold" color="#FFFFFF" style={styles.heroTitle}>
              Tableau des leaders
            </Text>
            <Text variant="s" color="#E2E8F0" style={styles.heroSubtitle}>
              Découvrez les citoyens et quartiers les plus engagés en faveur d'un environnement propre.
            </Text>
          </View>

          {/* Onglets (Pills style) */}
          <View style={styles.pillsContainer}>
            <TouchableOpacity
              style={[styles.pillBtn, activeTab === 'users' && styles.pillActive]}
              onPress={() => setActiveTab('users')}
              activeOpacity={0.8}
            >
              <Ionicons name="people-outline" size={18} color={activeTab === 'users' ? '#FFF' : '#E2E8F0'} />
              <Text variant="s" weight="bold" color={activeTab === 'users' ? '#FFF' : '#E2E8F0'} style={{ marginLeft: 8 }}>
                Citoyens
              </Text>
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity
              style={[styles.pillBtn, activeTab === 'quarters' && styles.pillActive]}
              onPress={() => setActiveTab('quarters')}
              activeOpacity={0.8}
            >
              <Ionicons name="business-outline" size={18} color={activeTab === 'quarters' ? '#FFF' : '#E2E8F0'} />
              <Text variant="s" weight="bold" color={activeTab === 'quarters' ? '#FFF' : '#E2E8F0'} style={{ marginLeft: 8 }}>
                Quartiers
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List Section */}
        <View style={styles.listSection}>
          {activeTab === 'users' ? (
            <>
              {/* Podium */}
              <View style={styles.podium}>
                {/* 2ème */}
                <View style={styles.podiumItem}>
                  <View style={styles.podiumImageContainer}>
                    <Image source={getAvatarUrl(leaderboard[1]?.userId, !!leaderboard[1]?.isCurrentUser)} style={styles.podiumAvatarImg} />
                    <View style={[styles.badge, { backgroundColor: '#94A3B8' }]}>
                      <Text variant="xs" weight="bold" color="#fff">2</Text>
                    </View>
                  </View>
                  <Text variant="xs" weight="bold" color={colors.textDark} numberOfLines={1}>
                    {leaderboard[1]?.userName.split(' ')[0]}
                  </Text>
                  <View style={styles.ecoRowCenter}>
                    <Text variant="xs" weight="bold" color={colors.primary}>
                      {leaderboard[1]?.ecoPoints.toLocaleString()}
                    </Text>
                    <Ionicons name="leaf" size={12} color={colors.primary} style={{ marginLeft: 2 }} />
                  </View>
                  <View style={[styles.podiumBar, { height: 60, backgroundColor: '#F1F5F9' }]} />
                </View>

                {/* 1er */}
                <View style={styles.podiumItem}>
                  <View style={styles.podiumImageContainer}>
                    <Image source={getAvatarUrl(leaderboard[0]?.userId, !!leaderboard[0]?.isCurrentUser)} style={[styles.podiumAvatarImg, { width: 76, height: 76, borderRadius: 38 }]} />
                    <View style={[styles.badge, { backgroundColor: '#F59E0B', width: 28, height: 28, borderRadius: 14, bottom: -6 }]}>
                      <Text variant="s" weight="bold" color="#fff">1</Text>
                    </View>
                  </View>
                  <Text variant="s" weight="bold" color={colors.textDark} numberOfLines={1} style={{ marginTop: 6 }}>
                    {leaderboard[0]?.userName.split(' ')[0]}
                  </Text>
                  <View style={styles.ecoRowCenter}>
                    <Text variant="s" weight="bold" color={colors.primary}>
                      {leaderboard[0]?.ecoPoints.toLocaleString()}
                    </Text>
                    <Ionicons name="leaf" size={14} color={colors.primary} style={{ marginLeft: 2 }} />
                  </View>
                  <View style={[styles.podiumBar, { height: 90, backgroundColor: '#FFFBEB' }]} />
                </View>

                {/* 3ème */}
                <View style={styles.podiumItem}>
                  <View style={styles.podiumImageContainer}>
                    <Image source={getAvatarUrl(leaderboard[2]?.userId, !!leaderboard[2]?.isCurrentUser)} style={styles.podiumAvatarImg} />
                    <View style={[styles.badge, { backgroundColor: '#D97706' }]}>
                      <Text variant="xs" weight="bold" color="#fff">3</Text>
                    </View>
                  </View>
                  <Text variant="xs" weight="bold" color={colors.textDark} numberOfLines={1}>
                    {leaderboard[2]?.userName.split(' ')[0]}
                  </Text>
                  <View style={styles.ecoRowCenter}>
                    <Text variant="xs" weight="bold" color={colors.primary}>
                      {leaderboard[2]?.ecoPoints.toLocaleString()}
                    </Text>
                    <Ionicons name="leaf" size={12} color={colors.primary} style={{ marginLeft: 2 }} />
                  </View>
                  <View style={[styles.podiumBar, { height: 45, backgroundColor: '#FFF7ED' }]} />
                </View>
              </View>

              {/* Reste du classement */}
              {leaderboard.slice(3).map((entry) => (
                <View key={entry.userId} style={[styles.flatCard, entry.isCurrentUser && styles.flatCardCurrent]}>
                  <Text variant="m" weight="bold" color={colors.textLight} style={{ width: 30 }}>
                    #{entry.rank}
                  </Text>
                  <Image source={getAvatarUrl(entry.userId, !!entry.isCurrentUser)} style={styles.rankAvatarImg} />
                  
                  <View style={styles.rankInfo}>
                    <Text variant="s" weight={entry.isCurrentUser ? 'bold' : 'medium'} color={colors.textDark}>
                      {entry.userName} {entry.isCurrentUser ? '(vous)' : ''}
                    </Text>
                    <Text variant="xs" color={colors.textLight}>
                      {entry.reportsCount} actions
                    </Text>
                  </View>

                  <View style={styles.ecoRow}>
                    <Text variant="m" weight="bold" color={colors.primary}>
                      {entry.ecoPoints.toLocaleString()}
                    </Text>
                    <Ionicons name="leaf" size={18} color={colors.primary} style={{ marginLeft: 4 }} />
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              {quarterRankings.map((q) => (
                <View key={q.quarterName} style={styles.flatCard}>
                  <Text variant="m" weight="bold" color={q.rank <= 3 ? colors.primary : colors.textLight} style={{ width: 30 }}>
                    #{q.rank}
                  </Text>

                  <Image source={getQuarterImage(q.quarterName)} style={styles.quarterAvatarImg} />
                  
                  <View style={styles.rankInfo}>
                    <Text variant="s" weight="bold" color={colors.textDark}>
                      {q.quarterName}
                    </Text>
                    <Text variant="xs" color={colors.textLight}>
                      Propreté: {q.cleanlinessScore}% ({q.totalCleanings} nettoyages)
                    </Text>
                    <View style={styles.scoreBarWrap}>
                      <View style={[
                        styles.scoreFill,
                        { width: `${q.cleanlinessScore}%`, backgroundColor: q.cleanlinessScore > 70 ? colors.primary : '#F59E0B' }
                      ]} />
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  content: {
    flex: 1,
  },
  heroWrapper: {
    width: '100%',
    paddingBottom: 24,
    position: 'relative',
    backgroundColor: '#0B2214',
  },
  heroCoverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 30, 15, 0.70)',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroTextContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 28,
    marginBottom: 8,
  },
  heroSubtitle: {
    lineHeight: 20,
  },
  pillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    zIndex: 10,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pillActive: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderColor: '#FFFFFF',
  },
  listSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 24,
    height: 220,
    gap: 12,
  },
  podiumItem: {
    alignItems: 'center',
    width: '30%',
  },
  podiumImageContainer: {
    position: 'relative',
    marginBottom: 6,
    alignItems: 'center',
  },
  podiumAvatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#E2E8F0',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  ecoRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    justifyContent: 'center',
  },
  podiumBar: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 8,
  },
  flatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  flatCardCurrent: {
    backgroundColor: '#F0FDF4',
    borderColor: colors.primary,
  },
  rankAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#E2E8F0',
  },
  quarterAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
  },
  rankInfo: {
    flex: 1,
  },
  ecoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBarWrap: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 2,
  },
});
