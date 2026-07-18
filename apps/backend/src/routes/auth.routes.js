const express = require('express');
const { pingAuth, register, login, logout, me } = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

/**
 * @openapi
 * /auth/ping:
 *   get:
 *     summary: Verifie que le module auth repond
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Le service auth est actif
 */
router.get('/ping', pingAuth);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Inscrit une nouvelle utilisatrice
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Inscription reussie
 *       400:
 *         description: Requete invalide
 */
router.post('/register', validate(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Connecte une utilisatrice existante
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Connexion reussie
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', validate(loginSchema), login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Deconnecte l'utilisatrice (cote client)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Deconnexion reussie
 */
router.post('/logout', logout);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Retourne l'utilisatrice actuellement authentifiee (route protegee)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisatrice authentifiee
 *       401:
 *         description: Token manquant ou invalide
 */
router.get('/me', authenticate, me);

module.exports = router;