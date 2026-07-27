const express = require('express');
const { getMyProfil, updateMyProfil } = require('../controllers/profil.controller');
const { validate } = require('../middlewares/validate');
const { updateProfilSchema } = require('../schemas/profil.schema');
const { authenticate } = require('../middlewares/authenticate');

const router = express.Router();

/**
 * @openapi
 * /profil:
 *   get:
 *     summary: Recupere le profil de l'utilisatrice connectee
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil trouve
 *       404:
 *         description: Profil introuvable
 */
router.get('/', authenticate, getMyProfil);

/**
 * @openapi
 * /profil:
 *   put:
 *     summary: Met a jour le profil de l'utilisatrice connectee
 *     tags: [Profil]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom: { type: string }
 *               age: { type: integer }
 *               taille: { type: integer }
 *               poids: { type: number }
 *               avatar: { type: integer }
 *     responses:
 *       200:
 *         description: Profil mis a jour
 *       400:
 *         description: Requete invalide
 */
router.put('/', authenticate, validate(updateProfilSchema), updateMyProfil);

module.exports = router;