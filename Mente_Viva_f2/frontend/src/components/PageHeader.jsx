import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';

export default function PageHeader({ title }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backText: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 28,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 28,
    fontWeight: '900',
  },
});
