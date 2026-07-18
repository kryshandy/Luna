const { registerUser, loginUser, logoutUser } = require('../services/auth.service');

function pingAuth(req, res) {
  res.json({ message: 'Auth controller pret.' });
}

async function register(req, res) {
  try {
    const { email, password } = req.body;
    const data = await registerUser(email, password);
    res.status(201).json({ message: 'Inscription reussie', user: data.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.status(200).json({
      message: 'Connexion reussie',
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

async function logout(req, res) {
  const result = await logoutUser();
  res.status(200).json(result);
}

function me(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = { pingAuth, register, login, logout, me };