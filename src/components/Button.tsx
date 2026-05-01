import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from './Text';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
  icon,
}: ButtonProps) => {
  const getBackgroundColor = () => {
    if (disabled && variant !== 'ghost') return colors.border;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.primaryLight;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textLight;
    switch (variant) {
      case 'primary': return colors.white;
      case 'secondary': return colors.white;
      case 'outline': return colors.primary;
      case 'ghost': return colors.primary;
      default: return colors.white;
    }
  };

  const getBorderColor = () => {
    if (disabled && variant === 'outline') return colors.border;
    if (variant === 'outline') return colors.primary;
    return 'transparent';
  };

  const getHeight = () => {
    switch (size) {
      case 'small': return 36;
      case 'medium': return 48;
      case 'large': return 56;
      default: return 48;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          height: getHeight(),
          width: fullWidth ? '100%' : 'auto',
          paddingHorizontal: fullWidth ? 0 : spacing.l,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text
            variant={size === 'small' ? 's' : 'm'}
            weight="semiBold"
            color={getTextColor()}
            style={[{ marginLeft: icon ? spacing.s : 0 }, textStyle]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: spacing.borderRadius.round, // Make it completely pill shaped according to user request
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
