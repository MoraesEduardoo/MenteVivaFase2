import { ScrollView, StyleSheet } from 'react-native';

import { colors, spacing } from '../constants/theme';

export default function Screen({ children }) {
  return <ScrollView contentContainerStyle={styles.container}>{children}</ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
