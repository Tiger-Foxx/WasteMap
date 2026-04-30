import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle, StyleProp } from 'react-native';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

interface TextProps extends RNTextProps {
  variant?: keyof typeof typography.sizes;
  weight?: keyof typeof typography.fonts;
  color?: string;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const Text = ({
  variant = 'm',
  weight = 'regular',
  color = colors.textDark,
  align = 'left',
  style,
  children,
  ...props
}: TextProps) => {
  return (
    <RNText
      style={[
        {
          fontSize: typography.sizes[variant],
          lineHeight: typography.lineHeights[variant],
          fontWeight: weight === 'regular' ? '400' : weight === 'medium' ? '500' : weight === 'semiBold' ? '600' : '700',
          color,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
