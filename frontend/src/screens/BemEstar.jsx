import { StyleSheet, Text, View } from 'react-native';

import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';

const practices = [
  {
    title: 'Respiração tranquila',
    text: 'Inspire contando até 4, segure por 2 segundos e solte o ar devagar. Repita cinco vezes.',
    color: colors.green,
  },
  {
    title: 'Alongamento sentado',
    text: 'Gire os ombros, estique os braços e mova o pescoço lentamente. Faça sem forçar.',
    color: colors.orange,
  },
  {
    title: 'Memória afetiva',
    text: 'Pense em uma lembrança boa, uma pessoa querida ou uma música que traga calma.',
    color: colors.pink,
  },
  {
    title: 'Atenção aos sentidos',
    text: 'Observe uma cor, um som, uma textura e uma sensação no corpo. Volte ao presente com gentileza.',
    color: colors.blue,
  },
];

export default function BemEstar() {
  return (
    <Screen>
      <PageHeader title="Bem-estar" />
      <Text style={styles.subtitle}>Atividades simples, coloridas e acolhedoras para criar pausas durante o dia.</Text>

      <Card style={styles.heroCard}>
        <Text style={styles.heroTitle}>Pausa de cuidado</Text>
        <Text style={styles.heroText}>Beba água, respire fundo e escolha uma atividade abaixo.</Text>
      </Card>

      {practices.map((practice) => (
        <Card key={practice.title} style={[styles.practiceCard, { backgroundColor: practice.color }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Bem-estar</Text>
          </View>
          <Text style={styles.cardTitle}>{practice.title}</Text>
          <Text style={styles.text}>{practice.text}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  heroCard: { backgroundColor: colors.ink },
  heroTitle: { color: colors.card, fontSize: 25, fontWeight: '900' },
  heroText: { color: '#D8E2DF', fontSize: 16, lineHeight: 24 },
  practiceCard: { gap: spacing.sm },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.card, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  badgeText: { color: colors.primaryDark, fontWeight: '900' },
  cardTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  text: { color: colors.muted, fontSize: 16, lineHeight: 24 },
});
