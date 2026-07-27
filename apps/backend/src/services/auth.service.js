const { createClient } = require('@supabase/supabase-js');
const { supabase } = require('../config/supabaseClient');

function getScopedClient(accessToken) {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
}

async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // Enrichissement : creer la ligne profil applicative correspondante.
  // Le prenom/age/avatar seront completes plus tard via PUT /profil (ecran Inscription).
  // On utilise un client scope avec le token de la nouvelle session,
  // pour que la RLS (auth.uid() = id) accepte l'insertion.
  if (data.user && data.session) {
    const scopedClient = getScopedClient(data.session.access_token);

    const { error: profilError } = await scopedClient
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
  // Client scope avec le token de session, pour que la RLS accepte la lecture.
  let profil = null;
  if (data.user && data.session) {
    const scopedClient = getScopedClient(data.session.access_token);

    const { data: profilData, error: profilError } = await scopedClient
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