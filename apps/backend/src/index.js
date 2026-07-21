// IMPORTANT : instrument.js doit etre la toute premiere ligne executee (regle Sentry),
// avant meme express, pour que le monitoring capture tout des le demarrage.
require('./instrument.js');

require('./instrument.js');

const dotenv = require('dotenv');
const app = require('./app');
const { Sentry } = require('./instrument.js');

dotenv.config();

const PORT = process.env.PORT || 3000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Luna backend demarre sur http://localhost:${PORT}`);
});