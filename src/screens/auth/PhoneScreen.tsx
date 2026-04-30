import React, { useState, useRef } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView, Platform,
  StatusBar, TouchableOpacity, Animated, Easing,
} from 'react-native';
import { Text, Button, Input } from '../../components';
import { colors, spacing } from '../../theme';

interface PhoneScreenProps {
  onSendOtp: (phone: string) => void;
}

export const PhoneScreen = ({ onSendOtp }: PhoneScreenProps) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  const handleSubmit = async () => {
    // Validation simple
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 9) {
      setError('Veuillez entrer un numéro valide (ex: 690 00 00 00)');
      return;
    }
    setError('');
    setLoading(true);
    // Simuler l'envoi du code
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    onSendOtp(cleaned);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.content}>
        {/* Header avec logo */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: logoAnim,
              transform: [
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.logoMini}>
            <Text style={{ fontSize: 28 }}>♻</Text>
          </View>
          <Text variant="xxl" weight="bold" color={colors.textDark}>
            Waste<Text variant="xxl" weight="bold" color={colors.primaryLight}>Map</Text>
          </Text>
        </Animated.View>

        {/* Titre */}
        <View style={styles.titleSection}>
          <Text variant="xxxl" weight="bold" color={colors.textDark}>
            Bienvenue ! 👋
          </Text>
          <Text variant="m" color={colors.textMuted} style={styles.description}>
            Entrez votre numéro de téléphone pour commencer à rendre votre ville plus propre.
          </Text>
        </View>

        {/* Champ de saisie */}
        <View style={styles.inputSection}>
          <View style={styles.phoneInputRow}>
            {/* Indicatif pays */}
            <View style={styles.countryCode}>
              <Text variant="s" color={colors.textMuted}>🇨🇲</Text>
              <Text variant="m" weight="medium" color={colors.textDark} style={{ marginLeft: 6 }}>
                +237
              </Text>
            </View>
            {/* Numéro */}
            <View style={styles.phoneInput}>
              <Input
                placeholder="690 00 00 00"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                error={error}
                style={{ borderWidth: 0 }}
              />
            </View>
          </View>

          <Text variant="xs" color={colors.textLight} style={styles.hint}>
            Un code de vérification sera envoyé à ce numéro via SMS.
          </Text>
        </View>

        {/* Bouton */}
        <Button
          title="Recevoir le code"
          onPress={handleSubmit}
          loading={loading}
          size="large"
          style={styles.submitButton}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="xs" color={colors.textLight} align="center" style={styles.footerText}>
            En continuant, vous acceptez nos{' '}
            <Text variant="xs" weight="medium" color={colors.primaryLight}>
              Conditions d'utilisation
            </Text>
            {' '}et notre{' '}
            <Text variant="xs" weight="medium" color={colors.primaryLight}>
              Politique de confidentialité
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  logoMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleSection: {
    marginBottom: 40,
  },
  description: {
    marginTop: 8,
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 32,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.medium,
    backgroundColor: colors.surface,
  },
  phoneInput: {
    flex: 1,
  },
  hint: {
    marginTop: 8,
    marginLeft: 4,
  },
  submitButton: {
    marginBottom: 24,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    lineHeight: 18,
  },
});
