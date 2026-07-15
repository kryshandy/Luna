const express = require('express');
const { pingAuth } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate');
const { registerSchema } = require('../schemas/auth.schema');

const router = express.Router();

router.get('/ping', pingAuth);

/**
 * @openapi
 * /auth/ping:
 *   get:
 *     summary: Vérifie que le module auth répond
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Le service auth est actif
 */
router.get('/ping', pingAuth);

// Route temporaire pour tester le middleware Zod (T009).
// Sera remplacee par la vraie logique en Sprint 2 (T030).
router.post('/test-validation', validate(registerSchema), (req, res) => {
  res.json({ message: 'Validation reussie', recu: req.body });
});

module.exports = router;