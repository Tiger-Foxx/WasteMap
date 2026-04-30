// ============================================================
// Service IA — Analyse de déchets et validation de nettoyage
// Simule les appels vers le backend Python (YOLO / MobileNet)
// ============================================================

import { WasteAnalysis, CleaningValidation, WasteType, GravityLevel } from '../models';

// Compositions réalistes selon les contextes camerounais
const REALISTIC_COMPOSITIONS: {
  type: WasteType;
  percentage: number;
  label: string;
}[][] = [
  [
    { type: 'plastic', percentage: 72, label: 'Plastique PET (bouteilles Tangui, sachets)' },
    { type: 'metal', percentage: 12, label: 'Métal aluminium (canettes Beaufort)' },
    { type: 'organic', percentage: 16, label: 'Déchets organiques' },
  ],
  [
    { type: 'organic', percentage: 58, label: 'Déchets organiques (restes de marché)' },
    { type: 'plastic', percentage: 28, label: 'Sachets plastiques noirs' },
    { type: 'mixed', percentage: 14, label: 'Déchets divers' },
  ],
  [
    { type: 'plastic', percentage: 65, label: 'Emballages plastiques' },
    { type: 'paper', percentage: 20, label: 'Carton ondulé' },
    { type: 'glass', percentage: 15, label: 'Bouteilles en verre' },
  ],
  [
    { type: 'mixed', percentage: 45, label: 'Déchets ménagers mélangés' },
    { type: 'plastic', percentage: 35, label: 'Plastique rigide et souple' },
    { type: 'metal', percentage: 20, label: 'Fer et aluminium' },
  ],
];

export const aiService = {
  /**
   * Analyse une image de déchets via la vision par ordinateur.
   * Simule un traitement IA progressif (pour les animations de scan).
   */
  analyzeWasteImage: async (_imageUri: string): Promise<WasteAnalysis> => {
    // Simuler le temps de traitement IA avec étapes progressives
    await new Promise(resolve => setTimeout(resolve, 2500));

    const composition = REALISTIC_COMPOSITIONS[Math.floor(Math.random() * REALISTIC_COMPOSITIONS.length)];
    const volume = parseFloat((0.5 + Math.random() * 5).toFixed(1));
    const weight = parseFloat((volume * 15 + Math.random() * 20).toFixed(1));

    let gravity: GravityLevel = 'low';
    if (volume > 4) gravity = 'critical';
    else if (volume > 2) gravity = 'high';
    else if (volume > 1) gravity = 'medium';

    return {
      composition,
      estimatedVolumeM3: volume,
      estimatedWeightKg: weight,
      gravity,
      confidence: parseFloat((0.82 + Math.random() * 0.16).toFixed(2)),
    };
  },

  /**
   * Analyse progressive — retourne des résultats partiels pour animer le scan.
   * Appelé en boucle par l'UI pour simuler un scan temps réel.
   */
  getProgressiveAnalysis: (progress: number): Partial<WasteAnalysis> => {
    if (progress < 30) {
      return { composition: [], confidence: progress / 100 };
    }
    if (progress < 60) {
      return {
        composition: [
          { type: 'plastic', percentage: 0, label: 'Détection en cours...' },
        ],
        confidence: progress / 100,
      };
    }
    return {
      composition: [
        { type: 'plastic', percentage: Math.floor(50 + Math.random() * 30), label: 'Plastique PET' },
        { type: 'metal', percentage: Math.floor(5 + Math.random() * 20), label: 'Métal' },
      ],
      estimatedVolumeM3: parseFloat((0.5 + Math.random() * 4).toFixed(1)),
      confidence: progress / 100,
    };
  },

  /**
   * Valide un nettoyage via comparaison vidéo avant/après.
   * Analyse la réduction effective des déchets.
   */
  validateCleaning: async (_beforeUri: string, _afterUri: string): Promise<CleaningValidation> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      reductionPercentage: Math.floor(75 + Math.random() * 20),
      confidence: parseFloat((0.85 + Math.random() * 0.14).toFixed(2)),
      humanActionDetected: true,
      meetsMinimumThreshold: true,
    };
  },

  /**
   * Vérifie si un signalement est un doublon (rayon GPS de 10m).
   * Retourne l'ID du signalement parent si doublon.
   */
  checkDuplicate: async (
    latitude: number,
    longitude: number,
    _existingReports: { id: string; lat: number; lng: number }[]
  ): Promise<{ isDuplicate: boolean; parentId?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // En mode simulé, jamais de doublon
    return { isDuplicate: false };
  },
};
