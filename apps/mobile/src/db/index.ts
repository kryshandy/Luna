import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { mySchema } from './schema';
import JournalEntry from './models/JournalEntry';
import Cycle from './models/Cycle';
import SymptomLog from './models/SymptomLog';
import LuluMessage from './models/LuluMessage';

const adapter = new SQLiteAdapter({
  schema: mySchema,
  jsi: true,
});

export const database = new Database({
  adapter,
  modelClasses: [JournalEntry, Cycle, SymptomLog, LuluMessage],
});