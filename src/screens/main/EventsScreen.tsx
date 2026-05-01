import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text, Card, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { EventStatus } from '../../models';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const statusConfig: Record<EventStatus, { label: string; iconName: keyof typeof Ionicons.glyphMap; color: string }> = {
  planned: { label: 'À venir', iconName: 'calendar', color: colors.primary },
  active: { label: 'En cours', iconName: 'radio-button-on', color: '#F59E0B' },
  completed: { label: 'Terminé', iconName: 'checkmark-circle', color: '#10B981' },
  cancelled: { label: 'Annulé', iconName: 'close-circle', color: '#EF4444' },
};

export const EventsScreen = ({ navigation }: any) => {
  const { events, user } = useAppStore();
  const insets = useSafeAreaInsets();

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Modern Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text variant="l" weight="bold" color={colors.textDark}>
          Actions Communes
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Hero Section with Illustration */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text variant="xl" weight="bold" color={colors.textDark} style={styles.heroTitle}>
              Agissons ensemble pour notre ville
            </Text>
            <Text variant="s" color={colors.textMuted} style={styles.heroSubtitle}>
              Rejoignez des initiatives locales de nettoyage, rencontrez d'autres citoyens engagés et maximisez votre impact environnemental.
            </Text>
          </View>
          <Image 
            source={require('../../../assets/illustrations/eco-event.png')} 
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Events List */}
        <View style={styles.listSection}>
          <Text variant="m" weight="bold" color={colors.textDark} style={styles.sectionTitle}>
            Prochains événements
          </Text>

          {events.map((event, index) => {
            const config = statusConfig[event.status];
            const isJoined = event.participants.some(p => p.userId === user?.id);
            const spotsLeft = event.maxParticipants ? event.maxParticipants - event.participants.length : null;

            return (
              <View key={event.id}>
                <View style={styles.modernCard}>
                  {/* Date & Status Column */}
                  <View style={styles.dateCol}>
                    <Text variant="l" weight="bold" color={colors.textDark}>
                      {new Date(event.scheduledAt).getDate()}
                    </Text>
                    <Text variant="xs" weight="medium" color={colors.textMuted} style={{ textTransform: 'uppercase' }}>
                      {new Date(event.scheduledAt).toLocaleDateString('fr-FR', { month: 'short' })}
                    </Text>
                  </View>

                  {/* Content Column */}
                  <View style={styles.contentCol}>
                    <View style={styles.cardHeader}>
                      <View style={styles.statusBadgeClean}>
                        <Ionicons name={config.iconName} size={14} color={config.color} />
                        <Text variant="xs" weight="bold" color={config.color} style={{ marginLeft: 4 }}>
                          {config.label}
                        </Text>
                      </View>
                      {event.sponsorName && (
                        <View style={styles.sponsorClean}>
                          <Ionicons name="briefcase-outline" size={12} color={colors.textMuted} />
                          <Text variant="xs" weight="medium" color={colors.textMuted} style={{ marginLeft: 4 }}>
                            {event.sponsorName}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text variant="m" weight="bold" color={colors.textDark} style={styles.eventTitle} numberOfLines={2}>
                      {event.title}
                    </Text>

                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={16} color={colors.textLight} />
                      <Text variant="xs" color={colors.textMuted} style={{ marginLeft: 6 }} numberOfLines={1}>
                        {event.targetLocation.quarter}, {event.targetLocation.city}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={16} color={colors.textLight} />
                      <Text variant="xs" color={colors.textMuted} style={{ marginLeft: 6 }}>
                        {formatTime(event.scheduledAt)} • {event.estimatedDurationMinutes} min
                      </Text>
                    </View>

                    <View style={styles.footerRow}>
                      <View style={styles.participantsClean}>
                        <Ionicons name="people-outline" size={16} color={colors.textMuted} />
                        <Text variant="xs" weight="medium" color={colors.textMuted} style={{ marginLeft: 6 }}>
                          {event.participants.length} {spotsLeft ? `/ ${event.maxParticipants}` : ''} inscrits
                        </Text>
                      </View>
                      
                      {event.status === 'planned' && (
                        <TouchableOpacity 
                          style={[styles.joinBtn, isJoined && styles.joinedBtn]} 
                          activeOpacity={0.8}
                        >
                          <Text variant="xs" weight="bold" color={isJoined ? colors.primary : colors.white}>
                            {isJoined ? 'Inscrit' : 'Participer'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Create Event CTA with Lottie */}
        <View style={styles.ctaContainer}>
          <View style={styles.lottieContainer}>
            <LottieView
              source={require('../../../assets/lotties/Hand holding plant seedling.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
          <View style={styles.ctaTextContainer}>
            <Text variant="m" weight="bold" color={colors.textDark}>
              Créer votre mouvement
            </Text>
            <Text variant="xs" color={colors.textMuted} style={{ marginTop: 4, lineHeight: 18 }}>
              Prenez l'initiative et organisez une collecte ciblée dans votre quartier.
            </Text>
            <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.8}>
              <Text variant="s" weight="bold" color={colors.textDark}>
                Proposer une date
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.textDark} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 24,
    padding: 24,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  heroTextContainer: {
    marginBottom: 20,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  heroSubtitle: {
    marginTop: 8,
    lineHeight: 20,
  },
  heroImage: {
    width: width * 0.7,
    height: 140,
    alignSelf: 'flex-end',
    marginRight: -20,
    marginBottom: -10,
  },
  listSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    marginLeft: 4,
  },
  modernCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  dateCol: {
    width: 50,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
    paddingRight: 16,
    marginRight: 16,
    paddingTop: 4,
  },
  contentCol: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadgeClean: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sponsorClean: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTitle: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  participantsClean: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinBtn: {
    backgroundColor: colors.textDark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  joinedBtn: {
    backgroundColor: '#E2E8F0',
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  lottieContainer: {
    width: 70,
    height: 70,
    marginRight: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 80,
    height: 80,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
});
