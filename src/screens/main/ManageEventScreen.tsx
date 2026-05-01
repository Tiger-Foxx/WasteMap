import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import { Text } from '../../components';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { useAppStore } from '../../hooks/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ManageEventScreen = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const { events, updateParticipantStatus } = useAppStore();
  const insets = useSafeAreaInsets();

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Événement non trouvé</Text>
      </View>
    );
  }

  const pendingParticipants = event.participants.filter(p => p.status === 'pending');
  const approvedParticipants = event.participants.filter(p => p.status === 'approved');

  const handleStatusUpdate = (userId: string, newStatus: 'approved' | 'rejected') => {
    updateParticipantStatus(event.id, userId, newStatus);
  };

  const renderParticipant = ({ item }: { item: any }) => (
    <View style={styles.participantCard}>
      <Image 
        source={{ uri: item.avatarUrl || `https://i.pravatar.cc/150?u=${item.userId}` }} 
        style={styles.avatar} 
      />
      <View style={styles.participantInfo}>
        <Text variant="m" weight="bold" color={colors.textDark}>{item.userName}</Text>
        <Text variant="xs" color={colors.textMuted}>Inscrit le {new Date(item.joinedAt).toLocaleDateString('fr-FR')}</Text>
      </View>
      
      {item.status === 'pending' ? (
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionBtnReject} 
            onPress={() => handleStatusUpdate(item.userId, 'rejected')}
          >
            <Ionicons name="close" size={20} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtnApprove} 
            onPress={() => handleStatusUpdate(item.userId, 'approved')}
          >
            <Ionicons name="checkmark" size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.statusBadge}>
          <Ionicons 
            name={item.status === 'approved' ? 'checkmark-circle' : 'close-circle'} 
            size={18} 
            color={item.status === 'approved' ? '#10B981' : '#EF4444'} 
          />
          <Text variant="xs" weight="medium" color={item.status === 'approved' ? '#10B981' : '#EF4444'} style={{ marginLeft: 4 }}>
            {item.status === 'approved' ? 'Approuvé' : 'Refusé'}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text variant="l" weight="bold" color={colors.textDark} numberOfLines={1}>
            Gestion des participants
          </Text>
          <Text variant="xs" color={colors.textMuted} numberOfLines={1}>
            {event.title}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={[...pendingParticipants, ...approvedParticipants]}
        keyExtractor={item => item.userId}
        contentContainerStyle={styles.listContent}
        renderItem={renderParticipant}
        ListHeaderComponent={() => (
           <View style={styles.summaryContainer}>
             <Text variant="s" weight="bold" color={colors.textDark} style={styles.sectionTitle}>
               Demandes en attente ({pendingParticipants.length})
             </Text>
           </View>
        )}
      />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  participantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnApprove: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  actionBtnReject: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
});