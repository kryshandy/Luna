async function getProfil(supabaseClient, userId) {
  const { data, error } = await supabaseClient
    .from('profils')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

async function updateProfil(supabaseClient, userId, updates) {
  const { data, error } = await supabaseClient
    .from('profils')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = { getProfil, updateProfil };