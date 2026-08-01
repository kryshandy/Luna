const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } = require('../services/auth.service');

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
      profil: data.profil,
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

async function forgotPasswordHandler(req, res) {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    // Meme en cas d'erreur inattendue, on reste generique cote client.
    res.status(200).json({ message: 'Si un compte existe avec cet email, un code de recuperation a ete envoye.' });
  }
}

async function resetPasswordHandler(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await resetPassword(email, otp, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 400).json({ error: error.message });
  }
}

module.exports = { pingAuth, register, login, logout, me, forgotPasswordHandler, resetPasswordHandler };