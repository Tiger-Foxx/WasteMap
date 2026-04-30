import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, TextInput, Animated, Easing,
  StatusBar, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Text, Button } from '../../components';
import { colors, spacing } from '../../theme';

interface OtpScreenProps {
  phone: string;
  onVerify: (code: string) => void;
  onBack: () => void;
}

const CODE_LENGTH = 6;

export const OtpScreen = ({ phone, onVerify, onBack }: OtpScreenProps) => {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 400, useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Focus sur le premier champ
    setTimeout(() => inputRefs.current[0]?.focus(), 500);
  }, []);

  // Compte à rebours pour renvoi
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text[text.length - 1];
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    // Auto-focus sur le champ suivant
    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit quand tous les champs sont remplis
    if (newCode.every(c => c !== '') && text) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handleSubmit = async (fullCode: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (fullCode.length === CODE_LENGTH) {
      onVerify(fullCode);
    } else {
      setError('Code invalide');
      // Animation de secousse
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(59);
    setCode(Array(CODE_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  const maskedPhone = phone.length > 4
    ? phone.slice(0, 3) + ' ••• •• ' + phone.slice(-2)
    : phone;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Retour */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text variant="l" color={colors.textDark}>←</Text>
        </TouchableOpacity>

        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 32 }}>🔐</Text>
          </View>
          <Text variant="xxl" weight="bold" color={colors.textDark} style={styles.title}>
            Vérification
          </Text>
          <Text variant="m" color={colors.textMuted} style={styles.description}>
            Entrez le code à 6 chiffres envoyé au{'\n'}
            <Text variant="m" weight="semiBold" color={colors.textDark}>
              +237 {maskedPhone}
            </Text>
          </Text>
        </View>

        {/* Champs OTP */}
        <Animated.View
          style={[
            styles.otpContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          {Array(CODE_LENGTH).fill(0).map((_, i) => (
            <TextInput
              key={i}
              ref={ref => { inputRefs.current[i] = ref; }}
              style={[
                styles.otpInput,
                code[i] ? styles.otpInputFilled : null,
                error ? styles.otpInputError : null,
              ]}
              value={code[i]}
              onChangeText={text => handleChange(text, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {error ? (
          <Text variant="s" color={colors.error} align="center" style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        {/* Timer de renvoi */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text variant="s" color={colors.textLight} align="center">
              Renvoyer le code dans{' '}
              <Text variant="s" weight="semiBold" color={colors.textMuted}>
                0:{timer.toString().padStart(2, '0')}
              </Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text variant="s" weight="semiBold" color={colors.primaryLight} align="center">
                Renvoyer le code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info pour le jury */}
        <View style={styles.demoHint}>
          <Text variant="xs" color={colors.textLight} align="center">
            💡 Pour la démo, entrez n'importe quel code à 6 chiffres
          </Text>
        </View>
      </Animated.View>
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
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: spacing.borderRadius.medium,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
  },
  otpInputFilled: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryLighter,
  },
  otpInputError: {
    borderColor: colors.error,
  },
  errorText: {
    marginBottom: 8,
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  demoHint: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(78, 159, 61, 0.08)',
    borderRadius: spacing.borderRadius.medium,
    alignSelf: 'center',
  },
});
