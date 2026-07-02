import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '../components/Button';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { clearSession, getUser } from '../services/session';

export default function Perfil() {
  const user = getUser();
  const [confirmEmail, setConfirmEmail] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  function sendVerification() {
    if (!user?.email || confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
      setVerificationStatus('Confirme o mesmo e-mail da sua conta para continuar.');
      return;
    }

    setVerificationStatus('E-mail de verificacao solicitado. Por seguranca, a senha nao e exibida; use recuperacao de senha.');
  }

  function logout() {
    clearSession();
    router.replace('/');
  }

  return (
    <Screen>
      <PageHeader title="Perfil" />

      <Card style={styles.photoCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>+</Text>
        </View>
        <View style={styles.photoText}>
          <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.text}>Toque futuramente para adicionar uma foto de perfil.</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Dados da conta</Text>
        <Info label="Nome" value={user?.name || 'Nao informado'} />
        <Info label="E-mail" value={user?.email || 'Nao informado'} />
        <Info label="Senha" value="********" />
      </Card>

      <Card style={styles.securityCard}>
        <Text style={styles.sectionTitle}>Verificacao de seguranca</Text>
        <Text style={styles.text}>
          Para proteger sua conta, a senha real nunca fica visivel. Confirme seu e-mail para solicitar uma verificacao.
        </Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
          placeholder="Confirme seu e-mail"
          style={styles.input}
        />
        <Button onPress={sendVerification}>Enviar verificacao</Button>
        {verificationStatus ? <Text style={styles.status}>{verificationStatus}</Text> : null}
      </Card>

      <Card style={styles.supportCard}>
        <Text style={styles.sectionTitle}>Rede de apoio</Text>
        <Text style={styles.text}>Em uma versao futura, este espaco pode guardar contatos de confianca e orientacoes de emergencia.</Text>
        <Info label="Contato principal" value="A definir" />
        <Info label="Observacao" value="A Viva nao substitui atendimento profissional." />
      </Card>

      <Button tone="red" style={styles.exitButton} onPress={logout}>SAIR</Button>
    </Screen>
  );
}

function Info({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  photoCard: { alignItems: 'center', flexDirection: 'row' },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.lavender,
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  avatarText: { color: colors.primaryDark, fontSize: 34, fontWeight: '900' },
  photoText: { flex: 1, gap: spacing.xs },
  name: { color: colors.text, fontSize: 22, fontWeight: '900' },
  text: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  infoRow: { gap: spacing.xs },
  infoLabel: { color: colors.primaryDark, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  infoValue: { color: colors.text, fontSize: 17, fontWeight: '800' },
  securityCard: { backgroundColor: colors.yellow },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  status: { color: colors.text, fontWeight: '800', lineHeight: 20 },
  supportCard: { backgroundColor: colors.green },
  exitButton: { marginTop: spacing.sm },
});
