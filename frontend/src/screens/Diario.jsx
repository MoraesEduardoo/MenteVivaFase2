import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '../components/Button';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import Screen from '../components/Screen';
import { colors, radius, spacing } from '../constants/theme';
import { api } from '../services/api';
import { getEntries, setEntries } from '../services/session';

const moods = ['Calmo', 'Leve', 'Tenso', 'Feliz', 'Ansioso', 'Cansado', 'Triste'];
const tags = ['sono', 'familia', 'trabalho', 'estudo', 'saude', 'amizades'];

export default function Diario() {
  const params = useLocalSearchParams();
  const [selectedMood, setSelectedMood] = useState(moods.includes(params.mood) ? params.mood : 'Calmo');
  const [selectedTag, setSelectedTag] = useState('sono');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function loadEntries() {
    try {
      const payload = await api.listEntries();
      setEntries(payload.data || []);
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setMessage(error.message || 'Nao foi possivel carregar o historico.');
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function saveEntry() {
    try {
      if (editingId) {
        await api.updateEntry(editingId, { mood: selectedMood, tag: selectedTag, note });
      } else {
        await api.createEntry({ mood: selectedMood, tag: selectedTag, note });
      }

      await loadEntries();
      setEditingId(null);
      setNote('');
      setMessage(editingId ? 'Registro atualizado com sucesso.' : 'Registro salvo com sucesso.');
    } catch (error) {
      setMessage(error.message || 'Nao foi possivel salvar o registro.');
    }
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setSelectedMood(moods.includes(entry.mood) ? entry.mood : 'Calmo');
    setSelectedTag(tags.includes(entry.tag) ? entry.tag : 'sono');
    setNote(entry.note || '');
    setMessage('Edite o registro selecionado.');
  }

  function cancelEdit() {
    setEditingId(null);
    setSelectedMood('Calmo');
    setSelectedTag('sono');
    setNote('');
    setMessage('');
  }

  async function removeEntry(entry) {
    try {
      await api.deleteEntry(entry.id);
      await loadEntries();
      if (editingId === entry.id) cancelEdit();
      setMessage('Registro excluido com sucesso.');
    } catch (error) {
      setMessage(error.message || 'Nao foi possivel excluir o registro.');
    }
  }

  return (
    <Screen>
      <PageHeader title="Diario" />
      <Text style={styles.subtitle}>Escreva como voce esta se sentindo agora.</Text>

      <Card>
        <Text style={styles.sectionTitle}>Humor</Text>
        <View style={styles.grid}>
          {moods.map((mood) => (
            <Pressable key={mood} onPress={() => setSelectedMood(mood)} style={[styles.chip, selectedMood === mood && styles.selected]}>
              <Text style={[styles.chipText, selectedMood === mood && styles.selectedText]}>{mood}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Assunto</Text>
        <View style={styles.grid}>
          {tags.map((tag) => (
            <Pressable key={tag} onPress={() => setSelectedTag(tag)} style={[styles.chip, selectedTag === tag && styles.selected]}>
              <Text style={[styles.chipText, selectedTag === tag && styles.selectedText]}>{tag}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Anotacao</Text>
        <TextInput
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Hoje eu percebi que..."
          style={styles.input}
          textAlignVertical="top"
        />
        <Button onPress={saveEntry}>{editingId ? 'Atualizar registro' : 'Salvar registro'}</Button>
        {editingId ? <Button tone="soft" onPress={cancelEdit}>Cancelar edicao</Button> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </Card>

      <Card style={styles.historyCard} key={refreshKey}>
        <Text style={styles.sectionTitle}>Ultimos registros</Text>
        {getEntries().length ? (
          getEntries().map((entry) => (
            <View key={entry.id} style={styles.entryItem}>
              <Text style={styles.entryTitle}>{entry.mood} - {entry.tag}</Text>
              <Text style={styles.entryDate}>{entry.date}</Text>
              {entry.note ? <Text style={styles.entryNote}>{entry.note}</Text> : null}
              <View style={styles.actions}>
                <Button tone="soft" style={styles.actionButton} onPress={() => startEdit(entry)}>Editar</Button>
                <Button tone="red" style={styles.actionButton} onPress={() => removeEntry(entry)}>Excluir</Button>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.entryNote}>Nenhum registro salvo ainda.</Text>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { backgroundColor: colors.green, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  selected: { backgroundColor: colors.primary },
  chipText: { color: colors.primaryDark, fontWeight: '900' },
  selectedText: { color: colors.card },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    minHeight: 150,
    padding: spacing.md,
  },
  message: { color: colors.primaryDark, fontWeight: '900' },
  historyCard: { backgroundColor: colors.blue },
  entryItem: { borderTopColor: colors.border, borderTopWidth: 1, gap: spacing.xs, paddingTop: spacing.sm },
  entryTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  entryDate: { color: colors.primaryDark, fontSize: 13, fontWeight: '900' },
  entryNote: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: { flex: 1, minHeight: 42, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
});
