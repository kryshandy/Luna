import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'journal_entries',
      columns: [
        { name: 'texte', type: 'string' },
        { name: 'humeur', type: 'string', isOptional: true },
        { name: 'tags', type: 'string', isOptional: true },
        { name: 'date', type: 'number' },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'cycles',
      columns: [
        { name: 'date_debut', type: 'number' },
        { name: 'date_fin', type: 'number', isOptional: true },
        { name: 'duree', type: 'number', isOptional: true },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'symptom_logs',
      columns: [
        { name: 'cycle_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'number' },
        { name: 'energie', type: 'number', isOptional: true },
        { name: 'humeur', type: 'string', isOptional: true },
        { name: 'douleur', type: 'number', isOptional: true },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'lulu_messages',
      columns: [
        { name: 'session_id', type: 'string', isIndexed: true },
        { name: 'role', type: 'string' },
        { name: 'contenu', type: 'string' },
        { name: 'date', type: 'number' },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});