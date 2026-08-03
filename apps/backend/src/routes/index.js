const express = require('express');
const authRoutes = require('./auth.routes');
const profilRoutes = require('./profil.routes');
const cycleRoutes = require('./cycle.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profil', profilRoutes);
router.use('/cycle', cycleRoutes);

module.exports = router;