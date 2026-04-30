import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card, Button } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { EventStatus } from '../../models';

const statusConfig: Record<EventStatus, { label: string; iconName: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  planned: { label: 'Prévu', iconName: 'calendar', color: '#1565C0', bg: '#E3F2FD' },
  active: { label: 'En cours', iconName: 'flame', color: '#E65100', bg: '#FFF3E0' },
  completed: { label: 'Terminé', iconName: 'checkmark-circle', color: '#2E7D32', bg: '#E8F5E9' },
  cancelled: { label: 'Annulé', iconName: 'close-circle', color: '#C62828', bg: '#FFEBEE' },
};

export const EventsScreen = ({ navigation }: any) => {
  const { events, user } = useAppStore();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text variant="l" color={colors.white}>←</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="flash" size={24} color={colors.white} />
          <Text variant="xl" weight="bold" color={colors.white}>Événements Flash</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info card */}
        <Card variant="glass" style={styles.infoCard}>
          <Text variant="s" color={colors.textDark} style={{ lineHeight: 22 }}>
            Les Événements Flash sont des matinées de nettoyage collectif. Rejoignez un événement ou
            créez le vôtre pour mobiliser votre quartier ! 💪
          </Text>
        </Card>

        {events.map((event) => {
          const config = statusConfig[event.status];
          const isJoined = event.participants.some(p => p.userId === user?.id);
          const spotsLeft = event.maxParticipants
            ? event.maxParticipants - event.participants.length
            : null;

          return (
            <Card key={event.id} variant="elevated" style={styles.eventCard}>
              {/* Status badge + Sponsor */}
              <View style={styles.eventTopRow}>
                <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name={config.iconName} size={14} color={config.color} />
                    <Text variant="xs" weight="semiBold" color={config.color}>
                      {config.label}
                    </Text>
                  </View>
                </View>
                {event.sponsorName && (
                  <View style={styles.sponsorBadge}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="star" size={12} color={colors.orange} />
                      <Text variant="xs" color={colors.orange}>
                        {event.sponsorName}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Title */}
              <Text variant="l" weight="bold" color={colors.textDark} style={{ marginTop: 12 }}>
                {event.title}
              </Text>
              <Text variant="s" color={colors.textMuted} style={{ marginTop: 4, lineHeight: 22 }}>
                {event.description}
              </Text>

              {/* Location + Date */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={16} color={colors.textDark} />
                  <Text variant="xs" color={colors.textMuted} style={{ marginLeft: 6 }}>
                    {event.targetLocation.quarter}, {event.targetLocation.city}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color={colors.textDark} />
                  <Text variant="xs" color={colors.textMuted} style={{ marginLeft: 6 }}>
                    {formatDate(event.scheduledAt)} à {formatTime(event.scheduledAt)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="hourglass-outline" size={16} color={colors.textDark} />
                  <Text variant="xs" color={colors.textMuted} style={{ marginLeft: 6 }}>
                    {event.estimatedDurationMinutes} min
                  </Text>
                </View>
              </View>

              {/* Participants */}
              <View style={styles.participantsSection}>
                <View style={styles.avatarStack}>
                  {event.participants.slice(0, 4).map((p, i) => (
                    <View key={p.userId} style={[styles.stackAvatar, { marginLeft: i > 0 ? -10 : 0, zIndex: 10 - i }]}>
                      <Ionicons name={p.userId === user?.id ? "person" : "person-outline"} size={16} color={colors.primary} />
                    </View>
                  ))}
                  {event.participants.length > 4 && (
                    <View style={[styles.stackAvatar, styles.stackMore, { marginLeft: -10 }]}>
                      <Text variant="xs" weight="bold" color={colors.primary}>
                        +{event.participants.length - 4}
                      </Text>
                    </View>
                  )}
                </View>
                <Text variant="xs" color={colors.textLight}>
                  {event.participants.length} participant{event.participants.length > 1 ? 's' : ''}
                  {spotsLeft !== null ? ` • ${spotsLeft} places restantes` : ''}
                </Text>
              </View>

              {/* EcoPoints collectifs */}
              {event.totalEcoPointsEarned > 0 && (
                <View style={styles.pointsRow}>
                  <Text variant="xs" color={colors.textLight}>EcoPoints collectifs :</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="leaf" size={14} color={colors.ecoPoint} />
                    <Text variant="s" weight="bold" color={colors.ecoPoint}>
                      {event.totalEcoPointsEarned.toLocaleString()} EP
                    </Text>
                  </View>
                </View>
              )}

              {/* Sponsor message */}
              {event.sponsorMessage && (
                <View style={styles.sponsorMsg}>
                  <Text variant="xs" color={colors.orange} style={{ fontStyle: 'italic', lineHeight: 18 }}>
                    "{event.sponsorMessage}"
                  </Text>
                </View>
              )}

              {/* Action button */}
              {event.status === 'planned' && (
                <Button
                  title={isJoined ? '✓ Vous participez' : 'Rejoindre l\'événement'}
                  onPress={() => {}}
                  variant={isJoined ? 'outline' : 'primary'}
                  size="medium"
                  disabled={isJoined}
                  style={{ marginTop: 16 }}
                />
              )}
            </Card>
          );
        })}

        {/* CTA créer un événement */}
        <Card variant="default" style={styles.createCard}>
          <Ionicons name="flower-outline" size={40} color={colors.primary} style={{ alignSelf: 'center' }} />
          <Text variant="m" weight="semiBold" color={colors.textDark} align="center" style={{ marginTop: 12 }}>
            Organisez votre propre événement !
          </Text>
          <Text variant="s" color={colors.textMuted} align="center" style={{ marginTop: 6, lineHeight: 22 }}>
            Mobilisez votre quartier, votre association ou votre club pour un nettoyage collectif.
          </Text>
          <Button
            title="Créer un événement"
            onPress={() => {}}
            variant="primary"
            size="medium"
            style={{ marginTop: 16 }}
          />
        </Card>

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
  content: { paddingHorizontal: spacing.screenPadding, paddingTop: 16 },
  infoCard: { marginBottom: 16, backgroundColor: colors.primaryLighter },
  eventCard: { marginBottom: 16, padding: 18 },
  eventTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  sponsorBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, backgroundColor: colors.orangeLighter,
  },
  metaRow: { marginTop: 14, gap: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  participantsSection: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border,
  },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  stackAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primaryLighter, borderWidth: 2, borderColor: colors.white,
    justifyContent: 'center', alignItems: 'center',
  },
  stackMore: { backgroundColor: colors.white, borderColor: colors.primaryLight },
  pointsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border,
  },
  sponsorMsg: {
    marginTop: 12, padding: 12, backgroundColor: colors.orangeLighter,
    borderRadius: spacing.borderRadius.medium,
  },
  createCard: {
    marginTop: 8, marginBottom: 16, padding: 24,
    borderStyle: 'dashed', borderWidth: 1.5, borderColor: colors.primaryLight,
  },
});
