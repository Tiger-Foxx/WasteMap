import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Card } from '../../components';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { AppNotification } from '../../models';

import { Ionicons } from '@expo/vector-icons';

const typeConfig: Record<AppNotification['type'], { iconName: keyof typeof Ionicons.glyphMap; color: string }> = {
  report_update: { iconName: 'location', color: '#1565C0' },
  cleaning_validated: { iconName: 'checkmark-circle', color: '#2E7D32' },
  points_earned: { iconName: 'leaf', color: colors.ecoPoint },
  event_invite: { iconName: 'flash', color: '#E65100' },
  badge_unlocked: { iconName: 'medal', color: '#FFD700' },
  reward_activated: { iconName: 'phone-portrait', color: colors.orange },
  system: { iconName: 'notifications', color: colors.textMuted },
};

const timeAgo = (dateStr: string): string => {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `il y a ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `il y a ${diffD}j`;
};

export const NotificationsScreen = ({ navigation }: any) => {
  const { notifications, markNotificationRead } = useAppStore();

  const handlePress = (notif: AppNotification) => {
    if (!notif.isRead) {
      markNotificationRead(notif.id);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text variant="l" color={colors.textDark}>←</Text>
        </TouchableOpacity>
        <Text variant="l" weight="bold" color={colors.textDark}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map((notif) => {
          const config = typeConfig[notif.type];
          return (
            <TouchableOpacity
              key={notif.id}
              activeOpacity={0.7}
              onPress={() => handlePress(notif)}
            >
              <Card
                variant={notif.isRead ? 'default' : 'elevated'}
                style={[styles.notifCard, !notif.isRead && styles.notifUnread]}
              >
                <View style={styles.notifRow}>
                  <View style={[styles.notifIcon, { backgroundColor: `${config.color}15` }]}>
                    <Ionicons name={config.iconName} size={20} color={config.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifTitleRow}>
                      <Text
                        variant="s" weight={notif.isRead ? 'medium' : 'bold'}
                        color={colors.textDark} style={{ flex: 1 }}
                        numberOfLines={1}
                      >
                        {notif.title}
                      </Text>
                      {!notif.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text variant="xs" color={colors.textMuted} style={{ marginTop: 2, lineHeight: 18 }}>
                      {notif.body}
                    </Text>
                    <Text variant="xs" color={colors.textLight} style={{ marginTop: 4 }}>
                      {timeAgo(notif.createdAt)}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 56, paddingHorizontal: spacing.screenPadding, paddingBottom: 16,
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  content: { paddingHorizontal: spacing.screenPadding, paddingTop: 16 },
  notifCard: { marginBottom: 8 },
  notifUnread: { borderLeftWidth: 3, borderLeftColor: colors.primaryLight },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  notifIcon: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  notifContent: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center' },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.primaryLight, marginLeft: 8,
  },
});
