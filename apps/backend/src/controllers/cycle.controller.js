const { logCycle, getCurrentCycle, getHistory } = require('../services/cycle.service');

async function postLogCycle(req, res) {
  try {
    const { date_debut } = req.body;
    const cycle = await logCycle(req.supabase, req.user.id, date_debut);
    res.status(201).json({ message: 'Cycle enregistre', cycle });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCycleCurrent(req, res) {
  try {
    const current = await getCurrentCycle(req.supabase, req.user.id);
    res.status(200).json(current);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getCycleHistory(req, res) {
  try {
    const history = await getHistory(req.supabase, req.user.id);
    res.status(200).json({ cycles: history });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { postLogCycle, getCycleCurrent, getCycleHistory };