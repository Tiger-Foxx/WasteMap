import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Image, Dimensions, Share } from 'react-native';
import { Text } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { EventStatus } from '../../models';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const statusConfig: Record<EventStatus, { label: string; iconName: keyof typeof Ionicons.glyphMap; color: string; bgColor: string }> = {
  planned: { label: 'À venir', iconName: 'calendar', color: colors.primary, bgColor: '#ECFDF5' },
  active: { label: 'En cours', iconName: 'radio-button-on', color: '#F59E0B', bgColor: '#FEF3C7' },
  completed: { label: 'Terminé', iconName: 'checkmark-circle', color: '#10B981', bgColor: '#ECFDF5' },
  cancelled: { label: 'Annulé', iconName: 'close-circle', color: '#EF4444', bgColor: '#FEE2E2' },
};

export const EventsScreen = ({ navigation }: any) => {
  const { events, user } = useAppStore();
  const insets = useSafeAreaInsets();
  // Set to mock local state for the joined visualization
  const [localJoined, setLocalJoined] = useState<Record<string, boolean>>({});

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleShare = async (title: string, dateStr: string) => {
    try {
      await Share.share({
        message: `Hé ! Rejoins-moi pour l'événement de nettoyage "${title}" le ${formatDateShort(dateStr)}. Connecte-toi sur WasteMap, on partagera des EcoPoints ensemble 🌱 !`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const toggleJoin = (eventId: string, initiallyJoined: boolean) => {
    setLocalJoined(prev => ({
      ...prev,
      [eventId]: prev[eventId] !== undefined ? !prev[eventId] : !initiallyJoined
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} bounces={false}>
        
        {/* Full Hero Section with Image Cover */}
        <View style={styles.heroWrapper}>
          <Image 
            source={require('../../../assets/illustrations/eco-event.png')} 
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
              Agissons ensemble pour notre ville
            </Text>
            <Text variant="s" color="#E2E8F0" style={styles.heroSubtitle}>
              Rejoignez des initiatives de nettoyage locales. Invitez vos amis et partagez les EcoPoints de la victoire.
            </Text>
          </View>
        </View>

        {/* Events List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text variant="l" weight="bold" color={colors.textDark}>
              Prochains événements
            </Text>
            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Text variant="xs" weight="bold" color={colors.primary}>
                Voir la carte
              </Text>
            </TouchableOpacity>
          </View>

          {events.map((event) => {
            const config = statusConfig[event.status];
            const initiallyJoined = event.participants.some(p => p.userId === user?.id);
            const isJoined = localJoined[event.id] !== undefined ? localJoined[event.id] : initiallyJoined;
            const spotsLeft = event.maxParticipants ? event.maxParticipants - event.participants.length : null;

            return (
              <View key={event.id} style={styles.flatCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
                    <Ionicons name={config.iconName} size={14} color={config.color} />
                    <Text variant="xs" weight="bold" color={config.color} style={{ marginLeft: 4 }}>
                      {config.label}
                    </Text>
                  </View>
                  <View style={styles.dateBadge}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                    <Text variant="xs" weight="bold" color={colors.textMuted} style={{ marginLeft: 4 }}>
                      {formatDateShort(event.scheduledAt)}
                    </Text>
                  </View>
                </View>

                <Text variant="m" weight="bold" color={colors.textDark} style={styles.eventTitle} numberOfLines={2}>
                  {event.title}
                </Text>

                <View style={styles.infoGrid}>
                  <View style={styles.infoRow}>
                    <View style={styles.iconBox}>
                      <Ionicons name="location-outline" size={16} color={colors.textMuted} />
                    </View>
                    <Text variant="xs" weight="medium" color={colors.textMuted} style={styles.infoText}>
                      {event.targetLocation.quarter}, {event.targetLocation.city}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={styles.iconBox}>
                      <Ionicons name="time-outline" size={16} color={colors.textMuted} />
                    </View>
                    <Text variant="xs" weight="medium" color={colors.textMuted} style={styles.infoText}>
                      {formatTime(event.scheduledAt)} ({event.estimatedDurationMinutes} min)
                    </Text>
                  </View>
                </View>

                {/* Team / Spots */}
                <View style={styles.teamContainer}>
                  <View style={styles.avatarsRow}>
                    {[1, 2, 3].map((num) => (
                      <Image 
                        key={num} 
                        source={{ uri: `https://i.pravatar.cc/100?u=event${event.id}${num}` }} 
                        style={[styles.miniAvatar, { marginLeft: num === 1 ? 0 : -8 }]} 
                      />
                    ))}
                  </View>
                  <Text variant="xs" weight="medium" color={colors.textMuted} style={{ marginLeft: 8 }}>
                    {event.participants.length} {spotsLeft ? `/ ${event.maxParticipants}` : ''} participants
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  {event.status === 'planned' && ! (event.organizerId === user?.id) && (
                    <TouchableOpacity 
                      style={[styles.primaryBtn, isJoined && styles.joinedBtn]} 
                      activeOpacity={0.8}
                      onPress={() => toggleJoin(event.id, initiallyJoined)}
                    >
                      <Ionicons 
                        name={isJoined ? "checkmark-circle" : "add-circle-outline"} 
                        size={18} 
                        color={isJoined ? colors.primary : colors.white} 
                      />
                      <Text variant="s" weight="bold" color={isJoined ? colors.primary : colors.white} style={{ marginLeft: 6 }}>
                        {isJoined ? 'Inscrit' : "S'inscrire"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {event.organizerId === user?.id && (
                    <TouchableOpacity 
                      style={[styles.primaryBtn, { backgroundColor: '#F59E0B' }]} 
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('ManageEvent', { eventId: event.id })}
                    >
                      <Ionicons name="people-outline" size={18} color="#FFF" />
                      <Text variant="s" weight="bold" color="#FFF" style={{ marginLeft: 6 }}>
                        Gérer
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity 
                    style={styles.secondaryBtn} 
                    activeOpacity={0.8}
                    onPress={() => handleShare(event.title, event.scheduledAt)}
                  >
                    <Ionicons name="share-social-outline" size={18} color={colors.textDark} />
                    <Text variant="s" weight="bold" color={colors.textDark} style={{ marginLeft: 6 }}>
                      Inviter
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>

      {/* Floating Action Button for Create Event */}
      <TouchableOpacity style={styles.fabWrap} activeOpacity={0.9}>
        <View style={styles.fabBtn}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  heroWrapper: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  heroCoverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 30, 15, 0.65)',
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
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSubtitle: {
    lineHeight: 20,
  },
  listSection: {
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  flatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  eventTitle: {
    fontSize: 18,
    marginBottom: 16,
    lineHeight: 24,
  },
  infoGrid: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    paddingTop: 2,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarsRow: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  joinedBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabWrap: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  fabBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
