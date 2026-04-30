import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  isPassword,
  leftIcon,
  style,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="s" weight="medium" color={colors.textDark} style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textLight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textLight} />
            ) : (
              <Eye size={20} color={colors.textLight} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text variant="xs" color={colors.error} style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.medium,
    backgroundColor: colors.surface,
    height: 56,
    paddingHorizontal: spacing.m,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.textDark,
  },
  leftIcon: {
    marginRight: spacing.s,
  },
  rightIcon: {
    marginLeft: spacing.s,
  },
  errorText: {
    marginTop: spacing.xs,
  },
});
