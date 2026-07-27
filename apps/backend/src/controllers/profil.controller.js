const { getProfil, updateProfil } = require('../services/profil.service');

async function getMyProfil(req, res) {
  try {
    const profil = await getProfil(req.supabase, req.user.id);
    res.status(200).json({ profil });
  } catch (error) {
    console.error('Erreur GET /profil :', error.message);
    res.status(404).json({ error: 'Profil introuvable' });
  }
}

async function updateMyProfil(req, res) {
  try {
    const profil = await updateProfil(req.supabase, req.user.id, req.body);
    res.status(200).json({ message: 'Profil mis a jour', profil });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { getMyProfil, updateMyProfil };