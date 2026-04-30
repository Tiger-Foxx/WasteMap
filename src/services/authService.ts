// Service pour l'authentification (simulé)
// Sera remplacé par des appels Django REST quand le backend sera prêt

export const authService = {
  /**
   * Envoie un code OTP au numéro de téléphone donné.
   * Simulé : retourne toujours succès après un délai.
   */
  sendOtp: async (phoneNumber: string): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    console.log(`[Mock] OTP envoyé à ${phoneNumber}`);
    return { success: true };
  },

  /**
   * Vérifie le code OTP saisi par l'utilisateur.
   * Simulé : accepte le code "123456" ou n'importe quel code de 6 chiffres.
   */
  verifyOtp: async (phoneNumber: string, code: string): Promise<{ success: boolean; token?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (code.length === 6) {
      return { success: true, token: 'mock-jwt-token-xyz' };
    }
    return { success: false };
  },

  /**
   * Déconnecte l'utilisateur.
   */
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
};
