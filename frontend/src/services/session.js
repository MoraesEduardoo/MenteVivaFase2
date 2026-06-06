let authToken = null;
let currentUser = null;
let entries = [];
let memoryGameResults = [];
let userGoals = [
  { id: 'agua', title: 'Beba agua aos poucos ao longo do dia.' },
  { id: 'respirar', title: 'Faca uma pausa curta para respirar com calma.' },
  { id: 'descanso', title: 'Afaste-se da tela por alguns minutos quando sentir cansaco.' },
];

function normalizeEntry(entry) {
  return {
    id: entry.id || entry._id || Date.now().toString(),
    date: entry.date || new Date(entry.createdAt || Date.now()).toLocaleDateString('pt-BR'),
    mood: entry.mood,
    tag: entry.tag,
    note: entry.note || '',
  };
}

function normalizeMemoryGame(result) {
  return {
    id: result.id || result._id || Date.now().toString(),
    won: Boolean(result.won),
    attempts: Number(result.attempts || result.moves || 0),
    timeMs: Number(result.timeMs || 0),
    createdAt: result.createdAt || new Date().toISOString(),
  };
}

export function isAuthenticated() {
  return Boolean(authToken);
}

export function getUser() {
  return currentUser;
}

export function setSession({ token, user }) {
  authToken = token;
  currentUser = user;
}

export function createLocalUser({ name, email }) {
  setSession({
    token: `local-${Date.now()}`,
    user: {
      name: name?.trim() || 'Visitante',
      email: email?.trim() || 'visitante@menteviva.local',
    },
  });
}

export function clearSession() {
  authToken = null;
  currentUser = null;
  entries = [];
  memoryGameResults = [];
}

export function getToken() {
  return authToken;
}

export function saveGameResult(result) {
  const nextResult = normalizeMemoryGame(result);
  memoryGameResults = [nextResult, ...memoryGameResults].slice(0, 50);
  return nextResult;
}

export function setMemoryGameResults(results) {
  memoryGameResults = results.map(normalizeMemoryGame);
}

export function saveEntry(entry) {
  const nextEntry = normalizeEntry(entry);
  entries = [nextEntry, ...entries].slice(0, 8);
  return nextEntry;
}

export function setEntries(nextEntries) {
  entries = nextEntries.map(normalizeEntry);
}

export function getEntries() {
  return entries;
}

export function getMoodSummary() {
  if (!entries.length) return 'Sem registros ainda';
  return entries[0].mood;
}

export function getGoals() {
  return userGoals;
}

export function toggleGoal() {
  return userGoals;
}

export function getGameDashboard() {
  const memory = getMemoryGamePerformance();

  return {
    score: memory.score,
    games: [
      memory,
      {
        id: 'attention',
        title: 'Jogo de atencao',
        label: 'Sem dados',
        description: 'Esse jogo sera acompanhado quando estiver disponivel.',
        score: 0,
      },
      {
        id: 'logic',
        title: 'Jogo de logica',
        label: 'Sem dados',
        description: 'Esse jogo sera acompanhado quando estiver disponivel.',
        score: 0,
      },
    ],
  };
}

function getMemoryGamePerformance() {
  const validResults = memoryGameResults.filter((result) => result.attempts > 0);

  if (!validResults.length) {
    return {
      id: 'memory',
      title: 'Jogo da memoria',
      label: 'Sem dados',
      description: 'Jogue uma partida de memoria para gerar seu primeiro resultado.',
      score: 0,
    };
  }

  const totalGames = validResults.length;
  const wins = validResults.filter((result) => result.won).length;
  const winRate = wins / totalGames;
  const averageAttempts = validResults.reduce((sum, result) => sum + result.attempts, 0) / totalGames;
  const bestTimeMs = Math.min(...validResults.map((result) => result.timeMs || 999999));

  const idealAttempts = 6;
  const highAttempts = 22;
  const attemptsScore = Math.max(0, Math.min(1, 1 - (averageAttempts - idealAttempts) / (highAttempts - idealAttempts)));

  const strongMs = 60000;
  const slowMs = 240000;
  const timeScore = Math.max(0, Math.min(1, 1 - (bestTimeMs - strongMs) / (slowMs - strongMs)));

  const consistencyPenalty = totalGames < 3 ? 0.08 : 0;
  const score = Math.max(0, Math.round(((attemptsScore * 0.5 + winRate * 0.3 + timeScore * 0.2) - consistencyPenalty) * 100));
  const attemptsText = averageAttempts.toFixed(1).replace('.', ',');

  if (score >= 92) {
    return {
      id: 'memory',
      title: 'Jogo da memoria',
      label: 'Excelente',
      description: `${totalGames} partida(s). Media de ${attemptsText} tentativas. Resultado muito forte.`,
      score,
    };
  }
  if (score >= 78) {
    return {
      id: 'memory',
      title: 'Jogo da memoria',
      label: 'Muito bom',
      description: `${totalGames} partida(s). Media de ${attemptsText} tentativas. Bom desempenho, ainda com espaco para constancia.`,
      score,
    };
  }
  if (score >= 62) {
    return {
      id: 'memory',
      title: 'Jogo da memoria',
      label: 'Bom',
      description: `${totalGames} partida(s). Media de ${attemptsText} tentativas. Continue treinando para reduzir as tentativas.`,
      score,
    };
  }
  if (score >= 42) {
    return {
      id: 'memory',
      title: 'Jogo da memoria',
      label: 'Em desenvolvimento',
      description: `${totalGames} partida(s). Media de ${attemptsText} tentativas. Observe as cartas com calma antes de escolher.`,
      score,
    };
  }

  return {
    id: 'memory',
    title: 'Jogo da memoria',
    label: 'Precisa praticar',
    description: `${totalGames} partida(s). Media de ${attemptsText} tentativas. Tente mais rodadas para evoluir aos poucos.`,
    score,
  };
}
