import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Text, ScannerFAB } from '../../components';
import { colors } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';

// Code couleur de la marque Orange
const ORANGE_BRAND = '#FF7900';
const ORANGE_LIGHT = '#FFF3E5';

export const RewardsScreen = () => {
  const { user, rewards } = useAppStore();
  if (!user) return null;

  const dataRewards = rewards.filter(r => r.type === 'data');
  const creditRewards = rewards.filter(r => r.type === 'credit');
  const specialRewards = rewards.filter(r => r.type === 'special_pass' || r.type === 'reduction');

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'data': return 'wifi';
      case 'credit': return 'call';
      case 'special_pass': return 'star';
      case 'reduction': return 'ticket';
      default: return 'gift';
    }
  };

  const renderReward = (reward: typeof rewards[0]) => {
    const canAfford = user.ecoPoints >= reward.cost;
    const meetsScore = !reward.isExclusive || (reward.minTrustScore && user.trustScore >= reward.minTrustScore);
    const isSpecial = reward.type === 'special_pass' || reward.type === 'reduction';

    return (
      <View key={reward.id} style={[styles.rewardCardFlat, isSpecial && styles.rewardCardSpecial]}>
        <View style={styles.rewardRow}>
          
          {/* Icon/Logo Block */}
          <View style={[
            styles.rewardIconBlock, 
            isSpecial ? { backgroundColor: 'transparent', width: 64, height: 64 } : { backgroundColor: '#F8FAFC' }
          ]}>
            {isSpecial ? (
              <LottieView
                source={require('../../../assets/lotties/animated giftbox.json')}
                autoPlay
                loop
                style={{ width: 90, height: 90, position: 'absolute' }}
              />
            ) : (
              <Image 
                source={require('../../../assets/logo-orange.png')} 
                style={{ width: 24, height: 24, resizeMode: 'contain', marginBottom: 4 }} 
              />
            )}
            {!isSpecial && (
              <Ionicons name={getRewardIcon(reward.type) as any} size={16} color={ORANGE_BRAND} style={{ position: 'absolute', bottom: -2, right: -2 }} />
            )}
          </View>

          {/* Info Block */}
          <View style={styles.rewardInfo}>
            <Text variant="m" weight="bold" color={colors.textDark}>{reward.title}</Text>
            <Text variant="xs" color={colors.textMuted} numberOfLines={2} style={{ marginTop: 2, lineHeight: 18 }}>
              {reward.description}
            </Text>
            
            {reward.isExclusive && (
              <View style={styles.exclusiveBadgeFlat}>
                <Ionicons name="star" size={10} color={ORANGE_BRAND} />
                <Text variant="xs" weight="semiBold" color={ORANGE_BRAND} style={{ marginLeft: 4 }}>Exclusif Fidélité</Text>
              </View>
            )}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.redeemButtonFlat, !canAfford && styles.redeemDisabledFlat]}
            disabled={!canAfford || !meetsScore}
            activeOpacity={0.8}
          >
            <Text variant="s" weight="bold" color={canAfford ? '#FFFFFF' : colors.textMuted}>
              {reward.cost} pts
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Flat */}
      <View style={styles.headerFlat}>
        <Text variant="xl" weight="bold" color={colors.textDark}>Boutique</Text>
        <Image 
          source={require('../../../assets/logo-orange.png')} 
          style={{ width: 32, height: 32, resizeMode: 'contain' }} 
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Hero Section with Lottie */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContent}>
            <Text variant="xl" weight="bold" color={colors.textDark}>
              Vos EcoPoints
            </Text>
            <View style={styles.balanceContainer}>
              <Text variant="xxxl" weight="bold" color={ORANGE_BRAND}>
                {user.ecoPoints.toLocaleString()}
              </Text>
              <Text variant="m" weight="semiBold" color={ORANGE_BRAND} style={{ marginLeft: 6, marginBottom: 4 }}>
                pts
              </Text>
            </View>
            <Text variant="s" color={colors.textMuted} style={{ marginTop: 8 }}>
              Échangez-les contre des forfaits Data et des cadeaux Orange.
            </Text>
          </View>

          {/* Joy Walking with Phone Lottie */}
          <View style={styles.heroLottieWrapper}>
            <LottieView
              source={require('../../../assets/lotties/Joy Walking with Phone.json')}
              autoPlay
              loop
              style={{ width: 140, height: 140 }}
            />
          </View>
        </View>

        <View style={styles.content}>
          {/* DATA SECTION */}
          <View style={styles.sectionHeader}>
            <Ionicons name="wifi" size={20} color={colors.textDark} />
            <Text variant="l" weight="bold" color={colors.textDark} style={styles.sectionTitle}>
              Forfaits Data
            </Text>
          </View>
          {dataRewards.map(renderReward)}

          <View style={styles.divider} />

          {/* CREDIT SECTION */}
          <View style={styles.sectionHeader}>
            <Ionicons name="call" size={20} color={colors.textDark} />
            <Text variant="l" weight="bold" color={colors.textDark} style={styles.sectionTitle}>
              Crédit d'appel
            </Text>
          </View>
          {creditRewards.map(renderReward)}

          <View style={styles.divider} />

          {/* SPECIAL SECTION */}
          <View style={styles.sectionHeader}>
            <Ionicons name="gift" size={20} color={colors.textDark} />
            <Text variant="l" weight="bold" color={colors.textDark} style={styles.sectionTitle}>
              Offres spéciales
            </Text>
          </View>
          {specialRewards.map(renderReward)}
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
    borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
  },

  // ── Hero Section ──
  heroSection: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: ORANGE_LIGHT,
    marginHorizontal: 20, marginTop: 24, padding: 24,
    borderRadius: 24,
  },
  heroTextContent: { flex: 1, paddingRight: 10 },
  balanceContainer: {
    flexDirection: 'row', alignItems: 'flex-end', marginTop: 8,
  },
  heroLottieWrapper: {
    width: 100, height: 120, justifyContent: 'center', alignItems: 'center',
    marginLeft: 10,
  },

  // ── Content ──
  content: { paddingHorizontal: 20, paddingTop: 32 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16,
  },
  sectionTitle: { marginLeft: 8 },
  divider: {
    height: 1, backgroundColor: '#F1F5F9', marginVertical: 24,
  },

  // ── Cards (Flat) ──
  rewardCardFlat: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#F1F5F9',
    borderRadius: 20, padding: 16,
    marginBottom: 12,
  },
  rewardCardSpecial: {
    borderColor: ORANGE_LIGHT,
    backgroundColor: '#FFFCF9',
  },
  rewardRow: { flexDirection: 'row', alignItems: 'center' },
  
  rewardIconBlock: { 
    width: 52, height: 52, borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center',
  },
  rewardInfo: { flex: 1, marginLeft: 16, paddingRight: 8 },
  
  exclusiveBadgeFlat: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8, paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: ORANGE_LIGHT, borderRadius: 8,
  },

  redeemButtonFlat: {
    backgroundColor: ORANGE_BRAND,
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  redeemDisabledFlat: {
    backgroundColor: '#F1F5F9',
  },
});
