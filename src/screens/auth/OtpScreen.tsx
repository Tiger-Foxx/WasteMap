import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, TextInput, Animated, Easing,
  StatusBar, TouchableOpacity, Platform, Image,
  Keyboard, ScrollView
} from 'react-native';
import { Text, Button } from '../../components';
import { colors, spacing } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

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
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 500, useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    setTimeout(() => inputRefs.current[0]?.focus(), 400);
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text[text.length - 1]; // Support simple copy-paste for single digit
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(c => c !== '') && text) {
      Keyboard.dismiss();
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
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
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
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>

          {/* En-tête avec Logo */}
          <View style={styles.header}>
            <Image
              source={require('../../../ressources/images/logo-big.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text variant="xxl" weight="bold" color={colors.textDark} style={styles.title} align="center">
              Code de vérification
            </Text>
            <Text variant="s" color={colors.textLight} style={styles.description} align="center">
              Veuillez entrer le code à 6 chiffres envoyé au{'\n'}
              <Text variant="s" weight="bold" color={colors.textDark}>
                +237 {maskedPhone}
              </Text>
            </Text>
          </View>

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
                  focusedIndex === i && styles.otpInputFocused,
                  code[i] !== '' && styles.otpInputFilled,
                  error ? styles.otpInputError : null,
                ]}
                keyboardType="default"
                maxLength={1}
                value={code[i]}
                onChangeText={(text) => handleChange(text, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                onFocus={() => setFocusedIndex(i)}
                selectTextOnFocus
              />
            ))}
          </Animated.View>

          <View style={styles.errorContainer}>
            {error ? (
              <Text variant="s" weight="medium" color={colors.error} align="center">
                {error}
              </Text>
            ) : null}
          </View>

          <View style={styles.resendContainer}>
            <Text variant="s" color={colors.textLight}>
              Vous n'avez pas reçu le code ?{' '}
            </Text>
            <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
              <Text
                variant="s"
                weight="bold"
                color={timer > 0 ? colors.textMuted : colors.textDark}
              >
                Renvoyer {timer > 0 ? `(${timer}s)` : ''}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Vérifier le code"
            onPress={() => handleSubmit(code.join(''))}
            loading={loading}
            size="large"
            disabled={code.some(c => c === '')}
            style={styles.verifyButton}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: -20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 60,
    borderRadius: spacing.borderRadius.medium,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.textDark,
  },
  otpInputFocused: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  otpInputError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
  errorContainer: {
    height: 24,
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  verifyButton: {
    borderRadius: spacing.borderRadius.large,
  },
});
