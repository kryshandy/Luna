const { z } = require('zod');

// Schema utilise pour tester le middleware de validation (T009).
// Sera reutilise/adapte en Sprint 2 (T030) pour la vraie route /auth/register.
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caracteres'),
  }),
});

module.exports = { registerSchema };