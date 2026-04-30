import { Reward } from '../models';

// Service pour les récompenses et les EcoPoints (simulé)
// Sera remplacé par des appels à l'API Orange quand le partenariat sera en place

const MOCK_REWARDS: Reward[] = [
  {
    id: 'rw1',
    title: '500 Mo Internet',
    description: 'Forfait data Orange valable 7 jours',
    cost: 200,
    type: 'data',
    isExclusive: false,
    validityDays: 7,
  },
  {
    id: 'rw2',
    title: '1 Go Internet',
    description: 'Forfait data Orange valable 30 jours',
    cost: 500,
    type: 'data',
    isExclusive: false,
    validityDays: 30,
  },
  {
    id: 'rw3',
    title: '5 Go Internet',
    description: 'Forfait data Orange Premium valable 30 jours',
    cost: 1500,
    type: 'data',
    isExclusive: false,
    validityDays: 30,
  },
  {
    id: 'rw4',
    title: '500 FCFA Crédit',
    description: 'Crédit de communication Orange',
    cost: 300,
    type: 'credit',
    isExclusive: false,
  },
  {
    id: 'rw5',
    title: '1000 FCFA Crédit',
    description: 'Crédit de communication Orange',
    cost: 550,
    type: 'credit',
    isExclusive: false,
  },
  {
    id: 'rw6',
    title: 'Pass WasteMap',
    description: 'Forfait exclusif : 5Go + 200min à prix réduit. Réservé aux EcoHéros !',
    cost: 2000,
    type: 'special_pass',
    isExclusive: true,
    minTrustScore: 500,
    validityDays: 30,
  },
];

export const rewardService = {
  /**
   * Récupère la liste des récompenses disponibles.
   */
  getRewards: async (): Promise<Reward[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_REWARDS;
  },

  /**
   * Échange des EcoPoints contre une récompense.
   * Simulé : retourne toujours succès.
   */
  redeemReward: async (rewardId: string, _userId: string): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const reward = MOCK_REWARDS.find(r => r.id === rewardId);
    return {
      success: true,
      message: `${reward?.title || 'Récompense'} activé(e) avec succès sur votre compte Orange !`,
    };
  },
};
