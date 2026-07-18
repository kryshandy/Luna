import { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useDatabase } from '@nozbe/watermelondb/react';
import Cycle from '../db/models/Cycle';
import { creerCycle, getCycleEnCours, ajouterSymptome, getSymptomesDuCycle } from '../db/services/cycleService';

export default function CycleScreen() {
  const database = useDatabase();
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [nbSymptomes, setNbSymptomes] = useState(0);

  const charger = async () => {
    const c = await getCycleEnCours(database);
    setCycle(c);
    if (c) {
      const symptomes = await getSymptomesDuCycle(c);
      setNbSymptomes(symptomes.length);
    }
  };

  useEffect(() => { charger(); }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Mon Cycle 🌸</Text>

      {cycle ? (
        <Text style={{ marginTop: 10 }}>
          Cycle en cours depuis le {cycle.dateDebut.toLocaleDateString('fr-FR')} — {nbSymptomes} symptôme(s) noté(s)
        </Text>
      ) : (
        <Text style={{ marginTop: 10 }}>Aucun cycle enregistré pour l'instant.</Text>
      )}

      <View style={{ marginTop: 20, gap: 10 }}>
        <Button
          title="Créer un cycle (test — aujourd'hui)"
          onPress={async () => { await creerCycle(database, new Date()); charger(); }}
        />
        {cycle && (
          <Button
            title="Ajouter un symptôme (test)"
            onPress={async () => { await ajouterSymptome(database, cycle.id, { energie: 7, humeur: 'bien', douleur: 2 }); charger(); }}
          />
        )}
      </View>
    </View>
  );
}