import { Database, Q } from '@nozbe/watermelondb';
import Cycle from '../models/Cycle';
import SymptomLog from '../models/SymptomLog';

export async function creerCycle(database: Database, dateDebut: Date) {
  return database.write(async () => {
    return database.get<Cycle>('cycles').create((cycle) => {
      cycle.dateDebut = dateDebut;
      cycle.synced = false;
    });
  });
}

export async function getCycleEnCours(database: Database): Promise<Cycle | null> {
  const cycles = await database
    .get<Cycle>('cycles')
    .query(Q.sortBy('date_debut', Q.desc), Q.take(1))
    .fetch();
  return cycles[0] ?? null;
}

export async function ajouterSymptome(
  database: Database,
  cycleId: string,
  data: { energie?: number; humeur?: string; douleur?: number }
) {
  return database.write(async () => {
    return database.get<SymptomLog>('symptom_logs').create((log) => {
      log.cycleId = cycleId;
      log.date = new Date();
      log.energie = data.energie;
      log.humeur = data.humeur;
      log.douleur = data.douleur;
      log.synced = false;
    });
  });
}

export async function getSymptomesDuCycle(cycle: Cycle) {
  return cycle.symptomLogs.fetch();
}