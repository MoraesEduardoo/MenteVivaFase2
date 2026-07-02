import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '../components/Button';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { api } from '../services/api';
import { saveGameResult } from '../services/session';

const gameOptions = [
  {
    id: 'memoria',
    title: 'Memoria das palavras',
    description: 'Encontre os pares de palavras iguais.',
    active: true,
    color: colors.green,
  },
  {
    id: 'sequencia',
    title: 'Sequencia logica',
    description: 'Observe padroes e complete a ordem.',
    active: false,
    color: colors.blue,
  },
  {
    id: 'contas',
    title: 'Calculo rapido',
    description: 'Pequenas contas para treinar raciocinio.',
    active: false,
    color: colors.orange,
  },
  {
    id: 'formas',
    title: 'Formas e cores',
    description: 'Associe formas, cores e atencao visual.',
    active: false,
    color: colors.pink,
  },
];

const cards = ['SOL', 'LUA', 'RIO', 'MAR', 'CASA', 'FLOR'];

function shuffle(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function buildDeck() {
  return shuffle([...cards, ...cards]).map((label, index) => ({
    id: `${label}-${index}`,
    label,
    matched: false,
  }));
}

export default function Jogos() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [deck, setDeck] = useState(() => buildDeck());
  const [opened, setOpened] = useState([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [message, setMessage] = useState('');
  const pairs = useMemo(() => deck.filter((card) => card.matched).length / 2, [deck]);

  function startMemory() {
    setSelectedGame('memoria');
    resetGame();
  }

  function resetGame() {
    setDeck(buildDeck());
    setOpened([]);
    setMoves(0);
    setFinished(false);
    setStartedAt(Date.now());
    setMessage('');
  }

  async function saveResult(result) {
    try {
      const payload = await api.createMemoryGameResult(result);
      saveGameResult(payload.data);
      setMessage('Resultado salvo no banco de dados.');
    } catch (error) {
      setMessage(error.message || 'Nao foi possivel salvar o resultado da partida.');
    }
  }

  function openCard(card) {
    if (finished || card.matched || opened.some((item) => item.id === card.id) || opened.length === 2) return;

    const nextOpened = [...opened, card];
    setOpened(nextOpened);

    if (nextOpened.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      const [first, second] = nextOpened;

      if (first.label === second.label) {
        const nextDeck = deck.map((item) => (item.label === first.label ? { ...item, matched: true } : item));
        setDeck(nextDeck);
        setOpened([]);

        if (nextDeck.every((item) => item.matched)) {
          const elapsed = Date.now() - (startedAt || Date.now());
          const result = { won: true, attempts: nextMoves, timeMs: elapsed };
          setFinished(true);
          saveResult(result);
        }
        return;
      }

      setTimeout(() => setOpened([]), 900);
    }
  }

  if (selectedGame === 'memoria') {
    return (
      <Screen>
        <PageHeader title="Memoria das palavras" />
        <Text style={styles.subtitle}>Encontre os pares com calma. O tempo ajuda a calcular sua media no dashboard.</Text>

        <Card style={styles.statusCard}>
          <Text style={styles.statusText}>Movimentos: {moves}</Text>
          <Text style={styles.statusText}>Pares encontrados: {pairs}/6</Text>
        </Card>

        <View style={styles.board}>
          {deck.map((card) => {
            const visible = card.matched || opened.some((item) => item.id === card.id);
            return (
              <Pressable key={card.id} style={[styles.memoryCard, visible && styles.cardOpen]} onPress={() => openCard(card)}>
                <Text style={styles.cardText}>{visible ? card.label : '?'}</Text>
              </Pressable>
            );
          })}
        </View>

        {finished ? (
          <Card style={styles.winCard}>
            <Text style={styles.winTitle}>Parabens!</Text>
            <Text style={styles.winText}>Voce encontrou todos os pares.</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
          </Card>
        ) : null}

        <Button onPress={resetGame}>Reiniciar jogo</Button>
        <Button tone="soft" onPress={() => setSelectedGame(null)}>Voltar aos jogos</Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageHeader title="Jogos" />
      <Text style={styles.subtitle}>Escolha um jogo para treinar memoria, atencao e raciocinio logico.</Text>

      {gameOptions.map((game) => (
        <Card key={game.id} style={[styles.optionCard, { backgroundColor: game.color }]}>
          <Text style={styles.optionTitle}>{game.title}</Text>
          <Text style={styles.optionText}>{game.description}</Text>
          <Button tone={game.active ? 'primary' : 'soft'} onPress={game.active ? startMemory : undefined}>
            {game.active ? 'Jogar agora' : 'Em breve'}
          </Button>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  optionCard: { gap: spacing.sm },
  optionTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  optionText: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  statusCard: { backgroundColor: colors.blue },
  statusText: { color: colors.text, fontSize: 16, fontWeight: '900' },
  board: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  memoryCard: {
    alignItems: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    height: 92,
    justifyContent: 'center',
    width: '31%',
  },
  cardOpen: { backgroundColor: colors.yellow },
  cardText: { color: colors.text, fontSize: 19, fontWeight: '900', textAlign: 'center' },
  winCard: { backgroundColor: colors.green },
  winTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  winText: { color: colors.muted, fontSize: 15 },
  message: { color: colors.primaryDark, fontWeight: '900', lineHeight: 20 },
});
