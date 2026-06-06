import { StyleSheet, Text, View } from 'react-native';

import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';

const futureItems = [
  'Conversas de apoio com respostas personalizadas.',
  'Sugestoes de exercicios de respiracao e foco.',
  'Acompanhamento do diario emocional com mais contexto.',
];

export default function Agente() {
  return (
    <Screen>
      <PageHeader title="Viva" />

      <Card style={styles.introCard}>
        <Text style={styles.title}>Agente ainda sera implementada futuramente</Text>
        <Text style={styles.subtitle}>
          Este espaco esta reservado para a Viva. Por enquanto, use as telas de diario, jogos e bem-estar para acompanhar seu cuidado.
        </Text>
      </Card>

      <Card style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>O que vira depois</Text>
        {futureItems.map((item) => (
          <View key={item} style={styles.itemRow}>
            <View style={styles.dot} />
            <Text style={styles.noticeText}>{item}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  introCard: { backgroundColor: colors.purple },
  title: { color: colors.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  noticeCard: { backgroundColor: colors.yellow },
  noticeTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  itemRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  dot: { backgroundColor: colors.primary, borderRadius: radius.full, height: 9, width: 9 },
  noticeText: { color: colors.muted, flex: 1, fontSize: 15, lineHeight: 22 },
});
