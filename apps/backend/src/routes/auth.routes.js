const express = require('express');
const { pingAuth } = require('../controllers/auth.controller');

const router = express.Router();

router.get('/ping', pingAuth);

module.exports = router;