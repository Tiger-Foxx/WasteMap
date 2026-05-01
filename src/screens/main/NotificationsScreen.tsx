import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text } from '../../components';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { AppNotification } from '../../models';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const typeConfig: Record<AppNotification['type'], { iconName: keyof typeof Ionicons.glyphMap; color: string; bgColor: string }> = {
  report_update: { iconName: 'location-outline', color: '#3B82F6', bgColor: '#EFF6FF' },
  cleaning_validated: { iconName: 'checkmark-circle-outline', color: '#10B981', bgColor: '#ECFDF5' },
  points_earned: { iconName: 'leaf-outline', color: '#10B981', bgColor: '#ECFDF5' },
  event_invite: { iconName: 'calendar-outline', color: '#F59E0B', bgColor: '#FEF3C7' },
  badge_unlocked: { iconName: 'medal-outline', color: '#8B5CF6', bgColor: '#EEF2FF' },
  reward_activated: { iconName: 'gift-outline', color: '#FF7900', bgColor: '#FFF7ED' },
  system: { iconName: 'notifications-outline', color: '#64748B', bgColor: '#F8FAFC' },
};

const timeAgo = (dateStr: string): string => {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return `À l'instant`;
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `il y a ${diffD} j`;
};

const groupNotifications = (notifications: AppNotification[]) => {
  const now = new Date();
  const today: AppNotification[] = [];
  const yesterday: AppNotification[] = [];
  const older: AppNotification[] = [];

  const getDaysDiff = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffTime = Math.abs(now.getTime() - d.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Sort by newest first
  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  sorted.forEach(notif => {
    const diff = getDaysDiff(notif.createdAt);
    if (diff === 0) today.push(notif);
    else if (diff === 1) yesterday.push(notif);
    else older.push(notif);
  });

  return { today, yesterday, older };
};

export const NotificationsScreen = ({ navigation }: any) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const insets = useSafeAreaInsets();

  const handlePress = (notif: AppNotification) => {
    if (!notif.isRead) {
      markNotificationRead(notif.id);
    }
  };

  const { today, yesterday, older } = useMemo(() => groupNotifications(notifications), [notifications]);

  const renderGroup = (title: string, data: AppNotification[]) => {
    if (data.length === 0) return null;
    return (
      <View style={styles.groupContainer}>
        <Text variant="s" weight="bold" color={colors.textLight} style={styles.groupHeader}>
          {title.toUpperCase()}
        </Text>
        {data.map(notif => {
          const config = typeConfig[notif.type] || typeConfig.system;
          return (
            <TouchableOpacity
              key={notif.id}
              activeOpacity={0.7}
              onPress={() => handlePress(notif)}
              style={[
                styles.flatCard,
                !notif.isRead && styles.unreadCard
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconWrapper, { backgroundColor: config.bgColor }]}>
                  <Ionicons name={config.iconName} size={20} color={config.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text variant="m" weight="bold" color={colors.textDark} style={{ flex: 1 }} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    {!notif.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text variant="xs" color={colors.textLight}>
                    {timeAgo(notif.createdAt)}
                  </Text>
                </View>
              </View>
              
              <Text variant="s" color={colors.textMuted} style={styles.bodyText}>
                {notif.body}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAF8" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtnFlat} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textDark} />
          </TouchableOpacity>
          <Text variant="xl" weight="bold" color={colors.textDark} style={{ marginLeft: 16 }}>
            Notifications
          </Text>
        </View>
        <TouchableOpacity style={styles.readAllBtn} onPress={markAllNotificationsRead}>
          <Ionicons name="checkmark-done" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="notifications-off-outline" size={32} color={colors.textLight} />
            </View>
            <Text variant="m" weight="bold" color={colors.textDark} style={{ marginTop: 16 }}>
              Aucune notification
            </Text>
            <Text variant="s" color={colors.textMuted} align="center" style={{ marginTop: 8 }}>
              Vous êtes à jour. Tout ce qui est important apparaîtra ici.
            </Text>
          </View>
        ) : (
          <>
            {renderGroup("Aujourd'hui", today)}
            {renderGroup("Hier", yesterday)}
            {renderGroup("Plus anciennes", older)}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAF8' 
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnFlat: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  readAllBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { 
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    marginBottom: 12,
    letterSpacing: 1,
  },
  flatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  unreadCard: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconWrapper: {
    width: 44, 
    height: 44, 
    borderRadius: 22,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  unreadDot: {
    width: 8, 
    height: 8, 
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  bodyText: {
    lineHeight: 20,
    paddingLeft: 56, // Align with text content
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  }
});