import React, { useState, useRef } from 'react';
import {
  View, StyleSheet, Platform,
  StatusBar, Image, TextInput, ScrollView,
} from 'react-native';
import { Text, Button } from '../../components';
import { colors, spacing } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface PhoneScreenProps {
  onSendOtp: (phone: string) => void;
}

export const PhoneScreen = ({ onSendOtp }: PhoneScreenProps) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 9) {
      setError('Veuillez entrer un numéro valide (ex: 690 00 00 00)');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    onSendOtp(cleaned);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        bounces={false}
      >

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../ressources/images/logo-big.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text variant="xxl" weight="bold" color={colors.textDark} align="center" style={styles.title}>
          Connectez-vous
        </Text>
        <Text variant="s" color={colors.textLight} align="center" style={styles.subtitle}>
          Saisissez votre numéro de téléphone pour{'\n'}rejoindre la communauté WasteMap.
        </Text>

        {/* Input */}
        <View style={styles.inputWrapper}>
          <Text variant="xs" weight="semiBold" color={colors.textMuted} style={styles.inputLabel}>
            VOTRE NUMÉRO
          </Text>
          <View style={styles.inputRow}>
            <View style={styles.countryCode}>
              <Ionicons name="call-outline" size={18} color={colors.textDark} />
              <Text variant="m" weight="medium" color={colors.textDark} style={{ marginLeft: 8 }}>
                +237
              </Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder="6XX XX XX XX"
              placeholderTextColor="#A0AEC0"
              value={phone}
              onChangeText={setPhone}
              keyboardType="default"
              autoCorrect={false}
              maxLength={12}
            />
          </View>

          {error ? (
            <Text variant="xs" color={colors.error} style={styles.hint}>{error}</Text>
          ) : (
            <Text variant="xs" color={colors.textLight} style={styles.hint}>
              Un code SMS à 6 chiffres vous sera envoyé.
            </Text>
          )}
        </View>

        {/* Button */}
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
            <Text variant="xs" weight="bold" color={colors.textDark}>Conditions</Text>
            {' '}et notre{' '}
            <Text variant="xs" weight="bold" color={colors.textDark}>Politique de confidentialité</Text>.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 140,
    height: 140,
  },
  title: {
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  inputWrapper: {
    marginBottom: 32,
  },
  inputLabel: {
    marginBottom: 10,
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#F7FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E0',
    marginHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: colors.textDark,
    paddingVertical: 0,
    height: 56,
  },
  hint: {
    marginTop: 10,
  },
  submitButton: {
    borderRadius: 16,
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    lineHeight: 20,
  },
});
