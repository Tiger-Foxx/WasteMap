// ============================================================
// WasteMap — Modèles de données complets
// Reflètent fidèlement l'architecture décrite dans le dossier
// POESAM 2026 : Radar, Action, Anti-Fraude, Gamification, Orange
// ============================================================

// ─── Enums & Types utilitaires ──────────────────────────────

/** Rôles possibles d'un utilisateur dans l'écosystème */
export type UserRole = 'citizen' | 'supervisor' | 'admin';

/** Types de déchets détectables par l'IA */
export type WasteType = 'plastic' | 'metal' | 'organic' | 'glass' | 'paper' | 'mixed';

/** Niveau de gravité d'un signalement */
export type GravityLevel = 'low' | 'medium' | 'high' | 'critical';

/** Statut d'un signalement dans son cycle de vie */
export type ReportStatus =
  | 'pending'       // Signalé, en attente d'intervention
  | 'confirmed'     // Confirmé par d'autres utilisateurs (validation P2P)
  | 'assigned'      // Pris en charge par HYSACAM / Mairie / Recycleur
  | 'cleaning'      // Nettoyage en cours (action citoyenne)
  | 'cleaned'       // Zone nettoyée et validée
  | 'rejected';     // Signalement invalide (doublon, fraude)

/** Statut d'une action de nettoyage */
export type CleaningStatus =
  | 'recording'          // L'utilisateur filme la vidéo avant
  | 'in_progress'        // Nettoyage en cours
  | 'awaiting_after'     // En attente de la vidéo après
  | 'ai_verifying'       // L'IA analyse les vidéos avant/après
  | 'supervisor_review'  // En attente de validation par superviseur (Trust Score bas)
  | 'approved'           // Nettoyage validé
  | 'rejected';          // Nettoyage non validé (fraude détectée)

/** Types de récompenses Orange */
export type RewardType = 'data' | 'credit' | 'special_pass' | 'reduction';

/** Types de transactions d'EcoPoints */
export type EcoPointTransactionType =
  | 'report_earned'       // Points gagnés via signalement
  | 'cleaning_earned'     // Points gagnés via nettoyage
  | 'confirmation_earned' // Point de confirmation (signalement doublon)
  | 'event_earned'        // Points gagnés via événement flash
  | 'reward_spent'        // Points dépensés pour une récompense
  | 'bonus'               // Bonus spécial (challenge, sponsor)
  | 'penalty';            // Pénalité (fraude détectée)

/** Statut d'un événement flash communautaire */
export type EventStatus = 'planned' | 'active' | 'completed' | 'cancelled';

/** Catégories de badges */
export type BadgeCategory = 'signaling' | 'cleaning' | 'community' | 'streak' | 'special';

// ─── Coordonnées GPS ────────────────────────────────────────

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeoLocation extends GeoCoordinates {
  address: string;
  quarter?: string; // Nom du quartier (ex: Mvog-Ada, Bastos, Biyem-Assi)
  city?: string;    // Ville (ex: Yaoundé, Douala)
}

// ─── Utilisateur ────────────────────────────────────────────

export interface UserStats {
  totalReports: number;          // Nombre total de signalements
  totalCleanings: number;        // Nombre total de nettoyages validés
  totalEventsJoined: number;     // Nombre d'événements flash rejoints
  totalEcoPointsEarned: number;  // Cumul historique de points gagnés
  totalEcoPointsSpent: number;   // Cumul historique de points dépensés
  co2SavedKg: number;            // CO2 économisé (estimation)
  wasteCollectedKg: number;      // Déchets collectés (estimation)
  rank: number;                  // Classement global
  weeklyRank: number;            // Classement de la semaine
}

export interface User {
  id: string;
  phone: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;

  // Gamification
  ecoPoints: number;             // Solde actuel
  trustScore: number;            // Score de confiance 0-1000 (affiché en %)
  level: number;                 // Niveau du joueur
  badges: Badge[];               // Badges débloqués

  // Statistiques
  stats: UserStats;

  // Dates
  createdAt: string;
  lastActiveAt: string;
}

// ─── Analyse IA d'un signalement ────────────────────────────

export interface WasteAnalysis {
  /** Répartition des types de déchets détectés (%) */
  composition: {
    type: WasteType;
    percentage: number;
    label: string; // Label localisé (ex: "Plastique PET", "Métal aluminium")
  }[];

  /** Volume estimé par l'IA en mètres cubes */
  estimatedVolumeM3: number;

  /** Masse estimée en kilogrammes */
  estimatedWeightKg: number;

  /** Niveau de gravité assigné par l'IA */
  gravity: GravityLevel;

  /** Score de confiance de l'IA (0.0 - 1.0) */
  confidence: number;
}

// ─── Signalement (Le Radar) ─────────────────────────────────

export interface WasteReport {
  id: string;
  userId: string;
  userName?: string;

  // Localisation avec métadonnées anti-fraude
  location: GeoLocation;

  // Photo(s) du dépôt
  imageUrls: string[];

  // Résultat de l'analyse IA
  analysis: WasteAnalysis;

  // Gestion des doublons : rayon GPS de 10m
  // Si un autre signalement existe dans ce rayon, c'est un doublon
  isDuplicate: boolean;
  parentReportId?: string; // ID du signalement original si doublon

  // Cycle de vie
  status: ReportStatus;

  // Nombre de confirmations P2P
  confirmationCount: number;

  // Points attribués (proportionnels au volume)
  ecoPointsEarned: number;

  // Dates
  createdAt: string;
  updatedAt: string;
}

// ─── Action de Nettoyage (Anti-Fraude) ──────────────────────

export interface CleaningValidation {
  /** Pourcentage de réduction des déchets détecté par l'IA */
  reductionPercentage: number;
  /** Score de confiance de la validation IA */
  confidence: number;
  /** L'IA a-t-elle détecté un mouvement humain réel ? */
  humanActionDetected: boolean;
  /** Le volume nettoyé dépasse-t-il le seuil minimum ? */
  meetsMinimumThreshold: boolean;
}

export interface CleaningAction {
  id: string;
  reportId: string;        // Signalement concerné
  userId: string;
  userName?: string;

  // Vidéos avant/après (10 secondes chacune)
  beforeVideoUrl: string;
  afterVideoUrl: string;

  // Point de dépôt officiel où les sacs ont été déposés
  collectionPointId?: string;
  collectionPointName?: string;

  // Résultat de la validation IA
  validation?: CleaningValidation;

  // Validation par superviseur (si Trust Score bas)
  supervisorId?: string;
  supervisorComment?: string;

  // Cycle de vie
  status: CleaningStatus;

  // Points attribués (multiplicateur massif par rapport au signalement)
  ecoPointsEarned: number;

  // Dates
  createdAt: string;
  validatedAt?: string;
}

// ─── Historique des EcoPoints ───────────────────────────────

export interface EcoPointTransaction {
  id: string;
  userId: string;
  type: EcoPointTransactionType;
  amount: number;          // Positif = gagné, Négatif = dépensé
  balance: number;         // Solde après transaction
  description: string;     // Description lisible (ex: "Signalement validé — Quartier Mvog-Ada")
  referenceId?: string;    // ID du signalement, nettoyage ou récompense lié
  createdAt: string;
}

// ─── Points de Ramassage Officiels ──────────────────────────

export interface CollectionPoint {
  id: string;
  name: string;                    // Ex: "Bac HYSACAM Mvog-Ada", "Point Partenaire Red-Plast"
  type: 'hysacam' | 'partner' | 'recycler';
  location: GeoLocation;
  acceptedWasteTypes: WasteType[]; // Types de déchets acceptés
  isActive: boolean;
}

// ─── Récompenses Orange ─────────────────────────────────────

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;                // Coût en EcoPoints
  type: RewardType;
  iconName?: string;           // Nom de l'icône à afficher
  isExclusive: boolean;        // Réservé aux utilisateurs avec un Trust Score élevé
  minTrustScore?: number;      // Trust Score minimum requis (pour Pass WasteMap par ex.)
  validityDays?: number;       // Durée de validité de la récompense
}

export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  reward: Reward;
  ecoPointsSpent: number;
  status: 'processing' | 'activated' | 'expired' | 'failed';
  activatedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

// ─── Événements Flash (Levier Communautaire) ────────────────

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;

  // Zone ciblée
  targetLocation: GeoLocation;
  radiusMeters: number;        // Rayon de la zone d'action

  // Participants
  participants: EventParticipant[];
  maxParticipants?: number;

  // Points collectifs
  totalEcoPointsEarned: number;

  // Planification
  scheduledAt: string;
  estimatedDurationMinutes: number;
  status: EventStatus;

  // Sponsoring (optionnel)
  sponsorName?: string;
  sponsorLogoUrl?: string;
  sponsorMessage?: string;     // Ex: "Le nettoyage de ce quartier est soutenu par [Marque]"

  createdAt: string;
}

export interface EventParticipant {
  userId: string;
  userName: string;
  avatarUrl?: string;
  joinedAt: string;
  ecoPointsEarned: number;     // Part individuelle des points
}

// ─── Badges & Gamification ──────────────────────────────────

export interface Badge {
  id: string;
  name: string;                // Ex: "Éco-Sentinelle", "Nettoyeur d'élite"
  description: string;
  iconName: string;
  category: BadgeCategory;
  requirement: string;         // Description de la condition (ex: "50 signalements validés")
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;           // Progression vers le déblocage (0-100)
}

// ─── Classement (Leaderboard) ───────────────────────────────

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl?: string;
  rank: number;
  ecoPoints: number;
  reportsCount: number;
  cleaningsCount: number;
  isCurrentUser?: boolean;     // Pour highlight dans l'UI
}

export interface QuarterRanking {
  quarterName: string;
  city: string;
  cleanlinessScore: number;    // Score de propreté du quartier (0-100)
  totalReports: number;
  totalCleanings: number;
  rank: number;
}

// ─── Notifications In-App ───────────────────────────────────

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'report_update' | 'cleaning_validated' | 'points_earned' | 'event_invite' | 'badge_unlocked' | 'reward_activated' | 'system';
  referenceId?: string;        // ID de l'entité liée
  isRead: boolean;
  createdAt: string;
}
