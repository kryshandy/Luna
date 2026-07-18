import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import JournalEntry from '../db/models/JournalEntry';

export default function JournalScreen() {
  const database = useDatabase();
  const [draft, setDraft] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const loadEntries = useCallback(async () => {
    const collection = database.get<JournalEntry>('journal_entries');
    const results = await collection
      .query(Q.sortBy('date', Q.desc))
      .fetch();
    setEntries(results);
  }, [database]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const save = async () => {
    if (!draft.trim()) return;
    await database.write(async () => {
      await database.get<JournalEntry>('journal_entries').create((entry) => {
        entry.texte = draft;
        entry.synced = false;
        entry.date = new Date();
      });
    });
    setDraft('');
    loadEntries();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Mon Journal 📓</Text>

      <TextInput
        value={draft}
        onChangeText={setDraft}
        placeholder="Que se passe-t-il dans ton cœur aujourd'hui ?"
        multiline
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, minHeight: 100 }}
      />
      <TouchableOpacity onPress={save} style={{ backgroundColor: '#B85C7C', padding: 12, borderRadius: 8, marginTop: 10 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Sauvegarder ✦</Text>
      </TouchableOpacity>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Text style={{ fontSize: 10, color: '#999' }}>{item.date.toLocaleDateString('fr-FR')}</Text>
            <Text style={{ marginTop: 4 }}>{item.texte}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
            Ton journal est vide pour l'instant. Commence à écrire ✨
          </Text>
        }
      />
    </View>
  );
}