const DUREE_PAR_DEFAUT = 28;
const DUREE_PHASE_LUTEALE = 14;

function joursEntre(dateA, dateB) {
  const diffMs = new Date(dateB) - new Date(dateA);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

async function logCycle(supabaseClient, userId, dateDebut) {
  const nouvelleDate = dateDebut || new Date().toISOString().slice(0, 10);

  // Cherche le cycle en cours (sans date_fin) pour le clore automatiquement
  const { data: cycleEnCours } = await supabaseClient
    .from('cycles')
    .select('*')
    .eq('user_id', userId)
    .is('date_fin', null)
    .order('date_debut', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cycleEnCours) {
    const duree = joursEntre(cycleEnCours.date_debut, nouvelleDate);
    await supabaseClient
      .from('cycles')
      .update({ date_fin: nouvelleDate, duree })
      .eq('id', cycleEnCours.id);
  }

  const { data, error } = await supabaseClient
    .from('cycles')
    .insert({ user_id: userId, date_debut: nouvelleDate })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getCurrentCycle(supabaseClient, userId) {
  const { data: dernierCycle, error } = await supabaseClient
    .from('cycles')
    .select('*')
    .eq('user_id', userId)
    .order('date_debut', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!dernierCycle) {
    return { message: 'Aucun cycle enregistre pour le moment.' };
  }

  const { data: cyclesTermines } = await supabaseClient
    .from('cycles')
    .select('duree')
    .eq('user_id', userId)
    .not('duree', 'is', null);

  const dureeMoyenne = cyclesTermines && cyclesTermines.length > 0
    ? Math.round(cyclesTermines.reduce((sum, c) => sum + c.duree, 0) / cyclesTermines.length)
    : DUREE_PAR_DEFAUT;

  const aujourdHui = new Date().toISOString().slice(0, 10);
  const jourDuCycle = joursEntre(dernierCycle.date_debut, aujourdHui) + 1;
  const jourOvulation = dureeMoyenne - DUREE_PHASE_LUTEALE;

  let phase;
  if (jourDuCycle <= 5) {
    phase = 'menstruelle';
  } else if (jourDuCycle < jourOvulation) {
    phase = 'folliculaire';
  } else if (jourDuCycle === jourOvulation) {
    phase = 'ovulation';
  } else {
    phase = 'luteale';
  }

  return {
    date_debut: dernierCycle.date_debut,
    jour_du_cycle: jourDuCycle,
    duree_moyenne: dureeMoyenne,
    phase,
    fenetre_fertilite: {
      debut_jour: Math.max(1, jourOvulation - 5),
      fin_jour: jourOvulation + 1,
    },
  };
}

async function getHistory(supabaseClient, userId) {
  const { data, error } = await supabaseClient
    .from('cycles')
    .select('*')
    .eq('user_id', userId)
    .order('date_debut', { ascending: false });

  if (error) throw error;
  return data;
}

module.exports = { logCycle, getCurrentCycle, getHistory };