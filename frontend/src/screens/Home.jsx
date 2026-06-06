import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { api } from '../services/api';
import { getGameDashboard, getGoals, isAuthenticated } from '../services/session';

const menuItems = [
  { label: 'Viva', href: '/agente' },
  { label: 'Perfil', href: '/perfil' },
  { label: 'Diario', href: '/diario' },
  { label: 'Jogos', href: '/jogos' },
  { label: 'Bem-estar', href: '/bem-estar' },
];

const checkInTips = ['Respire antes de responder', 'Observe seu corpo', 'Evite pressa', 'Procure descanso'];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const logged = isAuthenticated();
  const dashboard = getGameDashboard();

  useEffect(() => {
    if (!logged) return;

    let active = true;
    api.listMemoryGameResults()
      .then(() => {
        if (active) setRefreshKey((current) => current + 1);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [logged]);

  return (
    <Screen key={refreshKey}>
      <View style={styles.headerArea}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>Mente Viva</Text>

          {logged ? (
            <Pressable
              style={({ pressed }) => [styles.menuButton, (pressed || menuOpen) && styles.menuButtonActive]}
              onPress={() => setMenuOpen((open) => !open)}
            >
              <Text style={styles.menuIcon}>☰</Text>
            </Pressable>
          ) : (
            <View style={styles.authButtons}>
              <Button tone="soft" style={styles.authButton} onPress={() => router.push('/login')}>
                Login
              </Button>
              <Button style={styles.authButton} onPress={() => router.push('/cadastro')}>
                Cadastro
              </Button>
            </View>
          )}
        </View>

        {menuOpen && logged ? (
          <Card style={styles.menuCard}>
            {menuItems.map((item) => (
              <Pressable
                key={item.href}
                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                onPress={() => {
                  setMenuOpen(false);
                  router.push(item.href);
                }}
              >
                <Text style={styles.menuText}>{item.label}</Text>
              </Pressable>
            ))}
          </Card>
        ) : null}
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>HOJE</Text>
        <Text style={styles.heroText}>
          Um espaco simples para cuidar da mente, registrar emocoes e treinar a memoria com tranquilidade.
        </Text>
      </View>

      <Card style={styles.agentCard}>
        <View style={styles.agentAvatar}>
          <Text style={styles.agentAvatarText}>V</Text>
        </View>
        <View style={styles.agentContent}>
          <Text style={styles.agentTitle}>Viva</Text>
          <Text style={styles.agentText}>Agente ainda sera implementada futuramente.</Text>
          <Button style={styles.agentButton} onPress={() => router.push('/agente')}>
            Ver espaco da Viva
          </Button>
        </View>
      </Card>

      {logged ? (
        <Card style={styles.dashboard}>
          <Text style={styles.dashboardLabel}>Desempenho</Text>
          <Text style={styles.dashboardTitle}>Jogos e progresso</Text>
          {dashboard.games.map((game) => (
            <View key={game.id} style={styles.gameRow}>
              <View style={styles.gameHeader}>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameStatus}>{game.label}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${game.score}%` }]} />
              </View>
              <Text style={styles.dashboardHint}>{game.description}</Text>
            </View>
          ))}
        </Card>
      ) : null}

      <Card style={styles.goalsCard}>
        <Text style={styles.cardLabel}>Recomendacoes</Text>
        <Text style={styles.cardTitle}>Plano do dia</Text>
        {getGoals().map((goal) => (
          <View key={goal.id} style={styles.tipRow}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>{goal.title}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.checkIn}>
        <Text style={styles.cardLabel}>Check-in</Text>
        <Text style={styles.cardTitle}>Cuidado mental rapido</Text>
        <Text style={styles.cardText}>
          Antes de agir no automatico, pare por alguns segundos e nomeie como voce esta se sentindo.
        </Text>
        <View style={styles.moodRow}>
          {checkInTips.map((tip) => (
            <View key={tip} style={styles.moodChip}>
              <Text style={styles.moodText}>{tip}</Text>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerArea: { position: 'relative', zIndex: 10 },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  brand: { color: colors.text, fontSize: 23, fontWeight: '900' },
  authButtons: { flexDirection: 'row', gap: spacing.sm },
  authButton: { minHeight: 42, paddingHorizontal: spacing.md },
  menuButton: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    height: 52,
    justifyContent: 'center',
    opacity: 1,
    width: 52,
  },
  menuButtonActive: { opacity: 0.78 },
  menuIcon: { color: colors.card, fontSize: 28, fontWeight: '900', lineHeight: 30 },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    gap: 0,
    padding: spacing.sm,
    position: 'absolute',
    right: 0,
    top: 66,
    width: 210,
    zIndex: 20,
  },
  menuItem: { borderRadius: radius.md, padding: spacing.md },
  menuItemPressed: { backgroundColor: colors.primaryLight },
  menuText: { color: colors.text, fontSize: 16, fontWeight: '900' },
  hero: { backgroundColor: colors.ink, borderRadius: radius.xl, gap: spacing.sm, padding: spacing.xl },
  heroEyebrow: { color: colors.yellow, fontSize: 14, fontWeight: '900', textTransform: 'uppercase' },
  heroText: { color: '#D8E2DF', fontSize: 16, lineHeight: 24 },
  agentCard: { alignItems: 'center', backgroundColor: colors.purple, flexDirection: 'row' },
  agentAvatar: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.full,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  agentAvatarText: { color: colors.yellow, fontSize: 30, fontWeight: '900' },
  agentContent: { flex: 1, gap: spacing.sm },
  agentTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  agentText: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  agentButton: { alignSelf: 'flex-start', minHeight: 44 },
  dashboard: { backgroundColor: colors.green },
  dashboardLabel: { color: colors.primaryDark, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  dashboardTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  dashboardHint: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  gameRow: { gap: spacing.sm },
  gameHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  gameTitle: { color: colors.text, flex: 1, fontSize: 16, fontWeight: '900' },
  gameStatus: { color: colors.primaryDark, fontSize: 15, fontWeight: '900' },
  progressTrack: { backgroundColor: colors.card, borderRadius: radius.full, height: 12, overflow: 'hidden' },
  progressFill: { backgroundColor: colors.primary, height: '100%' },
  goalsCard: { backgroundColor: colors.blue },
  tipRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  tipDot: { backgroundColor: colors.primary, borderRadius: radius.full, height: 9, width: 9 },
  tipText: { color: colors.text, flex: 1, fontSize: 15, fontWeight: '800', lineHeight: 21 },
  checkIn: { backgroundColor: colors.primaryLight },
  cardLabel: { color: colors.primaryDark, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  cardTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  cardText: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  moodChip: { backgroundColor: colors.card, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  moodText: { color: colors.primaryDark, fontWeight: '900' },
});
