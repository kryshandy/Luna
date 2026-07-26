const { supabase } = require('../config/supabaseClient');

async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // Enrichissement : creer la ligne profil applicative correspondante.
  // Le prenom/age/avatar seront completes plus tard via PUT /profil (ecran Inscription).
  if (data.user) {
    const { error: profilError } = await supabase
      .from('profils')
      .insert({ id: data.user.id, email: data.user.email, prenom: '' });

    // On ne bloque pas l'inscription si la creation du profil echoue (log seulement),
    // pour ne pas empecher une utilisatrice de creer son compte a cause d'un souci secondaire.
    if (profilError) {
      console.error('Erreur creation profil apres inscription :', profilError.message);
    }
  }

  return data;
}

async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Enrichissement de session : on joint le profil applicatif a la reponse de login,
  // pas seulement l'identite technique Supabase Auth.
  let profil = null;
  if (data.user) {
    const { data: profilData, error: profilError } = await supabase
      .from('profils')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!profilError) {
      profil = profilData;
    }
  }

  return { ...data, profil };
}

async function logoutUser() {
  // Authentification par JWT stateless : le Backend n'a rien a invalider cote serveur.
  // Le "logout" consiste a dire au client de supprimer son token localement.
  // Une invalidation cote serveur necessiterait la cle service_role (volontairement non utilisee ici).
  return { message: 'Deconnexion reussie. Le token doit etre supprime cote client.' };
}

module.exports = { registerUser, loginUser, logoutUser };