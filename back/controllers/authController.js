const User = require('../models/userModel');

async function signup(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    req.session.userId = user._id;
    res.json({ message: 'Usuario registrado con éxito', user });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    req.session.userId = user._id;
    res.json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  req.session.destroy();
  res.json({ message: 'Sesión cerrada' });
}

module.exports = { signup, login, logout };
