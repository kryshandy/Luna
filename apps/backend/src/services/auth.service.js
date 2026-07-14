const { supabase } = require('../config/supabaseClient');

async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

module.exports = { registerUser };