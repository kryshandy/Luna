const express = require('express');
const { postLogCycle, getCycleCurrent, getCycleHistory } = require('../controllers/cycle.controller');
const { validate } = require('../middlewares/validate');
const { logCycleSchema } = require('../schemas/cycle.schema');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

/**
 * @openapi
 * /cycle/current:
 *   get:
 *     summary: Retourne la phase actuelle du cycle et la fenetre de fertilite
 *     tags: [Cycle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Etat actuel du cycle
 */
router.get('/current', authenticate, getCycleCurrent);

/**
 * @openapi
 * /cycle/log:
 *   post:
 *     summary: Enregistre le debut d'un nouveau cycle (regles)
 *     tags: [Cycle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_debut:
 *                 type: string
 *                 description: Format YYYY-MM-DD, defaut = aujourd'hui
 *     responses:
 *       201:
 *         description: Cycle enregistre
 */
router.post('/log', authenticate, validate(logCycleSchema), postLogCycle);

/**
 * @openapi
 * /cycle/history:
 *   get:
 *     summary: Historique des cycles de l'utilisatrice
 *     tags: [Cycle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des cycles passes
 */
router.get('/history', authenticate, getCycleHistory);

module.exports = router;