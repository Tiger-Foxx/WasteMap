import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Text } from '../../components';
import { colors, spacing } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { AppNotification } from '../../models';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const typeConfig: Record<AppNotification['type'], { iconName: keyof typeof Ionicons.glyphMap; color: string; bgColor: string }> = {
  report_update: { iconName: 'location-outline', color: '#10B981', bgColor: '#F0FDF4' },
  cleaning_validated: { iconName: 'checkmark', color: '#10B981', bgColor: '#F0FDF4' },
  points_earned: { iconName: 'leaf-outline', color: '#10B981', bgColor: '#F0FDF4' },
  event_invite: { iconName: 'calendar-outline', color: '#10B981', bgColor: '#F0FDF4' },
  badge_unlocked: { iconName: 'medal-outline', color: '#10B981', bgColor: '#F0FDF4' },
  reward_activated: { iconName: 'gift-outline', color: '#10B981', bgColor: '#F0FDF4' },
  system: { iconName: 'notifications-outline', color: '#10B981', bgColor: '#F0FDF4' },
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
    // Map specific titles to reference mockup logic if needed, else use title directly
    const displayTitle = title === "Plus anciennes" ? "Plus anciennes" : title;

    return (
      <View style={styles.groupContainer}>
        <Text variant="m" color="#718096" style={styles.groupHeader}>
          {displayTitle}
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
              {!notif.isRead && <View style={styles.unreadBorderLeft} />}
              <View style={styles.cardHeaderRow}>
                <View style={[styles.iconWrapper, { backgroundColor: config.bgColor }]}>
                  <Ionicons name={config.iconName} size={22} color={config.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <View style={styles.titleRow}>
                    <Text variant="m" weight="bold" color="#1A202C" style={{ flex: 1, fontSize: 16 }} numberOfLines={1}>
                      {notif.title}
                    </Text>
                    {!notif.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text variant="xs" color="#A0AEC0" style={{ marginTop: 2 }}>
                    {timeAgo(notif.createdAt)}
                  </Text>
                </View>
              </View>
              
              <View style={{ paddingLeft: 60, marginTop: -2 }}>
                <Text variant="s" color="#4A5568" style={[styles.bodyText, { lineHeight: 20 }]}>
                  {notif.body}
                </Text>
              </View>
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
            <Ionicons name="arrow-back" size={24} color="#1A202C" />
          </TouchableOpacity>
          <Text variant="xl" weight="bold" color="#1A202C" style={{ marginLeft: 16, fontSize: 22 }}>
            Notifications
          </Text>
        </View>
        <TouchableOpacity style={styles.readAllBtn} onPress={markAllNotificationsRead}>
          <Ionicons name="checkmark" size={20} color={colors.primary} />
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
    justifyContent: 'center', 
    alignItems: 'flex-start',
  },
  readAllBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
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
    letterSpacing: 0,
    color: '#A0AEC0',
    textTransform: 'none',
    fontSize: 15,
  },
  flatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 16,
    marginBottom: 12,
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  unreadCard: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  unreadBorderLeft: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  unreadDot: {
    width: 6, 
    height: 6, 
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginLeft: 8,
    marginTop: 6,
  },
  bodyText: {
    lineHeight: 20,
    paddingLeft: 0,
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