const { z } = require('zod');

const updateProfilSchema = z.object({
  body: z.object({
    prenom: z.string().min(1, 'Le prenom est requis').optional(),
    age: z.number().int().positive().optional(),
    taille: z.number().int().positive().optional(),
    poids: z.number().positive().optional(),
    avatar: z.number().int().min(1).max(12).optional(),
  }),
});

module.exports = { updateProfilSchema };