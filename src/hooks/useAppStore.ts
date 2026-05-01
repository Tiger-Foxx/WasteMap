// ============================================================
// Store global Zustand — État de l'application WasteMap
// Utilise les données mock pour la présentation au jury
// Prêt à être connecté à un backend Django REST
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User, WasteReport, CleaningAction, EcoPointTransaction,
  Reward, CommunityEvent, Badge, LeaderboardEntry,
  QuarterRanking, AppNotification, CollectionPoint,
} from '../models';
import {
  MOCK_CURRENT_USER, MOCK_REPORTS, MOCK_CLEANING_ACTIONS,
  MOCK_TRANSACTIONS, MOCK_REWARDS, MOCK_EVENTS, MOCK_BADGES,
  MOCK_LEADERBOARD, MOCK_QUARTER_RANKINGS, MOCK_NOTIFICATIONS,
  MOCK_COLLECTION_POINTS,
} from '../data/mockData';

// ─── Types du store ─────────────────────────────────────────

export interface CleaningSession {
  reportId: string;
  step: 'avant' | 'pendant' | 'apres';
  mediaAvant?: string | null;
  mediaPendant?: string | null;
  mediaApres?: string | null;
}

interface AppState {
  // Authentification
  isAuthenticated: boolean;
  isOnboarded: boolean;
  user: User | null;

  // Données métier
  reports: WasteReport[];
  cleaningActions: CleaningAction[];
  transactions: EcoPointTransaction[];
  rewards: Reward[];
  events: CommunityEvent[];
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  quarterRankings: QuarterRanking[];
  notifications: AppNotification[];
  collectionPoints: CollectionPoint[];

  // Session persistante
  activeCleaningSession: CleaningSession | null;

  // UI state
  isLoading: boolean;

  // Actions — Auth
  login: (phone: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;

  // Actions — Signalement (Radar)
  addReport: (report: Omit<WasteReport, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'ecoPointsEarned' | 'confirmationCount' | 'isDuplicate'>) => Promise<WasteReport>;

  // Actions — Nettoyage
  setActiveCleaningSession: (session: CleaningSession | null) => void;
  updateCleaningSession: (updates: Partial<CleaningSession>) => void;
  addCleaningAction: (action: Omit<CleaningAction, 'id' | 'createdAt' | 'status' | 'ecoPointsEarned' | 'validation' | 'validatedAt'>) => Promise<CleaningAction>;

  // Actions — Récompenses
  redeemReward: (rewardId: string) => Promise<{ success: boolean; message: string }>;

  // Actions — Evénements
  updateParticipantStatus: (eventId: string, userId: string, newStatus: 'pending' | 'approved' | 'rejected') => void;

  // Actions — Notifications
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  getUnreadCount: () => number;
}

// ─── Store ──────────────────────────────────────────────────

// Préparer le user avec ses badges
const userWithBadges: User = {
  ...MOCK_CURRENT_USER,
  badges: MOCK_BADGES.filter(b => b.isUnlocked),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // État initial
      isAuthenticated: false,
      isOnboarded: false,
      user: userWithBadges,
      reports: MOCK_REPORTS,
      cleaningActions: MOCK_CLEANING_ACTIONS,
      transactions: MOCK_TRANSACTIONS,
      rewards: MOCK_REWARDS,
      events: MOCK_EVENTS,
      badges: MOCK_BADGES,
      leaderboard: MOCK_LEADERBOARD,
      quarterRankings: MOCK_QUARTER_RANKINGS,
      notifications: MOCK_NOTIFICATIONS,
      collectionPoints: MOCK_COLLECTION_POINTS,
      activeCleaningSession: null,
      isLoading: false,

      // ── Auth ────────────────────────────────────────────────

      login: async (phone: string) => {
        set({ isLoading: true });
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({
          isAuthenticated: true,
          isLoading: false,
          user: { ...userWithBadges, phone },
        });
      },

      logout: () => {
        set({ isAuthenticated: false, isOnboarded: false, user: null, activeCleaningSession: null });
      },

      completeOnboarding: () => {
        set({ isOnboarded: true });
      },

      // ── Signalement ─────────────────────────────────────────

      addReport: async (reportData) => {
        set({ isLoading: true });
        // Simuler le traitement IA (2.5 secondes)
        await new Promise(resolve => setTimeout(resolve, 2500));

        const pointsEarned = Math.max(
          10,
          Math.floor(reportData.analysis.estimatedVolumeM3 * 50)
        );

        const newReport: WasteReport = {
          ...reportData,
          id: `r${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'pending',
          ecoPointsEarned: pointsEarned,
          confirmationCount: 0,
          isDuplicate: false,
        };

        const newTransaction: EcoPointTransaction = {
          id: `t${Date.now()}`,
          userId: get().user?.id || '',
          type: 'report_earned',
          amount: pointsEarned,
          balance: (get().user?.ecoPoints || 0) + pointsEarned,
          description: `Signalement validé — ${reportData.location.quarter || reportData.location.address}`,
          referenceId: newReport.id,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          reports: [newReport, ...state.reports],
          transactions: [newTransaction, ...state.transactions],
          isLoading: false,
          user: state.user ? {
            ...state.user,
            ecoPoints: state.user.ecoPoints + pointsEarned,
            stats: {
              ...state.user.stats,
              totalReports: state.user.stats.totalReports + 1,
              totalEcoPointsEarned: state.user.stats.totalEcoPointsEarned + pointsEarned,
            },
          } : null,
        }));

        return newReport;
      },

      // ── Nettoyage ───────────────────────────────────────────

      setActiveCleaningSession: (session) => {
        set({ activeCleaningSession: session });
      },

      updateCleaningSession: (updates) => {
        set((state) => ({
          activeCleaningSession: state.activeCleaningSession
            ? { ...state.activeCleaningSession, ...updates }
            : null,
        }));
      },

      addCleaningAction: async (actionData) => {
        set({ isLoading: true });
        // Simuler l'analyse vidéo IA anti-fraude (3 secondes)
        await new Promise(resolve => setTimeout(resolve, 3000));

        const pointsEarned = 250; // Multiplicateur massif

        const newAction: CleaningAction = {
          ...actionData,
          id: `c${Date.now()}`,
          createdAt: new Date().toISOString(),
          validatedAt: new Date().toISOString(),
          status: 'approved',
          ecoPointsEarned: pointsEarned,
          validation: {
            reductionPercentage: Math.floor(75 + Math.random() * 20),
            confidence: parseFloat((0.85 + Math.random() * 0.14).toFixed(2)),
            humanActionDetected: true,
            meetsMinimumThreshold: true,
          },
        };

        const newTransaction: EcoPointTransaction = {
          id: `t${Date.now()}`,
          userId: get().user?.id || '',
          type: 'cleaning_earned',
          amount: pointsEarned,
          balance: (get().user?.ecoPoints || 0) + pointsEarned,
          description: `Nettoyage validé — ${actionData.collectionPointName || 'Zone nettoyée'}`,
          referenceId: newAction.id,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          cleaningActions: [newAction, ...state.cleaningActions],
          transactions: [newTransaction, ...state.transactions],
          activeCleaningSession: null, // Clear session upon successful cleaning
          isLoading: false,
          user: state.user ? {
            ...state.user,
            ecoPoints: state.user.ecoPoints + pointsEarned,
            trustScore: Math.min(1000, state.user.trustScore + 25),
            stats: {
              ...state.user.stats,
              totalCleanings: state.user.stats.totalCleanings + 1,
              totalEcoPointsEarned: state.user.stats.totalEcoPointsEarned + pointsEarned,
            },
          } : null,
        }));

        return newAction;
      },

      // ── Récompenses ─────────────────────────────────────────

      redeemReward: async (rewardId: string) => {
        const state = get();
        const reward = state.rewards.find(r => r.id === rewardId);
        if (!reward || !state.user) {
          return { success: false, message: 'Récompense introuvable.' };
        }
        if (state.user.ecoPoints < reward.cost) {
          return { success: false, message: 'EcoPoints insuffisants.' };
        }
        if (reward.isExclusive && reward.minTrustScore && state.user.trustScore < reward.minTrustScore) {
          return { success: false, message: `Trust Score minimum requis : ${reward.minTrustScore}` };
        }

        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newTransaction: EcoPointTransaction = {
          id: `t${Date.now()}`,
          userId: state.user.id,
          type: 'reward_spent',
          amount: -reward.cost,
          balance: state.user.ecoPoints - reward.cost,
          description: `${reward.title} activé`,
          referenceId: rewardId,
          createdAt: new Date().toISOString(),
        };

        set((s) => ({
          transactions: [newTransaction, ...s.transactions],
          isLoading: false,
          user: s.user ? {
            ...s.user,
            ecoPoints: s.user.ecoPoints - reward.cost,
            stats: {
              ...s.user.stats,
              totalEcoPointsSpent: s.user.stats.totalEcoPointsSpent + reward.cost,
            },
          } : null,
        }));

        return { success: true, message: `${reward.title} activé avec succès sur votre compte Orange !` };
      },

      // ── Evénements ──────────────────────────────────────────

      updateParticipantStatus: (eventId: string, userId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
        set((state) => ({
          events: state.events.map(event => {
            if (event.id === eventId) {
              return {
                ...event,
                participants: event.participants.map(p => 
                  p.userId === userId ? { ...p, status: newStatus } : p
                )
              };
            }
            return event;
          })
        }));
      },

      // ── Notifications ───────────────────────────────────────

      markNotificationRead: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true }))
        }));
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.isRead).length;
      },
    }),
    {
      name: 'wastemap-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        user: state.user,
        activeCleaningSession: state.activeCleaningSession,
      }),
    }
  )
);
