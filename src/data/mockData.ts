// ============================================================
// Données simulées complètes pour la présentation au jury
// Tout est prévu pour être remplacé par des appels API Django
// ============================================================

import {
  User, WasteReport, CleaningAction, EcoPointTransaction,
  CollectionPoint, Reward, CommunityEvent, Badge,
  LeaderboardEntry, QuarterRanking, AppNotification,
  RewardRedemption,
} from '../models';

// ─── Utilisateur connecté (Dashboard bien rempli) ───────────

export const MOCK_CURRENT_USER: User = {
  id: 'u1',
  phone: '+237 690 00 00 00',
  name: 'Donfack Arthur',
  avatarUrl: undefined,
  role: 'citizen',
  ecoPoints: 1250,
  trustScore: 680,
  level: 7,
  badges: [],
  stats: {
    totalReports: 34,
    totalCleanings: 8,
    totalEventsJoined: 3,
    totalEcoPointsEarned: 2890,
    totalEcoPointsSpent: 1640,
    co2SavedKg: 45.2,
    wasteCollectedKg: 128,
    rank: 12,
    weeklyRank: 3,
  },
  createdAt: '2026-01-15T08:00:00Z',
  lastActiveAt: new Date().toISOString(),
};

// ─── Badges ─────────────────────────────────────────────────

export const MOCK_BADGES: Badge[] = [
  {
    id: 'b1', name: 'Éco-Sentinelle', description: 'Premier signalement effectué',
    iconName: 'eye', category: 'signaling', requirement: '1 signalement validé',
    isUnlocked: true, unlockedAt: '2026-01-16T10:00:00Z', progress: 100,
  },
  {
    id: 'b2', name: 'Radar Urbain', description: '10 signalements validés',
    iconName: 'radar', category: 'signaling', requirement: '10 signalements validés',
    isUnlocked: true, unlockedAt: '2026-02-20T14:00:00Z', progress: 100,
  },
  {
    id: 'b3', name: 'Cartographe', description: '25 signalements validés',
    iconName: 'map', category: 'signaling', requirement: '25 signalements validés',
    isUnlocked: true, unlockedAt: '2026-03-15T09:00:00Z', progress: 100,
  },
  {
    id: 'b4', name: 'Nettoyeur Bronze', description: 'Premier nettoyage validé',
    iconName: 'sparkles', category: 'cleaning', requirement: '1 nettoyage validé',
    isUnlocked: true, unlockedAt: '2026-02-01T16:00:00Z', progress: 100,
  },
  {
    id: 'b5', name: 'Nettoyeur Argent', description: '5 nettoyages validés',
    iconName: 'award', category: 'cleaning', requirement: '5 nettoyages validés',
    isUnlocked: true, unlockedAt: '2026-03-28T11:00:00Z', progress: 100,
  },
  {
    id: 'b6', name: 'Nettoyeur Or', description: '20 nettoyages validés',
    iconName: 'trophy', category: 'cleaning', requirement: '20 nettoyages validés',
    isUnlocked: false, progress: 40,
  },
  {
    id: 'b7', name: 'Leader Communautaire', description: 'Organiser un événement flash',
    iconName: 'users', category: 'community', requirement: '1 événement flash organisé',
    isUnlocked: true, unlockedAt: '2026-04-05T08:00:00Z', progress: 100,
  },
  {
    id: 'b8', name: 'Flamme Verte', description: '7 jours consécutifs d\'activité',
    iconName: 'flame', category: 'streak', requirement: '7 jours consécutifs',
    isUnlocked: true, unlockedAt: '2026-03-10T08:00:00Z', progress: 100,
  },
  {
    id: 'b9', name: 'Infatigable', description: '30 jours consécutifs d\'activité',
    iconName: 'zap', category: 'streak', requirement: '30 jours consécutifs',
    isUnlocked: false, progress: 65,
  },
  {
    id: 'b10', name: 'Éco-Héros', description: 'Atteindre le niveau 10',
    iconName: 'shield', category: 'special', requirement: 'Niveau 10',
    isUnlocked: false, progress: 70,
  },
];

// ─── Signalements ───────────────────────────────────────────

export const MOCK_REPORTS: WasteReport[] = [
  {
    id: 'r1', userId: 'u1', userName: 'Donfack Arthur',
    location: { latitude: 3.8667, longitude: 11.5167, address: 'Rue 1.234, Mvog-Ada', quarter: 'Mvog-Ada', city: 'Yaoundé' },
    imageUrls: ['mock_img_r1'],
    analysis: {
      composition: [
        { type: 'plastic', percentage: 72, label: 'Plastique PET (bouteilles Tangui, sachets)' },
        { type: 'metal', percentage: 12, label: 'Métal aluminium (canettes Beaufort)' },
        { type: 'organic', percentage: 16, label: 'Déchets organiques' },
      ],
      estimatedVolumeM3: 2.4, estimatedWeightKg: 35, gravity: 'high', confidence: 0.92,
    },
    isDuplicate: false, status: 'pending', confirmationCount: 3, ecoPointsEarned: 120,
    createdAt: '2026-04-28T09:15:00Z', updatedAt: '2026-04-28T09:15:00Z',
  },
  {
    id: 'r2', userId: 'u1', userName: 'Donfack Arthur',
    location: { latitude: 3.8712, longitude: 11.5203, address: 'Carrefour Nlongkak', quarter: 'Nlongkak', city: 'Yaoundé' },
    imageUrls: ['mock_img_r2'],
    analysis: {
      composition: [
        { type: 'plastic', percentage: 55, label: 'Plastique mélangé' },
        { type: 'paper', percentage: 30, label: 'Carton et papier' },
        { type: 'organic', percentage: 15, label: 'Restes alimentaires' },
      ],
      estimatedVolumeM3: 1.1, estimatedWeightKg: 18, gravity: 'medium', confidence: 0.88,
    },
    isDuplicate: false, status: 'cleaned', confirmationCount: 5, ecoPointsEarned: 55,
    createdAt: '2026-04-25T14:30:00Z', updatedAt: '2026-04-26T10:00:00Z',
  },
  {
    id: 'r3', userId: 'u2', userName: 'Marie Nguemo',
    location: { latitude: 3.8590, longitude: 11.5100, address: 'Derrière le marché Mokolo', quarter: 'Mokolo', city: 'Yaoundé' },
    imageUrls: ['mock_img_r3'],
    analysis: {
      composition: [
        { type: 'organic', percentage: 60, label: 'Déchets organiques (marché)' },
        { type: 'plastic', percentage: 25, label: 'Sachets plastiques' },
        { type: 'mixed', percentage: 15, label: 'Déchets divers' },
      ],
      estimatedVolumeM3: 5.8, estimatedWeightKg: 95, gravity: 'critical', confidence: 0.95,
    },
    isDuplicate: false, status: 'assigned', confirmationCount: 12, ecoPointsEarned: 290,
    createdAt: '2026-04-29T07:00:00Z', updatedAt: '2026-04-29T09:30:00Z',
  },
  {
    id: 'r4', userId: 'u3', userName: 'Jean-Paul Kamga',
    location: { latitude: 3.8800, longitude: 11.5050, address: 'Caniveau Avenue Kennedy', quarter: 'Bastos', city: 'Yaoundé' },
    imageUrls: ['mock_img_r4'],
    analysis: {
      composition: [
        { type: 'plastic', percentage: 80, label: 'Bouteilles plastiques PET' },
        { type: 'metal', percentage: 20, label: 'Canettes' },
      ],
      estimatedVolumeM3: 0.8, estimatedWeightKg: 12, gravity: 'low', confidence: 0.91,
    },
    isDuplicate: false, status: 'pending', confirmationCount: 1, ecoPointsEarned: 40,
    createdAt: '2026-04-30T06:45:00Z', updatedAt: '2026-04-30T06:45:00Z',
  },
  {
    id: 'r5', userId: 'u4', userName: 'Aminata Diallo',
    location: { latitude: 3.8550, longitude: 11.5250, address: 'Rond-point Biyem-Assi', quarter: 'Biyem-Assi', city: 'Yaoundé' },
    imageUrls: ['mock_img_r5'],
    analysis: {
      composition: [
        { type: 'mixed', percentage: 45, label: 'Déchets ménagers mélangés' },
        { type: 'plastic', percentage: 35, label: 'Emballages plastiques' },
        { type: 'glass', percentage: 20, label: 'Bouteilles en verre' },
      ],
      estimatedVolumeM3: 3.2, estimatedWeightKg: 52, gravity: 'high', confidence: 0.87,
    },
    isDuplicate: false, status: 'pending', confirmationCount: 7, ecoPointsEarned: 160,
    createdAt: '2026-04-30T08:20:00Z', updatedAt: '2026-04-30T08:20:00Z',
  },
];

// ─── Actions de nettoyage ───────────────────────────────────

export const MOCK_CLEANING_ACTIONS: CleaningAction[] = [
  {
    id: 'c1', reportId: 'r2', userId: 'u1', userName: 'Donfack Arthur',
    beforeVideoUrl: 'mock_video_before_c1', afterVideoUrl: 'mock_video_after_c1',
    collectionPointId: 'cp1', collectionPointName: 'Bac HYSACAM Nlongkak',
    validation: {
      reductionPercentage: 92, confidence: 0.94,
      humanActionDetected: true, meetsMinimumThreshold: true,
    },
    status: 'approved', ecoPointsEarned: 250,
    createdAt: '2026-04-26T08:00:00Z', validatedAt: '2026-04-26T08:15:00Z',
  },
];

// ─── Historique EcoPoints ───────────────────────────────────

export const MOCK_TRANSACTIONS: EcoPointTransaction[] = [
  { id: 't1', userId: 'u1', type: 'report_earned', amount: 120, balance: 1250, description: 'Signalement validé — Mvog-Ada', referenceId: 'r1', createdAt: '2026-04-28T09:15:00Z' },
  { id: 't2', userId: 'u1', type: 'cleaning_earned', amount: 250, balance: 1130, description: 'Nettoyage validé — Nlongkak', referenceId: 'c1', createdAt: '2026-04-26T08:15:00Z' },
  { id: 't3', userId: 'u1', type: 'reward_spent', amount: -550, balance: 880, description: '1000 FCFA Crédit Orange activé', referenceId: 'rw5', createdAt: '2026-04-24T12:00:00Z' },
  { id: 't4', userId: 'u1', type: 'report_earned', amount: 55, balance: 1430, description: 'Signalement validé — Nlongkak', referenceId: 'r2', createdAt: '2026-04-25T14:30:00Z' },
  { id: 't5', userId: 'u1', type: 'event_earned', amount: 180, balance: 1375, description: 'Événement Flash — Opération Mokolo Propre', referenceId: 'ev1', createdAt: '2026-04-20T16:00:00Z' },
  { id: 't6', userId: 'u1', type: 'reward_spent', amount: -200, balance: 1195, description: '500 Mo Internet Orange activé', referenceId: 'rw1', createdAt: '2026-04-18T09:00:00Z' },
  { id: 't7', userId: 'u1', type: 'bonus', amount: 100, balance: 1395, description: 'Bonus : Badge "Radar Urbain" débloqué', createdAt: '2026-02-20T14:00:00Z' },
];

// ─── Points de Ramassage ────────────────────────────────────

export const MOCK_COLLECTION_POINTS: CollectionPoint[] = [
  {
    id: 'cp1', name: 'Bac HYSACAM Nlongkak', type: 'hysacam',
    location: { latitude: 3.8720, longitude: 11.5210, address: 'Carrefour Nlongkak', quarter: 'Nlongkak', city: 'Yaoundé' },
    acceptedWasteTypes: ['plastic', 'metal', 'organic', 'paper', 'glass', 'mixed'], isActive: true,
  },
  {
    id: 'cp2', name: 'Point Red-Plast Mvog-Ada', type: 'recycler',
    location: { latitude: 3.8670, longitude: 11.5175, address: 'Avenue Mvog-Ada', quarter: 'Mvog-Ada', city: 'Yaoundé' },
    acceptedWasteTypes: ['plastic'], isActive: true,
  },
  {
    id: 'cp3', name: 'Bac HYSACAM Mokolo', type: 'hysacam',
    location: { latitude: 3.8595, longitude: 11.5108, address: 'Entrée marché Mokolo', quarter: 'Mokolo', city: 'Yaoundé' },
    acceptedWasteTypes: ['plastic', 'metal', 'organic', 'paper', 'glass', 'mixed'], isActive: true,
  },
  {
    id: 'cp4', name: 'Namé Recycling Bastos', type: 'recycler',
    location: { latitude: 3.8810, longitude: 11.5060, address: 'Rue Bastos', quarter: 'Bastos', city: 'Yaoundé' },
    acceptedWasteTypes: ['plastic', 'metal', 'glass'], isActive: true,
  },
];

// ─── Récompenses Orange ─────────────────────────────────────

export const MOCK_REWARDS: Reward[] = [
  { id: 'rw1', title: '500 Mo Internet', description: 'Forfait data Orange valable 7 jours', cost: 200, type: 'data', iconName: 'wifi', isExclusive: false, validityDays: 7 },
  { id: 'rw2', title: '1 Go Internet', description: 'Forfait data Orange valable 30 jours', cost: 500, type: 'data', iconName: 'wifi', isExclusive: false, validityDays: 30 },
  { id: 'rw3', title: '5 Go Internet', description: 'Forfait data Orange Premium 30 jours', cost: 1500, type: 'data', iconName: 'wifi', isExclusive: false, validityDays: 30 },
  { id: 'rw4', title: '500 FCFA Crédit', description: 'Crédit de communication Orange', cost: 300, type: 'credit', iconName: 'phone', isExclusive: false },
  { id: 'rw5', title: '1000 FCFA Crédit', description: 'Crédit de communication Orange', cost: 550, type: 'credit', iconName: 'phone', isExclusive: false },
  { id: 'rw6', title: '2000 FCFA Crédit', description: 'Crédit de communication Orange', cost: 1000, type: 'credit', iconName: 'phone', isExclusive: false },
  { id: 'rw7', title: 'Pass WasteMap 🌿', description: 'Forfait EXCLUSIF : 5Go + 200min d\'appels à prix réduit. Réservé aux Éco-Héros !', cost: 2000, type: 'special_pass', iconName: 'star', isExclusive: true, minTrustScore: 500, validityDays: 30 },
  { id: 'rw8', title: 'Réduction Forfait -30%', description: '30% de réduction sur votre prochain forfait Orange mensuel', cost: 800, type: 'reduction', iconName: 'percent', isExclusive: false },
];

// ─── Événements Flash ───────────────────────────────────────

export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: 'ev1', title: 'Opération Mokolo Propre', description: 'Grande matinée de nettoyage autour du marché Mokolo. Rejoignez-nous pour redonner vie à notre quartier !',
    organizerId: 'u1', organizerName: 'Donfack Arthur',
    targetLocation: { latitude: 3.8590, longitude: 11.5100, address: 'Marché Mokolo', quarter: 'Mokolo', city: 'Yaoundé' },
    radiusMeters: 200,
    participants: [
      { userId: 'u1', userName: 'Donfack Arthur', joinedAt: '2026-04-18T10:00:00Z', ecoPointsEarned: 180 },
      { userId: 'u2', userName: 'Marie Nguemo', joinedAt: '2026-04-18T10:05:00Z', ecoPointsEarned: 165 },
      { userId: 'u3', userName: 'Jean-Paul Kamga', joinedAt: '2026-04-19T08:00:00Z', ecoPointsEarned: 150 },
    ],
    maxParticipants: 30, totalEcoPointsEarned: 495,
    scheduledAt: '2026-04-20T07:00:00Z', estimatedDurationMinutes: 180, status: 'completed',
    sponsorName: 'Brasseries du Cameroun', sponsorMessage: 'Le nettoyage de Mokolo est soutenu par Brasseries du Cameroun 🍺',
    createdAt: '2026-04-18T10:00:00Z',
  },
  {
    id: 'ev2', title: 'Challenge Biyem-Assi Vert', description: 'Défi collectif : nettoyons les caniveaux de Biyem-Assi avant la saison des pluies !',
    organizerId: 'u4', organizerName: 'Aminata Diallo',
    targetLocation: { latitude: 3.8550, longitude: 11.5250, address: 'Rond-point Biyem-Assi', quarter: 'Biyem-Assi', city: 'Yaoundé' },
    radiusMeters: 300,
    participants: [
      { userId: 'u4', userName: 'Aminata Diallo', joinedAt: '2026-04-29T14:00:00Z', ecoPointsEarned: 0 },
      { userId: 'u5', userName: 'Paul Essomba', joinedAt: '2026-04-29T15:00:00Z', ecoPointsEarned: 0 },
    ],
    maxParticipants: 50, totalEcoPointsEarned: 0,
    scheduledAt: '2026-05-03T07:00:00Z', estimatedDurationMinutes: 240, status: 'planned',
    createdAt: '2026-04-29T14:00:00Z',
  },
];

// ─── Classement individuel ──────────────────────────────────

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: 'u6', userName: 'Samuel Onana', rank: 1, ecoPoints: 4520, reportsCount: 89, cleaningsCount: 22 },
  { userId: 'u7', userName: 'Fatima Bello', rank: 2, ecoPoints: 3890, reportsCount: 72, cleaningsCount: 18 },
  { userId: 'u1', userName: 'Donfack Arthur', rank: 3, ecoPoints: 2890, reportsCount: 34, cleaningsCount: 8, isCurrentUser: true },
  { userId: 'u2', userName: 'Marie Nguemo', rank: 4, ecoPoints: 2340, reportsCount: 45, cleaningsCount: 12 },
  { userId: 'u8', userName: 'Ibrahim Moussa', rank: 5, ecoPoints: 2100, reportsCount: 38, cleaningsCount: 10 },
  { userId: 'u3', userName: 'Jean-Paul Kamga', rank: 6, ecoPoints: 1870, reportsCount: 31, cleaningsCount: 7 },
  { userId: 'u9', userName: 'Grace Tchamba', rank: 7, ecoPoints: 1650, reportsCount: 28, cleaningsCount: 6 },
  { userId: 'u4', userName: 'Aminata Diallo', rank: 8, ecoPoints: 1420, reportsCount: 25, cleaningsCount: 5 },
  { userId: 'u10', userName: 'Hervé Fotso', rank: 9, ecoPoints: 1180, reportsCount: 20, cleaningsCount: 4 },
  { userId: 'u5', userName: 'Paul Essomba', rank: 10, ecoPoints: 980, reportsCount: 18, cleaningsCount: 3 },
];

// ─── Classement par quartier ────────────────────────────────

export const MOCK_QUARTER_RANKINGS: QuarterRanking[] = [
  { quarterName: 'Bastos', city: 'Yaoundé', cleanlinessScore: 82, totalReports: 15, totalCleanings: 12, rank: 1 },
  { quarterName: 'Nlongkak', city: 'Yaoundé', cleanlinessScore: 71, totalReports: 28, totalCleanings: 18, rank: 2 },
  { quarterName: 'Biyem-Assi', city: 'Yaoundé', cleanlinessScore: 58, totalReports: 42, totalCleanings: 14, rank: 3 },
  { quarterName: 'Mvog-Ada', city: 'Yaoundé', cleanlinessScore: 45, totalReports: 56, totalCleanings: 10, rank: 4 },
  { quarterName: 'Mokolo', city: 'Yaoundé', cleanlinessScore: 32, totalReports: 78, totalCleanings: 8, rank: 5 },
];

// ─── Notifications ──────────────────────────────────────────

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', userId: 'u1', title: 'Signalement confirmé ✅', body: 'Votre signalement à Mvog-Ada a été confirmé par 3 autres citoyens.', type: 'report_update', referenceId: 'r1', isRead: false, createdAt: '2026-04-30T10:00:00Z' },
  { id: 'n2', userId: 'u1', title: 'Nettoyage validé ! 🎉', body: 'Votre nettoyage à Nlongkak a été validé par l\'IA. +250 EcoPoints !', type: 'cleaning_validated', referenceId: 'c1', isRead: true, createdAt: '2026-04-26T08:15:00Z' },
  { id: 'n3', userId: 'u1', title: 'Nouveau badge débloqué 🏅', body: 'Félicitations ! Vous avez débloqué le badge "Nettoyeur Argent".', type: 'badge_unlocked', referenceId: 'b5', isRead: true, createdAt: '2026-04-25T11:00:00Z' },
  { id: 'n4', userId: 'u1', title: 'Événement Flash à venir 📢', body: 'Le "Challenge Biyem-Assi Vert" est prévu pour le 3 mai. Rejoignez l\'événement !', type: 'event_invite', referenceId: 'ev2', isRead: false, createdAt: '2026-04-29T14:30:00Z' },
  { id: 'n5', userId: 'u1', title: 'Crédit activé 📱', body: '1000 FCFA de crédit Orange ont été ajoutés à votre compte.', type: 'reward_activated', referenceId: 'rw5', isRead: true, createdAt: '2026-04-24T12:05:00Z' },
];
