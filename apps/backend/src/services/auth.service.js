const { supabase } = require('../config/supabaseClient');

async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function logoutUser() {
  // Authentification par JWT stateless : le Backend n'a rien a invalider cote serveur.
  // Le "logout" consiste a dire au client de supprimer son token localement.
  // Une invalidation cote serveur necessiterait la cle service_role (volontairement non utilisee ici).
  return { message: 'Deconnexion reussie. Le token doit etre supprime cote client.' };
}

module.exports = { registerUser, loginUser, logoutUser };