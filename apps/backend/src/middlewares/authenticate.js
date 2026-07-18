const { supabase } = require('../config/supabaseClient');

// Verifie qu'une requete contient un token valide (Authorization: Bearer <token>)
// et attache l'utilisatrice authentifiee a req.user pour les routes suivantes.
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
  next();
}

module.exports = { authenticate };