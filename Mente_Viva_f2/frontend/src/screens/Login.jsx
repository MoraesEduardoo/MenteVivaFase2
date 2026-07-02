import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { api } from '../services/api';

export default function Login({ mode = 'login' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const isRegister = mode === 'register';

  async function handleSubmit() {
    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) {
      setStatus('error');
      setMessage(isRegister ? 'Preencha nome, e-mail e senha para criar seu cadastro.' : 'Preencha e-mail e senha para entrar.');
      return;
    }

    if (isRegister && password.length < 8) {
      setStatus('error');
      setMessage('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      if (isRegister) {
        await api.register({ name, email, password });
      } else {
        await api.login({ email, password });
      }

      router.replace('/dashboard');
    } catch (error) {
      setStatus('error');
      const apiMessage = error.message || '';
      if (!isRegister && /inval|senha|e-mail|email|401/i.test(apiMessage)) {
        setMessage('Nao encontramos um cadastro com esses dados. Confira e-mail e senha ou crie uma conta.');
      } else if (isRegister && /cadastrado|409/i.test(apiMessage)) {
        setMessage('Este e-mail ja possui cadastro. Entre com sua senha ou use outro e-mail.');
      } else {
        setMessage(apiMessage || 'Nao foi possivel concluir o acesso agora. Tente novamente.');
      }
    }
  }

  return (
    <Screen>
      <Text style={styles.brand}>Mente Viva</Text>
      <Text style={styles.title}>{isRegister ? 'Criar cadastro' : 'Login'}</Text>
      <Text style={styles.subtitle}>
        {isRegister
          ? 'Crie sua conta para acessar diario, dashboard, perfil e espaco da Viva.'
          : 'Entre na sua conta. Se ainda nao possui cadastro, toque em Quero me cadastrar.'}
      </Text>

      <Card>
        {isRegister ? (
          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Seu nome" style={styles.input} />
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="voce@email.com"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo de 8 caracteres"
            style={styles.input}
          />
        </View>

        <Button onPress={handleSubmit}>{status === 'loading' ? 'Conectando...' : isRegister ? 'Cadastrar' : 'Entrar'}</Button>
        {message ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{message}</Text>
          </View>
        ) : null}
        <Button tone="soft" onPress={() => router.replace(isRegister ? '/login' : '/cadastro')}>
          {isRegister ? 'Ja tenho login' : 'Quero me cadastrar'}
        </Button>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { color: colors.primaryDark, fontSize: 18, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 34, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  field: { gap: spacing.xs },
  label: { color: colors.text, fontWeight: '900' },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  notice: {
    backgroundColor: colors.redSoft,
    borderColor: colors.red,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  noticeText: { color: colors.red, fontWeight: '800', lineHeight: 20 },
});
