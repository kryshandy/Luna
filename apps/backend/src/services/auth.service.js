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

async function forgotPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    console.error('DEBUG - Erreur resetPasswordForEmail :', error.message, error);
  } else {
    console.log('DEBUG - resetPasswordForEmail OK, data:', data);
  }
  return { message: 'Si un compte existe avec cet email, un code de recuperation a ete envoye.' };
}

async function resetPassword(email, otp, newPassword) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'recovery',
  });

  if (error || !data.session) {
    const err = new Error('Code invalide ou expire');
    err.status = 400;
    throw err;
  }

  // Le client scope a besoin d'une vraie session active (pas juste un header)
  // pour que les methodes internes du module auth (updateUser) fonctionnent.
  const scopedClient = getScopedClient(data.session.access_token);
  await scopedClient.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });

  const { error: updateError } = await scopedClient.auth.updateUser({ password: newPassword });

  if (updateError) throw updateError;

  return { message: 'Mot de passe modifie avec succes.' };
}

module.exports = { registerUser, loginUser, logoutUser, forgotPassword, resetPassword };