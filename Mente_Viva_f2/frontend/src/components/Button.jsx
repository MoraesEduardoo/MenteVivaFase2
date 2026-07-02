import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';

export default function Button({ children, onPress, tone = 'primary', style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === 'red' ? styles.red : tone === 'soft' ? styles.soft : styles.primary,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, tone === 'soft' && styles.softText]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  red: {
    backgroundColor: colors.red,
  },
  soft: {
    backgroundColor: colors.lavender,
  },
  text: {
    color: colors.card,
    fontSize: 15,
    fontWeight: '900',
  },
  softText: {
    color: colors.text,
  },
  pressed: {
    opacity: 0.82,
  },
});
