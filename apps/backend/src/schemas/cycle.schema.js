const { z } = require('zod');

const logCycleSchema = z.object({
  body: z.object({
    date_debut: z.string().date('Format de date invalide (attendu: YYYY-MM-DD)').optional(),
  }),
});

module.exports = { logCycleSchema };