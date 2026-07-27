const { createClient } = require('@supabase/supabase-js');
const { supabase } = require('../config/supabaseClient');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou mal forme' });
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Token invalide ou expire' });
  }

  req.user = data.user;

  // Client Supabase "scope" a cette requete : porte le token de l'utilisatrice,
  // pour que la RLS (auth.uid()) fonctionne correctement pour SES donnees.
  req.supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  next();
}

module.exports = { authenticate };