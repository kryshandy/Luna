// IMPORTANT : instrument.js doit etre la toute premiere ligne executee (regle Sentry),
// avant meme express, pour que le monitoring capture tout des le demarrage.
require('./instrument.js');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sentry } = require('./instrument.js');
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'luna-backend' });
});

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Luna backend demarre sur http://localhost:${PORT}`);
});