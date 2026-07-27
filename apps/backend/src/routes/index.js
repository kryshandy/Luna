const express = require('express');
const authRoutes = require('./auth.routes');
const profilRoutes = require('./profil.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profil', profilRoutes);

module.exports = router;