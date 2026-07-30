import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'cycles',
          columns: [{ name: 'reguliere', type: 'boolean', isOptional: true }],
        }),
      ],
    },
  ],
});