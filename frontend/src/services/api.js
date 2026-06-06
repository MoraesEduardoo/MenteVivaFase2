import Constants from 'expo-constants';

import { getToken, saveEntry, setMemoryGameResults, setSession } from './session';

function inferApiUrl() {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoClient?.hostUri;
  const host = hostUri?.split(':')?.[0];
  return host ? `http://${host}:3000/api` : 'http://localhost:3000/api';
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || inferApiUrl();

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || 'Nao foi possivel conectar com a API.');
  }

  return payload;
}

async function enter(path, data) {
  const payload = await request(path, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  setSession(payload.data);
  return payload;
}

export const api = {
  login(data) {
    return enter('/auth/login', data);
  },
  register(data) {
    return enter('/auth/register', data);
  },
  async createEntry(data) {
    const payload = await request('/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    saveEntry(payload.data);
    return payload;
  },
  listEntries() {
    return request('/entries');
  },
  async createMemoryGameResult(data) {
    return request('/jogo-memoria', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async listMemoryGameResults() {
    const payload = await request('/jogo-memoria');
    setMemoryGameResults(payload.data);
    return payload;
  },
  talkToAgent(data) {
    return request('/agent/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
